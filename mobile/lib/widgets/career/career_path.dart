import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme.dart';
import '../../../widgets/neo_card.dart';
import '../../../widgets/tag_sticker.dart';

class CareerPath extends StatelessWidget {
  final List<dynamic> report;

  const CareerPath({super.key, required this.report});

  Map<String, dynamic> _getDifficultyTheme(String? diff) {
    final d = diff?.toLowerCase() ?? '';
    if (d.contains('beginner')) return {'color': IrisColors.mint, 'label': 'Beginner'};
    if (d.contains('advanced')) return {'color': IrisColors.coral, 'label': 'Advanced'};
    return {'color': IrisColors.sunny, 'label': 'Intermediate'};
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: report.length,
      itemBuilder: (context, index) {
        final path = report[index] as Map<String, dynamic>;
        final theme = _getDifficultyTheme(path['difficulty']?.toString());
        
        final cardColors = [IrisColors.peach, IrisColors.sky, IrisColors.irisPurple];
        final cardAccent = cardColors[index % cardColors.length];

        return Padding(
          padding: const EdgeInsets.only(bottom: 24),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              NeoCard(
                leftBorderColor: cardAccent,
                leftBorderWidth: 16,
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Padding(
                      padding: const EdgeInsets.only(right: 48, bottom: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            path['title']?.toString() ?? '',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 24,
                              fontWeight: FontWeight.w900,
                              color: IrisColors.ink,
                              height: 1.2,
                            ),
                          ),
                          const SizedBox(height: 12),
                          TagSticker(
                            label: theme['label'] as String,
                            backgroundColor: theme['color'] as Color,
                          ),
                        ],
                      ),
                    ),
                    
                    Container(
                      margin: const EdgeInsets.only(bottom: 24),
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: IrisColors.cream,
                        borderRadius: IrisRadius.large,
                        border: Border.all(color: IrisColors.ink, width: 4),
                        boxShadow: [
                          BoxShadow(
                            color: IrisColors.ink.withValues(alpha: 0.05),
                            offset: const Offset(4, 4),
                          )
                        ],
                      ),
                      child: Wrap(
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _buildInfoBadge(Icons.access_time, path['timeframe']?.toString() ?? ''),
                          _buildInfoBadge(Icons.attach_money, path['salaryRange']?.toString() ?? '', iconColor: IrisColors.mint),
                        ],
                      ),
                    ),

                    if (path['skills'] != null && (path['skills'] as List).isNotEmpty) ...[
                      Container(
                        padding: const EdgeInsets.only(bottom: 8),
                        margin: const EdgeInsets.only(bottom: 16),
                        decoration: BoxDecoration(
                          border: Border(bottom: BorderSide(color: IrisColors.ink.withValues(alpha: 0.1), width: 3)),
                        ),
                        child: Text(
                          'REQUIRED SKILLS',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 2,
                            color: IrisColors.ink,
                          ),
                        ),
                      ),
                      Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: (path['skills'] as List).map((skill) {
                          return Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: IrisColors.white,
                              borderRadius: IrisRadius.small,
                              border: Border.all(color: IrisColors.ink, width: 3),
                              boxShadow: IrisShadows.small(),
                            ),
                            child: Text(
                              skill.toString(),
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: IrisColors.ink,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 24),
                    ],

                    if (path['steps'] != null && (path['steps'] as List).isNotEmpty) ...[
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: IrisColors.cream,
                          borderRadius: IrisRadius.large,
                          border: Border.all(color: IrisColors.ink, width: 4),
                          boxShadow: IrisShadows.medium(),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'ACTION PLAN',
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 10,
                                fontWeight: FontWeight.w900,
                                letterSpacing: 2,
                                color: IrisColors.ink,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ...(path['steps'] as List).asMap().entries.map((stepEntry) {
                              final i = stepEntry.key;
                              final step = stepEntry.value.toString();
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 16),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Container(
                                      width: 24,
                                      height: 24,
                                      decoration: BoxDecoration(
                                        color: cardAccent,
                                        shape: BoxShape.circle,
                                        border: Border.all(color: IrisColors.ink, width: 2),
                                        boxShadow: IrisShadows.neo(x: 2, y: 2),
                                      ),
                                      child: Center(
                                        child: Text(
                                          '${i + 1}',
                                          style: GoogleFonts.spaceGrotesk(
                                            fontSize: 10,
                                            fontWeight: FontWeight.w900,
                                            color: IrisColors.ink,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Padding(
                                        padding: const EdgeInsets.only(top: 2),
                                        child: Text(
                                          step,
                                          style: GoogleFonts.spaceGrotesk(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w500,
                                            color: IrisColors.ink,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            }),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              Positioned(
                top: -16,
                right: -16,
                child: Transform.rotate(
                  angle: 0.2,
                  child: Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: cardAccent,
                      shape: BoxShape.circle,
                      border: Border.all(color: IrisColors.ink, width: 4),
                      boxShadow: IrisShadows.medium(),
                    ),
                    child: Center(
                      child: Text(
                        '#${index + 1}',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: IrisColors.ink,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInfoBadge(IconData icon, String text, {Color? iconColor}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: IrisColors.white,
        borderRadius: IrisRadius.full,
        border: Border.all(color: IrisColors.ink, width: 3),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 20, color: iconColor ?? IrisColors.ink),
          const SizedBox(width: 8),
          Text(
            text,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: IrisColors.ink,
            ),
          ),
        ],
      ),
    );
  }
}
