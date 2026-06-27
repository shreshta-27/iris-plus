import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class BudgetMeter extends StatelessWidget {
  final double totalCost;
  final double maxBudget;
  final String mode;

  const BudgetMeter({
    super.key,
    required this.totalCost,
    required this.maxBudget,
    required this.mode,
  });

  @override
  Widget build(BuildContext context) {
    final percentage = (totalCost / maxBudget).clamp(0.0, 1.0);

    Color statusColor = IrisColors.mint;
    if (mode == 'warning' || mode == 'caution') statusColor = IrisColors.sunny;
    if (mode == 'exceeded' || mode == 'critical') statusColor = IrisColors.coral;

    return Row(
      children: [
        Container(
          width: 10,
          height: 10,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: statusColor,
            border: Border.all(color: IrisColors.ink, width: 2),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Container(
            height: 12,
            decoration: BoxDecoration(
              color: IrisColors.white,
              borderRadius: IrisRadius.full,
              border: Border.all(color: IrisColors.ink, width: 3),
            ),
            child: ClipRRect(
              borderRadius: IrisRadius.full,
              child: FractionallySizedBox(
                alignment: Alignment.centerLeft,
                widthFactor: percentage,
                child: Container(color: statusColor),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          '\$${totalCost.toStringAsFixed(2)}',
          style: GoogleFonts.jetBrainsMono(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: IrisColors.ink,
          ),
        ),
        Text(
          '/${maxBudget.toStringAsFixed(0)}',
          style: GoogleFonts.jetBrainsMono(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: IrisColors.ink.withValues(alpha: 0.4),
          ),
        ),
      ],
    );
  }
}
