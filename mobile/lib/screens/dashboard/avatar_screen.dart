import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';
import '../../widgets/neo_card.dart';

class AvatarScreen extends StatefulWidget {
  const AvatarScreen({super.key});

  @override
  State<AvatarScreen> createState() => _AvatarScreenState();
}

class _AvatarScreenState extends State<AvatarScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isOrbActive = false;

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    _controller.clear();
    final authProvider = context.read<AuthProvider>();
    final chatProvider = context.read<ChatProvider>();
    
    setState(() => _isOrbActive = true);
    
    chatProvider.sendMessage(text, authProvider.userId).then((_) {
      if (mounted) {
        setState(() => _isOrbActive = false);
        _scrollToBottom();
      }
    });
    
    _scrollToBottom();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<ChatProvider>(
      builder: (context, chatProvider, _) {
        return Scaffold(
          backgroundColor: IrisColors.cream,
          body: SafeArea(
            child: Column(
              children: [
                // Header with Orb
                Container(
                  padding: const EdgeInsets.symmetric(vertical: 24),
                  decoration: BoxDecoration(
                    color: IrisColors.white,
                    border: const Border(bottom: BorderSide(color: IrisColors.ink, width: 3)),
                    boxShadow: [
                      BoxShadow(
                        color: IrisColors.ink.withOpacity(0.1),
                        offset: const Offset(0, 4),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Column(
                    children: [
                      Container(
                        width: 80,
                        height: 80,
                        decoration: BoxDecoration(
                          color: _isOrbActive || chatProvider.isLoading ? IrisColors.mint : IrisColors.sky,
                          shape: BoxShape.circle,
                          border: Border.all(color: IrisColors.ink, width: 3),
                          boxShadow: IrisShadows.small(),
                        ),
                        child: Icon(
                          _isOrbActive || chatProvider.isLoading ? Icons.graphic_eq : Icons.mic_none,
                          size: 32,
                          color: IrisColors.ink,
                        ),
                      ).animate(
                        target: (_isOrbActive || chatProvider.isLoading) ? 1 : 0,
                        onPlay: (controller) => controller.repeat(reverse: true),
                      ).scaleXY(end: 1.1, duration: 600.ms, curve: Curves.easeInOut),
                      const SizedBox(height: 12),
                      Text(
                        'IRIS ✦ Assistant',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: IrisColors.ink,
                        ),
                      ),
                    ],
                  ),
                ),
                
                // Chat List
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    padding: const EdgeInsets.all(16),
                    itemCount: chatProvider.messages.length + (chatProvider.isLoading ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index == chatProvider.messages.length) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: Align(
                            alignment: Alignment.centerLeft,
                            child: NeoCard(
                              padding: const EdgeInsets.all(16),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const SizedBox(
                                    width: 16,
                                    height: 16,
                                    child: CircularProgressIndicator(strokeWidth: 2, color: IrisColors.ink),
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    'Thinking...',
                                    style: GoogleFonts.spaceGrotesk(
                                      fontWeight: FontWeight.w700,
                                      color: IrisColors.ink,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ).animate().fadeIn(),
                        );
                      }

                      final msg = chatProvider.messages[index];
                      final isUser = msg.role == 'user';

                      return Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Align(
                          alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                          child: ConstrainedBox(
                            constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                            child: NeoCard(
                              backgroundColor: isUser ? IrisColors.sky : IrisColors.white,
                              leftBorderColor: isUser ? null : (msg.isBlocked ? IrisColors.coral : (msg.isError ? IrisColors.sunny : IrisColors.mint)),
                              leftBorderWidth: 12,
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  if (!isUser && msg.model != null) ...[
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: IrisColors.mint,
                                        border: Border.all(color: IrisColors.ink, width: 2),
                                        borderRadius: IrisRadius.small,
                                      ),
                                      child: Text(
                                        msg.model!,
                                        style: GoogleFonts.spaceGrotesk(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 8),
                                  ],
                                  Text(
                                    msg.content,
                                    style: GoogleFonts.spaceGrotesk(
                                      fontSize: 15,
                                      fontWeight: isUser ? FontWeight.w700 : FontWeight.w500,
                                      color: IrisColors.ink,
                                    ),
                                  ),
                                  if (msg.isBlocked) ...[
                                    const SizedBox(height: 8),
                                    Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: IrisColors.coral,
                                        borderRadius: IrisRadius.small,
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(Icons.security, color: IrisColors.white, size: 14),
                                          const SizedBox(width: 4),
                                          Text(
                                            'PIGuard BLOCKED',
                                            style: GoogleFonts.spaceGrotesk(
                                              fontSize: 10,
                                              fontWeight: FontWeight.w900,
                                              color: IrisColors.white,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ]
                                ],
                              ),
                            ),
                          ),
                        ).animate().fadeIn().slideY(begin: 0.1),
                      );
                    },
                  ),
                ),
                
                // Input Area
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: IrisColors.white,
                    border: const Border(top: BorderSide(color: IrisColors.ink, width: 3)),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: _controller,
                          decoration: InputDecoration(
                            hintText: 'Message IRIS...',
                            hintStyle: GoogleFonts.spaceGrotesk(color: IrisColors.ink.withOpacity(0.5)),
                            filled: true,
                            fillColor: IrisColors.cream,
                            border: OutlineInputBorder(
                              borderRadius: IrisRadius.small,
                              borderSide: const BorderSide(color: IrisColors.ink, width: 2),
                            ),
                            enabledBorder: OutlineInputBorder(
                              borderRadius: IrisRadius.small,
                              borderSide: const BorderSide(color: IrisColors.ink, width: 2),
                            ),
                            focusedBorder: OutlineInputBorder(
                              borderRadius: IrisRadius.small,
                              borderSide: const BorderSide(color: IrisColors.ink, width: 3),
                            ),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          ),
                          onSubmitted: (_) => _sendMessage(),
                        ),
                      ),
                      const SizedBox(width: 12),
                      GestureDetector(
                        onTap: chatProvider.isLoading ? null : _sendMessage,
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: chatProvider.isLoading ? IrisColors.ink.withOpacity(0.3) : IrisColors.irisPurple,
                            borderRadius: IrisRadius.small,
                            border: Border.all(color: IrisColors.ink, width: 2),
                            boxShadow: chatProvider.isLoading ? null : IrisShadows.small(),
                          ),
                          child: const Icon(Icons.send, color: IrisColors.ink),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
