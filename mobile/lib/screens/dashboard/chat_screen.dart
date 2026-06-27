import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../core/socket_service.dart';
import '../../providers/auth_provider.dart';
import '../../providers/chat_provider.dart';
import '../../providers/budget_provider.dart';
import '../../widgets/chat/chat_message_bubble.dart';
import '../../widgets/chat/chat_input.dart';
import '../../widgets/chat/typing_indicator.dart';
import '../../widgets/chat/live_routing_feed.dart';
import '../../widgets/budget_warning_banner.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final ScrollController _scrollController = ScrollController();
  final SocketService _socketService = SocketService();
  bool _isSocketConnected = false;
  List<Map<String, dynamic>> _routingEvents = [];

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    
    _socketService.addConnectionListener(_onSocketConnection);
    _socketService.addRoutingListener(_onRoutingEvent);
    _socketService.connect(auth.userId);
  }

  void _onSocketConnection(bool connected) {
    if (mounted) {
      setState(() => _isSocketConnected = connected);
    }
  }

  void _onRoutingEvent(Map<String, dynamic> event) {
    if (mounted) {
      setState(() {
        _routingEvents = _socketService.routingEvents;
      });
    }
  }

  @override
  void dispose() {
    _socketService.removeConnectionListener(_onSocketConnection);
    _socketService.removeRoutingListener(_onRoutingEvent);
    _socketService.disconnect();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    if (_scrollController.hasClients) {
      _scrollController.animateTo(
        _scrollController.position.maxScrollExtent,
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeOut,
      );
    }
  }

  void _handleSend(String text) async {
    final chat = context.read<ChatProvider>();
    final auth = context.read<AuthProvider>();
    
    await chat.sendMessage(text, auth.userId);
    if (!mounted) return;
    // Let budget provider catch up via HTTP just in case socket missed it
    context.read<BudgetProvider>().fetchBudget(auth.userId);
    
    Future.delayed(const Duration(milliseconds: 100), _scrollToBottom);
  }

  @override
  Widget build(BuildContext context) {
    final chat = context.watch<ChatProvider>();
    final budget = context.watch<BudgetProvider>();
    final isExceeded = budget.mode == 'exceeded';

    return Column(
      children: [
        BudgetWarningBanner(mode: budget.mode),
        Expanded(
          child: chat.messages.isEmpty
              ? _buildWelcomeScreen()
              : ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.all(20),
                  itemCount: chat.messages.length + (chat.isLoading ? 1 : 0),
                  itemBuilder: (context, index) {
                    if (index == chat.messages.length) {
                      return const TypingIndicator();
                    }
                    return ChatMessageBubble(message: chat.messages[index]);
                  },
                ),
        ),
        LiveRoutingFeed(
          events: _routingEvents,
          isConnected: _isSocketConnected,
        ),
        ChatInput(
          onSend: _handleSend,
          disabled: isExceeded,
        ),
      ],
    );
  }

  Widget _buildWelcomeScreen() {
    return Center(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: IrisColors.mint,
                shape: BoxShape.circle,
                border: Border.all(color: IrisColors.ink, width: 4),
                boxShadow: IrisShadows.neo(x: 6, y: 6),
              ),
              child: const Center(
                child: Icon(Icons.auto_awesome, size: 50, color: IrisColors.ink),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'How can I help you today?',
              textAlign: TextAlign.center,
              style: GoogleFonts.spaceGrotesk(
                fontSize: 28,
                fontWeight: FontWeight.w900,
                color: IrisColors.ink,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              'I route your requests to the best AI model dynamically.',
              textAlign: TextAlign.center,
              style: GoogleFonts.spaceGrotesk(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: IrisColors.ink.withValues(alpha: 0.6),
              ),
            ),
            const SizedBox(height: 32),
            _buildSuggestionCard(
              'Explain quantum computing simply',
              'Fast & cheap · Claude Haiku 4.5',
              IrisColors.sunny,
            ),
            const SizedBox(height: 16),
            _buildSuggestionCard(
              'Write a Python script for data analysis',
              'Balanced · Kimi K2.6',
              IrisColors.mint,
            ),
            const SizedBox(height: 16),
            _buildSuggestionCard(
              'Analyze this complex legal document',
              'High Reasoning · Claude Sonnet 4.6',
              IrisColors.coral,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestionCard(String text, String subtext, Color color) {
    return GestureDetector(
      onTap: () => _handleSend(text),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: IrisColors.white,
          borderRadius: IrisRadius.medium,
          border: Border.all(color: IrisColors.ink, width: 3),
          boxShadow: IrisShadows.small(),
        ),
        child: Row(
          children: [
            Container(
              width: 12,
              height: 12,
              decoration: BoxDecoration(
                color: color,
                shape: BoxShape.circle,
                border: Border.all(color: IrisColors.ink, width: 2),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    text,
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: IrisColors.ink,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    subtext,
                    style: GoogleFonts.spaceGrotesk(
                      fontWeight: FontWeight.w500,
                      fontSize: 12,
                      color: IrisColors.ink.withValues(alpha: 0.6),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
