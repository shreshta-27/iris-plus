import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/career_provider.dart';
import '../../widgets/career/resume_upload.dart';
import '../../widgets/career/career_path.dart';

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
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Career Paths',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                        color: IrisColors.ink,
                      ),
                    ),
                    IconButton(
                      onPressed: () => career.reset(),
                      icon: const Icon(Icons.refresh, color: IrisColors.ink),
                      tooltip: 'New Analysis',
                    ),
                  ],
                ),
              ),
              Expanded(
                child: CareerPath(report: career.paths!),
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
        );
      },
    );
  }
}
