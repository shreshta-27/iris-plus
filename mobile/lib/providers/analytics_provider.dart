import 'package:flutter/material.dart';
import '../core/api_service.dart';

class AnalyticsProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  Map<String, dynamic>? _analyticsData;
  Map<String, dynamic>? _securityData;
  bool _isLoadingAnalytics = false;
  bool _isLoadingSecurity = false;

  Map<String, dynamic>? get analyticsData => _analyticsData;
  Map<String, dynamic>? get securityData => _securityData;
  bool get isLoadingAnalytics => _isLoadingAnalytics;
  bool get isLoadingSecurity => _isLoadingSecurity;

  Future<void> fetchAnalytics(String sessionId) async {
    _isLoadingAnalytics = true;
    notifyListeners();

    try {
      _analyticsData = await _api.get('/api/analytics/overview?sessionId=$sessionId');
    } catch (_) {
      _analyticsData = null;
    }
    _isLoadingAnalytics = false;
    notifyListeners();
  }

  Future<void> fetchSecurity(String sessionId) async {
    _isLoadingSecurity = true;
    notifyListeners();

    try {
      _securityData = await _api.get('/api/analytics/security?sessionId=$sessionId');
    } catch (_) {
      _securityData = null;
    }
    _isLoadingSecurity = false;
    notifyListeners();
  }
}
