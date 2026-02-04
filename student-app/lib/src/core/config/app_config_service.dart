import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'env.dart';

/// Represents the multi-tenant context for the current running session
class AppContext {
  final String appId;
  final String appName;
  final int primaryColor;

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
    String subdomain = 'app'; // Default for app.questerix.com

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

    // 2. Fetch Config from Database (apps table)
    try {
      final response = await _supabase
          .from('apps')
          .select('app_id, display_name, subdomain')
          .eq('subdomain', subdomain)
          .eq('is_active', true)
          .maybeSingle();

      if (response != null) {
          final context = AppContext(
            appId: response['app_id'] as String,
            appName: (response['display_name'] as String?) ?? Env.appName,
            primaryColor: Env.themePrimaryColor, // Use env config for theme
          );
          
          state = context;
          return context;
      }
    } catch (e) {
      debugPrint('Error loading app config for subdomain $subdomain: $e');
    }

    // 3. Fallback / Offline - use default app entry
    final defaultContext = AppContext(
      appId: '51f42753-b192-4bf8-9a3b-18269ad4096a', // 'app' subdomain app_id
      appName: Env.appName,
      primaryColor: Env.themePrimaryColor,
    );

    
    state = defaultContext;
    return defaultContext;
  }
}

