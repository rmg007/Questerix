import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: Math7WebApp(),
    ),
  );
}

class Math7WebApp extends StatelessWidget {
  const Math7WebApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Math7 Student App',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7C3AED),
          brightness: Brightness.light,
        ),
        useMaterial3: true,
        fontFamily: 'Inter',
      ),
      home: const StudentHomePage(),
    );
  }
}

class StudentHomePage extends StatelessWidget {
  const StudentHomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF7C3AED), Color(0xFF5B21B6)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF7C3AED).withOpacity(0.3),
                          blurRadius: 24,
                          offset: const Offset(0, 12),
                        ),
                      ],
                    ),
                    child: const Icon(
                      Icons.calculate_rounded,
                      size: 64,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 32),
                  const Text(
                    'Math7',
                    style: TextStyle(
                      fontSize: 48,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Student Learning App',
                    style: TextStyle(
                      fontSize: 20,
                      color: Color(0xFF64748B),
                    ),
                  ),
                  const SizedBox(height: 48),
                  const Text(
                    'Web Preview Mode',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF7C3AED),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3E8FF),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFE9D5FF)),
                    ),
                    child: const Text(
                      'The full app requires SQLite database which is not available in web browsers. '
                      'Use this preview to test the UI layout on different screen sizes.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFF6B21A8),
                      ),
                    ),
                  ),
                  const SizedBox(height: 48),
                  ElevatedButton.icon(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => const DemoQuizPage(),
                        ),
                      );
                    },
                    icon: const Icon(Icons.play_arrow_rounded),
                    label: const Text('Try Demo Quiz'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF7C3AED),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 16,
                      ),
                      textStyle: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class DemoQuizPage extends StatefulWidget {
  const DemoQuizPage({super.key});

  @override
  State<DemoQuizPage> createState() => _DemoQuizPageState();
}

class _DemoQuizPageState extends State<DemoQuizPage> {
  int currentQuestion = 0;
  int? selectedAnswer;
  bool showFeedback = false;

  final questions = [
    {
      'question': 'What is 7 x 8?',
      'options': ['54', '56', '58', '64'],
      'correct': 1,
    },
    {
      'question': 'What is 144 / 12?',
      'options': ['10', '11', '12', '14'],
      'correct': 2,
    },
    {
      'question': 'What is 25% of 200?',
      'options': ['25', '40', '50', '75'],
      'correct': 2,
    },
  ];

  @override
  Widget build(BuildContext context) {
    final q = questions[currentQuestion];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.close, color: Color(0xFF64748B)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Question ${currentQuestion + 1} of ${questions.length}',
          style: const TextStyle(
            color: Color(0xFF1E293B),
            fontWeight: FontWeight.w600,
          ),
        ),
        centerTitle: true,
      ),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  LinearProgressIndicator(
                    value: (currentQuestion + 1) / questions.length,
                    backgroundColor: const Color(0xFFE2E8F0),
                    valueColor: const AlwaysStoppedAnimation(Color(0xFF7C3AED)),
                  ),
                  const SizedBox(height: 48),
                  Text(
                    q['question'] as String,
                    style: const TextStyle(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1E293B),
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 48),
                  ...List.generate(
                    (q['options'] as List).length,
                    (index) => Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: showFeedback
                              ? null
                              : () {
                                  setState(() {
                                    selectedAnswer = index;
                                    showFeedback = true;
                                  });
                                },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: showFeedback
                                ? (index == q['correct']
                                    ? const Color(0xFF10B981)
                                    : (selectedAnswer == index
                                        ? const Color(0xFFEF4444)
                                        : Colors.white))
                                : (selectedAnswer == index
                                    ? const Color(0xFF7C3AED)
                                    : Colors.white),
                            foregroundColor: showFeedback
                                ? (index == q['correct'] ||
                                        selectedAnswer == index
                                    ? Colors.white
                                    : const Color(0xFF1E293B))
                                : (selectedAnswer == index
                                    ? Colors.white
                                    : const Color(0xFF1E293B)),
                            padding: const EdgeInsets.symmetric(vertical: 20),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                              side: BorderSide(
                                color: showFeedback
                                    ? Colors.transparent
                                    : const Color(0xFFE2E8F0),
                              ),
                            ),
                          ),
                          child: Text(
                            (q['options'] as List)[index] as String,
                            style: const TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                  const Spacer(),
                  if (showFeedback)
                    ElevatedButton(
                      onPressed: () {
                        if (currentQuestion < questions.length - 1) {
                          setState(() {
                            currentQuestion++;
                            selectedAnswer = null;
                            showFeedback = false;
                          });
                        } else {
                          Navigator.pop(context);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF7C3AED),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(
                          horizontal: 48,
                          vertical: 16,
                        ),
                      ),
                      child: Text(
                        currentQuestion < questions.length - 1
                            ? 'Next Question'
                            : 'Finish',
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
