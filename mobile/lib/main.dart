import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme.dart';

import 'providers/auth_provider.dart';
import 'providers/budget_provider.dart';
import 'providers/chat_provider.dart';
import 'providers/quiz_provider.dart';
import 'providers/career_provider.dart';
import 'providers/analytics_provider.dart';

import 'screens/landing_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/auth/verify_otp_screen.dart';
import 'screens/dashboard/dashboard_layout.dart';

void main() {
  runApp(const IrisPlusApp());
}

class IrisPlusApp extends StatelessWidget {
  const IrisPlusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => BudgetProvider()),
        ChangeNotifierProvider(create: (_) => ChatProvider()),
        ChangeNotifierProvider(create: (_) => QuizProvider()),
        ChangeNotifierProvider(create: (_) => CareerProvider()),
        ChangeNotifierProvider(create: (_) => AnalyticsProvider()),
      ],
      child: MaterialApp(
        title: 'IRIS Plus',
        theme: ThemeData(
          scaffoldBackgroundColor: IrisColors.cream,
          fontFamily: 'SpaceGrotesk',
          colorScheme: ColorScheme.fromSeed(
            seedColor: IrisColors.irisPurple,
            surface: IrisColors.cream,
          ),
          useMaterial3: true,
        ),
        debugShowCheckedModeBanner: false,
        initialRoute: '/',
        routes: {
          '/': (context) => const LandingScreen(),
          '/login': (context) => const LoginScreen(),
          '/register': (context) => const RegisterScreen(),
          '/verify-otp': (context) => const VerifyOtpScreen(),
          '/dashboard': (context) => const DashboardLayout(),
        },
      ),
    );
  }
}
