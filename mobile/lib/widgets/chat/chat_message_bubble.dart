import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme.dart';
import '../../../providers/chat_provider.dart';
import '../routing_chip.dart';
import '../injection_badge.dart';

class ChatMessageBubble extends StatelessWidget {
  final ChatMessage message;

  const ChatMessageBubble({super.key, required this.message});

  @override
  Widget build(BuildContext context) {
    final isUser = message.role == 'user';

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (!isUser) _buildAvatar(isUser),
          const SizedBox(width: 12),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: isUser ? IrisColors.cream : IrisColors.white,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(isUser ? 24 : 4),
                  topRight: Radius.circular(isUser ? 4 : 24),
                  bottomLeft: const Radius.circular(24),
                  bottomRight: const Radius.circular(24),
                ),
                border: Border.all(
                  color: message.isError || message.isBlocked ? IrisColors.coral : IrisColors.ink,
                  width: 4,
                ),
                boxShadow: IrisShadows.neo(
                  color: message.isError || message.isBlocked ? IrisColors.coral : IrisColors.ink,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (!isUser && (message.routing != null || message.injectionStatus != null))
                    Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: Wrap(
                        spacing: 8,
                        runSpacing: 8,
                        children: [
                          if (message.routing != null)
                            RoutingChip(routing: message.routing!, cost: message.cost),
                          if (message.injectionStatus != null)
                            InjectionBadge(status: message.injectionStatus!),
                        ],
                      ),
                    ),
                  MarkdownBody(
                    data: message.content,
                    styleSheet: MarkdownStyleSheet(
                      p: GoogleFonts.spaceGrotesk(
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                        color: IrisColors.ink,
                        height: 1.6,
                      ),
                      code: GoogleFonts.jetBrainsMono(
                        backgroundColor: IrisColors.ink.withValues(alpha: 0.1),
                        color: IrisColors.ink,
                        fontWeight: FontWeight.w700,
                      ),
                      codeblockDecoration: BoxDecoration(
                        color: IrisColors.ink,
                        borderRadius: IrisRadius.medium,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 12),
          if (isUser) _buildAvatar(isUser),
        ],
      ),
    );
  }

  Widget _buildAvatar(bool isUser) {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: isUser ? IrisColors.peach : IrisColors.mint,
        shape: BoxShape.circle,
        border: Border.all(color: IrisColors.ink, width: 3),
        boxShadow: IrisShadows.neo(x: 2, y: 2),
      ),
      child: Center(
        child: Icon(
          isUser ? Icons.person_outline : Icons.auto_awesome,
          color: IrisColors.ink,
          size: 20,
        ),
      ),
    );
  }
}
