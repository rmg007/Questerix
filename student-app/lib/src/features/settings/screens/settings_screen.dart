import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:student_app/src/core/connectivity/connectivity_service.dart';
import 'package:student_app/src/core/providers/settings_provider.dart';
import 'package:student_app/src/core/sync/sync_service.dart';
import 'package:student_app/src/core/theme/app_theme.dart';
import 'package:student_app/src/features/auth/providers/auth_provider.dart';
import 'package:student_app/src/core/database/providers.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final syncState = ref.watch(syncServiceProvider);
    final connectivityAsync = ref.watch(connectivityServiceProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
        automaticallyImplyLeading: false,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSyncSection(context, ref, syncState, connectivityAsync),
          const SizedBox(height: 24),
          _buildAccessibilitySection(context, ref, settings),
          const SizedBox(height: 24),
          _buildAccountSection(context, ref),
          const SizedBox(height: 24),
          _buildAboutSection(context),
        ],
      ),
    );
  }

  Widget _buildSyncSection(
    BuildContext context,
    WidgetRef ref,
    SyncState syncState,
    AsyncValue<ConnectivityStatus> connectivityAsync,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.sync, color: AppColors.primary),
                const SizedBox(width: 12),
                Text(
                  'Sync & Data',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),
            _buildConnectivityStatus(context, connectivityAsync),
            const Divider(height: 24),
            _buildSyncStatus(context, syncState),
            const SizedBox(height: 16),
            _buildPendingChanges(context, ref),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: syncState.isSyncing
                    ? null
                    : () => ref.read(syncServiceProvider.notifier).sync(),
                icon: syncState.isSyncing
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: Colors.white,
                        ),
                      )
                    : const Icon(Icons.sync),
                label: Text(syncState.isSyncing ? 'Syncing...' : 'Sync Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildConnectivityStatus(
    BuildContext context,
    AsyncValue<ConnectivityStatus> connectivityAsync,
  ) {
    return connectivityAsync.when(
      data: (status) {
        final isOnline = status == ConnectivityStatus.online;
        return Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: isOnline ? AppColors.online : AppColors.offline,
              ),
            ),
            const SizedBox(width: 12),
            Text(
              isOnline ? 'Online' : 'Offline',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: isOnline ? AppColors.online : AppColors.offline,
                    fontWeight: FontWeight.w500,
                  ),
            ),
            const Spacer(),
            if (!isOnline)
              Text(
                'Changes will sync when online',
                style: Theme.of(context).textTheme.bodySmall,
              ),
          ],
        );
      },
      loading: () => const Row(
        children: [
          SizedBox(
            width: 12,
            height: 12,
            child: CircularProgressIndicator(strokeWidth: 2),
          ),
          SizedBox(width: 12),
          Text('Checking connection...'),
        ],
      ),
      error: (_, __) => Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: const BoxDecoration(
              shape: BoxShape.circle,
              color: AppColors.warning,
            ),
          ),
          const SizedBox(width: 12),
          const Text('Connection unknown'),
        ],
      ),
    );
  }

  Widget _buildSyncStatus(BuildContext context, SyncState syncState) {
    String statusText;
    Color statusColor;
    IconData statusIcon;

    if (syncState.isSyncing) {
      statusText = 'Syncing...';
      statusColor = AppColors.primary;
      statusIcon = Icons.sync;
    } else if (syncState.error != null) {
      statusText = 'Sync failed';
      statusColor = AppColors.error;
      statusIcon = Icons.error_outline;
    } else if (syncState.lastSyncAt != null) {
      statusText = 'Last synced: ${_formatLastSync(syncState.lastSyncAt!)}';
      statusColor = AppColors.success;
      statusIcon = Icons.check_circle;
    } else {
      statusText = 'Not synced yet';
      statusColor = AppColors.textSecondary;
      statusIcon = Icons.info_outline;
    }

    return Row(
      children: [
        Icon(statusIcon, color: statusColor, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            statusText,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: statusColor,
                ),
          ),
        ),
      ],
    );
  }

  Widget _buildPendingChanges(BuildContext context, WidgetRef ref) {
    return FutureBuilder<int>(
      future: _getPendingChangesCount(ref),
      builder: (context, snapshot) {
        final count = snapshot.data ?? 0;
        return Row(
          children: [
            Icon(
              Icons.cloud_upload_outlined,
              color: count > 0 ? AppColors.warning : AppColors.textSecondary,
              size: 20,
            ),
            const SizedBox(width: 12),
            Text(
              count > 0 ? '$count pending changes' : 'All changes synced',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color:
                        count > 0 ? AppColors.warning : AppColors.textSecondary,
                  ),
            ),
          ],
        );
      },
    );
  }

  Future<int> _getPendingChangesCount(WidgetRef ref) async {
    final db = ref.read(databaseProvider);
    final outbox = await db.select(db.outbox).get();
    return outbox.length;
  }

  Widget _buildAccessibilitySection(
    BuildContext context,
    WidgetRef ref,
    AppSettings settings,
  ) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.accessibility, color: AppColors.primary),
                const SizedBox(width: 12),
                Text(
                  'Accessibility',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Large Text'),
              subtitle: const Text('Increase text size for better readability'),
              value: settings.largeText,
              onChanged: (value) {
                ref.read(settingsProvider.notifier).setLargeText(value);
              },
              contentPadding: EdgeInsets.zero,
            ),
            const Divider(),
            SwitchListTile(
              title: const Text('Dark Mode'),
              subtitle: const Text('Use dark theme'),
              value: settings.darkMode,
              onChanged: (value) {
                ref.read(settingsProvider.notifier).setDarkMode(value);
              },
              contentPadding: EdgeInsets.zero,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAccountSection(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(currentUserProvider);
    final email = currentUser?.email ?? 'Not logged in';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.person, color: AppColors.primary),
                const SizedBox(width: 12),
                Text(
                  'Account',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),
            ListTile(
              leading: CircleAvatar(
                backgroundColor: AppColors.primary.withValues(alpha: 0.1),
                child: const Icon(Icons.email, color: AppColors.primary),
              ),
              title: Text(email),
              subtitle: const Text('Student Account'),
              contentPadding: EdgeInsets.zero,
            ),
            const SizedBox(height: 8),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () async {
                  final confirmed = await showDialog<bool>(
                    context: context,
                    builder: (context) => AlertDialog(
                      title: const Text('Sign Out'),
                      content: const Text('Are you sure you want to sign out?'),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context, false),
                          child: const Text('Cancel'),
                        ),
                        TextButton(
                          onPressed: () => Navigator.pop(context, true),
                          child: const Text('Sign Out'),
                        ),
                      ],
                    ),
                  );
                  if (confirmed == true) {
                    await ref.read(authServiceProvider).signOut();
                  }
                },
                icon: const Icon(Icons.logout),
                label: const Text('Sign Out'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppColors.error,
                  side: const BorderSide(color: AppColors.error),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAboutSection(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.info, color: AppColors.primary),
                const SizedBox(width: 12),
                Text(
                  'About',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
              ],
            ),
            const SizedBox(height: 16),
            ListTile(
              title: const Text('Questerix Student'),
              subtitle: const Text('Version 1.0.0'),
              leading: Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(Icons.school, color: AppColors.primary),
              ),
              contentPadding: EdgeInsets.zero,
            ),
          ],
        ),
      ),
    );
  }

  String _formatLastSync(DateTime lastSync) {
    final now = DateTime.now();
    final difference = now.difference(lastSync);

    if (difference.inMinutes < 1) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      return '${difference.inMinutes}m ago';
    } else if (difference.inHours < 24) {
      return '${difference.inHours}h ago';
    } else {
      return '${difference.inDays}d ago';
    }
  }
}
