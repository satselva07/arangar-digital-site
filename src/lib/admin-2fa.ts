import { authenticator } from "otplib";
import { prisma } from "@/lib/prisma";
import { canSendEmail, sendNotificationEmail } from "@/lib/mailer";

authenticator.options = {
  step: 30,
  window: [1, 1],
};

const OTP_TTL_MINUTES = Number(process.env.ADMIN_OTP_TTL_MINUTES ?? 10);
const OTP_DIGITS = 6;

export function isAdmin2faRequired() {
  return process.env.ADMIN_2FA_REQUIRED === "true";
}

export function hasTotpConfigured() {
  return Boolean(process.env.ADMIN_TOTP_SECRET);
}

async function hashCode(code: string) {
  const encoded = new TextEncoder().encode(code);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generateNumericOtp(length: number) {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
}

export async function issueAdminEmailOtp() {
  if (!canSendEmail()) {
    throw new Error("Email service is not configured.");
  }

  const otp = generateNumericOtp(OTP_DIGITS);
  const codeHash = await hashCode(otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000);

  await prisma.adminOtpCode.create({
    data: {
      codeHash,
      expiresAt,
    },
  });

  const toAddress = process.env.ADMIN_EMAIL ?? process.env.NOTIFY_EMAIL;
  if (!toAddress) {
    throw new Error("ADMIN_EMAIL or NOTIFY_EMAIL must be configured.");
  }

  await sendNotificationEmail({
    subject: "Arangar Admin OTP",
    text: `Your admin OTP is ${otp}. It expires in ${OTP_TTL_MINUTES} minutes.`,
    html: `<p>Your admin OTP is <strong>${otp}</strong>.</p><p>It expires in ${OTP_TTL_MINUTES} minutes.</p>`,
  });
}

async function verifyEmailOtp(code: string) {
  const now = new Date();
  const activeChallenge = await prisma.adminOtpCode.findFirst({
    where: {
      usedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!activeChallenge) {
    return false;
  }

  const matches = activeChallenge.codeHash === (await hashCode(code));
  if (!matches) {
    await prisma.adminOtpCode.update({
      where: { id: activeChallenge.id },
      data: { attempts: { increment: 1 } },
    });
    return false;
  }

  await prisma.adminOtpCode.update({
    where: { id: activeChallenge.id },
    data: { usedAt: now },
  });

  return true;
}

export async function verifyAdminOtp(code: string) {
  const normalizedCode = code.trim();
  if (!normalizedCode) {
    return false;
  }

  const totpSecret = process.env.ADMIN_TOTP_SECRET;
  if (totpSecret && authenticator.verify({ token: normalizedCode, secret: totpSecret })) {
    return true;
  }

  return verifyEmailOtp(normalizedCode);
}
