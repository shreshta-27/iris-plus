import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class TagSticker extends StatelessWidget {
  final String label;
  final Color? backgroundColor;
  final double fontSize;

  const TagSticker({
    super.key,
    required this.label,
    this.backgroundColor,
    this.fontSize = 10,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      decoration: BoxDecoration(
        color: backgroundColor ?? IrisColors.white,
        borderRadius: IrisRadius.full,
        border: Border.all(color: IrisColors.ink, width: 3),
        boxShadow: IrisShadows.small(),
      ),
      child: Text(
        label.toUpperCase(),
        style: GoogleFonts.spaceGrotesk(
          fontWeight: FontWeight.w700,
          fontSize: fontSize,
          letterSpacing: 1,
          color: IrisColors.ink,
        ),
      ),
    );
  }
}
