import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyEnquiry } from "@/lib/notifications";
import { feedbackSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = feedbackSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid enquiry payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, feedback, language } = parsed.data;

    const createdEnquiry = await prisma.enquiry.create({
      data: {
        name,
        message: feedback,
        language,
        category: "feedback",
      },
    });

    const notification = await notifyEnquiry({
      id: createdEnquiry.id,
      name,
      message: feedback,
    });

    await prisma.enquiry.update({
      where: { id: createdEnquiry.id },
      data: {
        notificationStatus: notification.status,
        notificationChannels: notification.channels,
        notificationError: notification.error,
        notificationLastTriedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      enquiryId: createdEnquiry.id,
      notificationDelivered: notification.delivered,
      notificationStatus: notification.status,
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json({ ok: false, message: "Unable to submit feedback right now." }, { status: 500 });
  }
}
