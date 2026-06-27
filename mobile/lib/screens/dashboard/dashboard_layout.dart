import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/budget_provider.dart';
import '../../widgets/budget_meter.dart';
import 'dashboard_shell.dart';
import 'chat_screen.dart';
import 'quiz_screen.dart';
import 'career_screen.dart';
import 'analytics_screen.dart';
import 'security_screen.dart';

class DashboardLayout extends StatefulWidget {
  const DashboardLayout({super.key});

  @override
  State<DashboardLayout> createState() => _DashboardLayoutState();
}

class _DashboardLayoutState extends State<DashboardLayout> {
  int _currentIndex = 0;
  bool _isLoading = true;

  final List<Widget> _screens = [
    const ChatScreen(),
    const QuizScreen(),
    const CareerScreen(),
    const AnalyticsScreen(),
    const SecurityScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _checkAuth();
  }

  Future<void> _checkAuth() async {
    final auth = context.read<AuthProvider>();
    final isAuth = await auth.checkAuth();
    if (isAuth && mounted) {
      final budget = context.read<BudgetProvider>();
      budget.startPolling(auth.userId);
      setState(() => _isLoading = false);
    } else if (mounted) {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  void dispose() {
    // We shouldn't stop polling here because layout might just rebuild,
    // but typically we'd stop it on logout.
    super.dispose();
  }

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        backgroundColor: IrisColors.cream,
        body: Center(child: CircularProgressIndicator(color: IrisColors.irisPurple)),
      );
    }

    return DashboardShell(
      currentIndex: _currentIndex,
      onTabTapped: _onTabTapped,
      child: Column(
        children: [
          _buildHeader().animate().slideY(begin: -1, duration: 400.ms, curve: Curves.easeOutQuad),
          Expanded(child: _screens[_currentIndex]),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    final auth = context.read<AuthProvider>();
    return Container(
      padding: EdgeInsets.only(
        top: MediaQuery.of(context).padding.top + 16,
        bottom: 16,
        left: 20,
        right: 20,
      ),
      decoration: BoxDecoration(
        color: IrisColors.cream,
        border: const Border(bottom: BorderSide(color: IrisColors.ink, width: 4)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: IrisColors.white,
                    border: Border.all(color: IrisColors.ink, width: 3),
                    borderRadius: IrisRadius.medium,
                    boxShadow: IrisShadows.neo(x: 2, y: 2),
                  ),
                  child: const Center(
                    child: Text('✦', style: TextStyle(color: IrisColors.irisPurple, fontSize: 20)),
                  ),
                ).animate(onPlay: (controller) => controller.repeat())
                 .shimmer(duration: 2000.ms, color: IrisColors.irisPurple.withValues(alpha: 0.3)),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'IRIS Plus',
                        style: TextStyle(
                          fontFamily: 'SpaceGrotesk',
                          fontWeight: FontWeight.w900,
                          fontSize: 18,
                          color: IrisColors.ink,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        auth.user?['name'] ?? 'User',
                        style: TextStyle(
                          fontFamily: 'SpaceGrotesk',
                          fontWeight: FontWeight.w700,
                          fontSize: 12,
                          color: IrisColors.ink.withValues(alpha: 0.6),
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 120,
            child: Consumer<BudgetProvider>(
              builder: (context, budget, _) => BudgetMeter(
                totalCost: budget.totalCost,
                maxBudget: budget.maxBudget,
                mode: budget.mode,
              ),
            ),
          ),
          IconButton(
            onPressed: () async {
              await auth.logout();
              if (mounted) Navigator.pushReplacementNamed(context, '/login');
            },
            icon: const Icon(Icons.logout, color: IrisColors.ink),
          )
        ],
      ),
    );
  }
}
