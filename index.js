import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Import de fileURLToPath pour gérer __dirname
import fs from 'fs';
import { sendMailer } from './sendMail.js';
import { upload } from './middleware.file.js';
import deleteFileRecursively from './deleteFile.js';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url); // Définition de __filename
const __dirname = path.dirname(__filename); // Définition de __dirname

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send/mail', upload.single('file'), async function (req, res) {
  const { subject, content, text, from, to, username } = req.body;

  if (!req.file) {
    // Handle missing file upload gracefully
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { originalname, filename, path: filePath } = req.file; // Extract file information

  // Use path.join to create the file path
  const absoluteFilePath = path.join(__dirname, filePath);

  try {
    // Ensure the file exists at the given path
    if (!fs.existsSync(absoluteFilePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    await sendMailer(originalname, absoluteFilePath, subject, content, text, from, to, username);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    // Delete the uploaded file after sending
    await deleteFileRecursively(absoluteFilePath); 
  }
});

app.get('/', function(req, res) {
  res.status(200).json({ message: 'Main Endpoints' });
});

app.listen(3000, function () {
  console.log('Server started on port', 3000);
});
