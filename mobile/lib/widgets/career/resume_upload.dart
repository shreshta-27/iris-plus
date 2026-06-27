import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme.dart';
import '../../../widgets/neo_card.dart';
import '../../../widgets/neo_button.dart';
import '../../../widgets/neo_input.dart';

class ResumeUpload extends StatefulWidget {
  final Function({required String targetRole, required String currentSkills}) onAnalyze;
  final bool loading;

  const ResumeUpload({
    super.key,
    required this.onAnalyze,
    required this.loading,
  });

  @override
  State<ResumeUpload> createState() => _ResumeUploadState();
}

class _ResumeUploadState extends State<ResumeUpload> {
  final _roleCtrl = TextEditingController();
  final _skillsCtrl = TextEditingController();

  void _handleSubmit() {
    if (_roleCtrl.text.trim().isEmpty && _skillsCtrl.text.trim().isEmpty) return;
    widget.onAnalyze(
      targetRole: _roleCtrl.text,
      currentSkills: _skillsCtrl.text,
    );
  }

  @override
  void dispose() {
    _roleCtrl.dispose();
    _skillsCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: NeoCard(
        topBorderColor: IrisColors.peach,
        topBorderWidth: 16,
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: IrisColors.peach,
                    shape: BoxShape.circle,
                    border: Border.all(color: IrisColors.ink, width: 3),
                    boxShadow: IrisShadows.small(),
                  ),
                  child: const Icon(Icons.rocket_launch_outlined, color: IrisColors.ink),
                ),
                const SizedBox(width: 16),
                Text(
                  'Path Setup',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: IrisColors.ink,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            NeoInput(
              controller: _roleCtrl,
              label: 'Dream Role',
              prefixIcon: Icons.work_outline,
              placeholder: 'e.g., Full Stack Developer, ML Engineer, Product Manager...',
            ),
            const SizedBox(height: 24),
            NeoInput(
              controller: _skillsCtrl,
              label: 'Current Skills',
              prefixIcon: Icons.code,
              placeholder: 'e.g., Python, React, SQL, basic ML, communication, teamwork...',
              maxLines: 5,
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: NeoButton(
                label: widget.loading ? 'Simulating Paths...' : 'Generate Career Plan',
                icon: widget.loading ? null : Icons.rocket_launch_outlined,
                isLoading: widget.loading,
                onPressed: widget.loading ? null : _handleSubmit,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
