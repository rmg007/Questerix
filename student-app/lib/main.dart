import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'src/app.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Supabase
  await Supabase.initialize(
    url: const String.fromEnvironment(
      'SUPABASE_URL',
      defaultValue: 'https://[YOUR-PROJECT-ID].supabase.co',
    ),
    anonKey: const String.fromEnvironment(
      'SUPABASE_ANON_KEY',
      defaultValue:
          '[YOUR-ANON-KEY]',
    ),
  );

  // Sign in anonymously for student users
  final supabase = Supabase.instance.client;
  if (supabase.auth.currentUser == null) {
    await supabase.auth.signInAnonymously();
  }

  runApp(
    const ProviderScope(
      child: Math7App(),
    ),
  );
}
