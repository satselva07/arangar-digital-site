import { NextResponse } from "next/server";
import { canSendEmail, sendNotificationEmail } from "@/lib/mailer";
import { canSendSms, sendNotificationSms } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      feedback?: string;
      language?: "en" | "ta";
    };

    const name = body.name?.trim() ?? "";
    const feedback = body.feedback?.trim() ?? "";

    if (!name || !feedback) {
      return NextResponse.json({ ok: false, message: "Missing required feedback fields." }, { status: 400 });
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
      subject: `New Website Feedback - ${name}`,
      text: `New feedback received.\n\nName: ${name}\nFeedback:\n${feedback}`,
      html: `<h2>New Website Feedback</h2><p><strong>Name:</strong> ${name}</p><p><strong>Feedback:</strong></p><p>${feedback.replace(/\n/g, "<br/>")}</p>`,
    };
    const smsBody = `New Feedback\nName: ${name}\nFeedback: ${feedback}`;

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
    return NextResponse.json({ ok: false, message: "Unable to submit feedback right now." }, { status: 500 });
  }
}
