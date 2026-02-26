import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arangar Digital Trust | Annadhanam & Volunteering",
  description:
    "Arangar Digital Trust website for annadhanam service, volunteer booking, testimonials, donation details, and chatbot support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
