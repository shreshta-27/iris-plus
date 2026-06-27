import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/neo_card.dart';
import '../../widgets/neo_button.dart';
import '../../widgets/neo_input.dart';
import '../../widgets/tag_sticker.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  String _error = '';
  bool _loading = false;

  Future<void> _handleSubmit() async {
    setState(() { _loading = true; _error = ''; });
    final auth = context.read<AuthProvider>();

    try {
      final data = await auth.register(
        _nameCtrl.text, _emailCtrl.text, _passwordCtrl.text);
      if (!mounted) return;
      if (data['userId'] != null) {
        Navigator.pushReplacementNamed(context, '/verify-otp',
            arguments: data['userId'].toString());
      } else {
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (e) {
      setState(() => _error = 'Network error. Please try again.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: IrisColors.cream,
      body: SafeArea(
        child: Stack(
          children: [
            Positioned(
              top: 60,
              right: 20,
              child: Container(
                width: 70,
                height: 70,
                decoration: BoxDecoration(
                  color: IrisColors.coral,
                  border: Border.all(color: IrisColors.ink, width: 3),
                ),
              ).animate(onPlay: (controller) => controller.repeat(reverse: true))
               .moveY(begin: 5, end: -5, duration: 1800.ms, curve: Curves.easeInOut),
            ),
            Positioned(
              bottom: 40,
              left: 20,
              child: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: IrisColors.sky,
                  border: Border.all(color: IrisColors.ink, width: 3),
                ),
              ).animate(onPlay: (controller) => controller.repeat(reverse: true))
               .moveY(begin: -5, end: 5, duration: 2200.ms, curve: Curves.easeInOut),
            ),
            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    NeoCard(
                      topBorderColor: IrisColors.sunny,
                      padding: const EdgeInsets.all(28),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          GestureDetector(
                            onTap: () => Navigator.pushReplacementNamed(context, '/'),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('IRIS ',
                                    style: GoogleFonts.spaceGrotesk(
                                        fontSize: 28, fontWeight: FontWeight.w900, color: IrisColors.ink)),
                                const Text('✦',
                                    style: TextStyle(fontSize: 28, color: IrisColors.irisPurple)),
                              ],
                            ),
                          ),
                          const SizedBox(height: 8),
                          Text('Create Account',
                              style: GoogleFonts.spaceGrotesk(
                                  fontSize: 28, fontWeight: FontWeight.w900, color: IrisColors.ink)),
                          const SizedBox(height: 4),
                          Text('Start learning smarter today',
                              style: GoogleFonts.spaceGrotesk(
                                  fontSize: 14, fontWeight: FontWeight.w500,
                                  color: IrisColors.ink.withValues(alpha: 0.6))),
                          const SizedBox(height: 24),
                          if (_error.isNotEmpty)
                            Container(
                              width: double.infinity,
                              margin: const EdgeInsets.only(bottom: 16),
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: IrisColors.coral.withValues(alpha: 0.2),
                                border: Border.all(color: IrisColors.coral, width: 3),
                                borderRadius: IrisRadius.small,
                              ),
                              child: Text(_error,
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.spaceGrotesk(
                                      fontWeight: FontWeight.w700, fontSize: 13, color: IrisColors.coral)),
                            ).animate().fadeIn().shake(),
                          NeoInput(
                            controller: _nameCtrl,
                            label: 'Full Name',
                            prefixIcon: Icons.person_outline,
                            placeholder: 'John Doe',
                          ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                          const SizedBox(height: 14),
                          NeoInput(
                            controller: _emailCtrl,
                            label: 'Email',
                            prefixIcon: Icons.email_outlined,
                            placeholder: 'student@university.edu',
                            keyboardType: TextInputType.emailAddress,
                          ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
                          const SizedBox(height: 14),
                          NeoInput(
                            controller: _passwordCtrl,
                            label: 'Password',
                            prefixIcon: Icons.lock_outline,
                            placeholder: '••••••••',
                            obscureText: true,
                          ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: NeoButton(
                              label: 'Sign Up',
                              icon: Icons.arrow_forward,
                              isLoading: _loading,
                              onPressed: _loading ? null : _handleSubmit,
                            ),
                          ).animate().fadeIn(delay: 500.ms).scale(begin: const Offset(0.9, 0.9)),
                          const SizedBox(height: 24),
                          Container(
                            padding: const EdgeInsets.only(top: 20),
                            decoration: BoxDecoration(
                              border: Border(
                                top: BorderSide(color: IrisColors.ink.withValues(alpha: 0.1), width: 2),
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Text('Already have an account? ',
                                    style: GoogleFonts.spaceGrotesk(
                                        fontSize: 13, fontWeight: FontWeight.w500,
                                        color: IrisColors.ink.withValues(alpha: 0.7))),
                                GestureDetector(
                                  onTap: () => Navigator.pushReplacementNamed(context, '/login'),
                                  child: Text('Sign in',
                                      style: GoogleFonts.spaceGrotesk(
                                          fontSize: 13, fontWeight: FontWeight.w700,
                                          color: IrisColors.irisPurple,
                                          decoration: TextDecoration.underline,
                                          decorationThickness: 2)),
                                ),
                              ],
                            ),
                          ).animate().fadeIn(delay: 600.ms),
                        ],
                      ),
                    ),
                    Positioned(
                      top: -20,
                      right: -16,
                      child: Transform.rotate(
                        angle: 0.2,
                        child: TagSticker(
                          label: 'Join IRIS! ✦',
                          backgroundColor: IrisColors.mint,
                          fontSize: 14,
                        ),
                      ).animate(onPlay: (controller) => controller.repeat(reverse: true))
                       .scaleXY(end: 1.05, duration: 1000.ms, curve: Curves.easeInOut),
                    ),
                  ],
                ),
              ),
            ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.05),
          ],
        ),
      ),
    );
  }
}
