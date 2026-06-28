import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../core/api_service.dart';

class ChatMessage {
  final String role;
  final String content;
  final int id;
  final String? tier;
  final String? model;
  final Map<String, dynamic>? routing;
  final double? cost;
  final String? injectionStatus;
  final bool isError;
  final bool isBlocked;

  ChatMessage({
    required this.role,
    required this.content,
    required this.id,
    this.tier,
    this.model,
    this.routing,
    this.cost,
    this.injectionStatus,
    this.isError = false,
    this.isBlocked = false,
  });
}

class ChatProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  final List<ChatMessage> _messages = [];
  bool _isLoading = false;

  List<ChatMessage> get messages => List.unmodifiable(_messages);
  bool get isLoading => _isLoading;

  Future<String?> sendMessage(String text, String sessionId) async {
    final userMsg = ChatMessage(
      role: 'user',
      content: text,
      id: DateTime.now().millisecondsSinceEpoch,
    );
    _messages.add(userMsg);
    _isLoading = true;
    notifyListeners();

    try {
      final res = await _api.post('/api/ai/chat', data: {
        'message': text,
        'sessionId': sessionId,
      });

      final aiText = res['answer']?.toString() ?? '';
      final aiMsg = ChatMessage(
        role: 'assistant',
        content: aiText,
        id: DateTime.now().millisecondsSinceEpoch + 1,
        tier: res['routing']?['tier']?.toString(),
        model: res['routing']?['modelDisplayName']?.toString(),
        routing: res['routing'] is Map<String, dynamic> ? res['routing'] : null,
        cost: ((res['cost'] is Map ? res['cost']['thisCall'] : res['cost']) ?? 0).toDouble(),
        injectionStatus: res['injectionStatus']?.toString(),
      );
      _messages.add(aiMsg);
      return aiText;
    } on ApiException catch (e) {
      if (e.injectionDetected) {
        _messages.add(ChatMessage(
          role: 'assistant',
          content: 'I cannot answer that. Potential prompt injection detected and blocked by PIGuard.',
          id: DateTime.now().millisecondsSinceEpoch + 1,
          isBlocked: true,
          injectionStatus: 'blocked',
        ));
        return 'I cannot answer that. Potential prompt injection detected and blocked by PIGuard.';
      } else {
        _messages.add(ChatMessage(
          role: 'assistant',
          content: e.message,
          id: DateTime.now().millisecondsSinceEpoch + 1,
          isError: true,
        ));
        return e.message;
      }
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearMessages() {
    _messages.clear();
    notifyListeners();
  }

  Future<String?> uploadDocument(String filePath) async {
    _isLoading = true;
    notifyListeners();

    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath, filename: filePath.split('/').last),
      });
      final res = await _api.postFormData('/api/upload/document', formData);
      _isLoading = false;
      notifyListeners();
      return res['text']?.toString();
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }
}
