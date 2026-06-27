import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../../core/theme.dart';
import '../../core/api_service.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/neo_card.dart';
import '../../widgets/neo_button.dart';
import '../../widgets/neo_input.dart';

class VerifyOtpScreen extends StatefulWidget {
  const VerifyOtpScreen({super.key});

  @override
  State<VerifyOtpScreen> createState() => _VerifyOtpScreenState();
}

class _VerifyOtpScreenState extends State<VerifyOtpScreen> {
  final _otpCtrl = TextEditingController();
  String _error = '';
  String _successMsg = '';
  bool _loading = false;
  String? _userId;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _userId ??= ModalRoute.of(context)?.settings.arguments as String?;
  }

  Future<void> _handleSubmit() async {
    if (_userId == null) {
      setState(() => _error = 'User ID missing. Please login again.');
      return;
    }
    setState(() { _loading = true; _error = ''; _successMsg = ''; });

    try {
      await context.read<AuthProvider>().verifyOTP(_userId!, _otpCtrl.text);
      if (!mounted) return;
      Navigator.pushReplacementNamed(context, '/dashboard');
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      setState(() => _error = 'Network error. Please try again.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _handleResend() async {
    if (_userId == null) return;
    setState(() { _loading = true; _error = ''; _successMsg = ''; });

    try {
      await context.read<AuthProvider>().resendOTP(_userId!);
      setState(() => _successMsg = 'A new OTP has been sent to your email.');
    } on ApiException catch (e) {
      setState(() => _error = e.message);
    } catch (_) {
      setState(() => _error = 'Network error. Please try again.');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  void dispose() {
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
              top: MediaQuery.of(context).size.height * 0.25,
              left: 20,
              child: Container(
                width: 80,
                height: 30,
                decoration: BoxDecoration(
                  color: IrisColors.sunny,
                  border: Border.all(color: IrisColors.ink, width: 3),
                ),
              ),
            ),
            Positioned(
              bottom: MediaQuery.of(context).size.height * 0.25,
              right: 20,
              child: Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: IrisColors.irisPurple,
                  shape: BoxShape.circle,
                  border: Border.all(color: IrisColors.ink, width: 3),
                ),
              ),
            ),
            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: NeoCard(
                  topBorderColor: IrisColors.mint,
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: IrisColors.mint,
                          border: Border.all(color: IrisColors.ink, width: 3),
                          boxShadow: IrisShadows.small(),
                        ),
                        child: const Icon(Icons.shield_outlined, size: 32, color: IrisColors.ink),
                      ),
                      const SizedBox(height: 16),
                      Text('Verify Email',
                          style: GoogleFonts.spaceGrotesk(
                              fontSize: 28, fontWeight: FontWeight.w900, color: IrisColors.ink)),
                      const SizedBox(height: 4),
                      Text('Enter the 6-digit code sent to your email',
                          textAlign: TextAlign.center,
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
                        ),
                      if (_successMsg.isNotEmpty)
                        Container(
                          width: double.infinity,
                          margin: const EdgeInsets.only(bottom: 16),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: IrisColors.mint.withValues(alpha: 0.2),
                            border: Border.all(color: IrisColors.mint, width: 3),
                            borderRadius: IrisRadius.small,
                          ),
                          child: Text(_successMsg,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.spaceGrotesk(
                                  fontWeight: FontWeight.w700, fontSize: 13, color: IrisColors.ink)),
                        ),
                      NeoInput(
                        controller: _otpCtrl,
                        label: 'Code',
                        placeholder: '000000',
                        maxLength: 6,
                        keyboardType: TextInputType.number,
                        textAlign: TextAlign.center,
                        fontSize: 28,
                        letterSpacing: 12,
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: NeoButton(
                          label: 'Verify',
                          icon: Icons.arrow_forward,
                          isLoading: _loading,
                          onPressed: _loading ? null : _handleSubmit,
                        ),
                      ),
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.only(top: 20),
                        decoration: BoxDecoration(
                          border: Border(
                            top: BorderSide(color: IrisColors.ink.withValues(alpha: 0.1), width: 2),
                          ),
                        ),
                        child: GestureDetector(
                          onTap: _loading ? null : _handleResend,
                          child: Text(
                            "Didn't receive the email? Resend OTP",
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 13,
                              fontWeight: FontWeight.w700,
                              color: IrisColors.irisPurple,
                              decoration: TextDecoration.underline,
                              decorationThickness: 2,
                            ),
                          ),
                        ),
                      ),
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
