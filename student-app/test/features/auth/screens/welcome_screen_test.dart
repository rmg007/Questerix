import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/src/features/auth/screens/welcome_screen.dart';

void main() {
  group('WelcomeScreen Widget Tests', () {
    testWidgets('displays app logo and welcome message', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      // Verify welcome elements are displayed
      expect(find.textContaining('Welcome'), findsWidgets);
      expect(find.textContaining('Math7'), findsWidgets);
    });

    testWidgets('displays Get Started button', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      // Verify Get Started button exists
      expect(find.text('Get Started'), findsOneWidget);
    });

    testWidgets('Get Started button navigates to onboarding', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const WelcomeScreen(),
          routes: {
            '/onboarding': (context) => const Scaffold(body: Text('Onboarding Screen')),
          },
        ),
      );

      // Tap Get Started button
      await tester.tap(find.text('Get Started'));
      await tester.pumpAndSettle();

      // Verify navigation to onboarding
      expect(find.text('Onboarding Screen'), findsOneWidget);
    });

    testWidgets('displays Sign In link', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      // Verify Sign In link is present
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('Sign In link navigates to login screen', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const WelcomeScreen(),
          routes: {
            '/login': (context) => const Scaffold(body: Text('Login Screen')),
          },
        ),
      );

      // Tap Sign In link
      await tester.tap(find.text('Sign In'));
      await tester.pumpAndSettle();

      // Verify navigation to login
      expect(find.text('Login Screen'), findsOneWidget);
    });

    testWidgets('displays gradient background', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      // Verify Container with decoration exists (gradient background)
      expect(find.byType(Container), findsWidgets);
      
      final container = tester.widget<Container>(
        find.byType(Container).first,
      );
      
      expect(container.decoration, isA<BoxDecoration>());
    });

    testWidgets('has proper accessibility semantics', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      // Verify button has semantics
      final button = find.text('Get Started');
      expect(button, findsOneWidget);
      
      final semantics = tester.getSemantics(button);
      expect(semantics.hasAction(SemanticsAction.tap), isTrue);
    });

    testWidgets('button has visual feedback on press', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: WelcomeScreen(),
        ),
      );

      final button = find.text('Get Started');
      
      // Long press to see visual feedback
      await tester.press(button);
      await tester.pump();
      
      // Button should exist and be pressable
      expect(button, findsOneWidget);
    });
  });
}
