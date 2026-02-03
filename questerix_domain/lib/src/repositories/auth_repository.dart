import '../models/user.dart';

abstract class AuthRepository {
  Stream<User?> get authStateChanges;
  User? get currentUser;
  Future<void> signInWithEmail({required String email});
  Future<void> signInAnonymously();
  Future<void> signOut();
  Future<void> updateProfile({required User user});
}
