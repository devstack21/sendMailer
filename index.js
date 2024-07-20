import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { sendMailer } from './sendMail.js';
import { upload } from './middleware.file.js';
import deleteFileRecursively from './deleteFile.js';

const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send/mail', upload.single('file'), async function (req, res) {
  const { subject, content, text, from, to, username } = req.body;

  if (!req.file) {
    // Handle missing file upload gracefully
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { originalname, filename, path: filePath } = req.file; // Extract file information

  try {
    await sendMailer(originalname, filePath, subject, content, text, from, to, username);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  } finally {
    await deleteFileRecursively(filePath); // Delete the uploaded file after sending
  }
})
app.get('/' , function(req , res){
    res.status(200).json({message : 'main Endpoints '})
})

app.listen(3000, function () {
  console.log('Server started on the', 3000);
});
