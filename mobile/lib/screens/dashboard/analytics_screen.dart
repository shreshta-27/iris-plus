import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../core/theme.dart';
import '../../providers/analytics_provider.dart';
import '../../widgets/neo_card.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<AnalyticsProvider>().fetchAnalytics();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<AnalyticsProvider>(
      builder: (context, provider, _) {
        if (provider.isLoadingAnalytics) {
          return const Center(child: CircularProgressIndicator(color: IrisColors.irisPurple));
        }

        final data = provider.analyticsData;
        if (data == null) {
          return Center(
            child: Text(
              'No analytics data available.',
              style: GoogleFonts.spaceGrotesk(fontSize: 16, color: IrisColors.ink),
            ),
          );
        }

        return RefreshIndicator(
          onRefresh: provider.fetchAnalytics,
          color: IrisColors.irisPurple,
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            physics: const AlwaysScrollableScrollPhysics(),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Global Analytics',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 28,
                    fontWeight: FontWeight.w900,
                    color: IrisColors.ink,
                  ),
                ),
                const SizedBox(height: 24),
                _buildStatCard(
                  'Total Users',
                  data['users']?.toString() ?? '0',
                  Icons.people_outline,
                  IrisColors.peach,
                ),
                const SizedBox(height: 16),
                _buildStatCard(
                  'Chats Processed',
                  data['chats']?.toString() ?? '0',
                  Icons.chat_bubble_outline,
                  IrisColors.mint,
                ),
                const SizedBox(height: 16),
                _buildStatCard(
                  'Quizzes Taken',
                  data['quizzes']?.toString() ?? '0',
                  Icons.quiz_outlined,
                  IrisColors.sunny,
                ),
                const SizedBox(height: 16),
                _buildStatCard(
                  'Career Plans',
                  data['careers']?.toString() ?? '0',
                  Icons.work_outline,
                  IrisColors.sky,
                ),
                const SizedBox(height: 32),
                Text(
                  'System Usage Map',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: IrisColors.ink,
                  ),
                ),
                const SizedBox(height: 16),
                SizedBox(
                  height: 250,
                  child: NeoCard(
                    padding: const EdgeInsets.all(16),
                    child: BarChart(
                      BarChartData(
                        alignment: BarChartAlignment.spaceAround,
                        maxY: 100,
                        barTouchData: BarTouchData(enabled: false),
                        titlesData: FlTitlesData(
                          show: true,
                          bottomTitles: AxisTitles(
                            sideTitles: SideTitles(
                              showTitles: true,
                              getTitlesWidget: (value, meta) {
                                const titles = ['Users', 'Chats', 'Quizzes', 'Careers'];
                                if (value.toInt() >= 0 && value.toInt() < titles.length) {
                                  return Padding(
                                    padding: const EdgeInsets.only(top: 8.0),
                                    child: Text(
                                      titles[value.toInt()],
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                  );
                                }
                                return const SizedBox.shrink();
                              },
                            ),
                          ),
                          leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        ),
                        gridData: const FlGridData(show: false),
                        borderData: FlBorderData(show: false),
                        barGroups: [
                          _makeBarData(0, (data['users'] ?? 0).toDouble(), IrisColors.peach),
                          _makeBarData(1, (data['chats'] ?? 0).toDouble(), IrisColors.mint),
                          _makeBarData(2, (data['quizzes'] ?? 0).toDouble(), IrisColors.sunny),
                          _makeBarData(3, (data['careers'] ?? 0).toDouble(), IrisColors.sky),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatCard(String title, String value, IconData icon, Color color) {
    return NeoCard(
      leftBorderColor: color,
      leftBorderWidth: 16,
      padding: const EdgeInsets.all(24),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title.toUpperCase(),
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 12,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink.withValues(alpha: 0.6),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                value,
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 32,
                  fontWeight: FontWeight.w900,
                  color: IrisColors.ink,
                ),
              ),
            ],
          ),
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: IrisColors.ink, width: 3),
              boxShadow: IrisShadows.neo(x: 2, y: 2),
            ),
            child: Icon(icon, color: IrisColors.ink, size: 28),
          ),
        ],
      ),
    );
  }

  BarChartGroupData _makeBarData(int x, double y, Color color) {
    // scale y for visual purposes since we hardcoded maxY=100
    double scaledY = y > 100 ? 100 : y;
    if (scaledY == 0) scaledY = 5;
    
    return BarChartGroupData(
      x: x,
      barRods: [
        BarChartRodData(
          toY: scaledY,
          color: color,
          width: 20,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(4)),
          borderSide: const BorderSide(color: IrisColors.ink, width: 3),
        ),
      ],
    );
  }
}
