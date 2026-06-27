import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme.dart';
import '../../../widgets/neo_card.dart';
import '../../../widgets/neo_button.dart';

class QuizCard extends StatefulWidget {
  final List<Map<String, dynamic>> questions;
  final Function(Map<String, int>) onSubmit;
  final bool loading;

  const QuizCard({
    super.key,
    required this.questions,
    required this.onSubmit,
    required this.loading,
  });

  @override
  State<QuizCard> createState() => _QuizCardState();
}

class _QuizCardState extends State<QuizCard> {
  final Map<String, int> _answers = {};

  void _handleSelect(String questionId, int optionIndex) {
    setState(() {
      _answers[questionId] = optionIndex;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isComplete = widget.questions.length == _answers.length;
    final progress = widget.questions.isEmpty ? 0.0 : (_answers.length / widget.questions.length);

    return Column(
      children: [
        // Sticky Header / Progress
        Container(
          padding: const EdgeInsets.all(20),
          margin: const EdgeInsets.only(bottom: 32),
          decoration: BoxDecoration(
            color: IrisColors.cream.withValues(alpha: 0.9),
            border: const Border(bottom: BorderSide(color: IrisColors.ink, width: 4)),
            boxShadow: [
              BoxShadow(
                color: IrisColors.ink,
                offset: const Offset(0, 6),
              )
            ],
            borderRadius: const BorderRadius.only(
              bottomLeft: Radius.circular(24),
              bottomRight: Radius.circular(24),
            ),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Quiz in Progress',
                style: GoogleFonts.spaceGrotesk(
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                  color: IrisColors.ink,
                ),
              ),
              Row(
                children: [
                  Text(
                    '${_answers.length} / ${widget.questions.length}',
                    style: GoogleFonts.spaceGrotesk(
                      fontSize: 18,
                      fontWeight: FontWeight.w900,
                      color: IrisColors.ink,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Container(
                    width: 100,
                    height: 16,
                    decoration: BoxDecoration(
                      color: IrisColors.white,
                      borderRadius: IrisRadius.full,
                      border: Border.all(color: IrisColors.ink, width: 3),
                      boxShadow: IrisShadows.small(),
                    ),
                    child: ClipRRect(
                      borderRadius: IrisRadius.full,
                      child: FractionallySizedBox(
                        alignment: Alignment.centerLeft,
                        widthFactor: progress,
                        child: Container(color: IrisColors.sunny),
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),

        // Questions
        ...widget.questions.asMap().entries.map((entry) {
          final index = entry.key;
          final question = entry.value;
          final selected = _answers[question['id']?.toString() ?? ''];

          return Padding(
            padding: const EdgeInsets.only(bottom: 32, left: 16, right: 16),
            child: Stack(
              clipBehavior: Clip.none,
              children: [
                NeoCard(
                  topBorderColor: IrisColors.irisPurple,
                  leftBorderColor: IrisColors.irisPurple,
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 16),
                      Text(
                        question['question']?.toString() ?? '',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: IrisColors.ink,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ...(question['options'] as List<dynamic>? ?? []).asMap().entries.map((optEntry) {
                        final i = optEntry.key;
                        final opt = optEntry.value.toString();
                        final isSelected = selected == i;

                        return GestureDetector(
                          onTap: () => _handleSelect(question['id'].toString(), i),
                          child: AnimatedContainer(
                            duration: const Duration(milliseconds: 200),
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.all(16),
                            transform: Matrix4.translationValues(
                              isSelected ? 4 : 0,
                              isSelected ? 4 : 0,
                              0,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected ? IrisColors.mint : IrisColors.cream,
                              borderRadius: IrisRadius.medium,
                              border: Border.all(color: IrisColors.ink, width: 4),
                              boxShadow: isSelected
                                  ? IrisShadows.neo(x: 2, y: 2)
                                  : IrisShadows.neo(x: 4, y: 4, color: IrisColors.ink.withValues(alpha: 0.3)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: isSelected ? IrisColors.white : IrisColors.ink,
                                    shape: BoxShape.circle,
                                    border: Border.all(color: IrisColors.ink, width: 3),
                                  ),
                                  child: Center(
                                    child: Text(
                                      String.fromCharCode(65 + i),
                                      style: GoogleFonts.spaceGrotesk(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w900,
                                        color: isSelected ? IrisColors.ink : IrisColors.white,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Text(
                                    opt,
                                    style: GoogleFonts.spaceGrotesk(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      color: IrisColors.ink,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        );
                      }),
                    ],
                  ),
                ),
                Positioned(
                  top: -20,
                  left: -20,
                  child: Transform.rotate(
                    angle: -0.2,
                    child: Container(
                      width: 56,
                      height: 56,
                      decoration: BoxDecoration(
                        color: IrisColors.irisPurple,
                        shape: BoxShape.circle,
                        border: Border.all(color: IrisColors.ink, width: 4),
                        boxShadow: IrisShadows.medium(),
                      ),
                      child: Center(
                        child: Text(
                          'Q${index + 1}',
                          style: GoogleFonts.spaceGrotesk(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: IrisColors.white,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          );
        }),

        // Submit Button
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 32),
          child: Column(
            children: [
              SizedBox(
                width: double.infinity,
                child: NeoButton(
                  label: widget.loading ? 'Grading Quiz...' : 'Submit Answers',
                  icon: widget.loading ? null : Icons.check_circle_outline,
                  isLoading: widget.loading,
                  onPressed: isComplete && !widget.loading ? () => widget.onSubmit(_answers) : null,
                  backgroundColor: IrisColors.irisPurple,
                ),
              ),
              if (!isComplete)
                Padding(
                  padding: const EdgeInsets.only(top: 24),
                  child: Text(
                    'Answer all questions to submit!',
                    style: GoogleFonts.caveat(
                      fontSize: 24,
                      fontWeight: FontWeight.w700,
                      color: IrisColors.coral,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }
}
