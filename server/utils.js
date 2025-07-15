import "dotenv/config";
import twilio from "twilio";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

/**
 * Generates a random 6-digit access code.
 */
export function generateAccessCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSms(to, message) {
  // Mock gửi SMS: chỉ log ra console
  console.log(`[MOCK SMS] To ${to}: "${message}"`);
  return Promise.resolve();
}

/**
 * Send email using Nodemailer with Gmail SMTP.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to, subject, htmlOrText) => {
  await transporter.sendMail({
    from: `"Classroom" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: htmlOrText.includes("<") ? htmlOrText : undefined,
    text: !htmlOrText.includes("<") ? htmlOrText : undefined,
  });
};

/**
 * Generate a temporary password (e.g. for reset).
 */
export const genTempPassword = (len = 10) =>
  crypto.randomBytes(len).toString("base64").slice(0, len - 2) + "@1";