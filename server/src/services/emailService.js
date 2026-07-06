import nodemailer from 'nodemailer';
import AppError from '../utils/AppError.js';

const transporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});

export async function sendOtp(email, name, otp) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    if (process.env.NODE_ENV !== 'production') return console.log(`[DEV OTP] ${email}: ${otp}`);
    throw new AppError('Email service is not configured', 503);
  }
  await transporter().sendMail({
    from: `The Gifter <${process.env.GMAIL_USER}>`, to: email, subject: 'Verify your The Gifter account',
    text: `Hello ${name}, your verification code is ${otp}. It expires in 10 minutes.`,
    html: `<div style="font-family:Arial;max-width:520px;margin:auto;padding:30px"><h2 style="color:#a96248">The Gifter</h2><p>Hello ${name},</p><p>Your verification code is:</p><p style="font-size:30px;letter-spacing:8px;font-weight:bold">${otp}</p><p>This code expires in 10 minutes.</p></div>`
  });
}
