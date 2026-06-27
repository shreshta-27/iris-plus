import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme.dart';
import '../../../widgets/neo_card.dart';
import '../../../widgets/neo_button.dart';

class QuizResults extends StatelessWidget {
  final Map<String, dynamic> results;
  final VoidCallback onRetry;

  const QuizResults({
    super.key,
    required this.results,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    final score = results['score'] ?? 0;
    final total = results['total'] ?? 0;
    final percentage = results['percentage'] ?? 0;
    final feedback = results['feedback'] ?? '';

    Color themeColor = IrisColors.coral;
    IconData themeIcon = Icons.sentiment_dissatisfied;
    String themeMsg = 'Keep Studying!';

    if (percentage >= 80) {
      themeColor = IrisColors.mint;
      themeIcon = Icons.emoji_events;
      themeMsg = 'Excellent Work!';
    } else if (percentage >= 50) {
      themeColor = IrisColors.sunny;
      themeIcon = Icons.sentiment_satisfied;
      themeMsg = 'Good Effort!';
    }

    return Padding(
      padding: const EdgeInsets.all(20),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          NeoCard(
            topBorderColor: themeColor,
            topBorderWidth: 16,
            padding: const EdgeInsets.all(32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 16),
                Container(
                  width: 96,
                  height: 96,
                  decoration: BoxDecoration(
                    color: themeColor,
                    shape: BoxShape.circle,
                    border: Border.all(color: IrisColors.ink, width: 4),
                    boxShadow: IrisShadows.medium(),
                  ),
                  child: Icon(themeIcon, size: 48, color: IrisColors.ink),
                ),
                const SizedBox(height: 32),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.baseline,
                  textBaseline: TextBaseline.alphabetic,
                  children: [
                    Text(
                      '$score',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 64,
                        fontWeight: FontWeight.w900,
                        color: IrisColors.ink,
                      ),
                    ),
                    Text(
                      '/$total',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: IrisColors.ink.withValues(alpha: 0.4),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Text(
                  themeMsg,
                  style: GoogleFonts.caveat(
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    color: IrisColors.ink.withValues(alpha: 0.8),
                  ),
                ),
                if (feedback.isNotEmpty) ...[
                  const SizedBox(height: 48),
                  Stack(
                    clipBehavior: Clip.none,
                    children: [
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: IrisColors.cream,
                          borderRadius: IrisRadius.large,
                          border: Border.all(color: IrisColors.ink, width: 4),
                          boxShadow: IrisShadows.medium(),
                        ),
                        child: Text(
                          feedback,
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: IrisColors.ink,
                            height: 1.5,
                          ),
                        ),
                      ),
                      Positioned(
                        top: -16,
                        left: 24,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                          decoration: BoxDecoration(
                            color: IrisColors.irisPurple,
                            borderRadius: IrisRadius.full,
                            border: Border.all(color: IrisColors.ink, width: 3),
                            boxShadow: IrisShadows.small(),
                          ),
                          child: Text(
                            'AI STUDY FEEDBACK',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 2,
                              color: IrisColors.white,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  child: NeoButton(
                    label: 'Create Another Quiz',
                    icon: Icons.refresh,
                    isPrimary: false,
                    onPressed: onRetry,
                  ),
                ),
              ],
            ),
          ),
          Positioned(
            top: -24,
            right: -16,
            child: Transform.rotate(
              angle: 0.2,
              child: Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  color: themeColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: IrisColors.ink, width: 6),
                  boxShadow: IrisShadows.large(),
                ),
                child: Center(
                  child: Text(
                    '$percentage%',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 24,
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
  }
}
