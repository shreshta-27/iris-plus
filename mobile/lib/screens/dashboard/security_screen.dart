import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../providers/analytics_provider.dart';
import '../../widgets/neo_card.dart';
import '../../widgets/injection_badge.dart';
import 'package:intl/intl.dart';

class SecurityScreen extends StatefulWidget {
  const SecurityScreen({super.key});

  @override
  State<SecurityScreen> createState() => _SecurityScreenState();
}

class _SecurityScreenState extends State<SecurityScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AnalyticsProvider>().fetchSecurity();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AnalyticsProvider>(
      builder: (context, provider, _) {
        if (provider.isLoadingSecurity) {
          return const Center(child: CircularProgressIndicator(color: IrisColors.irisPurple));
        }

        final data = provider.securityData;
        if (data == null) {
          return Center(
            child: Text(
              'No security data available.',
              style: GoogleFonts.spaceGrotesk(fontSize: 16, color: IrisColors.ink),
            ),
          );
        }

        final blockedCount = data['summary']?['totalBlocked'] ?? 0;
        final totalScanned = data['summary']?['totalSuspicious'] ?? 0;
        final logs = data['recentEvents'] as List<dynamic>? ?? [];

        return RefreshIndicator(
          onRefresh: provider.fetchSecurity,
          color: IrisColors.irisPurple,
          child: ListView(
            padding: const EdgeInsets.all(20),
            physics: const AlwaysScrollableScrollPhysics(),
            children: [
              Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: IrisColors.coral,
                      shape: BoxShape.circle,
                      border: Border.all(color: IrisColors.ink, width: 3),
                      boxShadow: IrisShadows.small(),
                    ),
                    child: const Icon(Icons.security, color: IrisColors.ink),
                  ).animate(onPlay: (controller) => controller.repeat(reverse: true))
                   .scaleXY(end: 1.1, duration: 1500.ms, curve: Curves.easeInOut),
                  const SizedBox(width: 16),
                  Text(
                    'PIGuard Security',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: IrisColors.ink,
                    ),
                  ).animate().fadeIn().slideX(begin: -0.1),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Blocked',
                      blockedCount.toString(),
                      Icons.block,
                      IrisColors.coral,
                    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      'Suspicious',
                      totalScanned.toString(),
                      Icons.warning_amber_rounded,
                      IrisColors.mint,
                    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              Text(
                'Recent Detections',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 300.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              if (logs.isEmpty)
                Container(
                  padding: const EdgeInsets.all(32),
                  decoration: BoxDecoration(
                    color: IrisColors.white,
                    borderRadius: IrisRadius.medium,
                    border: Border.all(color: IrisColors.ink, width: 3),
                  ),
                  child: Center(
                    child: Text(
                      'No recent detections. Coast is clear! 🏄',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: IrisColors.ink.withValues(alpha: 0.6),
                      ),
                    ),
                  ),
                ).animate().fadeIn(delay: 400.ms).scaleXY(begin: 0.9, end: 1)
              else
                ...logs.asMap().entries.map((entry) {
                  final index = entry.key;
                  final l = entry.value as Map<String, dynamic>;
                  final timestamp = l['timestamp'] != null
                      ? DateFormat('MMM dd, HH:mm:ss').format(DateTime.parse(l['timestamp']))
                      : '';
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: NeoCard(
                      leftBorderColor: l['status'] == 'blocked' ? IrisColors.coral : IrisColors.mint,
                      leftBorderWidth: 12,
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              InjectionBadge(status: l['status']?.toString() ?? 'safe'),
                              Text(
                                timestamp,
                                style: GoogleFonts.jetBrainsMono(
                                  fontSize: 12,
                                  color: IrisColors.ink.withValues(alpha: 0.6),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Module: ${l['module']}',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 12,
                              fontWeight: FontWeight.w900,
                              color: IrisColors.ink,
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: IrisColors.ink.withValues(alpha: 0.05),
                              borderRadius: IrisRadius.small,
                              border: Border.all(color: IrisColors.ink.withValues(alpha: 0.2)),
                            ),
                            child: Text(
                              l['input']?.toString() ?? '',
                              style: GoogleFonts.jetBrainsMono(
                                fontSize: 13,
                                color: IrisColors.ink,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ).animate().fadeIn(delay: (400 + index * 100).ms).slideX(begin: 0.1);
                }),
            ],
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return NeoCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title.toUpperCase(),
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink.withValues(alpha: 0.6),
                ),
              ),
              Icon(icon, size: 16, color: color),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: IrisColors.ink,
            ),
          ),
        ],
      ),
    );
  }
}
