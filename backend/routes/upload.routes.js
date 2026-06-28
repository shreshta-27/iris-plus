import { Router } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import fs from 'fs';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // temporary storage

router.post('/pdf', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const dataBuffer = fs.readFileSync(req.file.path);
    const data = await pdfParse(dataBuffer);

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    return res.json({
      text: data.text,
      pages: data.numpages,
      info: data.info,
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

router.post('/document', authenticate, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No document file uploaded' });
    }

    const mimeType = req.file.mimetype;
    let extractedText = '';

    if (mimeType === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf')) {
      try {
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        extractedText = data.text || '';
      } catch (pdfErr) {
        console.error("PDF Parse Error:", pdfErr);
        extractedText = "Error: Could not extract text from PDF. It might be a scanned image or protected.";
      }
    } else if (mimeType.startsWith('image/') || req.file.originalname.match(/\.(jpg|jpeg|png|gif|bmp)$/i)) {
      try {
        const { createWorker } = Tesseract;
        const worker = await createWorker('eng');
        const imageBuffer = fs.readFileSync(req.file.path);
        const { data: { text } } = await worker.recognize(imageBuffer);
        await worker.terminate();
        extractedText = text || '';
      } catch (ocrErr) {
        console.error("OCR Error:", ocrErr);
        extractedText = "Error: Could not extract text from the image.";
      }
    } else {
      // Treat as plain text
      try {
        extractedText = fs.readFileSync(req.file.path, 'utf-8');
      } catch (txtErr) {
        extractedText = "Error: Could not read text file.";
      }
    }

    // Clean up temp file
    if (req.file && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkErr) {
        console.error("Temp file cleanup error:", unlinkErr);
      }
    }

    return res.json({ text: extractedText });
  } catch (err) {
    fs.writeFileSync('upload_error_log.txt', String(err.stack || err) + '\n\n');
    console.error("Upload Error:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

export default router;
