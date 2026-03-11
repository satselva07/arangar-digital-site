import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  adminSignOut,
  createFaq,
  createFaqFromChat,
  toggleFaqActive,
  retryBookingNotification,
  retryEnquiryNotification,
  updateBookingStatus,
  updateEnquiryStatus,
  updateFaq,
} from "@/app/admin/actions";

type BookingView = {
  id: string;
  name: string;
  phone: string;
  date: Date;
  slot: string;
  status: string;
  notificationStatus: string;
  notificationChannels: string[];
  notificationError?: string | null;
};

type EnquiryView = {
  id: string;
  name: string;
  category: string;
  status: string;
  message: string;
  notificationStatus: string;
  notificationChannels: string[];
  notificationError?: string | null;
};

type FaqView = {
  id: string;
  question: string;
  answer: string;
  language: string;
  tags: string[];
  isActive: boolean;
};

type ChatLogView = {
  id: string;
  language: string;
  userMessage: string;
  botResponse: string;
  confidence: number | null;
  createdAt: Date;
};

function enquiryStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "NEW";
    case "CONTACTED":
      return "ACKNOWLEDGED";
    case "ASSIGNED":
      return "IN PROGRESS";
    case "COMPLETED":
      return "REPLIED";
    case "CLOSED":
      return "CLOSED";
    default:
      return status;
  }
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "NEW":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "CONTACTED":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "ASSIGNED":
      return "bg-violet-100 text-violet-800 border-violet-200";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "CLOSED":
      return "bg-zinc-200 text-zinc-700 border-zinc-300";
    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

