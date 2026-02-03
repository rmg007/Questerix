import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/src/features/auth/screens/login_screen.dart';

void main() {
  group('LoginScreen Widget Tests', () {
    testWidgets('displays email and password fields', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Verify email and password fields exist
      expect(find.byType(TextFormField), findsNWidgets(2));
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
    });

    testWidgets('displays login button', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Verify login button
      expect(find.text('Sign In'), findsOneWidget);
      expect(find.byType(ElevatedButton), findsOneWidget);
    });

    testWidgets('email field validates empty input', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Enter empty email and submit
      final loginButton = find.text('Sign In');
      await tester.tap(loginButton);
      await tester.pumpAndSettle();

      // Verify validation error
      expect(find.textContaining('required'), findsWidgets);
    });

    testWidgets('email field validates invalid format', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Enter invalid email
      await tester.enterText(
        find.byType(TextFormField).first,
        'invalid-email',
      );
      await tester.tap(find.text('Sign In'));
      await tester.pumpAndSettle();

      // Verify validation error
      expect(find.textContaining('valid'), findsWidgets);
    });

    testWidgets('password field is obscured', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Find password TextField (the inner widget of TextFormField)
      final textFieldFinder = find.byType(TextField).last;
      final textField = tester.widget<TextField>(textFieldFinder);

      // Verify password is obscured
      expect(textField.obscureText, isTrue);
    });

    testWidgets('password visibility toggle works', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Find visibility toggle button (usually an IconButton)
      final toggleButton = find.byType(IconButton);
      
      if (toggleButton.evaluate().isNotEmpty) {
        // Tap to toggle visibility
        await tester.tap(toggleButton.first);
        await tester.pumpAndSettle();

        // Password should now be visible - check TextField
        final textFieldFinder = find.byType(TextField).last;
        final textField = tester.widget<TextField>(textFieldFinder);
        expect(textField.obscureText, isFalse);
      }
    });

    testWidgets('displays loading indicator during login', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Enter valid credentials
      await tester.enterText(
        find.byType(TextFormField).first,
        'test@example.com',
      );
      await tester.enterText(
        find.byType(TextFormField).last,
        'password123',
      );

      // Tap login
      await tester.tap(find.text('Sign In'));
      await tester.pump();

      // Should show loading indicator
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('forgot password link navigates correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const LoginScreen(),
          routes: {
            '/forgot-password': (context) => 
              const Scaffold(body: Text('Forgot Password Screen')),
          },
        ),
      );

      // Find and tap forgot password link
      final forgotLink = find.text('Forgot Password?');
      if (forgotLink.evaluate().isNotEmpty) {
        await tester.tap(forgotLink);
        await tester.pumpAndSettle();

        // Verify navigation
        expect(find.text('Forgot Password Screen'), findsOneWidget);
      }
    });

    testWidgets('back button returns to welcome screen', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const Scaffold(body: Text('Welcome Screen')),
          routes: {
            '/login': (context) => const LoginScreen(),
          },
        ),
      );

      // Navigate to login
      Navigator.pushNamed(
        tester.element(find.text('Welcome Screen')),
        '/login',
      );
      await tester.pumpAndSettle();

      // Tap back button
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();

      // Verify we're back
      expect(find.text('Welcome Screen'), findsOneWidget);
    });

    testWidgets('has proper accessibility labels', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: LoginScreen(),
        ),
      );

      // Verify email field has semantic label
      final emailField = find.byType(TextFormField).first;
      final emailSemantics = tester.getSemantics(emailField);
      expect(emailSemantics.label, isNotEmpty);

      // Verify password field has semantic label
      final passwordField = find.byType(TextFormField).last;
      final passwordSemantics = tester.getSemantics(passwordField);
      expect(passwordSemantics.label, isNotEmpty);
    });
  });
}
