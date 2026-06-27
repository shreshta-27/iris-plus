import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';

class NeoInput extends StatefulWidget {
  final TextEditingController controller;
  final String? label;
  final String? placeholder;
  final IconData? prefixIcon;
  final bool obscureText;
  final int maxLines;
  final int? maxLength;
  final TextInputType? keyboardType;
  final TextAlign textAlign;
  final double fontSize;
  final bool enabled;
  final double? letterSpacing;
  final ValueChanged<String>? onChanged;

  const NeoInput({
    super.key,
    required this.controller,
    this.label,
    this.placeholder,
    this.prefixIcon,
    this.obscureText = false,
    this.maxLines = 1,
    this.maxLength,
    this.keyboardType,
    this.textAlign = TextAlign.start,
    this.fontSize = 18,
    this.enabled = true,
    this.letterSpacing,
    this.onChanged,
  });

  @override
  State<NeoInput> createState() => _NeoInputState();
}

class _NeoInputState extends State<NeoInput> {
  bool _isFocused = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.label != null) ...[
          Row(
            children: [
              if (widget.prefixIcon != null) ...[
                Icon(widget.prefixIcon, size: 16, color: IrisColors.ink.withValues(alpha: 0.7)),
                const SizedBox(width: 8),
              ],
              Text(
                widget.label!.toUpperCase(),
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: IrisColors.ink.withValues(alpha: 0.7),
                  letterSpacing: 2,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
        ],
        Focus(
          onFocusChange: (focused) => setState(() => _isFocused = focused),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            transform: Matrix4.translationValues(
              _isFocused ? -2 : 0,
              _isFocused ? -2 : 0,
              0,
            ),
            decoration: BoxDecoration(
              borderRadius: IrisRadius.medium,
              boxShadow: _isFocused
                  ? IrisShadows.medium(color: IrisColors.irisPurple)
                  : [],
            ),
            child: TextField(
              controller: widget.controller,
              obscureText: widget.obscureText,
              maxLines: widget.maxLines,
              maxLength: widget.maxLength,
              keyboardType: widget.keyboardType,
              textAlign: widget.textAlign,
              enabled: widget.enabled,
              onChanged: widget.onChanged,
              style: GoogleFonts.spaceGrotesk(
                fontSize: widget.fontSize,
                fontWeight: FontWeight.w500,
                color: IrisColors.ink,
                letterSpacing: widget.letterSpacing,
              ),
              decoration: InputDecoration(
                hintText: widget.placeholder,
                hintStyle: GoogleFonts.spaceGrotesk(
                  color: const Color(0xFF8C8C8C),
                  fontWeight: FontWeight.w500,
                  fontSize: widget.fontSize,
                ),
                filled: true,
                fillColor: IrisColors.white,
                counterText: '',
                contentPadding: const EdgeInsets.all(16),
                border: OutlineInputBorder(
                  borderRadius: IrisRadius.medium,
                  borderSide: const BorderSide(color: IrisColors.ink, width: 4),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: IrisRadius.medium,
                  borderSide: const BorderSide(color: IrisColors.ink, width: 4),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: IrisRadius.medium,
                  borderSide: const BorderSide(color: IrisColors.irisPurple, width: 4),
                ),
                disabledBorder: OutlineInputBorder(
                  borderRadius: IrisRadius.medium,
                  borderSide: BorderSide(color: IrisColors.ink.withValues(alpha: 0.3), width: 4),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
