import 'dart:convert';
import 'package:crypto/crypto.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:uuid/uuid.dart';

/// Provides cryptographic signing for local data integrity (HMAC)
final appSignatureServiceProvider = Provider<AppSignatureService>((ref) {
  return AppSignatureService();
});

class AppSignatureService {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  String? _secretKey;
  bool _initialized = false;

  /// Initialize the secret key from secure storage or generate a new one.
  Future<void> init() async {
    if (_initialized) return;

    try {
      // Critical: Ensure key persistence
      _secretKey = await _storage.read(key: 'ironclad_hmac_secret'); // Renamed constant
      
      if (_secretKey == null) {
        debugPrint('Generating new Ironclad HMAC Secret...');
        _secretKey = const Uuid().v4();
        await _storage.write(key: 'ironclad_hmac_secret', value: _secretKey);
      } else {
        debugPrint('Loaded existing Ironclad HMAC Secret.');
      }
    } catch (e) {
      debugPrint('WARNING: Secure Storage falied: $e. Using ephemeral key.');
      _secretKey = const Uuid().v4();
    }
    
    _initialized = true;
  }

  /// Generates HMAC-SHA256 signature for attempt data.
  /// Format: questionId|responseJson|isCorrect|timestampMs
  String signAttempt({
    required String questionId,
    required String responseJson,
    required bool isCorrect,
    required int timestampMs,
  }) {
    if (!_initialized || _secretKey == null) {
       // Auto-init fallback if called unexpectedly
       debugPrint('AppSignatureService lazy-init triggered.');
       // This is sync, so we can't await. Verify initialization at app start!
       // If we are here, strict mode failure.
       // However, to prevent crash, use a fallback empty key? No, that defeats security.
       // Throw error.
       throw StateError('AppSignatureService must be initialized via init() before use.');
    }
    
    final payload = '$questionId|$responseJson|$isCorrect|$timestampMs';
    final key = utf8.encode(_secretKey!);
    final bytes = utf8.encode(payload);
    final hmac = Hmac(sha256, key);
    
    return hmac.convert(bytes).toString();
  }
  
  /// Verifies if a stored signature matches the data
  bool verify({
    required String signature,
    required String questionId,
    required String responseJson,
    required bool isCorrect,
    required int timestampMs,
  }) {
      final computed = signAttempt(
          questionId: questionId, 
          responseJson: responseJson, 
          isCorrect: isCorrect, 
          timestampMs: timestampMs
      );
      // Constant-time comparison not strictly necessary for local SQLite but good practice
      return computed == signature;
  }
}
