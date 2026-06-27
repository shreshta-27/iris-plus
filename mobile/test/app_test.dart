import 'package:flutter_test/flutter_test.dart';
import 'package:iris_mobile/providers/budget_provider.dart';

void main() {
  group('BudgetProvider Tests', () {
    test('Initial state is correct', () {
      final provider = BudgetProvider();
      
      expect(provider.totalCost, 0.0);
      expect(provider.maxBudget, 2.0); // default in provider
      expect(provider.mode, 'normal');
      expect(provider.calls, 0);
    });

    test('Stop polling works', () {
      final provider = BudgetProvider();
      provider.startPolling('test-session');
      provider.stopPolling();
      // Should not throw or crash
    });
  });
}
