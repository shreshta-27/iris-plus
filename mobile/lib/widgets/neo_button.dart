import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class NeoButton extends StatefulWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isPrimary;
  final IconData? icon;
  final double? fontSize;
  final EdgeInsetsGeometry? padding;
  final Color? backgroundColor;
  final Color? textColor;

  const NeoButton({
    super.key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.isPrimary = true,
    this.icon,
    this.fontSize,
    this.padding,
    this.backgroundColor,
    this.textColor,
  });

  @override
  State<NeoButton> createState() => _NeoButtonState();
}

class _NeoButtonState extends State<NeoButton> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    final bg = widget.backgroundColor ??
        (widget.isPrimary ? IrisColors.irisPurple : IrisColors.cream);
    final fg = widget.textColor ??
        (widget.isPrimary ? IrisColors.white : IrisColors.irisPurple);

    return GestureDetector(
      onTapDown: widget.onPressed != null ? (_) => setState(() => _isPressed = true) : null,
      onTapUp: widget.onPressed != null ? (_) => setState(() => _isPressed = false) : null,
      onTapCancel: () => setState(() => _isPressed = false),
      onTap: widget.isLoading ? null : widget.onPressed,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.translationValues(
          _isPressed ? 6 : 0,
          _isPressed ? 6 : 0,
          0,
        ),
        padding: widget.padding ??
            const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        decoration: BoxDecoration(
          color: widget.onPressed == null
              ? bg.withValues(alpha: 0.5)
              : bg,
          borderRadius: IrisRadius.full,
          border: Border.all(color: IrisColors.ink, width: 4),
          boxShadow: _isPressed
              ? []
              : IrisShadows.medium(),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (widget.isLoading)
              SizedBox(
                width: 24,
                height: 24,
                child: CircularProgressIndicator(
                  strokeWidth: 3,
                  valueColor: AlwaysStoppedAnimation<Color>(fg),
                ),
              )
            else ...[
              Text(
                widget.label,
                style: GoogleFonts.spaceGrotesk(
                  color: fg,
                  fontWeight: FontWeight.w700,
                  fontSize: widget.fontSize ?? 16,
                ),
              ),
              if (widget.icon != null) ...[
                const SizedBox(width: 8),
                Icon(widget.icon, color: fg, size: 20),
              ],
            ],
          ],
        ),
      ),
    );
  }
}
