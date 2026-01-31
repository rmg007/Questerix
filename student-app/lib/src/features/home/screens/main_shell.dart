import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:student_app/src/core/connectivity/connectivity_service.dart';
import 'package:student_app/src/core/sync/sync_service.dart';
import 'package:student_app/src/core/theme/app_theme.dart';
import 'package:student_app/src/features/curriculum/screens/domains_screen.dart';
import 'package:student_app/src/features/progress/screens/progress_screen.dart';
import 'package:student_app/src/features/settings/screens/settings_screen.dart';

final currentTabProvider = StateProvider<int>((ref) => 0);

class MainShell extends ConsumerWidget {
  const MainShell({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentTab = ref.watch(currentTabProvider);
    final connectivityAsync = ref.watch(connectivityServiceProvider);
    final syncState = ref.watch(syncServiceProvider);

    final screens = [
      const DomainsScreen(),
      const ProgressScreen(),
      const SettingsScreen(),
    ];

    return Scaffold(
      body: IndexedStack(
        index: currentTab,
        children: screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 10,
              offset: const Offset(0, -2),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: currentTab,
          onTap: (index) => ref.read(currentTabProvider.notifier).state = index,
          items: [
            const BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Home',
            ),
            BottomNavigationBarItem(
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Icon(Icons.trending_up_outlined),
                  if (syncState.isSyncing)
                    const Positioned(
                      right: -4,
                      top: -4,
                      child: SizedBox(
                        width: 12,
                        height: 12,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                ],
              ),
              activeIcon: const Icon(Icons.trending_up),
              label: 'Progress',
            ),
            BottomNavigationBarItem(
              icon: Stack(
                clipBehavior: Clip.none,
                children: [
                  const Icon(Icons.settings_outlined),
                  connectivityAsync.when(
                    data: (status) => status == ConnectivityStatus.offline
                        ? Positioned(
                            right: -4,
                            top: -4,
                            child: Container(
                              width: 10,
                              height: 10,
                              decoration: const BoxDecoration(
                                color: AppColors.offline,
                                shape: BoxShape.circle,
                              ),
                            ),
                          )
                        : const SizedBox.shrink(),
                    loading: () => const SizedBox.shrink(),
                    error: (_, __) => const SizedBox.shrink(),
                  ),
                ],
              ),
              activeIcon: const Icon(Icons.settings),
              label: 'Settings',
            ),
          ],
        ),
      ),
    );
  }
}
