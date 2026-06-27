import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme.dart';

class TypingIndicator extends StatelessWidget {
  const TypingIndicator({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: IrisColors.mint,
              shape: BoxShape.circle,
              border: Border.all(color: IrisColors.ink, width: 3),
              boxShadow: IrisShadows.neo(x: 2, y: 2),
            ),
            child: const Center(
              child: Icon(
                Icons.auto_awesome,
                color: IrisColors.ink,
                size: 20,
              ),
            ),
          ),
          const SizedBox(width: 12),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: IrisColors.white,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(4),
                topRight: Radius.circular(24),
                bottomLeft: Radius.circular(24),
                bottomRight: Radius.circular(24),
              ),
              border: Border.all(color: IrisColors.ink, width: 4),
              boxShadow: IrisShadows.neo(color: IrisColors.ink),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'IRIS is thinking',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: IrisColors.ink,
                  ),
                ),
                const SizedBox(width: 8),
                Row(
                  children: [
                    _buildDot(0),
                    _buildDot(1),
                    _buildDot(2),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDot(int index) {
    return Container(
      width: 6,
      height: 6,
      margin: const EdgeInsets.symmetric(horizontal: 2),
      decoration: const BoxDecoration(
        color: IrisColors.ink,
        shape: BoxShape.circle,
      ),
    ).animate(onPlay: (controller) => controller.repeat())
     .slideY(
       begin: 0,
       end: -1,
       duration: 400.ms,
       delay: (index * 150).ms,
       curve: Curves.easeInOut,
     )
     .then()
     .slideY(
       begin: -1,
       end: 0,
       duration: 400.ms,
       curve: Curves.easeInOut,
     );
  }
}
