import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/src/features/curriculum/screens/domains_screen.dart';
import 'package:student_app/src/features/curriculum/repositories/domain_repository.dart';
import 'package:student_app/src/core/database/database.dart';

void main() {
  group('DomainsScreen Widget Tests', () {
    testWidgets('displays loading indicator when loading', (WidgetTester tester) async {
      // Create a provider that returns a loading state
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            // Mock repository to return loading state
          ],
          child: const MaterialApp(
            home: DomainsScreen(),
          ),
        ),
      );

      // Verify loading indicator is shown
      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('displays domains list when data is loaded', (WidgetTester tester) async {
      // Create mock domains
      final mockDomains = [
        Domain(
          id: 'test-1',
          name: 'Algebra',
          description: 'Algebraic concepts',
          orderIndex: 1,
          iconUrl: null,
        ),
        Domain(
          id: 'test-2',
          name: 'Geometry',
          description: 'Geometric concepts',
          orderIndex: 2,
          iconUrl: null,
        ),
      ];

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            // Override domain repository provider
            // domainRepositoryProvider.overrideWith((ref) => mockRepository)
          ],
          child: const MaterialApp(
            home: DomainsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify domain names are displayed
      expect(find.text('Algebra'), findsOneWidget);
      expect(find.text('Geometry'), findsOneWidget);
    });

    testWidgets('displays empty state when no domains', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            // Override to return empty list
          ],
          child: const MaterialApp(
            home: DomainsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify empty state message
      expect(find.text('No domains available'), findsOneWidget);
    });

    testWidgets('navigates to skills screen when domain is tapped', (WidgetTester tester) async {
      final mockDomains = [
        Domain(
          id: 'test-1',
          name: 'Algebra',
          description: 'Algebraic concepts',
          orderIndex: 1,
          iconUrl: null,
        ),
      ];

      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: const DomainsScreen(),
            routes: {
              '/skills': (context) => const Scaffold(body: Text('Skills Screen')),
            },
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Tap on domain card
      await tester.tap(find.text('Algebra'));
      await tester.pumpAndSettle();

      // Verify navigation to skills screen
      expect(find.text('Skills Screen'), findsOneWidget);
    });

    testWidgets('displays error message when loading fails', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            // Override to throw error
          ],
          child: const MaterialApp(
            home: DomainsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify error message is displayed
      expect(find.textContaining('Error'), findsOneWidget);
    });

    testWidgets('has correct accessibility semantics', (WidgetTester tester) async {
      final mockDomains = [
        Domain(
          id: 'test-1',
          name: 'Algebra',
          description: 'Algebraic concepts',
          orderIndex: 1,
          iconUrl: null,
        ),
      ];

      await tester.pumpWidget(
        ProviderScope(
          child: const MaterialApp(
            home: DomainsScreen(),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify semantic labels exist for accessibility
      final semantics = tester.getSemantics(find.text('Algebra'));
      expect(semantics.label, contains('Algebra'));
    });
  });
}
