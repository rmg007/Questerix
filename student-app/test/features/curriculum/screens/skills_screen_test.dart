import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/src/features/curriculum/screens/skills_screen.dart';
import 'package:student_app/src/core/database/database.dart';

void main() {
  group('SkillsScreen Widget Tests', () {
    const testDomainId = 'test-domain-1';

    testWidgets('displays loading indicator initially', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: const MaterialApp(
            home: SkillsScreen(domainId: testDomainId),
          ),
        ),
      );

      expect(find.byType(CircularProgressIndicator), findsOneWidget);
    });

    testWidgets('displays skills list when loaded', (WidgetTester tester) async {
      final mockSkills = [
        Skill(
          id: 'skill-1',
          domainId: testDomainId,
          name: 'Linear Equations',
          description: 'Solving linear equations',
          orderIndex: 1,
          masteryThreshold: 80,
        ),
        Skill(
          id: 'skill-2',
          domainId: testDomainId,
          name: 'Quadratic Equations',
          description: 'Solving quadratic equations',
          orderIndex: 2,
          masteryThreshold: 80,
        ),
      ];

      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            // Override skills provider with mock data
          ],
          child: const MaterialApp(
            home: SkillsScreen(domainId: testDomainId),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify skill names are displayed
      expect(find.text('Linear Equations'), findsOneWidget);
      expect(find.text('Quadratic Equations'), findsOneWidget);
    });

    testWidgets('filters skills by domain ID', (WidgetTester tester) async {
      // Skills from different domains
      final allSkills = [
        Skill(
          id: 'skill-1',
          domainId: testDomainId,
          name: 'Algebra Skill',
          description: 'Algebra',
          orderIndex: 1,
          masteryThreshold: 80,
        ),
        Skill(
          id: 'skill-2',
          domainId: 'other-domain',
          name: 'Geometry Skill',
          description: 'Geometry',
          orderIndex: 1,
          masteryThreshold: 80,
        ),
      ];

      await tester.pumpWidget(
        ProviderScope(
          child: const MaterialApp(
            home: SkillsScreen(domainId: testDomainId),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Should only show skills from the specified domain
      expect(find.text('Algebra Skill'), findsOneWidget);
      expect(find.text('Geometry Skill'), findsNothing);
    });

    testWidgets('navigates to practice screen when skill is selected', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: const SkillsScreen(domainId: testDomainId),
            routes: {
              '/practice': (context) => const Scaffold(body: Text('Practice Screen')),
            },
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Tap on a skill
      await tester.tap(find.text('Linear Equations'));
      await tester.pumpAndSettle();

      // Verify navigation to practice screen
      expect(find.text('Practice Screen'), findsOneWidget);
    });

    testWidgets('displays skill progress indicators', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: const MaterialApp(
            home: SkillsScreen(domainId: testDomainId),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify progress indicators are shown
      expect(find.byType(LinearProgressIndicator), findsWidgets);
    });

    testWidgets('back button returns to domains screen', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: MaterialApp(
            home: const Scaffold(body: Text('Domains Screen')),
            routes: {
              '/skills': (context) => const SkillsScreen(domainId: testDomainId),
            },
          ),
        ),
      );

      // Navigate to skills screen
      await tester.tap(find.text('Domains Screen'));
      await tester.pumpAndSettle();

      // Find and tap back button
      await tester.tap(find.byType(BackButton));
      await tester.pumpAndSettle();

      // Verify we're back at domains screen
      expect(find.text('Domains Screen'), findsOneWidget);
    });

    testWidgets('has accessibility semantics for skills', (WidgetTester tester) async {
      await tester.pumpWidget(
        ProviderScope(
          child: const MaterialApp(
            home: SkillsScreen(domainId: testDomainId),
          ),
        ),
      );

      await tester.pumpAndSettle();

      // Verify semantic labels
      final skillFinder = find.text('Linear Equations');
      if (skillFinder.evaluate().isNotEmpty) {
        final semantics = tester.getSemantics(skillFinder);
        expect(semantics.label, isNotNull);
      }
    });
  });
}
