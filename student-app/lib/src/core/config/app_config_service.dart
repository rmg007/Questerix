import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'env.dart';

/// Represents the multi-tenant context for the current running session
class AppContext {
  final String appId;
  final String appName;
  final String primaryColor;

  const AppContext({
    required this.appId,
    required this.appName,
    required this.primaryColor,
  });
}

/// Provides access to the current [AppContext] and manages its loading.
final appConfigProvider = StateNotifierProvider<AppConfigService, AppContext?>((ref) {
  return AppConfigService(Supabase.instance.client);
});

// For backward compatibility if needed, or just use appConfigProvider.notifier
final appConfigServiceProvider = Provider<AppConfigService>((ref) {
  return ref.watch(appConfigProvider.notifier);
});

class AppConfigService extends StateNotifier<AppContext?> {
  final SupabaseClient _supabase;

  AppConfigService(this._supabase) : super(null);

  Future<AppContext> load() async {
    // 1. Detect Subdomain (Web) or Flavor (Mobile)
    String subdomain = 'math7'; // Default

    if (kIsWeb) {
       final uri = Uri.base;
       final host = uri.host;
       // Logic: sub.domain.com -> sub
       if (host != 'localhost' && host != '127.0.0.1') {
          final parts = host.split('.');
          if (parts.isNotEmpty) {
             subdomain = parts[0];
          }
       }
    }

    // 2. Fetch Config from Database
    try {
      final response = await _supabase
          .from('app_landing_pages')
          .select('app_id, hero_title, theme')
          .eq('subdomain', subdomain)
          .maybeSingle();

      if (response != null) {
          final context = AppContext(
            appId: response['app_id'] as String,
            appName: (response['hero_title'] as String?) ?? Env.appName,
            primaryColor: (response['theme'] as Map?)?['primary'] as String? ?? '0xFF319795',
          );
          
          state = context;
          return context;
      }
    } catch (e) {
      debugPrint('Error loading app config for subdomain $subdomain: $e');
    }

    // 3. Fallback / Offline
    const defaultContext = AppContext(
      appId: '11111111-1111-1111-1111-111111111111', // Math7 Baseline ID
      appName: 'Math7 (Offline)',
      primaryColor: '0xFF319795',
    );
    
    state = defaultContext;
    return defaultContext;
  }
}
