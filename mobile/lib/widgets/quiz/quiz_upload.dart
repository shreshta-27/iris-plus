import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:file_picker/file_picker.dart';
import 'package:provider/provider.dart';
import '../../../core/theme.dart';
import '../../../widgets/neo_card.dart';
import '../../../widgets/neo_button.dart';
import '../../../widgets/neo_input.dart';
import '../../../providers/quiz_provider.dart';

class QuizUpload extends StatefulWidget {
  final Function({
    required String topic,
    required String noteContent,
    required String difficulty,
    required int numQuestions,
  }) onGenerate;
  final bool loading;

  const QuizUpload({
    super.key,
    required this.onGenerate,
    required this.loading,
  });

  @override
  State<QuizUpload> createState() => _QuizUploadState();
}

class _QuizUploadState extends State<QuizUpload> {
  String _mode = 'topic'; // topic, notes, pdf
  final _topicCtrl = TextEditingController();
  final _notesCtrl = TextEditingController();
  String _difficulty = 'medium';
  int _numQuestions = 5;
  String _fileName = '';
  String _pdfContent = '';

  Future<void> _handlePdfUpload() async {
    final quiz = context.read<QuizProvider>();
    
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );

    if (result != null && result.files.single.path != null) {
      setState(() {
        _fileName = result.files.single.name;
      });
      
      final text = await quiz.uploadPdf(result.files.single.path!);
      if (!mounted) return;
      if (text != null) {
        setState(() {
          _pdfContent = text;
        });
      }
    }
  }

  void _handleSubmit() {
    if (_mode == 'topic' && _topicCtrl.text.trim().isEmpty) return;
    if ((_mode == 'notes' || _mode == 'pdf') && 
        (_mode == 'notes' ? _notesCtrl.text.trim().isEmpty : _pdfContent.isEmpty)) {
      return;
    }

    widget.onGenerate(
      topic: _mode == 'topic' ? _topicCtrl.text : (_fileName.isNotEmpty ? 'Notes from $_fileName' : ''),
      noteContent: _mode == 'notes' ? _notesCtrl.text : (_mode == 'pdf' ? _pdfContent : ''),
      difficulty: _difficulty,
      numQuestions: _numQuestions,
    );
  }

  @override
  void dispose() {
    _topicCtrl.dispose();
    _notesCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final quiz = context.watch<QuizProvider>();
    final isPdfLoading = quiz.isLoading && _fileName.isNotEmpty && _pdfContent.isEmpty;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: NeoCard(
        topBorderColor: IrisColors.sunny,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: IrisColors.sunny,
                    shape: BoxShape.circle,
                    border: Border.all(color: IrisColors.ink, width: 3),
                    boxShadow: IrisShadows.small(),
                  ),
                  child: const Icon(Icons.menu_book, color: IrisColors.ink),
                ),
                const SizedBox(width: 16),
                Text(
                  'Configure Quiz',
                  style: GoogleFonts.spaceGrotesk(
                    fontSize: 24,
                    fontWeight: FontWeight.w900,
                    color: IrisColors.ink,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildModeTab('topic', 'Enter Topic'),
                  const SizedBox(width: 8),
                  _buildModeTab('notes', 'Paste Notes'),
                  const SizedBox(width: 8),
                  _buildModeTab('pdf', 'Upload PDF'),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              _mode == 'topic' ? 'SUBJECT / TOPIC' : _mode == 'pdf' ? 'UPLOAD PDF DOCUMENT' : 'STUDY NOTES CONTENT',
              style: GoogleFonts.spaceGrotesk(
                fontSize: 12,
                fontWeight: FontWeight.w900,
                letterSpacing: 2,
                color: IrisColors.ink,
              ),
            ),
            const SizedBox(height: 12),
            if (_mode == 'topic')
              NeoInput(
                controller: _topicCtrl,
                placeholder: 'e.g., Photosynthesis, Data Structures, WW2...',
              )
            else if (_mode == 'notes')
              NeoInput(
                controller: _notesCtrl,
                placeholder: 'Paste your study notes here...',
                maxLines: 6,
              )
            else
              GestureDetector(
                onTap: isPdfLoading ? null : _handlePdfUpload,
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: IrisColors.cream,
                    borderRadius: IrisRadius.medium,
                    border: Border.all(color: IrisColors.ink, width: 3),
                    boxShadow: IrisShadows.small(),
                  ),
                  child: Column(
                    children: [
                      Icon(
                        isPdfLoading ? Icons.refresh : Icons.cloud_upload_outlined,
                        size: 40,
                        color: isPdfLoading ? IrisColors.irisPurple : IrisColors.ink.withValues(alpha: 0.4),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        isPdfLoading ? 'Extracting text...' : (_fileName.isNotEmpty ? _fileName : 'Tap to upload PDF'),
                        style: GoogleFonts.spaceGrotesk(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: IrisColors.ink,
                        ),
                      ),
                      if (_pdfContent.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8),
                          child: Text(
                            'TEXT EXTRACTED SUCCESSFULLY',
                            style: GoogleFonts.spaceGrotesk(
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: IrisColors.mint,
                              letterSpacing: 1,
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 24),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'DIFFICULTY',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2,
                        color: IrisColors.ink,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildDropdown(
                      value: _difficulty,
                      items: const [
                        DropdownMenuItem(value: 'easy', child: Text('🟢 Easy')),
                        DropdownMenuItem(value: 'medium', child: Text('🟡 Medium')),
                        DropdownMenuItem(value: 'hard', child: Text('🔴 Hard')),
                      ],
                      onChanged: (v) => setState(() => _difficulty = v as String),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'QUESTIONS',
                      style: GoogleFonts.spaceGrotesk(
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 2,
                        color: IrisColors.ink,
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildDropdown(
                      value: _numQuestions,
                      items: [3, 5, 7, 10].map((n) => DropdownMenuItem(value: n, child: Text('$n Questions'))).toList(),
                      onChanged: (v) => setState(() => _numQuestions = v as int),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: NeoButton(
                label: widget.loading ? 'Generating Quiz...' : 'Generate Quiz Now',
                icon: widget.loading ? null : Icons.flash_on,
                isLoading: widget.loading,
                onPressed: widget.loading || isPdfLoading ? null : _handleSubmit,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildModeTab(String modeValue, String label) {
    final isSelected = _mode == modeValue;
    return GestureDetector(
      onTap: () => setState(() => _mode = modeValue),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? IrisColors.ink : Colors.transparent,
          borderRadius: IrisRadius.full,
          border: Border.all(
            color: isSelected ? IrisColors.ink : Colors.transparent,
            width: 3,
          ),
          boxShadow: isSelected ? IrisShadows.neo(x: 4, y: 4, color: IrisColors.sunny) : [],
        ),
        child: Text(
          label.toUpperCase(),
          style: GoogleFonts.spaceGrotesk(
            fontWeight: FontWeight.w900,
            fontSize: 12,
            letterSpacing: 2,
            color: isSelected ? IrisColors.cream : IrisColors.ink.withValues(alpha: 0.6),
          ),
        ),
      ),
    );
  }

  Widget _buildDropdown({required dynamic value, required List<DropdownMenuItem<dynamic>> items, required Function(dynamic) onChanged}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: IrisColors.white,
        borderRadius: IrisRadius.medium,
        border: Border.all(color: IrisColors.ink, width: 4),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton(
          value: value,
          items: items,
          onChanged: onChanged,
          isExpanded: true,
          icon: Container(
            padding: const EdgeInsets.all(8),
            decoration: const BoxDecoration(
              border: Border(left: BorderSide(color: IrisColors.ink, width: 4)),
              color: IrisColors.cream,
            ),
            child: const Icon(Icons.keyboard_arrow_down, color: IrisColors.ink),
          ),
          style: GoogleFonts.spaceGrotesk(
            fontSize: 16,
            fontWeight: FontWeight.w700,
            color: IrisColors.ink,
          ),
        ),
      ),
    );
  }
}
