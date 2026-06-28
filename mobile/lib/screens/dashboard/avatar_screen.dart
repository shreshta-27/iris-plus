import 'package:webview_flutter/webview_flutter.dart';
import '../../core/constants.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';

class AvatarScreen extends StatefulWidget {
  const AvatarScreen({super.key});

  @override
  State<AvatarScreen> createState() => _AvatarScreenState();
}

class _AvatarScreenState extends State<AvatarScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  late final WebViewController _webViewController;
  bool _isWebViewLoading = true;
  bool _isListening = false; // Mock for mic button state

  @override
  void initState() {
    super.initState();
    _webViewController = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(Colors.transparent)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageFinished: (String url) {
            if (mounted) {
              setState(() => _isWebViewLoading = false);
            }
          },
        ),
      )
      ..loadRequest(Uri.parse('$frontendUrl/avatar-only'));
  }

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    _controller.clear();
    final authProvider = context.read<AuthProvider>();
    final chatProvider = context.read<ChatProvider>();
    
    // Trigger thinking animation in WebView
    _webViewController.runJavaScript("if(window.avatarThink) window.avatarThink();");

    chatProvider.sendMessage(text, authProvider.userId).then((reply) {
      if (mounted && reply != null) {
        // Escape quotes and newlines for JS
        final escapedReply = reply.replaceAll("'", "\\'").replaceAll('\n', '\\n');
        _webViewController.runJavaScript("if(window.avatarSpeak) window.avatarSpeak('$escapedReply');");
        _scrollToBottom();
      } else if (mounted) {
        _webViewController.runJavaScript("if(window.avatarSpeak) window.avatarSpeak('I had a problem connecting. Please try again.');");
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

  void _toggleMic() {
    // In a real app, integrate speech_to_text package here
    setState(() {
      _isListening = !_isListening;
    });
    if (_isListening) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'Microphone access would be requested here.',
            style: GoogleFonts.spaceGrotesk(fontWeight: FontWeight.w700),
          ),
          backgroundColor: IrisColors.irisPurple,
          duration: const Duration(seconds: 2),
        ),
      );
      Future.delayed(const Duration(seconds: 2), () {
        if (mounted) setState(() => _isListening = false);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isKeyboardOpen = MediaQuery.of(context).viewInsets.bottom > 0;
    
    return Consumer<ChatProvider>(
      builder: (context, chatProvider, _) {
        return Scaffold(
          backgroundColor: IrisColors.cream,
          body: SafeArea(
            child: Column(
              children: [
                // 3D Avatar Viewport
                AnimatedContainer(
                  duration: const Duration(milliseconds: 250),
                  height: isKeyboardOpen ? 150 : 350,
                  decoration: BoxDecoration(
                    color: IrisColors.white,
                    border: const Border(bottom: BorderSide(color: IrisColors.ink, width: 4)),
                    boxShadow: [
                      BoxShadow(
                        color: IrisColors.ink.withValues(alpha: 0.1),
                        offset: const Offset(0, 4),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: Stack(
                    children: [
                      WebViewWidget(controller: _webViewController),
                      if (_isWebViewLoading)
                        const Center(
                          child: CircularProgressIndicator(
                            color: IrisColors.irisPurple,
                          ),
                        ),
                    ],
                  ),
                ),
                
                // Chat Header
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  decoration: const BoxDecoration(
                    color: IrisColors.cream,
                    border: Border(bottom: BorderSide(color: IrisColors.ink, width: 4)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: IrisColors.irisPurple,
                          shape: BoxShape.circle,
                          border: Border.all(color: IrisColors.ink, width: 3),
                          boxShadow: IrisShadows.neo(x: 2, y: 2),
                        ),
                        child: Center(
                          child: Text(
                            'IR',
                            style: GoogleFonts.spaceGrotesk(
                              color: IrisColors.white,
                              fontWeight: FontWeight.w900,
                              fontSize: 14,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Iris Avatar',
                            style: GoogleFonts.spaceGrotesk(
                              color: IrisColors.ink,
                              fontWeight: FontWeight.w900,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            '3D AI ASSISTANT',
                            style: GoogleFonts.spaceGrotesk(
                              color: IrisColors.ink.withValues(alpha: 0.5),
                              fontWeight: FontWeight.w900,
                              fontSize: 10,
                              letterSpacing: 1,
                            ),
                          ),
                        ],
                      ),
                      const Spacer(),
                      Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: _isWebViewLoading ? IrisColors.coral : IrisColors.mint,
                          shape: BoxShape.circle,
                          border: Border.all(color: IrisColors.ink, width: 2),
                          boxShadow: IrisShadows.neo(x: 2, y: 2),
                        ),
                      ).animate(onPlay: (controller) => controller.repeat(reverse: true))
                       .scaleXY(begin: 1.0, end: 1.3, duration: 1.seconds),
                    ],
                  ),
                ),

                // Chat List
                Expanded(
                  child: Container(
                    color: IrisColors.cream.withValues(alpha: 0.5),
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: const EdgeInsets.all(16),
                      itemCount: chatProvider.messages.length + (chatProvider.isLoading ? 1 : 0),
                      itemBuilder: (context, index) {
                        if (index == chatProvider.messages.length) {
                          // Loading indicator bubble
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 16),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: IrisColors.white,
                                  border: Border.all(color: IrisColors.ink, width: 3),
                                  borderRadius: const BorderRadius.only(
                                    topLeft: Radius.circular(16),
                                    topRight: Radius.circular(16),
                                    bottomRight: Radius.circular(16),
                                    bottomLeft: Radius.circular(4),
                                  ),
                                  boxShadow: IrisShadows.neo(x: 3, y: 3),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: IrisColors.irisPurple,
                                        shape: BoxShape.circle,
                                      ),
                                    ).animate(onPlay: (c) => c.repeat(reverse: true)).scaleXY(end: 1.3, duration: 600.ms),
                                    const SizedBox(width: 4),
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: IrisColors.irisPurple,
                                        shape: BoxShape.circle,
                                      ),
                                    ).animate(delay: 200.ms, onPlay: (c) => c.repeat(reverse: true)).scaleXY(end: 1.3, duration: 600.ms),
                                    const SizedBox(width: 4),
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: const BoxDecoration(
                                        color: IrisColors.irisPurple,
                                        shape: BoxShape.circle,
                                      ),
                                    ).animate(delay: 400.ms, onPlay: (c) => c.repeat(reverse: true)).scaleXY(end: 1.3, duration: 600.ms),
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
                              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.85),
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                                decoration: BoxDecoration(
                                  color: isUser ? IrisColors.irisPurple : IrisColors.white,
                                  border: Border.all(color: IrisColors.ink, width: 3),
                                  borderRadius: BorderRadius.only(
                                    topLeft: const Radius.circular(16),
                                    topRight: const Radius.circular(16),
                                    bottomLeft: Radius.circular(isUser ? 16 : 4),
                                    bottomRight: Radius.circular(isUser ? 4 : 16),
                                  ),
                                  boxShadow: IrisShadows.neo(x: 3, y: 3),
                                ),
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
                                            color: IrisColors.ink,
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                    ],
                                    Text(
                                      msg.content,
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                        color: isUser ? IrisColors.white : IrisColors.ink,
                                        height: 1.5,
                                      ),
                                    ),
                                    if (msg.isBlocked) ...[
                                      const SizedBox(height: 8),
                                      Container(
                                        padding: const EdgeInsets.all(8),
                                        decoration: BoxDecoration(
                                          color: IrisColors.coral,
                                          borderRadius: IrisRadius.small,
                                          border: Border.all(color: IrisColors.ink, width: 2),
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
                ),
                
                // Input Area
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: IrisColors.white,
                    border: Border(top: BorderSide(color: IrisColors.ink, width: 4)),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            boxShadow: IrisShadows.neo(x: 3, y: 3),
                            borderRadius: IrisRadius.medium,
                          ),
                          child: TextField(
                            controller: _controller,
                            style: GoogleFonts.spaceGrotesk(
                              color: IrisColors.ink,
                              fontWeight: FontWeight.w500,
                            ),
                            decoration: InputDecoration(
                              hintText: 'Talk to Iris...',
                              hintStyle: GoogleFonts.spaceGrotesk(
                                color: IrisColors.ink.withValues(alpha: 0.4),
                                fontWeight: FontWeight.w500,
                              ),
                              filled: true,
                              fillColor: IrisColors.cream,
                              border: OutlineInputBorder(
                                borderRadius: IrisRadius.medium,
                                borderSide: const BorderSide(color: IrisColors.ink, width: 3),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: IrisRadius.medium,
                                borderSide: const BorderSide(color: IrisColors.ink, width: 3),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: IrisRadius.medium,
                                borderSide: const BorderSide(color: IrisColors.irisPurple, width: 3),
                              ),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                            ),
                            onSubmitted: (_) => _sendMessage(),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      GestureDetector(
                        onTap: chatProvider.isLoading ? null : _sendMessage,
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: chatProvider.isLoading ? IrisColors.ink.withValues(alpha: 0.3) : IrisColors.irisPurple,
                            borderRadius: IrisRadius.medium,
                            border: Border.all(color: IrisColors.ink, width: 3),
                            boxShadow: chatProvider.isLoading ? null : IrisShadows.neo(x: 3, y: 3),
                          ),
                          child: chatProvider.isLoading
                              ? const Padding(
                                  padding: EdgeInsets.all(10),
                                  child: CircularProgressIndicator(strokeWidth: 2, color: IrisColors.white),
                                )
                              : const Icon(Icons.send, color: IrisColors.white, size: 20),
                        ),
                      ),
                      const SizedBox(width: 12),
                      GestureDetector(
                        onTap: chatProvider.isLoading ? null : _toggleMic,
                        child: Container(
                          width: 44,
                          height: 44,
                          decoration: BoxDecoration(
                            color: _isListening ? IrisColors.coral : IrisColors.sunny,
                            borderRadius: IrisRadius.medium,
                            border: Border.all(color: IrisColors.ink, width: 3),
                            boxShadow: chatProvider.isLoading ? null : IrisShadows.neo(x: 3, y: 3),
                          ),
                          child: Icon(
                            _isListening ? Icons.mic_off : Icons.mic,
                            color: _isListening ? IrisColors.white : IrisColors.ink,
                            size: 20,
                          ),
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
