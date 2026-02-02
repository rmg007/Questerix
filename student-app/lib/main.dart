import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'src/app.dart';
import 'src/core/config/env.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Validate environment configuration early (fail-fast)
  // In debug mode, this will throw if SUPABASE_URL or SUPABASE_ANON_KEY are missing
  try {
    Env.validate();
  } catch (e) {
    // In debug builds, show a helpful error
    debugPrint('⚠️ Environment validation failed: $e');
    debugPrint('📋 Current configuration: ${Env.summary}');
    // Continue anyway in debug mode for local development
    if (Env.isProduction) {
      rethrow;
    }
  }

  // If Sentry is not enabled (or no DSN), run normally.
  if (!Env.sentryEnabled || Env.sentryDsn.isEmpty) {
    await _initializeDependencies();
    runApp(
      const ProviderScope(
        child: Math7App(),
      ),
    );
    return;
  }

  await SentryFlutter.init(
    (options) {
      options.dsn = Env.sentryDsn;
      options.environment = Env.environment;
      options.tracesSampleRate = 1.0;
    },
    appRunner: () async {
      await _initializeDependencies();
      runApp(
        const ProviderScope(
          child: Math7App(),
        ),
      );
    },
  );
}

Future<void> _initializeDependencies() async {
  // Use centralized Env configuration
  // Falls back to placeholder values for local development without .env
  await Supabase.initialize(
    url: Env.supabaseUrl.isNotEmpty 
        ? Env.supabaseUrl 
        : 'https://placeholder.supabase.co',
    anonKey: Env.supabaseAnonKey.isNotEmpty 
        ? Env.supabaseAnonKey 
        : 'placeholder-anon-key',
  );
}

