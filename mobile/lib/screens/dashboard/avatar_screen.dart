import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../widgets/neo_card.dart';

class AvatarScreen extends StatefulWidget {
  const AvatarScreen({super.key});

  @override
  State<AvatarScreen> createState() => _AvatarScreenState();
}

class _AvatarScreenState extends State<AvatarScreen> {
  bool _isListening = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: IrisColors.cream,
      body: SafeArea(
        child: Stack(
          children: [
            Center(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: NeoCard(
                  topBorderColor: IrisColors.irisPurple,
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'IRIS ✦ Voice Assistant',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: IrisColors.ink,
                        ),
                      ).animate().fadeIn().slideY(begin: -0.1),
                      const SizedBox(height: 8),
                      Text(
                        'Interactive 3D Avatar is currently running on the web version.',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 14,
                          color: IrisColors.ink.withValues(alpha: 0.6),
                          fontWeight: FontWeight.w500,
                        ),
                      ).animate().fadeIn(delay: 100.ms),
                      const SizedBox(height: 48),
                      
                      // Animated Voice Orb
                      GestureDetector(
                        onTap: () {
                          setState(() {
                            _isListening = !_isListening;
                          });
                        },
                        child: Container(
                          width: 150,
                          height: 150,
                          decoration: BoxDecoration(
                            color: _isListening ? IrisColors.mint : IrisColors.sky,
                            shape: BoxShape.circle,
                            border: Border.all(color: IrisColors.ink, width: 4),
                            boxShadow: [
                              BoxShadow(
                                color: IrisColors.ink,
                                offset: const Offset(4, 4),
                              )
                            ],
                          ),
                          child: Icon(
                            _isListening ? Icons.graphic_eq : Icons.mic,
                            size: 64,
                            color: IrisColors.ink,
                          ),
                        ).animate(
                          target: _isListening ? 1 : 0,
                          onPlay: (controller) => controller.repeat(reverse: true),
                        ).scaleXY(end: 1.1, duration: 800.ms, curve: Curves.easeInOut),
                      ),
                      
                      const SizedBox(height: 48),
                      Text(
                        _isListening ? 'Listening to you...' : 'Tap the microphone to speak',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: IrisColors.ink,
                        ),
                      ).animate().fadeIn(delay: 200.ms),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