function notificationBadgeClass(status: string) {
  switch (status) {
    case "SENT":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "FAILED":
      return "bg-red-100 text-red-700 border-red-200";
    case "SKIPPED":
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
    default:
      return "bg-amber-100 text-amber-800 border-amber-200";
  }
}

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/login");
  }

  const [bookings, enquiries, faqs, unansweredChats] = (await Promise.all([
    prisma.volunteerBooking.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.faq.findMany({
      orderBy: { updatedAt: "desc" },
      take: 20,
    }),
    prisma.chatLog.findMany({
      where: {
        matchedFaqId: null,
        OR: [{ confidence: null }, { confidence: { lte: 0.3 } }],
      },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
  ])) as [BookingView[], EnquiryView[], FaqView[], ChatLogView[]];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,theme(colors.amber.100),theme(colors.orange.50)_40%,theme(colors.emerald.50)_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-semibold text-orange-950">Admin Dashboard</h1>
            <p className="text-sm text-zinc-600">Welcome, {session.user.name ?? "Admin"}. Manage recent volunteer bookings and enquiries.</p>
          </div>
          <form action={adminSignOut}>
            <button
              type="submit"
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
              Sign out
            </button>
          </form>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-emerald-900">Volunteer Bookings</h2>
            <p className="mt-1 text-sm text-zinc-600">Latest 20 requests with status update controls.</p>
            <div className="mt-4 space-y-3">
              {bookings.length === 0 ? <p className="text-sm text-zinc-500">No bookings yet.</p> : null}
              {bookings.map((booking: BookingView) => (
                <div key={booking.id} className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-800">{booking.name}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${statusBadgeClass(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">Phone: {booking.phone}</p>
                  <p className="text-xs text-zinc-600">Date: {booking.date.toISOString().slice(0, 10)} | Slot: {booking.slot}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${notificationBadgeClass(booking.notificationStatus)}`}>
                      NOTIFY {booking.notificationStatus}
                    </span>
                    {booking.notificationChannels.length > 0 ? (
                      <span className="text-[11px] text-zinc-600">via {booking.notificationChannels.join(", ")}</span>
                    ) : null}
                  </div>
                  {booking.notificationError ? <p className="mt-1 text-[11px] text-red-600">{booking.notificationError}</p> : null}
                  <form action={updateBookingStatus} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <select
                      key={`${booking.id}-${booking.status}`}
                      name="status"
                      defaultValue={booking.status}
                      className="rounded-md border border-emerald-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">CONTACTED</option>
                      <option value="ASSIGNED">ASSIGNED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <button
                      type="submit"
                      className="cursor-pointer rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 hover:shadow"
                    >
                      Update
                    </button>
                  </form>
                  <form action={retryBookingNotification} className="mt-2">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <button
                      type="submit"
                      className="cursor-pointer rounded border border-emerald-300 bg-white px-2 py-1 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
                    >
                      Retry Notification
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-orange-900">Enquiries</h2>
            <p className="mt-1 text-sm text-zinc-600">Latest 20 website enquiries/feedback messages.</p>
            <div className="mt-4 space-y-3">
              {enquiries.length === 0 ? <p className="text-sm text-zinc-500">No enquiries yet.</p> : null}
              {enquiries.map((enquiry: EnquiryView) => (
                <div key={enquiry.id} className="rounded-lg border border-orange-100 bg-orange-50/60 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-zinc-800">{enquiry.name}</p>
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide ${statusBadgeClass(
                        enquiry.status
                      )}`}
                    >
                      {enquiryStatusLabel(enquiry.status)}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600">Category: {enquiry.category}</p>
                  <p className="mt-1 text-sm leading-6 text-zinc-700">{enquiry.message}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${notificationBadgeClass(enquiry.notificationStatus)}`}>
                      NOTIFY {enquiry.notificationStatus}
                    </span>
                    {enquiry.notificationChannels.length > 0 ? (
                      <span className="text-[11px] text-zinc-600">via {enquiry.notificationChannels.join(", ")}</span>
                    ) : null}
                  </div>
                  {enquiry.notificationError ? <p className="mt-1 text-[11px] text-red-600">{enquiry.notificationError}</p> : null}
                  <form action={updateEnquiryStatus} className="mt-2 flex items-center gap-2">
                    <input type="hidden" name="enquiryId" value={enquiry.id} />
                    <select
                      key={`${enquiry.id}-${enquiry.status}`}
                      name="status"
                      defaultValue={enquiry.status}
                      className="rounded-md border border-orange-200 bg-white px-2 py-1 text-xs"
                    >
                      <option value="NEW">NEW</option>
                      <option value="CONTACTED">ACKNOWLEDGED</option>
                      <option value="ASSIGNED">IN PROGRESS</option>
                      <option value="COMPLETED">REPLIED</option>
                      <option value="CLOSED">CLOSED</option>
                    </select>
                    <button
                      type="submit"
                      className="cursor-pointer rounded-md bg-orange-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-800 hover:shadow"
                    >
                      Update
                    </button>
                  </form>
                  <form action={retryEnquiryNotification} className="mt-2">
                    <input type="hidden" name="enquiryId" value={enquiry.id} />
                    <button
                      type="submit"
                      className="cursor-pointer rounded border border-orange-300 bg-white px-2 py-1 text-xs font-medium text-orange-800 hover:bg-orange-100"
                    >
                      Retry Notification
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-indigo-900">FAQ Knowledge Base</h2>
            <p className="mt-1 text-sm text-zinc-600">Create and maintain dynamic chatbot answers.</p>

            <form action={createFaq} className="mt-4 space-y-2 rounded-lg border border-indigo-100 bg-indigo-50/40 p-3">
              <input
                name="question"
                required
                placeholder="FAQ question"
                className="w-full rounded-md border border-indigo-200 bg-white px-2 py-1.5 text-sm"
              />
              <textarea
                name="answer"
                required
                rows={3}
                placeholder="FAQ answer"
                className="w-full rounded-md border border-indigo-200 bg-white px-2 py-1.5 text-sm"
              />
              <div className="flex flex-wrap items-center gap-2">
                <select name="language" defaultValue="en" className="rounded-md border border-indigo-200 bg-white px-2 py-1 text-xs">
                  <option value="en">English</option>
                  <option value="ta">Tamil</option>
                </select>
                <input
                  name="tags"
                  placeholder="tags: donation, volunteer"
                  className="min-w-48 flex-1 rounded-md border border-indigo-200 bg-white px-2 py-1 text-xs"
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-md bg-indigo-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-800"
                >
                  Add FAQ
                </button>
              </div>
            </form>

            <div className="mt-4 space-y-3">
              {faqs.length === 0 ? <p className="text-sm text-zinc-500">No FAQs yet.</p> : null}
              {faqs.map((faq) => (
                <div key={faq.id} className="rounded-lg border border-indigo-100 bg-indigo-50/25 p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${faq.isActive ? "border-emerald-200 bg-emerald-100 text-emerald-800" : "border-zinc-300 bg-zinc-200 text-zinc-700"}`}>
                      {faq.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                    <form action={toggleFaqActive}>
                      <input type="hidden" name="faqId" value={faq.id} />
                      <input type="hidden" name="isActive" value={String(faq.isActive)} />
                      <button type="submit" className="cursor-pointer rounded border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-100">
                        {faq.isActive ? "Disable" : "Enable"}
                      </button>
                    </form>
                  </div>
                  <form action={updateFaq} className="space-y-2">
                    <input type="hidden" name="faqId" value={faq.id} />
                    <input name="question" defaultValue={faq.question} required className="w-full rounded-md border border-indigo-200 bg-white px-2 py-1.5 text-xs" />
                    <textarea name="answer" defaultValue={faq.answer} required rows={3} className="w-full rounded-md border border-indigo-200 bg-white px-2 py-1.5 text-xs" />
                    <div className="flex flex-wrap items-center gap-2">
                      <select name="language" defaultValue={faq.language} className="rounded-md border border-indigo-200 bg-white px-2 py-1 text-xs">
                        <option value="en">English</option>
                        <option value="ta">Tamil</option>
                      </select>
                      <input
                        name="tags"
                        defaultValue={faq.tags.join(", ")}
                        className="min-w-40 flex-1 rounded-md border border-indigo-200 bg-white px-2 py-1 text-xs"
                      />
                      <button type="submit" className="cursor-pointer rounded-md bg-indigo-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-800">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-white/70 bg-white/90 p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-900">Unanswered Chat Questions</h2>
            <p className="mt-1 text-sm text-zinc-600">Convert low-confidence questions into FAQs.</p>
            <div className="mt-4 space-y-3">
              {unansweredChats.length === 0 ? <p className="text-sm text-zinc-500">No unanswered chat items.</p> : null}
              {unansweredChats.map((chat) => (
                <div key={chat.id} className="rounded-lg border border-rose-100 bg-rose-50/40 p-3">
                  <p className="text-xs font-semibold text-zinc-800">Question ({chat.language.toUpperCase()}): {chat.userMessage}</p>
                  <p className="mt-1 text-xs text-zinc-600">Bot replied: {chat.botResponse}</p>
                  <p className="mt-1 text-[11px] text-zinc-500">{chat.createdAt.toISOString().slice(0, 16).replace("T", " ")}</p>
                  <form action={createFaqFromChat} className="mt-2 space-y-2">
                    <input type="hidden" name="chatLogId" value={chat.id} />
                    <input name="question" defaultValue={chat.userMessage} required className="w-full rounded-md border border-rose-200 bg-white px-2 py-1 text-xs" />
                    <textarea name="answer" rows={2} required placeholder="Write a better FAQ answer" className="w-full rounded-md border border-rose-200 bg-white px-2 py-1 text-xs" />
                    <div className="flex flex-wrap items-center gap-2">
                      <select name="language" defaultValue={chat.language} className="rounded-md border border-rose-200 bg-white px-2 py-1 text-xs">
                        <option value="en">English</option>
                        <option value="ta">Tamil</option>
                      </select>
                      <input name="tags" placeholder="tags" className="min-w-40 flex-1 rounded-md border border-rose-200 bg-white px-2 py-1 text-xs" />
                      <button type="submit" className="cursor-pointer rounded-md bg-rose-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-800">
                        Convert To FAQ
                      </button>
                    </div>
                  </form>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
