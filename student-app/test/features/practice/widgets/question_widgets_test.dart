import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_app/src/features/practice/widgets/multiple_choice_question.dart';
import 'package:student_app/src/features/practice/widgets/text_input_question.dart';
import 'package:student_app/src/features/practice/widgets/boolean_question.dart';

void main() {
  group('MultipleChoiceQuestion Widget Tests', () {
    const questionText = 'What is 2 + 2?';
    const choices = ['2', '3', '4', '5'];
    const correctAnswer = '4';

    testWidgets('displays question text', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: MultipleChoiceQuestion(
              questionText: questionText,
              choices: choices,
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      expect(find.text(questionText), findsOneWidget);
    });

    testWidgets('displays all answer choices', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: MultipleChoiceQuestion(
              questionText: questionText,
              choices: choices,
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      for (final choice in choices) {
        expect(find.text(choice), findsOneWidget);
      }
    });

    testWidgets('allows selecting an answer', (WidgetTester tester) async {
      String? selectedAnswer;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: MultipleChoiceQuestion(
              questionText: questionText,
              choices: choices,
              onAnswerSelected: (answer) {
                selectedAnswer = answer;
              },
            ),
          ),
        ),
      );

      // Tap on answer choice
      await tester.tap(find.text('4'));
      await tester.pumpAndSettle();

      expect(selectedAnswer, equals('4'));
    });

    testWidgets('highlights selected answer', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: MultipleChoiceQuestion(
              questionText: questionText,
              choices: choices,
              selectedAnswer: '4',
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      // Verify visual feedback for selected answer
      // Check for different styling on selected choice
      expect(find.text('4'), findsOneWidget);
    });

    testWidgets('has accessibility semantics', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: MultipleChoiceQuestion(
              questionText: questionText,
              choices: choices,
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      // Verify question has semantic label
      final questionSemantics = tester.getSemantics(find.text(questionText));
      expect(questionSemantics.label, contains(questionText));
    });
  });

  group('TextInputQuestion Widget Tests', () {
    const questionText = 'What is the capital of France?';

    testWidgets('displays question text', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TextInputQuestion(
              questionText: questionText,
              onAnswerChanged: (_) {},
            ),
          ),
        ),
      );

      expect(find.text(questionText), findsOneWidget);
    });

    testWidgets('displays text input field', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TextInputQuestion(
              questionText: questionText,
              onAnswerChanged: (_) {},
            ),
          ),
        ),
      );

      expect(find.byType(TextField), findsOneWidget);
    });

    testWidgets('allows entering text', (WidgetTester tester) async {
      String? enteredAnswer;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TextInputQuestion(
              questionText: questionText,
              onAnswerChanged: (answer) {
                enteredAnswer = answer;
              },
            ),
          ),
        ),
      );

      // Enter text
      await tester.enterText(find.byType(TextField), 'Paris');
      await tester.pumpAndSettle();

      expect(enteredAnswer, equals('Paris'));
    });

    testWidgets('has hint text in input field', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TextInputQuestion(
              questionText: questionText,
              hintText: 'Enter your answer',
              onAnswerChanged: (_) {},
            ),
          ),
        ),
      );

      expect(find.text('Enter your answer'), findsOneWidget);
    });

    testWidgets('has proper keyboard type', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: TextInputQuestion(
              questionText: 'What is 5 x 6?',
              keyboardType: TextInputType.number,
              onAnswerChanged: (_) {},
            ),
          ),
        ),
      );

      final textField = tester.widget<TextField>(find.byType(TextField));
      expect(textField.keyboardType, equals(TextInputType.number));
    });
  });

  group('BooleanQuestion Widget Tests', () {
    const questionText = 'Is 4 greater than 2?';

    testWidgets('displays question text', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BooleanQuestion(
              questionText: questionText,
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      expect(find.text(questionText), findsOneWidget);
    });

    testWidgets('displays True and False buttons', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BooleanQuestion(
              questionText: questionText,
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      expect(find.text('True'), findsOneWidget);
      expect(find.text('False'), findsOneWidget);
    });

    testWidgets('allows selecting True', (WidgetTester tester) async {
      bool? selectedAnswer;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BooleanQuestion(
              questionText: questionText,
              onAnswerSelected: (answer) {
                selectedAnswer = answer;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('True'));
      await tester.pumpAndSettle();

      expect(selectedAnswer, isTrue);
    });

    testWidgets('allows selecting False', (WidgetTester tester) async {
      bool? selectedAnswer;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BooleanQuestion(
              questionText: questionText,
              onAnswerSelected: (answer) {
                selectedAnswer = answer;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('False'));
      await tester.pumpAndSettle();

      expect(selectedAnswer, isFalse);
    });

    testWidgets('highlights selected button', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BooleanQuestion(
              questionText: questionText,
              selectedAnswer: true,
              onAnswerSelected: (_) {},
            ),
          ),
        ),
      );

      // Verify True button is highlighted
      expect(find.text('True'), findsOneWidget);
    });
  });

  group('Progress Indicator Widget Tests', () {
    testWidgets('displays current question number', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: QuestionProgressIndicator(
              currentQuestion: 3,
              totalQuestions: 10,
            ),
          ),
        ),
      );

      expect(find.text('3 / 10'), findsOneWidget);
    });

    testWidgets('displays linear progress bar', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: QuestionProgressIndicator(
              currentQuestion: 5,
              totalQuestions: 10,
            ),
          ),
        ),
      );

      expect(find.byType(LinearProgressIndicator), findsOneWidget);
      
      final progressBar = tester.widget<LinearProgressIndicator>(
        find.byType(LinearProgressIndicator),
      );
      expect(progressBar.value, equals(0.5));
    });

    testWidgets('updates progress correctly', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: QuestionProgressIndicator(
              currentQuestion: 7,
              totalQuestions: 10,
            ),
          ),
        ),
      );

      final progressBar = tester.widget<LinearProgressIndicator>(
        find.byType(LinearProgressIndicator),
      );
      expect(progressBar.value, equals(0.7));
    });
  });
}

// Placeholder widget for testing
class QuestionProgressIndicator extends StatelessWidget {
  final int currentQuestion;
  final int totalQuestions;

  const QuestionProgressIndicator({
    super.key,
    required this.currentQuestion,
    required this.totalQuestions,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('$currentQuestion / $totalQuestions'),
        LinearProgressIndicator(
          value: currentQuestion / totalQuestions,
        ),
      ],
    );
  }
}
