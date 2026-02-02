import 'dart:convert';
import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:student_app/src/core/database/database.dart';
import 'package:student_app/src/core/database/providers.dart';
import 'package:student_app/src/core/supabase/providers.dart';
import 'package:student_app/src/features/curriculum/repositories/domain_repository.dart';
import 'package:student_app/src/features/curriculum/repositories/skill_repository.dart';
import 'package:student_app/src/features/curriculum/repositories/question_repository.dart';

import 'package:math7_domain/math7_domain.dart' as model;

/// Sync state
class SyncState {
  final bool isSyncing;
  final String? error;
  final DateTime? lastSyncAt;

  SyncState({
    this.isSyncing = false,
    this.error,
    this.lastSyncAt,
  });

  SyncState.idle() : this();
  SyncState.syncing() : this(isSyncing: true);
  SyncState.success(DateTime time) : this(lastSyncAt: time);
  SyncState.error(String message) : this(error: message);

  SyncState copyWith({bool? isSyncing, String? error, DateTime? lastSyncAt}) {
    return SyncState(
      isSyncing: isSyncing ?? this.isSyncing,
      error: error ?? this.error,
      lastSyncAt: lastSyncAt ?? this.lastSyncAt,
    );
  }
}

/// Sync service provider
final syncServiceProvider =
    StateNotifierProvider<SyncService, SyncState>((ref) {
  final database = ref.watch(databaseProvider);
  final supabase = ref.watch(supabaseClientProvider);
  final domainRepo = ref.watch(localDomainRepositoryProvider);
  final skillRepo = ref.watch(localSkillRepositoryProvider);
  final questionRepo = ref.watch(localQuestionRepositoryProvider);
  return SyncService(database, supabase, domainRepo, skillRepo, questionRepo);
});

/// Sync service - handles push/pull synchronization (manual only)
class SyncService extends StateNotifier<SyncState> {
  final AppDatabase _database;
  final SupabaseClient _supabase;
  final DriftDomainRepository _domainRepo;
  final DriftSkillRepository _skillRepo;
  final DriftQuestionRepository _questionRepo;

  SyncService(
    this._database,
    this._supabase,
    this._domainRepo,
    this._skillRepo,
    this._questionRepo,
  ) : super(SyncState.idle());

  /// Full sync: push local changes, then pull remote changes
  Future<void> sync() async {
    if (state.isSyncing) return;

    try {
      state = SyncState.syncing();
      await push();
      await pull();
      state = SyncState.success(DateTime.now());
    } catch (e) {
      state = SyncState.error(e.toString());
      // Retry after delay
      await Future.delayed(const Duration(seconds: 5));
      if (!state.isSyncing) sync();
    }
  }

  /// Push: Upload pending changes from outbox to Supabase
  Future<void> push() async {
    final outboxItems = await (_database.select(_database.outbox)
          ..orderBy([(o) => OrderingTerm.asc(o.createdAt)]))
        .get();

    for (final item in outboxItems) {
      try {
        final payload = jsonDecode(item.payload) as Map<String, dynamic>;

        switch (item.action) {
          case 'INSERT':
          case 'UPSERT':
            // Use submit_attempt_and_update_progress RPC for attempts
            if (item.table == 'attempts') {
              final List<dynamic> response = await _supabase.rpc(
                'submit_attempt_and_update_progress',
                params: {
                  'attempts_json': [payload],
                },
              );

              // Process returned skill_progress updates
              if (response.isNotEmpty) {
                final progressList = response.map((json) {
                  return SkillProgressCompanion(
                    id: Value(json['id'] as String),
                    userId: Value(json['user_id'] as String),
                    skillId: Value(json['skill_id'] as String),
                    totalAttempts: Value(json['total_attempts'] as int),
                    correctAttempts: Value(json['correct_attempts'] as int),
                    totalPoints: Value(json['total_points'] as int),
                    masteryLevel: Value(json['mastery_level'] as int),
                    currentStreak: Value(json['current_streak'] as int),
                    longestStreak: Value(json['longest_streak'] as int),
                    lastAttemptAt: Value(
                        DateTime.parse(json['last_attempt_at'] as String)),
                    createdAt:
                        Value(DateTime.parse(json['created_at'] as String)),
                    updatedAt:
                        Value(DateTime.parse(json['updated_at'] as String)),
                  );
                }).toList();

                await _database.batch((batch) {
                  for (final progress in progressList) {
                    batch.insert(
                      _database.skillProgress,
                      progress,
                      mode: InsertMode.insertOrReplace,
                    );
                  }
                });
              }
            } else {
              await _supabase.from(item.table).upsert(payload);
            }
            break;
          case 'DELETE':
            await _supabase.from(item.table).delete().eq('id', item.recordId);
            break;
        }

        // Remove from outbox on success
        await (_database.delete(_database.outbox)
              ..where((o) => o.id.equals(item.id)))
            .go();
      } catch (e) {
        // Update retry count
        await (_database.update(_database.outbox)
              ..where((o) => o.id.equals(item.id)))
            .write(
          OutboxCompanion(
            retryCount: Value(item.retryCount + 1),
          ),
        );

        // Skip items with too many retries
        if (item.retryCount > 5) {
          await (_database.delete(_database.outbox)
                ..where((o) => o.id.equals(item.id)))
              .go();
        }

        rethrow;
      }
    }
  }

  /// Pull: Download changes from Supabase to local database
  Future<void> pull() async {
    await _pullDomains();
    await _pullSkills();
    await _pullQuestions();
  }

  Future<void> _pullDomains() async {
    final lastSync = await _getLastSync('domains');

    final response = await _supabase
        .from('domains')
        .select()
        .gt('updated_at', lastSync.toIso8601String())
        .eq('status', 'live')
        .isFilter('deleted_at', null);

    if (response.isNotEmpty) {
      final domains =
          response.map((json) => model.Domain.fromJson(json)).toList();
      await _domainRepo.batchUpsert(domains);
      await _updateLastSync('domains', DateTime.now());
    }
  }

  Future<void> _pullSkills() async {
    final lastSync = await _getLastSync('skills');

    final response = await _supabase
        .from('skills')
        .select()
        .gt('updated_at', lastSync.toIso8601String())
        .eq('status', 'live')
        .isFilter('deleted_at', null);

    if (response.isNotEmpty) {
      final skills =
          response.map((json) => model.Skill.fromJson(json)).toList();
      await _skillRepo.batchUpsert(skills);
      await _updateLastSync('skills', DateTime.now());
    }
  }

  Future<void> _pullQuestions() async {
    final lastSync = await _getLastSync('questions');

    final response = await _supabase
        .from('questions')
        .select()
        .gt('updated_at', lastSync.toIso8601String())
        .eq('status', 'live')
        .isFilter('deleted_at', null);

    if (response.isNotEmpty) {
      final questions =
          response.map((json) => model.Question.fromJson(json)).toList();
      await _questionRepo.batchUpsert(questions);
      await _updateLastSync('questions', DateTime.now());
    }
  }

  Future<DateTime> _getLastSync(String tableName) async {
    final meta = await (_database.select(_database.syncMeta)
          ..where((s) => s.table.equals(tableName))
          ..limit(1))
        .getSingleOrNull();
    return meta?.lastSyncedAt ?? DateTime.fromMillisecondsSinceEpoch(0);
  }

  Future<void> _updateLastSync(String tableName, DateTime time) async {
    await _database.into(_database.syncMeta).insertOnConflictUpdate(
          SyncMetaCompanion(
            table: Value(tableName),
            lastSyncedAt: Value(time),
            updatedAt: Value(time),
          ),
        );
  }
}
