import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../providers/analytics_provider.dart';
import '../../widgets/neo_card.dart';
import '../../widgets/injection_badge.dart';

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

        final summary = data['summary'] ?? {};
        final blockedCount = summary['totalBlocked'] ?? 0;
        final totalScanned = summary['totalSuspicious'] ?? 0;
        final savedBySecurity = summary['savedBySecurity'] ?? 0;
        final isShieldActive = summary['shieldStatus'] == 'active_blocking';
        final logs = data['recentEvents'] as List<dynamic>? ?? [];
        
        final layerBreakdown = data['layerBreakdown'] ?? {};
        final categoryBreakdown = data['categoryBreakdown'] ?? {};

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
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'PIGuard Security',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: IrisColors.ink,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: isShieldActive ? IrisColors.mint : IrisColors.white,
                            border: Border.all(color: IrisColors.ink, width: 2),
                            borderRadius: IrisRadius.small,
                          ),
                          child: Text(
                            isShieldActive ? 'SHIELD ACTIVE' : 'MONITORING',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: IrisColors.ink,
                            ),
                          ),
                        ),
                      ],
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
                      IrisColors.sunny,
                    ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              NeoCard(
                leftBorderColor: IrisColors.mint,
                leftBorderWidth: 16,
                padding: const EdgeInsets.all(20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.security_outlined, color: IrisColors.ink, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                'MONEY SAVED BY GUARD',
                                style: GoogleFonts.spaceGrotesk(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2,
                                  color: IrisColors.ink.withOpacity(0.7),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            '\$${(savedBySecurity as num).toStringAsFixed(4)}',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                              color: IrisColors.ink,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
              const SizedBox(height: 32),
              
              // Defense Layers
              Text(
                'DEFENSE LAYERS',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              NeoCard(
                padding: const EdgeInsets.all(16),
                child: Column(
                  children: [
                    _buildListItem('Layer 1: Local Pre-filter', '${layerBreakdown['local'] ?? 0} blocked'),
                    const Divider(color: IrisColors.ink, thickness: 2),
                    _buildListItem('Layer 2: Otari PIGuard', '${layerBreakdown['piguard'] ?? 0} blocked'),
                    const Divider(color: IrisColors.ink, thickness: 2),
                    _buildListItem('Layer 3: Response Validator', '${layerBreakdown['response'] ?? 0} blocked'),
                  ],
                ),
              ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1),
              
              const SizedBox(height: 32),
              // Attack Categories
              Text(
                'ATTACK CATEGORIES',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              NeoCard(
                padding: const EdgeInsets.all(16),
                child: (categoryBreakdown as Map).isEmpty
                    ? const Center(child: Text('No attacks recorded yet.'))
                    : Column(
                        children: categoryBreakdown.entries.map<Widget>((e) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: _buildListItem(e.key.toString(), e.value.toString()),
                          );
                        }).toList(),
                      ),
              ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.1),

              const SizedBox(height: 32),
              Text(
                'LIVE THREAT LOG',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 800.ms).slideX(begin: -0.1),
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
                        color: IrisColors.ink.withOpacity(0.6),
                      ),
                    ),
                  ),
                ).animate().fadeIn(delay: 900.ms).scaleXY(begin: 0.9, end: 1)
              else
                ...logs.asMap().entries.map((entry) {
                  final index = entry.key;
                  final l = entry.value as Map<String, dynamic>;
                  final timestamp = l['timestamp'] != null
                      ? DateFormat('MMM dd, HH:mm:ss').format(DateTime.parse(l['timestamp']).toLocal())
                      : '';
                  final isBlocked = l['threatLevel'] == 'blocked';
                  final patterns = (l['matchedPatterns'] as List<dynamic>? ?? []).map((e) => e as Map<String, dynamic>).toList();
                  
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: NeoCard(
                      leftBorderColor: isBlocked ? IrisColors.coral : IrisColors.sunny,
                      leftBorderWidth: 12,
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                color: isBlocked ? IrisColors.coral : IrisColors.sunny,
                                child: Text(
                                  (l['threatLevel']?.toString() ?? 'safe').toUpperCase(),
                                  style: GoogleFonts.jetBrainsMono(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: IrisColors.white,
                                  ),
                                ),
                              ),
                              Text(
                                timestamp,
                                style: GoogleFonts.jetBrainsMono(
                                  fontSize: 12,
                                  color: IrisColors.ink.withOpacity(0.6),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Layer: ${l['detectionLayer']}',
                            style: GoogleFonts.jetBrainsMono(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: IrisColors.ink.withOpacity(0.7),
                            ),
                          ),
                          const SizedBox(height: 12),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(12),
                            color: IrisColors.ink,
                            child: Text(
                              l['promptSnippet']?.toString() ?? '',
                              style: GoogleFonts.jetBrainsMono(
                                fontSize: 13,
                                color: IrisColors.white,
                              ),
                            ),
                          ),
                          if (patterns.isNotEmpty) ...[
                            const SizedBox(height: 8),
                            Wrap(
                              spacing: 4,
                              runSpacing: 4,
                              children: patterns.map((p) {
                                return Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: IrisColors.ink,
                                    border: Border.all(color: IrisColors.ink.withOpacity(0.2)),
                                  ),
                                  child: Text(
                                    '${p['label']} (${((p['severity'] as num) * 100).toStringAsFixed(0)}%)',
                                    style: GoogleFonts.jetBrainsMono(
                                      fontSize: 10,
                                      color: IrisColors.white,
                                    ),
                                  ),
                                );
                              }).toList(),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ).animate().fadeIn(delay: (900 + index * 100).ms).slideX(begin: 0.1);
                }),
            ],
          ),
        );
      },
    );
  }

  Widget _buildListItem(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: GoogleFonts.spaceGrotesk(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: IrisColors.ink.withOpacity(0.8),
          ),
        ),
        Text(
          value,
          style: GoogleFonts.spaceGrotesk(
            fontSize: 16,
            fontWeight: FontWeight.w900,
            color: IrisColors.ink,
          ),
        ),
      ],
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
                  color: IrisColors.ink.withOpacity(0.6),
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
