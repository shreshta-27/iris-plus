import 'package:flutter/material.dart';
import '../core/api_service.dart';

class AuthProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  Map<String, dynamic>? _user;
  bool _isLoading = false;
  String? _error;

  Map<String, dynamic>? get user => _user;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get error => _error;
  String get userId => _user?['_id']?.toString() ?? _user?['id']?.toString() ?? 'demo-session-id';

  Future<bool> checkAuth() async {
    try {
      final data = await _api.get('/api/auth/me');
      _user = data['user'];
      notifyListeners();
      return true;
    } catch (_) {
      _user = null;
      notifyListeners();
      return false;
    }
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/api/auth/login', data: {
        'email': email,
        'password': password,
      });
      if (data['token'] != null) {
        await _api.setToken(data['token']);
      }
      _user = data['user'];
      _isLoading = false;
      notifyListeners();
      return data;
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<Map<String, dynamic>> sendLoginOTP(String email) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/api/auth/login/send-otp', data: {
        'email': email,
      });
      _isLoading = false;
      notifyListeners();
      return data;
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> verifyLoginOTP(String userId, String otp) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/api/auth/login/verify-otp', data: {
        'userId': userId,
        'otp': otp,
      });
      if (data['token'] != null) {
        await _api.setToken(data['token']);
      }
      _user = data['user'];
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<Map<String, dynamic>> register(String name, String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/api/auth/register', data: {
        'name': name,
        'email': email,
        'password': password,
      });
      _isLoading = false;
      notifyListeners();
      return data;
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> verifyOTP(String userId, String otp) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      final data = await _api.post('/api/auth/verify-otp', data: {
        'userId': userId,
        'otp': otp,
      });
      if (data['token'] != null) {
        await _api.setToken(data['token']);
      }
      _user = data['user'];
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> resendOTP(String userId) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      await _api.post('/api/auth/resend-otp', data: {'userId': userId});
      _isLoading = false;
      notifyListeners();
    } on ApiException catch (e) {
      _isLoading = false;
      _error = e.message;
      notifyListeners();
      rethrow;
    }
  }

  Future<void> logout() async {
    try {
      await _api.post('/api/auth/logout');
    } catch (_) {}
    _user = null;
    await _api.clearCookies();
    notifyListeners();
  }

  void clearError() {
    _error = null;
    notifyListeners();
  }
}
