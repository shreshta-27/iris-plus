import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class RoutingChip extends StatelessWidget {
  final Map<String, dynamic> routing;
  final double? cost;

  const RoutingChip({super.key, required this.routing, this.cost});

  Color _getTierColor(String? modelName) {
    if (modelName == null) return IrisColors.white;
    if (modelName.contains('Haiku')) return IrisColors.sunny;
    if (modelName.contains('Sonnet')) return IrisColors.coral;
    return IrisColors.mint;
  }

  @override
  Widget build(BuildContext context) {
    final tier = routing['tier']?.toString();
    if (tier == null) return const SizedBox.shrink();

    final modelName = routing['modelDisplayName']?.toString() ?? tier;
    final bg = _getTierColor(modelName);

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: bg,
            borderRadius: IrisRadius.full,
            border: Border.all(color: IrisColors.ink, width: 3),
            boxShadow: IrisShadows.small(),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 8,
                height: 8,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: IrisColors.ink,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                modelName.toUpperCase(),
                style: GoogleFonts.spaceGrotesk(
                  fontWeight: FontWeight.w900,
                  fontSize: 10,
                  letterSpacing: 2,
                  color: IrisColors.ink,
                ),
              ),
            ],
          ),
        ),
        if (cost != null && cost! > 0)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: IrisColors.cream,
              borderRadius: IrisRadius.full,
              border: Border.all(color: IrisColors.ink, width: 3),
              boxShadow: IrisShadows.small(),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Cost: ',
                  style: GoogleFonts.jetBrainsMono(
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                    color: IrisColors.ink.withValues(alpha: 0.7),
                  ),
                ),
                Text(
                  '\$${cost!.toStringAsFixed(5)}',
                  style: GoogleFonts.jetBrainsMono(
                    fontWeight: FontWeight.w700,
                    fontSize: 11,
                    color: IrisColors.ink,
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }
}
