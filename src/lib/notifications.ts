import { canSendEmail, sendNotificationEmail } from "@/lib/mailer";
import { canSendSms, sendNotificationSms } from "@/lib/sms";
import { canSendTelegram, sendTelegramMessage } from "@/lib/telegram";

export type NotificationResult = {
  status: "SENT" | "FAILED" | "SKIPPED";
  delivered: boolean;
  channels: string[];
  error: string | null;
};

function toErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown notification error";
}

export async function notifyBooking(payload: {
  id: string;
  name: string;
  phone: string;
  date: string;
  slot: string;
}) {
  const channels: string[] = [];
  const errors: string[] = [];

  const emailPayload = {
    subject: `New Volunteer Booking - ${payload.name}`,
    text: `A new volunteer booking was submitted.\n\nBooking ID: ${payload.id}\nName: ${payload.name}\nPhone: ${payload.phone}\nDate: ${payload.date}\nSlot: ${payload.slot}`,
    html: `<h2>New Volunteer Booking</h2><p><strong>Booking ID:</strong> ${payload.id}</p><p><strong>Name:</strong> ${payload.name}</p><p><strong>Phone:</strong> ${payload.phone}</p><p><strong>Date:</strong> ${payload.date}</p><p><strong>Slot:</strong> ${payload.slot}</p>`,
  };

  const plain = `New Volunteer Booking\nBooking ID: ${payload.id}\nName: ${payload.name}\nPhone: ${payload.phone}\nDate: ${payload.date}\nSlot: ${payload.slot}`;

  if (canSendEmail()) {
    try {
      await sendNotificationEmail(emailPayload);
      channels.push("email");
    } catch (error) {
      errors.push(`email: ${toErrorMessage(error)}`);
    }
  }

  if (canSendSms()) {
    try {
      await sendNotificationSms(plain);
      channels.push("sms");
    } catch (error) {
      errors.push(`sms: ${toErrorMessage(error)}`);
    }
  }

  if (canSendTelegram()) {
    try {
      await sendTelegramMessage(plain);
      channels.push("telegram");
    } catch (error) {
      errors.push(`telegram: ${toErrorMessage(error)}`);
    }
  }

  if (channels.length > 0) {
    return {
      status: "SENT",
      delivered: true,
      channels,
      error: errors.length ? errors.join(" | ") : null,
    } as NotificationResult;
  }

  if (errors.length > 0) {
    return {
      status: "FAILED",
      delivered: false,
      channels,
      error: errors.join(" | "),
    } as NotificationResult;
  }

  return {
    status: "SKIPPED",
    delivered: false,
    channels,
    error: "No notification channel configured",
  } as NotificationResult;
}

export async function notifyEnquiry(payload: {
  id: string;
  name: string;
  message: string;
}) {
  const channels: string[] = [];
  const errors: string[] = [];

  const emailPayload = {
    subject: `New Website Feedback - ${payload.name}`,
    text: `New feedback received.\n\nEnquiry ID: ${payload.id}\nName: ${payload.name}\nFeedback:\n${payload.message}`,
    html: `<h2>New Website Feedback</h2><p><strong>Enquiry ID:</strong> ${payload.id}</p><p><strong>Name:</strong> ${payload.name}</p><p><strong>Feedback:</strong></p><p>${payload.message.replace(/\n/g, "<br/>")}</p>`,
  };

  const plain = `New Enquiry\nEnquiry ID: ${payload.id}\nName: ${payload.name}\nMessage: ${payload.message}`;

  if (canSendEmail()) {
    try {
      await sendNotificationEmail(emailPayload);
      channels.push("email");
    } catch (error) {
      errors.push(`email: ${toErrorMessage(error)}`);
    }
  }

  if (canSendSms()) {
    try {
      await sendNotificationSms(plain);
      channels.push("sms");
    } catch (error) {
      errors.push(`sms: ${toErrorMessage(error)}`);
    }
  }

  if (canSendTelegram()) {
    try {
      await sendTelegramMessage(plain);
      channels.push("telegram");
    } catch (error) {
      errors.push(`telegram: ${toErrorMessage(error)}`);
    }
  }

  if (channels.length > 0) {
    return {
      status: "SENT",
      delivered: true,
      channels,
      error: errors.length ? errors.join(" | ") : null,
    } as NotificationResult;
  }

  if (errors.length > 0) {
    return {
      status: "FAILED",
      delivered: false,
      channels,
      error: errors.join(" | "),
    } as NotificationResult;
  }

  return {
    status: "SKIPPED",
    delivered: false,
    channels,
    error: "No notification channel configured",
  } as NotificationResult;
}
