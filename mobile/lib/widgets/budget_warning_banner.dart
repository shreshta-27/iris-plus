import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class BudgetWarningBanner extends StatelessWidget {
  final String mode;

  const BudgetWarningBanner({super.key, required this.mode});

  @override
  Widget build(BuildContext context) {
    if (mode == 'normal') return const SizedBox.shrink();

    final isExceeded = mode == 'exceeded';
    final bgColor = isExceeded ? IrisColors.coral : IrisColors.sunny;

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: IrisRadius.medium,
        border: Border.all(color: IrisColors.ink, width: 4),
        boxShadow: IrisShadows.medium(),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: IrisColors.white,
              shape: BoxShape.circle,
              border: Border.all(color: IrisColors.ink, width: 3),
              boxShadow: IrisShadows.small(),
            ),
            child: Center(
              child: Text(
                isExceeded ? '⛔' : '⚠️',
                style: const TextStyle(fontSize: 20),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isExceeded ? 'BUDGET EXCEEDED' : 'BUDGET WARNING',
                  style: GoogleFonts.spaceGrotesk(
                    fontWeight: FontWeight.w900,
                    fontSize: 16,
                    color: IrisColors.ink,
                    letterSpacing: 1,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  isExceeded
                      ? 'You have reached the \$2.00 session limit. API requests will be blocked.'
                      : 'You are approaching the \$2.00 session limit. Switch to smaller models.',
                  style: GoogleFonts.spaceGrotesk(
                    fontWeight: FontWeight.w700,
                    fontSize: 13,
                    color: IrisColors.ink,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
