import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class IrisColors {
  static const Color cream = Color(0xFFFFF8F0);
  static const Color ink = Color(0xFF1A1A2E);
  static const Color irisPurple = Color(0xFF7C3AED);
  static const Color coral = Color(0xFFFF6B6B);
  static const Color sunny = Color(0xFFFFD93D);
  static const Color mint = Color(0xFF6BCB77);
  static const Color sky = Color(0xFF4D96FF);
  static const Color peach = Color(0xFFFF9A76);
  static const Color white = Color(0xFFFFFFFF);
  static const Color brutalHover = Color(0xFFF2E8DC);
  static const Color iris300 = Color(0xFFC4B5FD);
  static const Color iris400 = Color(0xFFA78BFA);
  static const Color iris500 = Color(0xFF8B5CF6);
  static const Color iris600 = Color(0xFF7C3AED);
  static const Color iris700 = Color(0xFF6D28D9);
  static const Color cardBg = Color(0xFFFDF9F3);
}

class IrisShadows {
  static List<BoxShadow> neo({double x = 8, double y = 8, Color? color}) => [
    BoxShadow(
      offset: Offset(x, y),
      color: color ?? IrisColors.ink,
      blurRadius: 0,
      spreadRadius: 0,
    ),
  ];

  static List<BoxShadow> small({Color? color}) => neo(x: 4, y: 4, color: color);
  static List<BoxShadow> medium({Color? color}) => neo(x: 6, y: 6, color: color);
  static List<BoxShadow> large({Color? color}) => neo(x: 8, y: 8, color: color);
  static List<BoxShadow> extraLarge({Color? color}) => neo(x: 12, y: 12, color: color);
}

class IrisBorders {
  static const double thin = 2.0;
  static const double normal = 3.0;
  static const double thick = 4.0;
  static const double extraThick = 6.0;

  static Border all({double width = 4.0, Color? color}) =>
      Border.all(width: width, color: color ?? IrisColors.ink);
}

class IrisRadius {
  static const BorderRadius small = BorderRadius.all(Radius.circular(12));
  static const BorderRadius medium = BorderRadius.all(Radius.circular(16));
  static const BorderRadius large = BorderRadius.all(Radius.circular(24));
  static const BorderRadius extraLarge = BorderRadius.all(Radius.circular(32));
  static const BorderRadius full = BorderRadius.all(Radius.circular(100));
}

class IrisTheme {
  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: IrisColors.cream,
      colorScheme: ColorScheme.light(
        primary: IrisColors.irisPurple,
        secondary: IrisColors.coral,
        surface: IrisColors.cream,
        onPrimary: IrisColors.white,
        onSecondary: IrisColors.ink,
        onSurface: IrisColors.ink,
      ),
      textTheme: GoogleFonts.spaceGroteskTextTheme().apply(
        bodyColor: IrisColors.ink,
        displayColor: IrisColors.ink,
      ),
      fontFamily: GoogleFonts.spaceGrotesk().fontFamily,
      appBarTheme: const AppBarTheme(
        backgroundColor: IrisColors.cream,
        foregroundColor: IrisColors.ink,
        elevation: 0,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: IrisColors.irisPurple,
          foregroundColor: IrisColors.white,
          textStyle: GoogleFonts.spaceGrotesk(
            fontWeight: FontWeight.w700,
            fontSize: 16,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: IrisRadius.full,
            side: const BorderSide(color: IrisColors.ink, width: 4),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: IrisColors.white,
        border: OutlineInputBorder(
          borderRadius: IrisRadius.medium,
          borderSide: const BorderSide(color: IrisColors.ink, width: 4),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: IrisRadius.medium,
          borderSide: const BorderSide(color: IrisColors.ink, width: 4),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: IrisRadius.medium,
          borderSide: const BorderSide(color: IrisColors.irisPurple, width: 4),
        ),
        contentPadding: const EdgeInsets.all(16),
        hintStyle: GoogleFonts.spaceGrotesk(
          color: const Color(0xFF8C8C8C),
          fontWeight: FontWeight.w500,
        ),
        labelStyle: GoogleFonts.spaceGrotesk(
          color: IrisColors.ink,
          fontWeight: FontWeight.w700,
          fontSize: 12,
          letterSpacing: 2,
        ),
      ),
    );
  }
}
