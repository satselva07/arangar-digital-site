import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const notifyPhone = process.env.NOTIFY_PHONE ?? "+919363616263";

const isSmsConfigured = Boolean(accountSid && authToken && fromNumber && notifyPhone);

export function canSendSms() {
  return isSmsConfigured;
}

export async function sendNotificationSms(message: string) {
  if (!isSmsConfigured) {
    throw new Error(
      "SMS service is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, and NOTIFY_PHONE."
    );
  }

  const client = twilio(accountSid, authToken);

  await client.messages.create({
    body: message,
    from: fromNumber,
    to: notifyPhone,
  });
}
