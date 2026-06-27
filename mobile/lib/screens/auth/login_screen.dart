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

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailCtrl = TextEditingController();
  final _passwordCtrl = TextEditingController();
  final _otpCtrl = TextEditingController();
  String _mode = 'password';
  String? _userId;
  String _error = '';
  String _success = '';
  bool _loading = false;

  Future<void> _handleSubmit() async {
    setState(() { _loading = true; _error = ''; _success = ''; });
    final auth = context.read<AuthProvider>();

    try {
      if (_mode == 'password') {
        final data = await auth.login(_emailCtrl.text, _passwordCtrl.text);
        if (!mounted) return;
        if (data['userId'] != null && data['user'] == null) {
          Navigator.pushReplacementNamed(context, '/verify-otp',
              arguments: data['userId'].toString());
        } else {
          Navigator.pushReplacementNamed(context, '/dashboard');
        }
      } else if (_mode == 'otp_request') {
        final data = await auth.sendLoginOTP(_emailCtrl.text);
        _userId = data['userId']?.toString();
        setState(() {
          _success = 'OTP sent to your email. Please check your inbox.';
          _mode = 'otp_verify';
        });
      } else if (_mode == 'otp_verify') {
        await auth.verifyLoginOTP(_userId!, _otpCtrl.text);
        if (!mounted) return;
        Navigator.pushReplacementNamed(context, '/dashboard');
      }
    } on ApiException catch (e) {
      if (e.statusCode == 403 && e.data != null && e.data!['userId'] != null) {
        Navigator.pushReplacementNamed(context, '/verify-otp', arguments: e.data!['userId'].toString());
      } else {
        setState(() => _error = e.message);
      }
    } catch (e) {
      setState(() => _error = 'Network error. Please try again.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passwordCtrl.dispose();
    _otpCtrl.dispose();
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
              top: 40,
              left: 20,
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: IrisColors.mint,
                  shape: BoxShape.circle,
                  border: Border.all(color: IrisColors.ink, width: 3),
                ),
              ).animate(onPlay: (controller) => controller.repeat(reverse: true))
               .moveY(begin: -5, end: 5, duration: 2000.ms, curve: Curves.easeInOut),
            ),
            Positioned(
              bottom: 80,
              right: 20,
              child: Transform.rotate(
                angle: 0.2,
                child: Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    color: IrisColors.sunny,
                    border: Border.all(color: IrisColors.ink, width: 3),
                  ),
                ),
              ).animate(onPlay: (controller) => controller.repeat(reverse: true))
               .moveY(begin: 5, end: -5, duration: 1500.ms, curve: Curves.easeInOut),
            ),
            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: NeoCard(
                  topBorderColor: IrisColors.irisPurple,
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
                      Text('Welcome back',
                          style: GoogleFonts.spaceGrotesk(
                              fontSize: 28, fontWeight: FontWeight.w900, color: IrisColors.ink)),
                      const SizedBox(height: 4),
                      Text(
                        _mode == 'password'
                            ? 'Sign in to access your dashboard'
                            : _mode == 'otp_request'
                                ? 'Passwordless Login / Forgot Password'
                                : 'Enter OTP to Login',
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: IrisColors.ink.withValues(alpha: 0.6),
                        ),
                      ),
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
                      if (_success.isNotEmpty)
                        Container(
                          width: double.infinity,
                          margin: const EdgeInsets.only(bottom: 16),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: IrisColors.mint.withValues(alpha: 0.2),
                            border: Border.all(color: IrisColors.mint, width: 3),
                            borderRadius: IrisRadius.small,
                          ),
                          child: Text(_success,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.spaceGrotesk(
                                  fontWeight: FontWeight.w700, fontSize: 13, color: IrisColors.ink)),
                        ).animate().fadeIn(),
                      if (_mode == 'password' || _mode == 'otp_request') ...[
                        NeoInput(
                          controller: _emailCtrl,
                          label: 'Email',
                          prefixIcon: Icons.email_outlined,
                          placeholder: 'student@university.edu',
                          keyboardType: TextInputType.emailAddress,
                        ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.1),
                        const SizedBox(height: 16),
                      ],
                      if (_mode == 'password') ...[
                        NeoInput(
                          controller: _passwordCtrl,
                          label: 'Password',
                          prefixIcon: Icons.lock_outline,
                          placeholder: '••••••••',
                          obscureText: true,
                        ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.1),
                        const SizedBox(height: 8),
                        Align(
                          alignment: Alignment.centerLeft,
                          child: GestureDetector(
                            onTap: () => setState(() {
                              _mode = 'otp_request';
                              _error = '';
                              _success = '';
                            }),
                            child: Text(
                              'Forgot Password? Login with OTP',
                              style: GoogleFonts.spaceGrotesk(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: IrisColors.irisPurple,
                                decoration: TextDecoration.underline,
                                decorationThickness: 2,
                              ),
                            ),
                          ),
                        ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1),
                        const SizedBox(height: 16),
                      ],
                      if (_mode == 'otp_verify') ...[
                        NeoInput(
                          controller: _otpCtrl,
                          label: 'OTP Code',
                          prefixIcon: Icons.shield_outlined,
                          placeholder: '123456',
                          maxLength: 6,
                          keyboardType: TextInputType.number,
                          textAlign: TextAlign.center,
                          fontSize: 20,
                          letterSpacing: 12,
                        ).animate().fadeIn().slideY(begin: 0.1),
                        const SizedBox(height: 16),
                      ],
                      SizedBox(
                        width: double.infinity,
                        child: NeoButton(
                          label: _mode == 'password'
                              ? 'Sign In'
                              : _mode == 'otp_request'
                                  ? 'Send OTP'
                                  : 'Verify & Login',
                          icon: Icons.arrow_forward,
                          isLoading: _loading,
                          onPressed: _loading ? null : _handleSubmit,
                        ),
                      ).animate().fadeIn(delay: 500.ms).scale(begin: const Offset(0.9, 0.9)),
                      if (_mode != 'password') ...[
                        const SizedBox(height: 12),
                        GestureDetector(
                          onTap: () => setState(() {
                            _mode = 'password';
                            _error = '';
                            _success = '';
                          }),
                          child: Text(
                            'Back to Password Login',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: IrisColors.ink.withValues(alpha: 0.5),
                              decoration: TextDecoration.underline,
                              decorationThickness: 2,
                            ),
                          ),
                        ).animate().fadeIn().slideY(begin: 0.1),
                      ],
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.only(top: 20),
                        decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(color: IrisColors.ink.withValues(alpha: 0.1), width: 2),
                          ),
                        ),
                        child: Wrap(
                          alignment: WrapAlignment.center,
                          children: [
                            Text("Don't have an account? ",
                                style: GoogleFonts.spaceGrotesk(
                                    fontSize: 13, fontWeight: FontWeight.w500,
                                    color: IrisColors.ink.withValues(alpha: 0.7))),
                            GestureDetector(
                              onTap: () => Navigator.pushReplacementNamed(context, '/register'),
                              child: Text('Register here',
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
              ),
            ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.05),
          ],
        ),
      ),
    );
  }
}
