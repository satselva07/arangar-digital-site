import { NextResponse } from "next/server";

const fallbackReply = {
  en: "For exact details, please contact our trust team at +91 9363616263 or visit the contact section on this page.",
  ta: "துல்லியமான தகவல்களுக்கு +91 9363616263 என்ற எண்ணில் தொடர்பு கொள்ளவும் அல்லது இணையதளத்தின் தொடர்பு பகுதியில் பார்க்கவும்.",
};

const emptyQuestionReply = {
  en: "Please type your question so I can help.",
  ta: "உங்களுக்கு உதவ நான் உங்கள் கேள்வியை টাইப் செய்யவும்.",
};

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string; language?: "en" | "ta" };
  const language = body.language === "ta" ? "ta" : "en";
  const message = body.message?.toLowerCase().trim() ?? "";

  if (!message) {
    return NextResponse.json({ reply: emptyQuestionReply[language] });
  }

  if (
    message.includes("annadhanam") ||
    message.includes("food donation") ||
    message.includes("அன்னதான") ||
    message.includes("உணவு")
  ) {
    return NextResponse.json({
      reply:
        language === "ta"
          ? "அன்னதானம் என்பது தேவையுள்ளவர்களுக்கு சமைத்த உணவை வழங்கும் எங்கள் சேவை. நீங்கள் 50, 100, 250 அல்லது 500 உணவுகளுக்கு அனுசரணை வழங்கலாம்."
          : "Annadhanam is our food service program where we prepare and distribute fresh meals to needy people. You can sponsor 50, 100, 250, or 500 meals.",
    });
  }

  if (
    message.includes("volunteer") ||
    message.includes("book") ||
    message.includes("தன்னார்வ") ||
    message.includes("முன்பதிவு")
  ) {
    return NextResponse.json({
      reply:
        language === "ta"
          ? "தன்னார்வ முன்பதிவு பகுதியில் தேதி மற்றும் நேரத்தை தேர்வு செய்யுங்கள். உறுதிப்படுத்த எங்கள் குழு உங்களை தொடர்பு கொள்கிறது."
          : "Use the Volunteer Booking Calendar section to choose a date and time slot. Our team will contact you to confirm participation.",
    });
  }

  if (message.includes("menu") || message.includes("food menu") || message.includes("மெனு")) {
    return NextResponse.json({
      reply:
        language === "ta"
          ? "பொதுவான அன்னதான மெனுவில் சாதம், சாம்பார், காய்கறி பொரியல், தயிர் சாதம், மற்றும் தண்ணீர் இருக்கும். அனுசரணையாளர் மற்றும் விழா நாட்களுக்கு ஏற்ப மெனு மாறலாம்."
          : "Typical annadhanam menu includes rice, sambar, vegetable poriyal, curd rice, and water. Menu may vary based on sponsor and festival days.",
    });
  }

  if (
    message.includes("price") ||
    message.includes("cost") ||
    message.includes("plan") ||
    message.includes("விலை") ||
    message.includes("திட்ட")
  ) {
    return NextResponse.json({
      reply:
        language === "ta"
          ? "தற்போதைய அனுசரணை திட்டங்கள்: 50 உணவுகள் ₹2,500, 100 உணவுகள் ₹5,000, 250 உணவுகள் ₹12,000, 500 உணவுகள் ₹24,000."
          : "Current meal sponsorship plans are 50 meals ₹2,500, 100 meals ₹5,000, 250 meals ₹12,000, and 500 meals ₹24,000.",
    });
  }

  if (
    message.includes("donate") ||
    message.includes("upi") ||
    message.includes("payment") ||
    message.includes("நன்கொடை") ||
    message.includes("கட்டணம்")
  ) {
    return NextResponse.json({
      reply:
        language === "ta"
          ? "UPI மூலம் நன்கொடை அளிக்கலாம்: arangardigitaltrust@upi. பரிமாற்ற உதவிக்கு +91 9363616263 என்ற எண்ணை அழைக்கவும்."
          : "You can donate via UPI: arangardigitaltrust@upi. For transfer support, please call +91 9363616263.",
    });
  }

  if (
    message.includes("contact") ||
    message.includes("address") ||
    message.includes("phone") ||
    message.includes("தொடர்பு") ||
    message.includes("முகவரி")
  ) {
    return NextResponse.json({
      reply:
        language === "ta"
          ? "அறக்கட்டளை முகவரி: 12, டெம்பிள் ஸ்ட்ரீட், ஸ்ரீரங்கம், திருச்சிராப்பள்ளி. தொடர்பு: +91 9363616263. சமூக வலைதளம்: x.com/arangardigitaltrust மற்றும் youtube.com/@arangardigitaltrust."
          : "Trust address: 12, Temple Street, Srirangam, Tiruchirappalli. Contact: +91 9363616263. Social: x.com/arangardigitaltrust and youtube.com/@arangardigitaltrust.",
    });
  }

  return NextResponse.json({ reply: fallbackReply[language] });
}
