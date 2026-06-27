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
    return Container(
      padding: padding ?? const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: backgroundColor ?? IrisColors.white,
        borderRadius: borderRadius ?? IrisRadius.extraLarge,
        border: Border(
          top: BorderSide(
            color: topBorderColor ?? IrisColors.ink,
            width: topBorderColor != null ? topBorderWidth : borderWidth,
          ),
          left: BorderSide(
            color: leftBorderColor ?? IrisColors.ink,
            width: leftBorderColor != null ? leftBorderWidth : borderWidth,
          ),
          right: BorderSide(color: IrisColors.ink, width: borderWidth),
          bottom: BorderSide(color: IrisColors.ink, width: borderWidth),
        ),
        boxShadow: boxShadow ?? IrisShadows.large(),
      ),
      child: child,
    );
  }
}
