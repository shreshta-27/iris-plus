import 'package:flutter/material.dart';
import '../core/api_service.dart';

class CareerProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  List<dynamic>? _paths;
  Map<String, dynamic>? _routing;
  Map<String, dynamic>? _cost;
  bool _isLoading = false;
  String? _error;

  List<dynamic>? get paths => _paths;
  Map<String, dynamic>? get routing => _routing;
  Map<String, dynamic>? get cost => _cost;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> analyze({
    required String targetRole,
    required String currentSkills,
    required String sessionId,
  }) async {
    _isLoading = true;
    _error = null;
    _paths = null;
    _routing = null;
    _cost = null;
    notifyListeners();

    try {
      final res = await _api.post('/api/career/analyze', data: {
        'targetRole': targetRole,
        'currentSkills': currentSkills,
        'sessionId': sessionId,
      });
      _paths = res['paths'] is List ? res['paths'] : [];
      _routing = res['routing'] is Map<String, dynamic> ? res['routing'] : null;
      _cost = res['cost'] is Map<String, dynamic> ? res['cost'] : null;
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.injectionDetected
          ? 'PIGuard blocked analysis: Potential prompt injection detected.'
          : e.message;
      notifyListeners();
    }
  }

  void reset() {
    _paths = null;
    _routing = null;
    _cost = null;
    _error = null;
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}

