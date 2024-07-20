import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import { sendMailer } from './sendMail.js';
import { upload } from './middleware.file.js';
import deleteFileRecursively from './deleteFile.js';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send/mail', upload.single('file'), async function (req, res) {
  const { subject, content, text, from, to, username } = req.body;
  let absoluteFilePath = null;

  if (req.file) {
    const { originalname, filename, path: filePath } = req.file;
    absoluteFilePath = path.join(__dirname, filePath);

    // Vérifiez les permissions de lecture et d'écriture
    try {
      fs.accessSync(absoluteFilePath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (error) {
      return res.status(500).json({ message: 'Permission denied or file not found' });
    }
  }

  try {
    await sendMailer(req.file?.originalname, absoluteFilePath, subject, content, text, from, to, username);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    if (absoluteFilePath) {
      await deleteFileRecursively(absoluteFilePath);
    }
  }
});

app.get('/', function(req, res) {
  res.status(200).json({ message: 'Main Endpoints' });
});

app.listen(3000, function () {
  console.log('Server started on port', 3000);
});
