import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:iris_mobile/main.dart';

void main() {
  testWidgets('IrisPlusApp builds successfully and shows Landing Screen', (WidgetTester tester) async {
    await tester.pumpWidget(const IrisPlusApp());

    // Verify the app starts up without throwing exceptions
    // The splash/landing screen has "IRIS Plus" title
    expect(find.text('Login', skipOffstage: false), findsWidgets);
  });
}
