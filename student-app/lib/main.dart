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
  // Validate environment configuration immediately.
  // Fail-fast if configuration is missing to prevent "silent" failures.
  Env.validate();

  // If Sentry is not enabled (or no DSN), run normally.
  if (!Env.sentryEnabled || Env.sentryDsn.isEmpty) {
    await _initializeDependencies();
    runApp(
      const ProviderScope(
        child: QuesterixApp(),
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
          child: QuesterixApp(),
        ),
      );
    },
  );
}

Future<void> _initializeDependencies() async {
  // Use centralized Env configuration
  // Strict mode: Throws if URL/Key are empty (Already validated by Env.validate)
  await Supabase.initialize(
    url: Env.supabaseUrl,
    anonKey: Env.supabaseAnonKey,
  );
}

