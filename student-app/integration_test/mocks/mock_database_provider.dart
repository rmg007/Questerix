import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:student_app/src/core/database/database.dart';

/// Mock Database Provider for Integration Tests
/// 
/// Provides an in-memory Drift database for testing
/// without persisting data to disk.
class MockDatabaseProvider {
  AppDatabase? _database;
  bool _isInitialized = false;

  bool get isInitialized => _isInitialized;

  /// Initialize in-memory test database
  Future<void> initialize() async {
    if (_isInitialized) return;

    // Create in-memory database
    _database = AppDatabase(NativeDatabase.memory());
    _isInitialized = true;
  }

  /// Get the mock database instance
  AppDatabase getDatabase() {
    if (!_isInitialized) {
      throw StateError('MockDatabaseProvider not initialized. Call initialize() first.');
    }
    return _database!;
  }

  /// Seed test data into database
  Future<void> seedTestData() async {
    final db = getDatabase();

    // Insert test domains
    await db.into(db.domains).insert(DomainsCompanion.insert(
      id: const Value('test-domain-1'),
      name: 'Test Algebra',
      description: const Value('Test algebra domain'),
      orderIndex: 1,
    ));

    await db.into(db.domains).insert(DomainsCompanion.insert(
      id: const Value('test-domain-2'),
      name: 'Test Geometry',
      description: const Value('Test geometry domain'),
      orderIndex: 2,
    ));

    // Insert test skills
    await db.into(db.skills).insert(SkillsCompanion.insert(
      id: const Value('test-skill-1'),
      domainId: 'test-domain-1',
      name: 'Linear Equations',
      description: const Value('Solving linear equations'),
      orderIndex: 1,
      masteryThreshold: const Value(80),
    ));

    await db.into(db.skills).insert(SkillsCompanion.insert(
      id: const Value('test-skill-2'),
      domainId: 'test-domain-2',
      name: 'Triangles',
      description: const Value('Triangle properties'),
      orderIndex: 1,
      masteryThreshold: const Value(75),
    ));

    // Insert test questions
    await db.into(db.questions).insert(QuestionsCompanion.insert(
      id: const Value('test-question-1'),
      skillId: 'test-skill-1',
      questionType: QuestionType.multipleChoice,
      questionText: 'Solve for x: 2x + 5 = 15',
      correctAnswer: '5',
      options: const Value('["3", "5", "7", "10"]'),
      difficulty: const Value(2),
      points: const Value(10),
    ));

    await db.into(db.questions).insert(QuestionsCompanion.insert(
      id: const Value('test-question-2'),
      skillId: 'test-skill-2',
      questionType: QuestionType.boolean,
      questionText: 'The sum of angles in a triangle is 180 degrees',
      correctAnswer: 'true',
      difficulty: const Value(1),
      points: const Value(5),
    ));
  }

  /// Clear all data from database
  Future<void> clearData() async {
    final db = getDatabase();
    
    await db.delete(db.attempts).go();
    await db.delete(db.questions).go();
    await db.delete(db.skills).go();
    await db.delete(db.domains).go();
  }

  /// Close database and clean up
  Future<void> cleanup() async {
    if (_database != null) {
      await _database!.close();
      _database = null;
    }
    _isInitialized = false;
  }

  /// Verify database has test data
  Future<bool> hasTestData() async {
    final db = getDatabase();
    
    final domains = await db.select(db.domains).get();
    final skills = await db.select(db.skills).get();
    final questions = await db.select(db.questions).get();
    
    return domains.isNotEmpty && skills.isNotEmpty && questions.isNotEmpty;
  }
}
