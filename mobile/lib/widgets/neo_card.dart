import 'package:flutter/material.dart';
import '../core/theme.dart';

class NeoCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final Color? topBorderColor;
  final double topBorderWidth;
  final Color? leftBorderColor;
  final double leftBorderWidth;
  final Color? backgroundColor;
  final double borderWidth;
  final BorderRadius? borderRadius;
  final List<BoxShadow>? boxShadow;

  const NeoCard({
    super.key,
    required this.child,
    this.padding,
    this.topBorderColor,
    this.topBorderWidth = 12,
    this.leftBorderColor,
    this.leftBorderWidth = 16,
    this.backgroundColor,
    this.borderWidth = 4,
    this.borderRadius,
    this.boxShadow,
  });

  @override
  Widget build(BuildContext context) {
    // Flutter throws if BorderRadius is used with non-uniform Borders.
    // To achieve the Neo-Brutalist accent borders (top/left) with rounded corners,
    // we use a uniform outer border and an inner border for the accents, clipped to fit.
    final radius = borderRadius ?? IrisRadius.extraLarge;
    
    return Container(
      decoration: BoxDecoration(
        color: IrisColors.white, // Outer background
        borderRadius: radius,
        border: Border.all(color: IrisColors.ink, width: borderWidth),
        boxShadow: boxShadow ?? IrisShadows.large(),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(
            (radius.topLeft.x > borderWidth) ? radius.topLeft.x - borderWidth : 0),
        child: Container(
          padding: padding ?? const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: backgroundColor ?? IrisColors.white,
            border: Border(
              top: topBorderColor != null 
                  ? BorderSide(color: topBorderColor!, width: (topBorderWidth - borderWidth).clamp(0.0, double.infinity)) 
                  : BorderSide.none,
              left: leftBorderColor != null 
                  ? BorderSide(color: leftBorderColor!, width: (leftBorderWidth - borderWidth).clamp(0.0, double.infinity)) 
                  : BorderSide.none,
            ),
          ),
          child: child,
        ),
      ),
    );
  }
}
