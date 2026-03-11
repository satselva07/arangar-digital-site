import { z } from "zod";

const phonePattern = /^[0-9+()\-\s]{7,20}$/;

export const volunteerBookingSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(phonePattern, "Invalid phone number format."),
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format."),
  slot: z.string().trim().min(2).max(40),
  language: z.enum(["en", "ta"]).default("en"),
});

export const feedbackSchema = z.object({
  name: z.string().trim().min(2).max(100),
  feedback: z.string().trim().min(5).max(2000),
  language: z.enum(["en", "ta"]).default("en"),
});

export const statusUpdateSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "ASSIGNED", "COMPLETED", "CLOSED"]),
});

export const faqFormSchema = z.object({
  question: z.string().trim().min(5).max(300),
  answer: z.string().trim().min(5).max(3000),
  language: z.enum(["en", "ta"]).default("en"),
  tags: z.string().trim().max(300).optional().default(""),
});
