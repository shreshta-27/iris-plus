import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import '../../../core/theme.dart';
import '../../../providers/chat_provider.dart';

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
  bool _isUploading = false;
  String _attachedFileName = '';
  String _attachedFileText = '';

  Future<void> _handleAttach() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'txt', 'png', 'jpg', 'jpeg'],
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _isUploading = true;
        _attachedFileName = result.files.single.name;
      });

      final chat = context.read<ChatProvider>();
      final text = await chat.uploadDocument(result.files.single.path!);

      if (mounted) {
        setState(() {
          _isUploading = false;
          if (text != null && text.isNotEmpty && !text.startsWith('Error:')) {
            _attachedFileText = text;
          } else {
            _attachedFileName = '';
            _attachedFileText = '';
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text(text ?? 'Failed to process document.')),
            );
          }
        });
      }
    }
  }

  void _handleSend() {
    final text = _controller.text.trim();
    if ((text.isNotEmpty || _attachedFileText.isNotEmpty) && !widget.disabled && !_isUploading) {
      final finalMessage = _attachedFileText.isNotEmpty
          ? '[Attached Document: $_attachedFileName]\n$_attachedFileText\n\nUser Query: $text'
          : text;

      widget.onSend(finalMessage);
      
      _controller.clear();
      setState(() {
        _attachedFileName = '';
        _attachedFileText = '';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: IrisColors.white,
        border: const Border(top: BorderSide(color: IrisColors.ink, width: 4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_attachedFileName.isNotEmpty)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: IrisColors.cream,
                borderRadius: IrisRadius.medium,
                border: Border.all(color: IrisColors.ink, width: 3),
                boxShadow: IrisShadows.small(),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.description, size: 20, color: IrisColors.ink),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      _isUploading ? 'Extracting text...' : '$_attachedFileName attached',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: IrisColors.ink,
                      ),
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                  if (!_isUploading) ...[
                    const SizedBox(width: 8),
                    GestureDetector(
                      onTap: () {
                        setState(() {
                          _attachedFileName = '';
                          _attachedFileText = '';
                        });
                      },
                      child: const Icon(Icons.close, size: 20, color: IrisColors.coral),
                    ),
                  ]
                ],
              ),
            ),
          Row(
            children: [
              GestureDetector(
                onTap: widget.disabled || _isUploading ? null : _handleAttach,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: widget.disabled ? IrisColors.cream : IrisColors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: IrisColors.ink, width: 4),
                    boxShadow: widget.disabled ? [] : IrisShadows.neo(x: 4, y: 4),
                  ),
                  child: _isUploading
                      ? const Padding(
                          padding: EdgeInsets.all(16),
                          child: CircularProgressIndicator(strokeWidth: 3, color: IrisColors.ink),
                        )
                      : Icon(
                          Icons.attach_file,
                          color: widget.disabled ? IrisColors.ink.withValues(alpha: 0.3) : IrisColors.ink,
                        ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: TextField(
                  controller: _controller,
                  enabled: !widget.disabled && !_isUploading,
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
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
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
                onTap: widget.disabled || _isUploading ? null : _handleSend,
                child: Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: widget.disabled || _isUploading ? IrisColors.cream : IrisColors.irisPurple,
                    shape: BoxShape.circle,
                    border: Border.all(color: IrisColors.ink, width: 4),
                    boxShadow: widget.disabled || _isUploading ? [] : IrisShadows.neo(x: 4, y: 4),
                  ),
                  child: Icon(
                    Icons.send,
                    color: widget.disabled || _isUploading ? IrisColors.ink.withValues(alpha: 0.3) : IrisColors.white,
                  ),
                ),
              ),
            ],
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
