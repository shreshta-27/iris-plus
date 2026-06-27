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
      await tester.enterText(emailFinder, 'ganeshhanuman77@gamiul.com');
      await tester.pump();
      await tester.enterText(passwordFinder, '9082249120');
      await tester.pump();
      
      await tester.tap(loginButtonFinder.first);
      
      // Wait for the login request to finish and navigation to occur
      await tester.pumpAndSettle(const Duration(seconds: 5));
      
      // We should be on the dashboard or OTP screen.
      // Let's verify if we transitioned by checking if login button is gone or OTP/Dashboard is visible
      expect(loginButtonFinder, findsNothing);
    });
  });
}
