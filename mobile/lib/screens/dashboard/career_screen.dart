import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/career_provider.dart';
import '../../widgets/career/resume_upload.dart';
import '../../widgets/career/career_path.dart';
import '../../widgets/neo_card.dart';

class CareerScreen extends StatelessWidget {
  const CareerScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<CareerProvider>(
      builder: (context, career, child) {
        if (career.error != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  career.error!,
                  style: GoogleFonts.spaceGrotesk(
                    fontWeight: FontWeight.w700,
                    color: IrisColors.white,
                  ),
                ),
                backgroundColor: IrisColors.coral,
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(20),
                shape: RoundedRectangleBorder(
                  borderRadius: IrisRadius.medium,
                  side: const BorderSide(color: IrisColors.ink, width: 3),
                ),
                action: SnackBarAction(
                  label: 'Dismiss',
                  textColor: IrisColors.ink,
                  onPressed: () => career.clearError(),
                ),
              ),
            );
            career.clearError();
          });
        }

        if (career.paths != null && career.paths!.isNotEmpty) {
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'Career Paths',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 24,
                            fontWeight: FontWeight.w900,
                            color: IrisColors.ink,
                          ),
                        ).animate().fadeIn().slideX(begin: -0.1),
                        IconButton(
                          onPressed: () => career.reset(),
                          icon: const Icon(Icons.refresh, color: IrisColors.ink),
                          tooltip: 'New Analysis',
                        ).animate().fadeIn().scaleXY(begin: 0.8),
                      ],
                    ),
                    if (career.routing != null || career.cost != null) ...[
                      const SizedBox(height: 12),
                      NeoCard(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        child: Row(
                          children: [
                            if (career.routing != null) ...[
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: IrisColors.irisPurple,
                                  borderRadius: IrisRadius.full,
                                  border: Border.all(color: IrisColors.ink, width: 2),
                                ),
                                child: Text(
                                  career.routing!['model']?.toString().split('/').last ?? 'AI',
                                  style: GoogleFonts.spaceGrotesk(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: IrisColors.white,
                                    letterSpacing: 1,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                decoration: BoxDecoration(
                                  color: IrisColors.mint,
                                  borderRadius: IrisRadius.full,
                                  border: Border.all(color: IrisColors.ink, width: 2),
                                ),
                                child: Text(
                                  (career.routing!['tier']?.toString() ?? 'complex').toUpperCase(),
                                  style: GoogleFonts.spaceGrotesk(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w900,
                                    color: IrisColors.ink,
                                    letterSpacing: 1,
                                  ),
                                ),
                              ),
                              if (career.routing!['webSearchUsed'] == true) ...[
                                const SizedBox(width: 8),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: IrisColors.sky,
                                    borderRadius: IrisRadius.full,
                                    border: Border.all(color: IrisColors.ink, width: 2),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(Icons.public, size: 12, color: IrisColors.ink),
                                      const SizedBox(width: 4),
                                      Text(
                                        'WEB',
                                        style: GoogleFonts.spaceGrotesk(
                                          fontSize: 10,
                                          fontWeight: FontWeight.w900,
                                          color: IrisColors.ink,
                                          letterSpacing: 1,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ],
                            ],
                            const Spacer(),
                            if (career.cost != null)
                              Text(
                                '\$${(career.cost!['thisCall'] ?? 0).toStringAsFixed(4)}',
                                style: GoogleFonts.spaceGrotesk(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  color: IrisColors.ink,
                                ),
                              ),
                          ],
                        ),
                      ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                    ],
                  ],
                ),
              ),
              Expanded(
                child: CareerPath(report: career.paths!).animate().fadeIn().slideY(begin: 0.05),
              ),
            ],
          );
        }

        return ResumeUpload(
          loading: career.isLoading,
          onAnalyze: ({required targetRole, required currentSkills}) {
            final auth = context.read<AuthProvider>();
            career.analyze(
              targetRole: targetRole,
              currentSkills: currentSkills,
              sessionId: auth.userId,
            );
          },
        ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.05);
      },
    );
  }
}

