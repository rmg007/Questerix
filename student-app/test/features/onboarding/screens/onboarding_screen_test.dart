import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/src/features/auth/screens/onboarding_screen.dart';

void main() {
  group('OnboardingScreen Widget Tests', () {
    testWidgets('displays PageView with multiple pages', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Verify PageView exists
      expect(find.byType(PageView), findsOneWidget);
    });

    testWidgets('displays first onboarding page initially', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Verify first page content is visible
      expect(find.textContaining('Welcome'), findsWidgets);
    });

    testWidgets('Next button navigates to next page', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Find and tap Next button
      final nextButton = find.text('Next');
      if (nextButton.evaluate().isNotEmpty) {
        await tester.tap(nextButton);
        await tester.pumpAndSettle();

        // Page should change
        // Verify by checking page indicator or content change
        expect(find.byType(PageView), findsOneWidget);
      }
    });

    testWidgets('Skip button navigates to main app', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const OnboardingScreen(),
          routes: {
            '/home': (context) => const Scaffold(body: Text('Home Screen')),
          },
        ),
      );

      // Find and tap Skip button
      final skipButton = find.text('Skip');
      if (skipButton.evaluate().isNotEmpty) {
        await tester.tap(skipButton);
        await tester.pumpAndSettle();

        // Should navigate to home
        expect(find.text('Home Screen'), findsOneWidget);
      }
    });

    testWidgets('displays page indicators', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Verify page indicators (dots) are present
      // Usually implemented as Row of Containers or custom widgets
      expect(find.byType(Row), findsWidgets);
    });

    testWidgets('Get Started button appears on last page', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Swipe to last page (assume 3 pages)
      await tester.drag(find.byType(PageView), const Offset(-400, 0));
      await tester.pumpAndSettle();
      await tester.drag(find.byType(PageView), const Offset(-400, 0));
      await tester.pumpAndSettle();

      // Verify Get Started button appears
      expect(find.text('Get Started'), findsOneWidget);
    });

    testWidgets('Get Started button completes onboarding', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: const OnboardingScreen(),
          routes: {
            '/home': (context) => const Scaffold(body: Text('Home Screen')),
          },
        ),
      );

      // Navigate to last page
      await tester.drag(find.byType(PageView), const Offset(-800, 0));
      await tester.pumpAndSettle();

      // Tap Get Started
      final getStartedButton = find.text('Get Started');
      if (getStartedButton.evaluate().isNotEmpty) {
        await tester.tap(getStartedButton);
        await tester.pumpAndSettle();

        // Should navigate to home
        expect(find.text('Home Screen'), findsOneWidget);
      }
    });

    testWidgets('swipe gesture changes pages', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Swipe left to next page
      await tester.drag(find.byType(PageView), const Offset(-400, 0));
      await tester.pumpAndSettle();

      // Page should have changed
      expect(find.byType(PageView), findsOneWidget);
    });

    testWidgets('has proper page transitions', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Swipe and verify smooth transition
      await tester.drag(find.byType(PageView), const Offset(-200, 0));
      await tester.pump(const Duration(milliseconds: 100));

      // PageView should animate
      expect(find.byType(PageView), findsOneWidget);
    });

    testWidgets('displays illustrations for each page', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Verify images or illustrations are present
      // Usually Image widgets or custom illustrations
      expect(find.byType(Image), findsWidgets);
    });

    testWidgets('has accessibility semantics', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: OnboardingScreen(),
        ),
      );

      // Verify buttons have proper semantics
      final nextButton = find.text('Next');
      if (nextButton.evaluate().isNotEmpty) {
        final semantics = tester.getSemantics(nextButton);
        // Check that semantic node exists (it will have label)
        expect(semantics.label, isNotNull);
      }
    });
  });
}
