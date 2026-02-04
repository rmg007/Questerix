import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:sentry_flutter/sentry_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'src/app.dart';
import 'src/core/config/env.dart';
import 'src/core/config/app_config_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Validate environment configuration early (fail-fast)
  // In debug mode, this will throw if SUPABASE_URL or SUPABASE_ANON_KEY are missing
  // Validate environment configuration immediately.
  // Fail-fast if configuration is missing to prevent "silent" failures.
  Env.validate();

  await _initializeSupabase();

  final container = ProviderContainer();
  
  // Initialize App Context (Multi-tenancy)
  try {
    await container.read(appConfigServiceProvider).load();
  } catch (e, stack) {
    debugPrint('Failed to load app config: $e');
    if (Env.sentryEnabled) {
      await Sentry.captureException(e, stackTrace: stack);
    }
  }

  // If Sentry is not enabled (or no DSN), run normally.
  if (!Env.sentryEnabled || Env.sentryDsn.isEmpty) {
    runApp(
      UncontrolledProviderScope(
        container: container,
        child: const QuesterixApp(),
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
    appRunner: () => runApp(
      UncontrolledProviderScope(
        container: container,
        child: const QuesterixApp(),
      ),
    ),
  );
}

Future<void> _initializeSupabase() async {
  // Use centralized Env configuration
  // Strict mode: Throws if URL/Key are empty (Already validated by Env.validate)
  await Supabase.initialize(
    url: Env.supabaseUrl,
    anonKey: Env.supabaseAnonKey,
  );
}

