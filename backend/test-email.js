import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function main() {
  try {
    console.log('Sending email...');
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'shreshtajunjurusc@gmail.com', // destination email
      subject: 'Test Email from IRIS Backend',
      text: 'This is a test email to verify Nodemailer works.',
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main();
