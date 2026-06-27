import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../core/api_service.dart';

class QuizProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<Map<String, dynamic>>? _questions;
  String? _attemptId;
  Map<String, dynamic>? _results;
  bool _isLoading = false;
  String? _error;

  List<Map<String, dynamic>>? get questions => _questions;
  String? get attemptId => _attemptId;
  Map<String, dynamic>? get results => _results;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> generateQuiz({
    required String sessionId,
    String? topic,
    String? noteContent,
    String difficulty = 'medium',
    int numQuestions = 5,
  }) async {
    _isLoading = true;
    _error = null;
    _questions = null;
    _results = null;
    notifyListeners();

    try {
      final res = await _api.post('/api/quiz/generate', data: {
        'topic': topic ?? '',
        'noteContent': noteContent ?? '',
        'difficulty': difficulty,
        'numQuestions': numQuestions,
        'sessionId': sessionId,
      });

      _attemptId = res['attemptId']?.toString();
      _questions = (res['questions'] as List?)
          ?.map((q) => q is Map<String, dynamic> ? q : <String, dynamic>{})
          .toList();
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.injectionDetected
          ? 'PIGuard blocked generation: Potential prompt injection detected.'
          : e.message;
      notifyListeners();
    }
  }

  Future<void> submitQuiz(Map<String, int> answers) async {
    if (_attemptId == null) return;
    _isLoading = true;
    notifyListeners();

    try {
      final res = await _api.post('/api/quiz/submit', data: {
        'attemptId': _attemptId,
        'answers': answers,
      });
      _results = res['results'] is Map<String, dynamic> ? res['results'] : res;
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
    }
  }

  Future<String?> uploadPdf(String filePath) async {
    _isLoading = true;
    notifyListeners();

    try {
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(filePath, filename: filePath.split('/').last),
      });
      final res = await _api.postFormData('/api/upload/pdf', formData);
      _isLoading = false;
      notifyListeners();
      return res['text']?.toString();
    } catch (e) {
      _isLoading = false;
      _error = 'Failed to parse PDF.';
      notifyListeners();
      return null;
    }
  }

  void reset() {
    _questions = null;
    _attemptId = null;
    _results = null;
    _error = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
