import { Router } from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
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

export default router;
