import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class InjectionBadge extends StatelessWidget {
  final String status;

  const InjectionBadge({super.key, required this.status});

  @override
  Widget build(BuildContext context) {
    if (status == 'safe' || status.isEmpty) return const SizedBox.shrink();

    final isSuspicious = status == 'suspicious';
    final bgColor = isSuspicious ? IrisColors.sunny : IrisColors.coral;
    final label = isSuspicious ? 'SUSPICIOUS' : 'BLOCKED';
    final icon = isSuspicious ? Icons.shield_outlined : Icons.block;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: IrisRadius.full,
        border: Border.all(color: IrisColors.ink, width: 3),
        boxShadow: IrisShadows.small(),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: IrisColors.ink),
          const SizedBox(width: 6),
          Text(
            label,
            style: GoogleFonts.spaceGrotesk(
              fontWeight: FontWeight.w900,
              fontSize: 9,
              letterSpacing: 2,
              color: IrisColors.ink,
            ),
          ),
        ],
      ),
    );
  }
}
