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
      defaultValue: 'https://qvslbiceoonrgjxzkotb.supabase.co',
    ),
    anonKey: const String.fromEnvironment(
      'SUPABASE_ANON_KEY',
      defaultValue:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2c2xiaWNlb29ucmdqeHprb3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MTE5NjksImV4cCI6MjA4NTA4Nzk2OX0.tksExuWD4OZyb4MoYRliQ71WQ8rywcaYMxbH2UXWe8s',
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
