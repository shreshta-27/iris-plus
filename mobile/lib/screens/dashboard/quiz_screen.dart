import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/quiz_provider.dart';
import '../../widgets/quiz/quiz_upload.dart';
import '../../widgets/quiz/quiz_card.dart';
import '../../widgets/quiz/quiz_results.dart';

class QuizScreen extends StatelessWidget {
  const QuizScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<QuizProvider>(
      builder: (context, quiz, child) {
        if (quiz.error != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  quiz.error!,
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
                  onPressed: () => quiz.clearError(),
                ),
              ),
            );
            quiz.clearError();
          });
        }

        if (quiz.results != null) {
          return SingleChildScrollView(
            child: QuizResults(
              results: quiz.results!,
              onRetry: () => quiz.reset(),
            ),
          );
        }

        if (quiz.questions != null) {
          return SingleChildScrollView(
            child: QuizCard(
              questions: quiz.questions!,
              onSubmit: (answers) => quiz.submitQuiz(answers),
              loading: quiz.isLoading,
            ),
          );
        }

        return QuizUpload(
          loading: quiz.isLoading,
          onGenerate: ({required topic, required noteContent, required difficulty, required numQuestions}) {
            final auth = context.read<AuthProvider>();
            quiz.generateQuiz(
              sessionId: auth.userId,
              topic: topic,
              noteContent: noteContent,
              difficulty: difficulty,
              numQuestions: numQuestions,
            );
          },
        );
      },
    );
  }
}
