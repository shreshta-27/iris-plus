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
    final detailedResults = results['results'] as List<dynamic>? ?? [];

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
      child: Column(
        children: [
          Stack(
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

          if (feedback.toString().isNotEmpty) ...[
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
                  child: Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(
                      feedback.toString(),
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                        color: IrisColors.ink,
                        height: 1.5,
                      ),
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

          if (detailedResults.isNotEmpty) ...[
            const SizedBox(height: 32),
            Align(
              alignment: Alignment.centerLeft,
              child: Container(
                padding: const EdgeInsets.only(bottom: 8),
                decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(color: IrisColors.ink, width: 4)),
                ),
                child: Text(
                  'DETAILED REVIEW',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 1,
                    color: IrisColors.ink,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),
            ...detailedResults.asMap().entries.map((entry) {
              final item = entry.value as Map<String, dynamic>;
              final isCorrect = item['correct'] == true;
              final question = item['question']?.toString() ?? '';
              final userAnswer = item['userAnswer'];
              final correctAnswer = item['correctAnswer'];
              final explanation = item['explanation']?.toString() ?? '';

              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: isCorrect
                        ? IrisColors.mint.withValues(alpha: 0.2)
                        : IrisColors.coral.withValues(alpha: 0.2),
                    borderRadius: IrisRadius.medium,
                    border: Border.all(color: IrisColors.ink, width: 4),
                    boxShadow: IrisShadows.small(),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: isCorrect ? IrisColors.mint : IrisColors.coral,
                              shape: BoxShape.circle,
                              border: Border.all(color: IrisColors.ink, width: 3),
                              boxShadow: IrisShadows.neo(x: 2, y: 2),
                            ),
                            child: Icon(
                              isCorrect ? Icons.check : Icons.close,
                              size: 18,
                              color: isCorrect ? IrisColors.ink : IrisColors.white,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              question,
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: IrisColors.ink,
                                height: 1.4,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Padding(
                        padding: const EdgeInsets.only(left: 44),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            if (!isCorrect) ...[
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: IrisColors.white.withValues(alpha: 0.8),
                                  borderRadius: IrisRadius.small,
                                  border: Border.all(color: IrisColors.ink.withValues(alpha: 0.2), width: 2),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'YOUR ANSWER',
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 1,
                                        color: IrisColors.coral,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _formatAnswer(userAnswer),
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: IrisColors.ink,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 8),
                            ],
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: IrisColors.white,
                                borderRadius: IrisRadius.small,
                                border: Border.all(color: IrisColors.ink, width: 3),
                                boxShadow: IrisShadows.neo(x: 2, y: 2),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'CORRECT ANSWER',
                                    style: GoogleFonts.spaceGrotesk(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w900,
                                      letterSpacing: 1,
                                      color: IrisColors.mint,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    _formatAnswer(correctAnswer),
                                    style: GoogleFonts.spaceGrotesk(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: IrisColors.ink,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (explanation.isNotEmpty) ...[
                              const SizedBox(height: 12),
                              Container(
                                width: double.infinity,
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  color: IrisColors.white,
                                  borderRadius: IrisRadius.small,
                                  border: Border.all(color: IrisColors.ink, width: 3),
                                  boxShadow: IrisShadows.neo(x: 3, y: 3),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'EXPLANATION',
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w900,
                                        letterSpacing: 2,
                                        color: IrisColors.irisPurple,
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      explanation,
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: IrisColors.ink.withValues(alpha: 0.9),
                                        height: 1.5,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }),
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
    );
  }

  String _formatAnswer(dynamic answer) {
    if (answer == null) return 'N/A';
    if (answer is int) return 'Option ${String.fromCharCode(65 + answer)}';
    return answer.toString();
  }
}

