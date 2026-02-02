import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:student_app/src/core/database/database.dart';
import 'package:student_app/src/core/database/providers.dart';

/// Provider for question repository
final questionRepositoryProvider = Provider<QuestionRepository>((ref) {
  final database = ref.watch(databaseProvider);
  return QuestionRepository(database);
});

/// Repository for questions (offline-first)
class QuestionRepository {
  final AppDatabase _database;

  QuestionRepository(this._database);

  /// Watch all published questions for a skill
  Stream<List<Question>> watchBySkill(String skillId) {
    return (_database.select(_database.questions)
          ..where((q) => q.skillId.equals(skillId))
          ..where((q) => q.isPublished.equals(true))
          ..where((q) => q.deletedAt.isNull()))
        .watch();
  }

  /// Get a single question by ID
  Future<Question?> getById(String id) {
    return (_database.select(_database.questions)
          ..where((q) => q.id.equals(id)))
        .getSingleOrNull();
  }

  /// Get random questions from a skill (for practice)
  Future<List<Question>> getRandomBySkill(String skillId, int limit) async {
    final questions = await (_database.select(_database.questions)
          ..where((q) => q.skillId.equals(skillId))
          ..where((q) => q.isPublished.equals(true))
          ..where((q) => q.deletedAt.isNull()))
        .get();
    
    questions.shuffle();
    return questions.take(limit).toList();
  }

  /// Upsert a question to local database
  Future<void> upsert(Question question) async {
    await _database.into(_database.questions).insertOnConflictUpdate(question);
  }

  /// Batch upsert questions (for sync)
  Future<void> batchUpsert(List<Question> questions) async {
    await _database.batch((batch) {
      for (final question in questions) {
        batch.insert(
          _database.questions,
          question,
          mode: InsertMode.insertOrReplace,
        );
      }
    });
  }
}
