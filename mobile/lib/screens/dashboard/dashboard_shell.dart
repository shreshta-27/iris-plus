import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';

class DashboardShell extends StatelessWidget {
  final Widget child;
  final int currentIndex;
  final Function(int) onTabTapped;

  const DashboardShell({
    super.key,
    required this.child,
    required this.currentIndex,
    required this.onTabTapped,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: IrisColors.cream,
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: IrisColors.white,
          border: const Border(
            top: BorderSide(color: IrisColors.ink, width: 4),
          ),
          boxShadow: IrisShadows.neo(x: 0, y: -4, color: IrisColors.ink.withValues(alpha: 0.1)),
        ),
        child: BottomNavigationBar(
          currentIndex: currentIndex,
          onTap: onTabTapped,
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: IrisColors.ink,
          unselectedItemColor: IrisColors.ink.withValues(alpha: 0.5),
          selectedLabelStyle: GoogleFonts.spaceGrotesk(
            fontWeight: FontWeight.w700,
            fontSize: 10,
          ),
          unselectedLabelStyle: GoogleFonts.spaceGrotesk(
            fontWeight: FontWeight.w700,
            fontSize: 10,
          ),
          items: [
            _buildNavItem(Icons.chat_bubble_outline, 'AI Chat', IrisColors.irisPurple, currentIndex == 0),
            _buildNavItem(Icons.record_voice_over_outlined, 'Avatar', IrisColors.mint, currentIndex == 1),
            _buildNavItem(Icons.quiz_outlined, 'Quiz Forge', IrisColors.sunny, currentIndex == 2),
            _buildNavItem(Icons.work_outline, 'Career Sim', IrisColors.peach, currentIndex == 3),
            _buildNavItem(Icons.bar_chart_outlined, 'Analytics', IrisColors.sky, currentIndex == 4),
            _buildNavItem(Icons.shield_outlined, 'Security', IrisColors.coral, currentIndex == 5),
          ],
        ),
      ).animate().slideY(begin: 1, duration: 400.ms, curve: Curves.easeOutQuad),
    );
  }

  BottomNavigationBarItem _buildNavItem(IconData icon, String label, Color activeColor, bool isSelected) {
    return BottomNavigationBarItem(
      icon: Container(
        padding: const EdgeInsets.all(8),
        margin: const EdgeInsets.only(bottom: 4),
        decoration: BoxDecoration(
          color: isSelected ? activeColor : Colors.transparent,
          borderRadius: IrisRadius.medium,
          border: isSelected ? Border.all(color: IrisColors.ink, width: 2) : null,
          boxShadow: isSelected ? IrisShadows.neo(x: 2, y: 2) : null,
        ),
        child: Icon(
          icon,
          size: 24,
          color: isSelected ? IrisColors.ink : IrisColors.ink.withValues(alpha: 0.5),
        ),
      ).animate(target: isSelected ? 1 : 0).scaleXY(end: 1.1, duration: 200.ms),
      label: label,
    );
  }
}
