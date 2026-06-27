import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../core/theme.dart';
import '../widgets/neo_button.dart';
import '../widgets/neo_card.dart';

class LandingScreen extends StatelessWidget {
  const LandingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: IrisColors.cream,
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          'IRIS ',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: IrisColors.ink,
                          ),
                        ),
                        const Text(
                          '✦',
                          style: TextStyle(
                            fontSize: 24,
                            color: IrisColors.irisPurple,
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: [
                        TextButton(
                          onPressed: () => Navigator.pushNamed(context, '/login'),
                          child: Text(
                            'Login',
                            style: GoogleFonts.spaceGrotesk(
                              fontWeight: FontWeight.w900,
                              color: IrisColors.ink,
                              fontSize: 16,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        NeoButton(
                          label: 'Get Started',
                          onPressed: () => Navigator.pushNamed(context, '/register'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              // Hero Section
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
                child: Column(
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Text(
                          'Learn Anything.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 48,
                            fontWeight: FontWeight.w900,
                            color: IrisColors.ink,
                            height: 1.1,
                          ),
                        ),
                        Positioned(
                          right: -20,
                          top: -20,
                          child: Transform.rotate(
                            angle: 0.2,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              decoration: BoxDecoration(
                                color: IrisColors.mint,
                                border: Border.all(color: IrisColors.ink, width: 2),
                                borderRadius: IrisRadius.small,
                              ),
                              child: Text(
                                'FAST',
                                style: GoogleFonts.spaceGrotesk(
                                  fontWeight: FontWeight.w900,
                                  fontSize: 12,
                                  color: IrisColors.ink,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Smarter.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 48,
                        fontWeight: FontWeight.w900,
                        color: IrisColors.irisPurple,
                        height: 1.1,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'The AI-powered platform that adapts to your learning style. Chat, generate quizzes, and plan your career with the smartest models available.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 18,
                        fontWeight: FontWeight.w500,
                        color: IrisColors.ink.withValues(alpha: 0.7),
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 48),
                    SizedBox(
                      width: double.infinity,
                      child: NeoButton(
                        label: 'Start Learning Now',
                        icon: Icons.rocket_launch,
                        onPressed: () => Navigator.pushNamed(context, '/register'),
                      ),
                    ),
                  ],
                ),
              ),

              // Features Grid
              Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'SUPERPOWERS',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 14,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2,
                        color: IrisColors.ink,
                      ),
                    ),
                    const SizedBox(height: 24),
                    _buildFeatureCard(
                      title: 'Smart AI Routing',
                      desc: 'Automatically connects you to the best AI model (Claude, GPT, Kimi) based on your query complexity.',
                      icon: Icons.route,
                      color: IrisColors.sunny,
                    ),
                    const SizedBox(height: 24),
                    _buildFeatureCard(
                      title: 'Quiz Forge',
                      desc: 'Generate custom quizzes from your notes or PDF uploads instantly to test your knowledge.',
                      icon: Icons.quiz,
                      color: IrisColors.sky,
                    ),
                    const SizedBox(height: 24),
                    _buildFeatureCard(
                      title: 'Career Simulator',
                      desc: 'Map out your career path based on your current skills and target role with AI-generated actionable steps.',
                      icon: Icons.work,
                      color: IrisColors.peach,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 48),
              
              // Footer
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                decoration: const BoxDecoration(
                  color: IrisColors.ink,
                  border: Border(top: BorderSide(color: IrisColors.ink, width: 4)),
                ),
                child: Column(
                  children: [
                    Text(
                      'Built for the future of education.',
                      style: GoogleFonts.spaceGrotesk(
                        color: IrisColors.white,
                        fontSize: 16,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '© 2026 IRIS Plus',
                      style: GoogleFonts.spaceGrotesk(
                        color: IrisColors.white.withValues(alpha: 0.5),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureCard({
    required String title,
    required String desc,
    required IconData icon,
    required Color color,
  }) {
    return NeoCard(
      leftBorderColor: color,
      leftBorderWidth: 16,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color,
              shape: BoxShape.circle,
              border: Border.all(color: IrisColors.ink, width: 3),
              boxShadow: IrisShadows.small(),
            ),
            child: Icon(icon, color: IrisColors.ink),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 20,
              fontWeight: FontWeight.w900,
              color: IrisColors.ink,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            desc,
            style: GoogleFonts.spaceGrotesk(
              fontSize: 14,
              fontWeight: FontWeight.w500,
              color: IrisColors.ink.withValues(alpha: 0.7),
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}
