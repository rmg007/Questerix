import 'package:math7_domain/math7_domain.dart' as model;

/// Abstract repository for skills
abstract class SkillRepository {
  /// Watch skills for a specific domain
  Stream<List<model.Skill>> watchByDomain(String domainId);

  /// Get skills by domain ID
  Future<List<model.Skill>> getByDomain(String domainId);

  /// Get a single skill by ID
  Future<model.Skill?> getById(String id);
}
