"use server";

import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifyBooking, notifyEnquiry } from "@/lib/notifications";
import { faqFormSchema, statusUpdateSchema } from "@/lib/validation";

async function ensureAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

export async function updateBookingStatus(formData: FormData) {
  await ensureAdmin();

  const bookingId = String(formData.get("bookingId") ?? "");
  const status = String(formData.get("status") ?? "");
  const parsed = statusUpdateSchema.safeParse({ status });

  if (!bookingId || !parsed.success) {
    return;
  }

  await prisma.volunteerBooking.update({
    where: { id: bookingId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin");
}

export async function updateEnquiryStatus(formData: FormData) {
  await ensureAdmin();

  const enquiryId = String(formData.get("enquiryId") ?? "");
  const status = String(formData.get("status") ?? "");
  const parsed = statusUpdateSchema.safeParse({ status });

  if (!enquiryId || !parsed.success) {
    return;
  }

  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: { status: parsed.data.status },
  });

  revalidatePath("/admin");
}

export async function retryBookingNotification(formData: FormData) {
  await ensureAdmin();

  const bookingId = String(formData.get("bookingId") ?? "");
  if (!bookingId) {
    return;
  }

  const booking = await prisma.volunteerBooking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return;
  }

  const notification = await notifyBooking({
    id: booking.id,
    name: booking.name,
    phone: booking.phone,
    date: booking.date.toISOString().slice(0, 10),
    slot: booking.slot,
  });

  await prisma.volunteerBooking.update({
    where: { id: booking.id },
    data: {
      notificationStatus: notification.status,
      notificationChannels: notification.channels,
      notificationError: notification.error,
      notificationLastTriedAt: new Date(),
    },
  });

  revalidatePath("/admin");
}

export async function retryEnquiryNotification(formData: FormData) {
  await ensureAdmin();

  const enquiryId = String(formData.get("enquiryId") ?? "");
  if (!enquiryId) {
    return;
  }

  const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId } });
  if (!enquiry) {
    return;
  }

  const notification = await notifyEnquiry({
    id: enquiry.id,
    name: enquiry.name,
    message: enquiry.message,
  });

  await prisma.enquiry.update({
    where: { id: enquiry.id },
    data: {
      notificationStatus: notification.status,
      notificationChannels: notification.channels,
      notificationError: notification.error,
      notificationLastTriedAt: new Date(),
    },
  });

  revalidatePath("/admin");
}

function parseTags(tags: string) {
  return tags
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12);
}

export async function createFaq(formData: FormData) {
  await ensureAdmin();

  const parsed = faqFormSchema.safeParse({
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    language: String(formData.get("language") ?? "en"),
    tags: String(formData.get("tags") ?? ""),
  });

  if (!parsed.success) {
    return;
  }

  await prisma.faq.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      language: parsed.data.language,
      tags: parseTags(parsed.data.tags),
    },
  });

  revalidatePath("/admin");
}

export async function updateFaq(formData: FormData) {
  await ensureAdmin();

  const faqId = String(formData.get("faqId") ?? "");
  const parsed = faqFormSchema.safeParse({
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    language: String(formData.get("language") ?? "en"),
    tags: String(formData.get("tags") ?? ""),
  });

  if (!faqId || !parsed.success) {
    return;
  }

  await prisma.faq.update({
    where: { id: faqId },
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      language: parsed.data.language,
      tags: parseTags(parsed.data.tags),
    },
  });

  revalidatePath("/admin");
}

export async function toggleFaqActive(formData: FormData) {
  await ensureAdmin();

  const faqId = String(formData.get("faqId") ?? "");
  const isActive = String(formData.get("isActive") ?? "") === "true";

  if (!faqId) {
    return;
  }

  await prisma.faq.update({
    where: { id: faqId },
    data: { isActive: !isActive },
  });

  revalidatePath("/admin");
}

export async function createFaqFromChat(formData: FormData) {
  await ensureAdmin();

  const chatLogId = String(formData.get("chatLogId") ?? "");
  const parsed = faqFormSchema.safeParse({
    question: String(formData.get("question") ?? ""),
    answer: String(formData.get("answer") ?? ""),
    language: String(formData.get("language") ?? "en"),
    tags: String(formData.get("tags") ?? ""),
  });

  if (!chatLogId || !parsed.success) {
    return;
  }

  const faq = await prisma.faq.create({
    data: {
      question: parsed.data.question,
      answer: parsed.data.answer,
      language: parsed.data.language,
      tags: parseTags(parsed.data.tags),
    },
  });

  await prisma.chatLog.update({
    where: { id: chatLogId },
    data: {
      matchedFaqId: faq.id,
      confidence: 0.9,
    },
  });

  revalidatePath("/admin");
}

export async function adminSignOut() {
  await signOut({ redirectTo: "/login" });
}
