import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpFrom = process.env.SMTP_FROM ?? smtpUser;

const isMailerConfigured = Boolean(smtpHost && smtpUser && smtpPass && smtpFrom);

export function canSendEmail() {
  return isMailerConfigured;
}

export async function sendNotificationEmail({
  subject,
  text,
  html,
}: {
  subject: string;
  text: string;
  html: string;
}) {
  if (!isMailerConfigured) {
    throw new Error("Email service is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM.");
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const notifyEmail = process.env.NOTIFY_EMAIL ?? "reachsatselva@gmail.com";

  await transporter.sendMail({
    from: smtpFrom,
    to: notifyEmail,
    subject,
    text,
    html,
  });
}
