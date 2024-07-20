const PWD_GOOGLE_APP_ACCESS = 'imye soys svir vfba'
const PORT = 587
import nodeMailer from 'nodemailer'

export async function sendMailer(nameFile, pathFile, subject, content, text, from, to, username) {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: PORT,
    secure: false,
    auth: {
      user: from,
      pass: PWD_GOOGLE_APP_ACCESS
    }
  });

  const mailOptions = {
    from: `${username} <${from}>`,
    to: to,
    subject: subject,
    text: text,
    html: content,
    attachments: []
  };

  if (nameFile && pathFile) {
    mailOptions.attachments.push({
      filename: nameFile,
      path: pathFile,
      contentType: "application/pdf"
    });
  }

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error:', error);
    throw error; // Rejeter l'erreur pour que l'appelant puisse la gérer
  }
}

