import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme.dart';

class ChatInput extends StatefulWidget {
  final Function(String) onSend;
  final bool disabled;

  const ChatInput({
    super.key,
    required this.onSend,
    this.disabled = false,
  });

  @override
  State<ChatInput> createState() => _ChatInputState();
}

class _ChatInputState extends State<ChatInput> {
  final _controller = TextEditingController();

  void _handleSend() {
    final text = _controller.text.trim();
    if (text.isNotEmpty && !widget.disabled) {
      widget.onSend(text);
      _controller.clear();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: IrisColors.white,
        border: const Border(top: BorderSide(color: IrisColors.ink, width: 4)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _controller,
              enabled: !widget.disabled,
              maxLines: null,
              textInputAction: TextInputAction.send,
              onSubmitted: (_) => _handleSend(),
              style: GoogleFonts.spaceGrotesk(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: IrisColors.ink,
              ),
              decoration: InputDecoration(
                hintText: widget.disabled ? 'Budget exceeded' : 'Message IRIS...',
                hintStyle: GoogleFonts.spaceGrotesk(
                  color: const Color(0xFF8C8C8C),
                  fontWeight: FontWeight.w500,
                ),
                filled: true,
                fillColor: widget.disabled ? IrisColors.cream : IrisColors.white,
                contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                border: OutlineInputBorder(
                  borderRadius: IrisRadius.full,
                  borderSide: const BorderSide(color: IrisColors.ink, width: 4),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: IrisRadius.full,
                  borderSide: const BorderSide(color: IrisColors.ink, width: 4),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: IrisRadius.full,
                  borderSide: const BorderSide(color: IrisColors.irisPurple, width: 4),
                ),
                disabledBorder: OutlineInputBorder(
                  borderRadius: IrisRadius.full,
                  borderSide: const BorderSide(color: IrisColors.ink, width: 4),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          GestureDetector(
            onTap: widget.disabled ? null : _handleSend,
            child: Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: widget.disabled ? IrisColors.cream : IrisColors.irisPurple,
                shape: BoxShape.circle,
                border: Border.all(color: IrisColors.ink, width: 4),
                boxShadow: widget.disabled ? [] : IrisShadows.neo(x: 4, y: 4),
              ),
              child: Icon(
                Icons.send,
                color: widget.disabled ? IrisColors.ink.withValues(alpha: 0.3) : IrisColors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}
