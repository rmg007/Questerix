import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:student_app/src/core/database/database.dart';
import 'package:student_app/src/core/database/providers.dart';

/// Provider for domain repository
final domainRepositoryProvider = Provider<DomainRepository>((ref) {
  final database = ref.watch(databaseProvider);
  return DomainRepository(database);
});

/// Repository for domains (offline-first)
class DomainRepository {
  final AppDatabase _database;

  DomainRepository(this._database);

  /// Watch all published, non-deleted domains
  Stream<List<Domain>> watchAllPublished() {
    return (_database.select(_database.domains)
          ..where((d) => d.isPublished.equals(true))
          ..where((d) => d.deletedAt.isNull())
          ..orderBy([(d) => OrderingTerm.asc(d.sortOrder)]))
        .watch();
  }

  /// Get a single domain by ID
  Future<Domain?> getById(String id) {
    return (_database.select(_database.domains)
          ..where((d) => d.id.equals(id)))
        .getSingleOrNull();
  }

  /// Get all domains (for admin or offline access)
  Future<List<Domain>> getAll() {
    return (_database.select(_database.domains)
          ..where((d) => d.deletedAt.isNull())
          ..orderBy([(d) => OrderingTerm.asc(d.sortOrder)]))
        .get();
  }

  /// Upsert a domain to local database
  Future<void> upsert(Domain domain) async {
    await _database.into(_database.domains).insertOnConflictUpdate(domain);
  }

  /// Batch upsert domains (for sync)
  Future<void> batchUpsert(List<Domain> domains) async {
    await _database.batch((batch) {
      for (final domain in domains) {
        batch.insert(
          _database.domains,
          domain,
          mode: InsertMode.insertOrReplace,
        );
      }
    });
  }

  /// Soft delete a domain
  Future<void> softDelete(String id) async {
    await (_database.update(_database.domains)
          ..where((d) => d.id.equals(id)))
        .write(
      DomainsCompanion(
        deletedAt: Value(DateTime.now()),
        updatedAt: Value(DateTime.now()),
      ),
    );
  }
}
