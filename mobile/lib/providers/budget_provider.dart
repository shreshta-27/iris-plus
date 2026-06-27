import 'dart:async';
import 'package:flutter/material.dart';
import '../core/api_service.dart';

class BudgetProvider extends ChangeNotifier {
  final ApiService _api = ApiService();

  double totalCost = 0;
  double maxBudget = 2.0;
  String mode = 'normal';
  int calls = 0;
  Timer? _pollTimer;

  Future<void> fetchBudget(String sessionId) async {
    if (sessionId.isEmpty) return;
    try {
      final data = await _api.get('/api/budget/stats/$sessionId');
      totalCost = (data['totalCost'] ?? data['spent'] ?? 0).toDouble();
      maxBudget = (data['maxBudget'] ?? data['total'] ?? 2.0).toDouble();
      mode = data['mode']?.toString() ?? 'normal';
      calls = data['calls'] ?? 0;
      notifyListeners();
    } catch (_) {}
  }

  void startPolling(String sessionId) {
    _pollTimer?.cancel();
    fetchBudget(sessionId);
    _pollTimer = Timer.periodic(const Duration(seconds: 30), (_) {
      fetchBudget(sessionId);
    });
  }

  void stopPolling() {
    _pollTimer?.cancel();
  }

  Future<void> resetBudget(String sessionId) async {
    try {
      final data = await _api.post('/api/budget/reset/$sessionId');
      if (data['stats'] != null) {
        totalCost = (data['stats']['totalCost'] ?? data['stats']['spent'] ?? 0).toDouble();
        maxBudget = (data['stats']['maxBudget'] ?? data['stats']['total'] ?? 2.0).toDouble();
        mode = data['stats']['mode']?.toString() ?? 'normal';
      }
      notifyListeners();
    } catch (_) {}
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }
}
