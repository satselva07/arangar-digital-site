import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyBooking } from "@/lib/notifications";
import { volunteerBookingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const parsed = volunteerBookingSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Invalid booking payload.",
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { name, phone, date, slot, language } = parsed.data;

    const createdBooking = await prisma.volunteerBooking.create({
      data: {
        name,
        phone,
        date: new Date(`${date}T00:00:00.000Z`),
        slot,
        language,
      },
    });

    const notification = await notifyBooking({
      id: createdBooking.id,
      name,
      phone,
      date,
      slot,
    });

    await prisma.volunteerBooking.update({
      where: { id: createdBooking.id },
      data: {
        notificationStatus: notification.status,
        notificationChannels: notification.channels,
        notificationError: notification.error,
        notificationLastTriedAt: new Date(),
      },
    });

    return NextResponse.json({
      ok: true,
      bookingId: createdBooking.id,
      notificationDelivered: notification.delivered,
      notificationStatus: notification.status,
    });
  } catch (error) {
    console.error("Volunteer booking API error:", error);
    return NextResponse.json({ ok: false, message: "Unable to submit booking right now." }, { status: 500 });
  }
}
