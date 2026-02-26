import { NextResponse } from "next/server";
import { canSendEmail, sendNotificationEmail } from "@/lib/mailer";
import { canSendSms, sendNotificationSms } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      phone?: string;
      date?: string;
      slot?: string;
      language?: "en" | "ta";
    };

    const name = body.name?.trim() ?? "";
    const phone = body.phone?.trim() ?? "";
    const date = body.date?.trim() ?? "";
    const slot = body.slot?.trim() ?? "";

    if (!name || !phone || !date || !slot) {
      return NextResponse.json({ ok: false, message: "Missing required booking fields." }, { status: 400 });
    }

    const canEmail = canSendEmail();
    const canSms = canSendSms();

    if (!canEmail && !canSms) {
      return NextResponse.json(
        {
          ok: false,
          message: "No notification service is configured. Set SMTP and/or Twilio env vars.",
        },
        { status: 500 }
      );
    }

    const emailPayload = {
      subject: `New Volunteer Booking - ${name}`,
      text: `A new volunteer booking was submitted.\n\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nSlot: ${slot}`,
      html: `<h2>New Volunteer Booking</h2><p><strong>Name:</strong> ${name}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Date:</strong> ${date}</p><p><strong>Slot:</strong> ${slot}</p>`,
    };
    const smsBody = `New Volunteer Booking\nName: ${name}\nPhone: ${phone}\nDate: ${date}\nSlot: ${slot}`;

    let delivered = false;

    if (canEmail) {
      try {
        await sendNotificationEmail(emailPayload);
        delivered = true;
      } catch {
        
      }
    }

    if (canSms) {
      try {
        await sendNotificationSms(smsBody);
        delivered = true;
      } catch {
        
      }
    }

    if (!delivered) {
      return NextResponse.json({ ok: false, message: "Unable to send notification right now." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, message: "Unable to submit booking right now." }, { status: 500 });
  }
}
