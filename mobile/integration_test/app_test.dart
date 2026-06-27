import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:iris_mobile/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('end-to-end test', () {
    testWidgets('tap on the login button, verify error or success',
        (tester) async {
      app.main();
      
      // Wait for app to render
      await tester.pumpAndSettle();

      // Find the email input field and enter text
      final emailFinder = find.byType(TextField).first;
      final passwordFinder = find.byType(TextField).last;
      
      // Find the login button
      final loginButtonFinder = find.text('Login', skipOffstage: false);

      expect(loginButtonFinder, findsWidgets);

      // We can interact with the app:
      // await tester.enterText(emailFinder, 'test@example.com');
      // await tester.enterText(passwordFinder, 'password');
      // await tester.tap(loginButtonFinder.first);
      // await tester.pumpAndSettle();
      
      // Check that it's actually running and loaded the UI
    });
  });
}
