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
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    } else if (mimeType.startsWith('image/')) {
      const { createWorker } = Tesseract;
      const worker = await createWorker('eng');
      const { data: { text } } = await worker.recognize(req.file.path);
      await worker.terminate();
      extractedText = text;
    } else {
      // Treat as plain text
      extractedText = fs.readFileSync(req.file.path, 'utf-8');
    }

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    return res.json({ text: extractedText });
  } catch (err) {
    console.error("Upload Error:", err);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    next(err);
  }
});

export default router;
