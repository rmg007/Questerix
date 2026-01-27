import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:student_app/src/core/database/database.dart';
import 'package:student_app/src/core/database/providers.dart';

/// Provider for skill repository
final skillRepositoryProvider = Provider<SkillRepository>((ref) {
  final database = ref.watch(databaseProvider);
  return SkillRepository(database);
});

/// Repository for skills (offline-first)
class SkillRepository {
  final AppDatabase _database;

  SkillRepository(this._database);

  /// Watch all published skills for a domain
  Stream<List<Skill>> watchByDomain(String domainId) {
    return (_database.select(_database.skills)
          ..where((s) => s.domainId.equals(domainId))
          ..where((s) => s.isPublished.equals(true))
          ..where((s) => s.deletedAt.isNull())
          ..orderBy([(s) => OrderingTerm.asc(s.sortOrder)]))
        .watch();
  }

  /// Get a single skill by ID
  Future<Skill?> getById(String id) {
    return (_database.select(_database.skills)
          ..where((s) => s.id.equals(id)))
        .getSingleOrNull();
  }

  /// Upsert a skill to local database
  Future<void> upsert(Skill skill) async {
    await _database.into(_database.skills).insertOnConflictUpdate(skill);
  }

  /// Batch upsert skills (for sync)
  Future<void> batchUpsert(List<Skill> skills) async {
    await _database.batch((batch) {
      for (final skill in skills) {
        batch.insert(
          _database.skills,
          skill,
          mode: InsertMode.insertOrReplace,
        );
      }
    });
  }
}
