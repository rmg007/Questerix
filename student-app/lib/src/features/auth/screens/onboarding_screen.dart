import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../providers/auth_providers.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  int _step = 0; // 0: Age, 1: Email/Parent Email
  bool _isUnder13 = false;

  void _onAgeSelected(DateTime birthDate) {
    // Calculate age
    final now = DateTime.now();
    int age = now.year - birthDate.year;
    if (now.month < birthDate.month || (now.month == birthDate.month && now.day < birthDate.day)) {
      age--;
    }

    setState(() {
      _isUnder13 = age < 13;
      _step = 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Welcome to Math7')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: _step == 0
            ? _AgeGateStep(onContinue: _onAgeSelected)
            : _isUnder13
                ? _ParentApprovalStep(onBack: () => setState(() => _step = 0))
                : _StudentSignupStep(onBack: () => setState(() => _step = 0)),
      ),
    );
  }
}

class _AgeGateStep extends StatefulWidget {
  final ValueChanged<DateTime> onContinue;

  const _AgeGateStep({required this.onContinue});

  @override
  State<_AgeGateStep> createState() => _AgeGateStepState();
}

class _AgeGateStepState extends State<_AgeGateStep> {
  DateTime? _selectedDate;

  Future<void> _selectDate(BuildContext context) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().subtract(const Duration(days: 365 * 10)), // Default 10 years old
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null && picked != _selectedDate) {
      setState(() {
        _selectedDate = picked;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'When is your birthday?',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: () => _selectDate(context),
          child: Text(_selectedDate == null
              ? 'Select Date'
              : '${_selectedDate!.month}/${_selectedDate!.day}/${_selectedDate!.year}'),
        ),
        const SizedBox(height: 20),
        if (_selectedDate != null)
          ElevatedButton(
            onPressed: () => widget.onContinue(_selectedDate!),
            child: const Text('Continue'),
          ),
      ],
    );
  }
}

class _ParentApprovalStep extends ConsumerStatefulWidget {
  final VoidCallback onBack;

  const _ParentApprovalStep({required this.onBack});

  @override
  ConsumerState<_ParentApprovalStep> createState() => _ParentApprovalStepState();
}

class _ParentApprovalStepState extends ConsumerState<_ParentApprovalStep> {
  final _emailController = TextEditingController();
  bool _isLoading = false;

  Future<void> _submit() async {
    setState(() => _isLoading = true);
    try {
      final email = _emailController.text;
      if (email.isEmpty || !email.contains('@')) {
         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Invalid Email')));
         return;
      }
      
      // Send magic link to parent.
      // NOTE: This actually creates a user with this email for now.
      // In a real parent flow, we might want to flag this user as "parent pending" in metadata 
      // or simply treat this as the parent creating an account for clarity.
      await ref.read(authRepositoryProvider).signInWithEmail(email: email);

      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Email sent to parent! Check inbox.')));
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Ask a parent for help',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 10),
        const Text('Enter your parent\'s email to get approved.'),
        const SizedBox(height: 20),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Parent Email',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 20),
        if (_isLoading)
          const CircularProgressIndicator()
        else
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              TextButton(onPressed: widget.onBack, child: const Text('Back')),
              ElevatedButton(onPressed: _submit, child: const Text('Send Request')),
            ],
          ),
        const SizedBox(height: 20),
        const Text(
          'By asking for approval, you agree to the Terms of Service.',
          style: TextStyle(fontSize: 12, color: Colors.grey),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}

class _StudentSignupStep extends ConsumerStatefulWidget {
  final VoidCallback onBack;

  const _StudentSignupStep({required this.onBack});

  @override
  ConsumerState<_StudentSignupStep> createState() => _StudentSignupStepState();
}

class _StudentSignupStepState extends ConsumerState<_StudentSignupStep> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  bool _agreedToTerms = false;

  Future<void> _submit() async {
     if (!_agreedToTerms) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('You must agree to the terms.')));
        return;
     }

    setState(() => _isLoading = true);
    try {
      final email = _emailController.text;
      await ref.read(authRepositoryProvider).signInWithEmail(email: email);
      if (mounted) {
         ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Email sent! Check your inbox to login.')));
      }
    } catch (e) {
       if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showTermsDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Terms of Service & Privacy Policy'),
        content: const SingleChildScrollView(
          child: Text(
            '1. Acceptance of Terms\n'
            'By accessing and using Math7, you agree to these terms.\n\n'
            '2. Privacy & Data Collection\n'
            'We value your privacy. We only collect your email address for account authentication and progress tracking. We do not share your data with third parties.\n\n'
            '3. User Conduct\n'
            'You agree to use the app for educational purposes only.\n\n'
            '4. Changes to Terms\n'
            'We may update these terms from time to time. Continued use of the app constitutes acceptance of new terms.',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          'Create Account',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 20),
        TextField(
          controller: _emailController,
          decoration: const InputDecoration(
            labelText: 'Email Address',
            border: OutlineInputBorder(),
          ),
        ),
        const SizedBox(height: 20),
        Row(
          children: [
            Checkbox(
              value: _agreedToTerms,
              onChanged: (val) => setState(() => _agreedToTerms = val ?? false),
            ),
            Expanded(
              child: GestureDetector(
                onTap: () => _showTermsDialog(context),
                child: const Text.rich(
                  TextSpan(
                    text: 'I agree to the ',
                    style: TextStyle(color: Colors.black),
                    children: [
                      TextSpan(
                        text: 'Terms of Service',
                        style: TextStyle(
                          color: Colors.blue,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                      TextSpan(text: ' and '),
                      TextSpan(
                        text: 'Privacy Policy',
                        style: TextStyle(
                          color: Colors.blue,
                          decoration: TextDecoration.underline,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),
        if (_isLoading)
          const CircularProgressIndicator()
        else
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              TextButton(onPressed: widget.onBack, child: const Text('Back')),
              ElevatedButton(onPressed: _submit, child: const Text('Start Learning')),
            ],
          ),
      ],
    );
  }
}
