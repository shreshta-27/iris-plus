import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../providers/analytics_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/neo_card.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen> {
  final List<Color> _pieColors = [
    IrisColors.irisPurple,
    IrisColors.mint,
    IrisColors.peach,
    IrisColors.sky,
  ];

  final List<Color> _complexityColors = [
    IrisColors.mint,
    IrisColors.sunny,
    IrisColors.coral,
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final auth = context.read<AuthProvider>();
      context.read<AnalyticsProvider>().fetchAnalytics(auth.userId);
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

        final summary = data['summary'] ?? {};
        final modelDist = data['modelDistribution'] as Map<String, dynamic>? ?? {};
        final recentHistory = data['recentHistory'] as List<dynamic>? ?? [];
        final complexityBuckets = data['complexityBuckets'] as Map<String, dynamic>? ?? {};

        return RefreshIndicator(
          onRefresh: () async {
            final auth = context.read<AuthProvider>();
            await provider.fetchAnalytics(auth.userId);
          },
          color: IrisColors.irisPurple,
          child: ListView(
            padding: const EdgeInsets.all(20),
            physics: const AlwaysScrollableScrollPhysics(),
            children: [
              Row(
                children: [
                  Text(
                    '📊 Usage & Analytics',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                      color: IrisColors.ink,
                    ),
                  ).animate().fadeIn().slideX(begin: -0.1),
                ],
              ),
              const SizedBox(height: 24),
              
              // Top Stats
              Row(
                children: [
                  Expanded(
                    child: _buildStatCard(
                      'Total Queries',
                      summary['totalCalls']?.toString() ?? '0',
                      Icons.route_outlined,
                      IrisColors.white,
                    ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.1),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: _buildStatCard(
                      'Actual Cost',
                      '\$${(summary['totalCost'] ?? 0).toStringAsFixed(4)}',
                      Icons.attach_money,
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
                              const Icon(Icons.show_chart, color: IrisColors.ink, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                'IRIS SAVED YOU',
                                style: GoogleFonts.spaceGrotesk(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 2,
                                  color: IrisColors.ink.withValues(alpha: 0.7),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.end,
                            children: [
                              Text(
                                '\$${(summary['savedCost'] ?? 0).toStringAsFixed(4)}',
                                style: GoogleFonts.spaceGrotesk(
                                  fontSize: 32,
                                  fontWeight: FontWeight.w900,
                                  color: IrisColors.ink,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                decoration: BoxDecoration(
                                  color: IrisColors.ink,
                                  borderRadius: IrisRadius.small,
                                  border: Border.all(color: IrisColors.white, width: 2),
                                ),
                                child: Text(
                                  '${summary['savingsPercent'] ?? 0}% savings',
                                  style: GoogleFonts.spaceGrotesk(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w900,
                                    color: IrisColors.white,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
              const SizedBox(height: 32),
              
              // Timeline Chart
              Text(
                'COST PER QUERY TIMELINE',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              SizedBox(
                height: 250,
                child: NeoCard(
                  padding: const EdgeInsets.all(16),
                  child: recentHistory.isEmpty
                      ? const Center(child: Text('No data'))
                      : LineChart(
                          LineChartData(
                            gridData: const FlGridData(show: true, drawVerticalLine: false),
                            titlesData: const FlTitlesData(
                              topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                              bottomTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            ),
                            borderData: FlBorderData(show: false),
                            lineBarsData: [
                              LineChartBarData(
                                spots: List.generate(
                                  recentHistory.length > 20 ? 20 : recentHistory.length,
                                  (index) => FlSpot(
                                    index.toDouble(),
                                    (recentHistory[index]['cost'] ?? 0).toDouble(),
                                  ),
                                ),
                                isCurved: true,
                                color: IrisColors.ink,
                                barWidth: 4,
                                dotData: const FlDotData(show: true),
                                belowBarData: BarAreaData(show: false),
                              ),
                            ],
                          ),
                        ),
                ),
              ).animate().fadeIn(delay: 500.ms).scaleXY(begin: 0.9, end: 1),
              
              const SizedBox(height: 32),
              // Model Distribution Pie
              Text(
                'MODEL DISTRIBUTION',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 600.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              NeoCard(
                padding: const EdgeInsets.all(20),
                child: modelDist.isEmpty
                    ? const Center(child: Text('No model data yet.'))
                    : Column(
                        children: [
                          SizedBox(
                            height: 200,
                            child: PieChart(
                              PieChartData(
                                sectionsSpace: 4,
                                centerSpaceRadius: 50,
                                sections: _buildPieSections(modelDist),
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          ...modelDist.entries.toList().asMap().entries.map((entry) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  Container(
                                    width: 16,
                                    height: 16,
                                    decoration: BoxDecoration(
                                      color: _pieColors[entry.key % _pieColors.length],
                                      border: Border.all(color: IrisColors.ink, width: 2),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      entry.value.key.split('/').last,
                                      style: GoogleFonts.spaceGrotesk(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                    decoration: BoxDecoration(
                                      border: Border.all(color: IrisColors.ink, width: 2),
                                      borderRadius: IrisRadius.small,
                                    ),
                                    child: Text(
                                      entry.value.value.toString(),
                                      style: GoogleFonts.spaceGrotesk(
                                        fontWeight: FontWeight.w900,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            );
                          }),
                        ],
                      ),
              ).animate().fadeIn(delay: 700.ms).scaleXY(begin: 0.9, end: 1),

              const SizedBox(height: 32),
              Text(
                'COMPLEXITY BREAKDOWN',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 750.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              NeoCard(
                padding: const EdgeInsets.all(20),
                child: _buildComplexitySection(complexityBuckets),
              ).animate().fadeIn(delay: 800.ms).scaleXY(begin: 0.9, end: 1),

              const SizedBox(height: 32),
              // Recent Queries
              Text(
                'DEEP ANALYSIS: RECENT QUERIES',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ).animate().fadeIn(delay: 800.ms).slideX(begin: -0.1),
              const SizedBox(height: 16),
              if (recentHistory.isEmpty)
                const Center(child: Text('No queries found.'))
              else
                ...recentHistory.take(5).map((q) => Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: NeoCard(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                border: Border.all(color: IrisColors.ink, width: 2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                (q['model']?.toString().split('/').last ?? 'Unknown').toUpperCase(),
                                style: GoogleFonts.spaceGrotesk(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w900,
                                ),
                              ),
                            ),
                            const Icon(Icons.remove_red_eye_outlined, size: 20),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Text(
                          '"${q['query'] ?? '...'}"',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 14,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Divider(color: IrisColors.ink, thickness: 2),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              q['timestamp'] != null 
                                  ? DateFormat('hh:mm a').format(DateTime.parse(q['timestamp']).toLocal())
                                  : '',
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: IrisColors.ink.withValues(alpha: 0.6),
                              ),
                            ),
                            Text(
                              '\$${(q['cost'] ?? 0).toStringAsFixed(4)}',
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 14,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                )),
            ],
          ),
        );
      },
    );
  }

  List<PieChartSectionData> _buildPieSections(Map<String, dynamic> modelDist) {
    int i = 0;
    return modelDist.entries.map((entry) {
      final isTouched = false;
      final fontSize = isTouched ? 16.0 : 12.0;
      final radius = isTouched ? 60.0 : 50.0;
      final color = _pieColors[i % _pieColors.length];
      i++;
      return PieChartSectionData(
        color: color,
        value: (entry.value as num).toDouble(),
        title: entry.value.toString(),
        radius: radius,
        titleStyle: GoogleFonts.spaceGrotesk(
          fontSize: fontSize,
          fontWeight: FontWeight.w900,
          color: IrisColors.ink,
        ),
        borderSide: const BorderSide(color: IrisColors.ink, width: 2),
      );
    }).toList();
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
              Expanded(
                child: Text(
                  title.toUpperCase(),
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                    color: IrisColors.ink.withValues(alpha: 0.7),
                  ),
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: color,
                  shape: BoxShape.circle,
                  border: Border.all(color: IrisColors.ink, width: 2),
                ),
                child: Icon(icon, size: 16, color: IrisColors.ink),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            value,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: IrisColors.ink,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildComplexitySection(Map<String, dynamic> buckets) {
    final simple = (buckets['simple'] ?? 0) as num;
    final medium = (buckets['medium'] ?? 0) as num;
    final complex = (buckets['complex'] ?? 0) as num;
    final total = simple + medium + complex;

    if (total == 0) {
      return Center(
        child: Text(
          'No complexity data yet.',
          style: GoogleFonts.spaceGrotesk(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: IrisColors.ink.withValues(alpha: 0.5),
          ),
        ),
      );
    }

    final entries = [
      {'label': 'Simple', 'value': simple, 'color': IrisColors.mint, 'emoji': '🟢'},
      {'label': 'Medium', 'value': medium, 'color': IrisColors.sunny, 'emoji': '🟡'},
      {'label': 'Complex', 'value': complex, 'color': IrisColors.coral, 'emoji': '🔴'},
    ].where((e) => (e['value'] as num) > 0).toList();

    return Column(
      children: [
        SizedBox(
          height: 200,
          child: PieChart(
            PieChartData(
              sectionsSpace: 4,
              centerSpaceRadius: 50,
              sections: entries.asMap().entries.map((entry) {
                final item = entry.value;
                return PieChartSectionData(
                  color: item['color'] as Color,
                  value: (item['value'] as num).toDouble(),
                  title: item['value'].toString(),
                  radius: 50,
                  titleStyle: GoogleFonts.spaceGrotesk(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: IrisColors.ink,
                  ),
                  borderSide: const BorderSide(color: IrisColors.ink, width: 2),
                );
              }).toList(),
            ),
          ),
        ),
        const SizedBox(height: 16),
        ...entries.map((item) {
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              children: [
                Container(
                  width: 16,
                  height: 16,
                  decoration: BoxDecoration(
                    color: item['color'] as Color,
                    border: Border.all(color: IrisColors.ink, width: 2),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  item['emoji'] as String,
                  style: const TextStyle(fontSize: 14),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    item['label'] as String,
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    border: Border.all(color: IrisColors.ink, width: 2),
                    borderRadius: IrisRadius.small,
                  ),
                  child: Text(
                    '${item['value']}',
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w900,
                      fontSize: 14,
                    ),
                  ),
                ),
              ],
            ),
          );
        }),
      ],
    );
  }
}
