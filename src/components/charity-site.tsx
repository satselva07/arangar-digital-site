"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

type Language = "en" | "ta";
const LANGUAGE_STORAGE_KEY = "arangar-language";
const NEXT_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const withBasePath = (path: string) => `${NEXT_BASE_PATH}${path}`;

const gallerySlides = [
  {
    src: "/gallery/agathiyar_sanmarga_sangam.jpg",
    caption: {
      en: "Community annadhanam drive organized with local service groups.",
      ta: "உள்ளூர் சேவை குழுக்களுடன் இணைந்து நடத்தப்பட்ட சமூக அன்னதான இயக்கம்.",
    },
  },
  {
    src: "/gallery/Arangar_Photo.jpg",
    caption: {
      en: "Trust volunteers coordinating meal packets before distribution.",
      ta: "வழங்குவதற்கு முன் உணவுப் பொதிகளை ஒருங்கிணைக்கும் அறக்கட்டளை தன்னார்வலர்கள்.",
    },
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-02-25%20at%209.09.40%20PM.jpeg",
    caption: {
      en: "Evening serving session delivering warm meals with care.",
      ta: "மாலை நேர உணவு வழங்கல் அமர்வில் அன்புடன் சூடான உணவு வழங்கப்பட்டது.",
    },
  },
  {
    src: "/gallery/WhatsApp%20Image%202026-02-25.jpeg",
    caption: {
      en: "Food support activity reaching families and senior citizens.",
      ta: "குடும்பங்கள் மற்றும் மூப்பினர்களை சென்றடைந்த உணவு ஆதரவு நிகழ்வு.",
    },
  },
  {
    src: "/gallery/WhatsApp_Img_1.jpeg",
    caption: {
      en: "Volunteer team distributing meals in an organized queue.",
      ta: "ஒழுங்கையான வரிசையில் உணவு வழங்கும் தன்னார்வ குழு.",
    },
  },
  {
    src: "/gallery/WhatsApp_Img_2.jpeg",
    caption: {
      en: "Annadhanam moments focused on dignity and compassion.",
      ta: "மரியாதையும் கருணையும் மையமாக கொண்ட அன்னதான தருணங்கள்.",
    },
  },
  {
    src: "/gallery/WhatsApp_Img_3.jpeg",
    caption: {
      en: "Closing moments after successful food donation service.",
      ta: "வெற்றிகரமான உணவு வழங்கல் சேவைக்கு பிந்தைய நிறைவு தருணம்.",
    },
  },
];

const content = {
  en: {
    siteName: "Arangar Digital Trust",
    mantras: [
      "Om agatheesaya namaha",
      "Om Arangar Potri",
      "Om Muruga Potri",
      "Arut perum jothi arut perum jothi thani perum karunai arut perum jothi",
    ],
    languageLabel: "Language",
    languageEnglish: "English",
    languageTamil: "Tamil",
    nav: {
      about: "About",
      testimonials: "Testimonials",
      photos: "Photos",
      volunteer: "Volunteer",
      contact: "Contact",
    },
    aboutTag: "Annadhanam Service",
    heroTitle: "Serving Food to the Needy with Compassion",
    heroDescription:
      "We organize annadhanam drives, sponsor-based meal distribution, and volunteer-led food service to support elders, daily wage workers, and families in need.",
    aboutExtra:
      "Arumuga Aranga Maha Swamigal was a revered saint who established the Ongarakudil (Siddhar Peedam) in Thuraiyur, Tamil Nadu. Focused on Siddha tradition, he promoted spiritual enlightenment and meditation, with his ashram serving as a key center for followers seeking knowledge of ancient Tamil Siddhars. Ongarakudil is located at 113-Extension, Thuraiyur, Trichy District, Tamil Nadu. It focuses on propagating the teachings of Siddhars, particularly Agathiar and Bujanda Maharishi, and supports spiritual upliftment through meditation and simple living as established by the Swamigal. The ashram in Thuraiyur remains a significant place for spiritual seekers.",
    donationPlans: [
      { title: "50 Meals", amount: "₹2,500" },
      { title: "100 Meals", amount: "₹5,000" },
      { title: "250 Meals", amount: "₹12,000" },
      { title: "500 Meals", amount: "₹24,000" },
    ],
    testimonialsTitle: "Testimonials",
    testimonials: [
      {
        name: "Lakshmi R.",
        text: "I volunteered with my family and felt the impact immediately. The trust serves with dignity and care.",
      },
      {
        name: "Praveen K.",
        text: "Transparent process, clear communication, and meaningful annadhanam service for people in need.",
      },
      {
        name: "Meera S.",
        text: "I donated for a birthday annadhanam and received updates quickly. Highly recommended.",
      },
    ],
    galleryTitle: "Food Distribution Photos",
    galleryDescription: "Real moments from our annadhanam events. Click arrows or dots to slide through photos.",
    prevPhoto: "Previous",
    nextPhoto: "Next",
    volunteerTitle: "Volunteer Booking Calendar",
    volunteerDescription:
      "Choose your date and slot to join the annadhanam team. We will contact you with confirmation.",
    formNamePlaceholder: "Your Name",
    formPhonePlaceholder: "Phone Number",
    slotPlaceholder: "Select Time Slot",
    slotMorning: "Morning (7 AM - 10 AM)",
    slotAfternoon: "Afternoon (12 PM - 3 PM)",
    slotEvening: "Evening (5 PM - 8 PM)",
    bookButton: "Book Volunteer Slot",
    bookingSuccess: "Booking request received successfully.",
    feedbackTitle: "Feedback",
    feedbackDescription: "Share your suggestions to improve our service and food outreach programs.",
    feedbackPlaceholder: "Write your feedback",
    feedbackButton: "Submit Feedback",
    feedbackSuccess: "Thank you for your feedback.",
    contactTitle: "Contact & Donation Details",
    trustAddressLabel: "Trust Address:",
    contactNumberLabel: "Contact Number:",
    upiLabel: "UPI ID:",
    youtubeLabel: "YouTube:",
    twitterLabel: "Twitter/X:",
    trustAddress: "12, Temple Street, Srirangam, Tiruchirappalli",
    contactNumber: "+91 9363616263",
    upiId: "arangardigitaltrust@upi",
    youtubeHandle: "youtube.com/@arangardigitaltrust",
    twitterHandle: "x.com/arangardigitaltrust",
    reachUs: "Reach Us",
    omMute: "Mute Om Chanting",
    omUnmute: "Unmute Om Chanting",
    chatOpen: "Chat with Trust Assistant",
    chatTitle: "Trust Assistant",
    chatClose: "Close",
    chatInputPlaceholder: "Ask about trust, menu, donation...",
    chatSend: "Send",
    chatInit:
      "Vanakkam! I can help with trust info, annadhanam, volunteering, menu details, and donation plans.",
    chatFallback: "Please contact our team for more details.",
    chatError: "I could not connect right now. Please try again in a moment.",
    quickQuestions: ["What is annadhanam?", "How can I volunteer?", "What are donation options?"],
    staticBannerTitle: "GitHub Pages Static Mode",
    staticBannerDescription:
      "Chatbot, volunteer booking submission, and feedback submission are disabled here because GitHub Pages does not run backend APIs.",
    staticFeatureDisabled: "This feature is disabled in GitHub Pages static mode.",
  },
  ta: {
    siteName: "அரங்கர் டிஜிட்டல் அறக்கட்டளை",
    mantras: [
      "ஓம் அகத்தீசாய நமஹ",
      "ஓம் அரங்கர் போற்றி",
      "ஓம் முருகா போற்றி",
      "அருட்பெருஞ் ஜோதி அருட்பெருஞ் ஜோதி தனிப்பெரும் கருணை அருட்பெருஞ் ஜோதி",
    ],
    languageLabel: "மொழி",
    languageEnglish: "ஆங்கிலம்",
    languageTamil: "தமிழ்",
    nav: {
      about: "எங்களை பற்றி",
      testimonials: "சான்றுகள்",
      photos: "புகைப்படங்கள்",
      volunteer: "தன்னார்வம்",
      contact: "தொடர்பு",
    },
    aboutTag: "அன்னதான சேவை",
    heroTitle: "தேவையுள்ளவர்களுக்கு அன்புடன் உணவு வழங்குதல்",
    heroDescription:
      "மூத்தவர்கள், தினக்கூலி தொழிலாளர்கள் மற்றும் தேவையுள்ள குடும்பங்களுக்கு ஆதரவாக அன்னதான முகாம்கள், அனுசரணை அடிப்படையிலான உணவு வழங்கல் மற்றும் தன்னார்வ சேவைகளை நாங்கள் நடத்துகிறோம்.",
    aboutExtra:
      "அருமுக அரங்க மகா சுவாமிகள் தமிழ்நாட்டின் துறையூரில் ஓங்காரக்குடில் (சித்தர் பீடம்) நிறுவிய புகழ்பெற்ற சான்றோராகப் போற்றப்படுகிறார். சித்த மரபை மையமாகக் கொண்டு ஆன்மீக விழிப்புணர்வு மற்றும் தியானத்தை அவர் ஊக்குவித்தார். இதனால், பண்டைய தமிழ் சித்தர்களின் ஞானத்தை நாடும் பக்தர்களுக்கு அவரது ஆசிரமம் ஒரு முக்கிய ஆன்மிக மையமாக வளர்ந்தது. ஓங்காரக்குடில், தமிழ்நாடு திருச்சி மாவட்டம், துறையூர், 113-எக்ஸ்டென்ஷனில் அமைந்துள்ளது. குறிப்பாக அகத்தியர் மற்றும் புஜண்ட மகரிஷி போதனைகளைப் பரப்புவது இதன் முக்கிய குறிக்கோள். சுவாமிகள் வலியுறுத்திய எளிய வாழ்வு மற்றும் தியானம் வழியாக ஆன்மிக உயர்வை வழங்குவது இதன் நோக்கம். துறையூரிலுள்ள இந்த ஆசிரமம் இன்று வரை ஆன்மிகத் தேடுபவர்களுக்கு முக்கிய தலமாக உள்ளது.",
    donationPlans: [
      { title: "50 உணவுகள்", amount: "₹2,500" },
      { title: "100 உணவுகள்", amount: "₹5,000" },
      { title: "250 உணவுகள்", amount: "₹12,000" },
      { title: "500 உணவுகள்", amount: "₹24,000" },
    ],
    testimonialsTitle: "சான்றுகள்",
    testimonials: [
      {
        name: "லட்சுமி ர.",
        text: "என் குடும்பத்துடன் தன்னார்வமாக கலந்து கொண்டேன். அறக்கட்டளையின் சேவை மரியாதையுடனும் அக்கறையுடனும் இருந்தது.",
      },
      {
        name: "பிரவீன் க.",
        text: "தெளிவான தொடர்பும் வெளிப்படையான செயல்முறையும் கொண்ட அர்த்தமுள்ள அன்னதான சேவை.",
      },
      {
        name: "மீரா ச.",
        text: "என் பிறந்தநாளில் அன்னதானத்திற்கு நன்கொடை அளித்தேன். உடனடி தகவல் கிடைத்தது.",
      },
    ],
    galleryTitle: "உணவு வழங்கல் புகைப்படங்கள்",
    galleryDescription: "எங்கள் அன்னதான நிகழ்வுகளின் உண்மை தருணங்கள். அம்புகள் அல்லது புள்ளிகளை கிளிக் செய்து படங்களை பார்க்கலாம்.",
    prevPhoto: "முந்தையது",
    nextPhoto: "அடுத்தது",
    volunteerTitle: "தன்னார்வ முன்பதிவு காலண்டர்",
    volunteerDescription:
      "அன்னதான குழுவில் சேர தேதி மற்றும் நேரத்தை தேர்வு செய்யுங்கள். உறுதிப்படுத்த எங்கள் குழு தொடர்புகொள்ளும்.",
    formNamePlaceholder: "உங்கள் பெயர்",
    formPhonePlaceholder: "தொலைபேசி எண்",
    slotPlaceholder: "நேரத்தை தேர்வு செய்யவும்",
    slotMorning: "காலை (7 AM - 10 AM)",
    slotAfternoon: "மதியம் (12 PM - 3 PM)",
    slotEvening: "மாலை (5 PM - 8 PM)",
    bookButton: "தன்னார்வ நேரம் முன்பதிவு செய்யவும்",
    bookingSuccess: "முன்பதிவு கோரிக்கை வெற்றிகரமாக பெறப்பட்டது.",
    feedbackTitle: "பின்னூட்டம்",
    feedbackDescription: "எங்கள் சேவையை மேம்படுத்த உங்கள் கருத்துகளை பகிரவும்.",
    feedbackPlaceholder: "உங்கள் பின்னூட்டத்தை எழுதவும்",
    feedbackButton: "பின்னூட்டத்தை சமர்ப்பிக்கவும்",
    feedbackSuccess: "உங்கள் பின்னூட்டத்திற்கு நன்றி.",
    contactTitle: "தொடர்பு & நன்கொடை விவரங்கள்",
    trustAddressLabel: "அறக்கட்டளை முகவரி:",
    contactNumberLabel: "தொடர்பு எண்:",
    upiLabel: "UPI ஐடி:",
    youtubeLabel: "யூடியூப்:",
    twitterLabel: "ட்விட்டர்/X:",
    trustAddress: "12, டெம்பிள் ஸ்ட்ரீட், ஸ்ரீரங்கம், திருச்சிராப்பள்ளி",
    contactNumber: "+91 9363616263",
    upiId: "arangardigitaltrust@upi",
    youtubeHandle: "youtube.com/@arangardigitaltrust",
    twitterHandle: "x.com/arangardigitaltrust",
    reachUs: "எங்களை அணுக",
    omMute: "ஓம் ஜபத்தை மவுனப்படுத்தவும்",
    omUnmute: "ஓம் ஜபத்தை ஒலிக்கச் செய்யவும்",
    chatOpen: "அறக்கட்டளை உதவியாளருடன் உரையாடவும்",
    chatTitle: "அறக்கட்டளை உதவியாளர்",
    chatClose: "மூடு",
    chatInputPlaceholder: "அறக்கட்டளை, மெனு, நன்கொடை பற்றி கேளுங்கள்...",
    chatSend: "அனுப்பு",
    chatInit:
      "வணக்கம்! அறக்கட்டளை தகவல், அன்னதானம், தன்னார்வ சேவை, உணவு மெனு மற்றும் நன்கொடை திட்டங்கள் பற்றி உதவ முடியும்.",
    chatFallback: "துல்லியமான விவரங்களுக்கு எங்கள் குழுவை தொடர்பு கொள்ளவும்.",
    chatError: "இப்போது இணைக்க முடியவில்லை. சில நிமிடங்களில் மீண்டும் முயற்சிக்கவும்.",
    quickQuestions: [
      "அன்னதானம் என்றால் என்ன?",
      "நான் எப்படி தன்னார்வமாக சேரலாம்?",
      "நன்கொடை திட்டங்கள் என்ன?",
    ],
    staticBannerTitle: "GitHub Pages நிலையான பதிப்பு",
    staticBannerDescription:
      "GitHub Pages பின்னணி API-களை இயக்காததால், chatbot, தன்னார்வ முன்பதிவு அனுப்பல் மற்றும் feedback அனுப்பல் இங்கு முடக்கப்பட்டுள்ளது.",
    staticFeatureDisabled: "GitHub Pages நிலையான முறையில் இந்த வசதி இயங்காது.",
  },
} as const;

export default function CharitySite() {
  const isStaticMode = process.env.NEXT_PUBLIC_STATIC_MODE === "true";
  const [language, setLanguage] = useState<Language>("en");
  const t = content[language];
  const mantraText = `${t.mantras.join(" • ")} • ${t.mantras.join(" • ")} •`;
  const mantraAria = t.mantras.join(". ");
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isOmMuted, setIsOmMuted] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: "bot", text: content.en.chatInit }]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isArrowHovering, setIsArrowHovering] = useState(false);
  const autoplayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const omAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === "en" || storedLanguage === "ta") {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    setMessages([{ role: "bot", text: content[language].chatInit }]);
    setChatInput("");
  }, [language]);

  useEffect(() => {
    const audioElement = omAudioRef.current;
    if (!audioElement) {
      return;
    }

    audioElement.volume = 0.4;
    audioElement.muted = isOmMuted;
    audioElement
      .play()
      .catch(() => {});
  }, []);

  useEffect(() => {
    const audioElement = omAudioRef.current;
    if (!audioElement) {
      return;
    }

    audioElement.muted = isOmMuted;
  }, [isOmMuted]);

  useEffect(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }

    if (!isArrowHovering) {
      autoplayIntervalRef.current = setInterval(() => {
        setActiveSlide((previous) => (previous + 1) % gallerySlides.length);
      }, 3500);
    }

    return () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };
  }, [isArrowHovering]);

  const handleArrowMouseEnter = () => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
    setIsArrowHovering(true);
  };

  const handleArrowMouseLeave = () => {
    setIsArrowHovering(false);
  };

  const showPreviousSlide = () => {
    setActiveSlide((previous) => (previous - 1 + gallerySlides.length) % gallerySlides.length);
  };

  const showNextSlide = () => {
    setActiveSlide((previous) => (previous + 1) % gallerySlides.length);
  };

  const handleBookingSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isStaticMode) {
      setBookingStatus("error");
      return;
    }

    setBookingStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      date: String(formData.get("date") ?? ""),
      slot: String(formData.get("slot") ?? ""),
      language,
    };

    try {
      const response = await fetch("/api/volunteer-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setBookingStatus("error");
        return;
      }

      setBookingStatus("success");
      event.currentTarget.reset();
    } catch {
      setBookingStatus("error");
    }
  };

  const handleFeedbackSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isStaticMode) {
      setFeedbackStatus("error");
      return;
    }

    setFeedbackStatus("submitting");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      feedback: String(formData.get("feedback") ?? ""),
      language,
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setFeedbackStatus("error");
        return;
      }

      setFeedbackStatus("success");
      event.currentTarget.reset();
    } catch {
      setFeedbackStatus("error");
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) {
      return;
    }

    if (isStaticMode) {
      const updatedMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
      setMessages([...updatedMessages, { role: "bot", text: t.staticFeatureDisabled }]);
      setChatInput("");
      return;
    }

    const updatedMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(updatedMessages);
    setChatInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed, language }),
      });

      const data = (await response.json()) as { reply?: string };
      const replyText = data.reply ?? t.chatFallback;

      setMessages([...updatedMessages, { role: "bot", text: replyText }]);
    } catch {
      setMessages([
        ...updatedMessages,
        {
          role: "bot",
          text: t.chatError,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const toggleOmAudio = async () => {
    const audioElement = omAudioRef.current;
    if (!audioElement) {
      return;
    }

    try {
      if (audioElement.paused) {
        await audioElement.play();
      }
      setIsOmMuted((previous) => !previous);
    } catch {
      
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,theme(colors.amber.100),theme(colors.orange.50)_38%,theme(colors.emerald.50)_100%)] text-foreground">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 shadow-[0_8px_30px_rgb(15_23_42/0.06)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="relative h-9 w-9 overflow-hidden rounded-full border border-amber-300 shadow-sm">
                <Image
                  src={withBasePath("/gallery/Arangar_Photo.jpg")}
                  alt="Arangar Trust Icon"
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </span>
              <p className="text-lg font-semibold tracking-tight text-orange-950 sm:text-xl">{t.siteName}</p>
              <span
                className="running-mantra-container inline-flex"
                aria-label={mantraAria}
              >
                <span className="running-mantra-track">{mantraText}</span>
              </span>
            </div>
            <label className="flex items-center gap-2 text-sm text-orange-900">
            <span className="font-medium">{t.languageLabel}</span>
            <select
              className="rounded-lg border border-amber-200 bg-white px-2.5 py-1.5 shadow-sm"
              value={language}
              onChange={(event) => setLanguage(event.target.value as Language)}
            >
              <option value="en">{t.languageEnglish}</option>
              <option value="ta">{t.languageTamil}</option>
            </select>
          </label>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            <a
              href="#about"
              className="rounded-full border border-amber-200 bg-white px-3.5 py-1.5 text-orange-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white"
            >
              {t.nav.about}
            </a>
            <a
              href="#testimonials"
              className="rounded-full border border-amber-200 bg-white px-3.5 py-1.5 text-orange-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white"
            >
              {t.nav.testimonials}
            </a>
            <a
              href="#gallery"
              className="rounded-full border border-amber-200 bg-white px-3.5 py-1.5 text-orange-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white"
            >
              {t.nav.photos}
            </a>
            <a
              href="#volunteer"
              className="rounded-full border border-amber-200 bg-white px-3.5 py-1.5 text-orange-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white"
            >
              {t.nav.volunteer}
            </a>
            <a
              href="#contact"
              className="rounded-full border border-amber-200 bg-white px-3.5 py-1.5 text-orange-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-500 hover:text-white"
            >
              {t.nav.contact}
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-18 px-4 py-14 sm:px-6 lg:px-8">
        {isStaticMode ? (
          <section className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm">
            <p className="text-sm font-semibold text-amber-900">{t.staticBannerTitle}</p>
            <p className="mt-1 text-sm text-amber-800">{t.staticBannerDescription}</p>
          </section>
        ) : null}

        <section id="about" className="scroll-mt-40 space-y-6 rounded-3xl border border-white/70 bg-white/75 p-7 shadow-[0_20px_45px_rgb(15_23_42/0.08)] backdrop-blur md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-700">{t.aboutTag}</p>
          <h1 className="text-3xl font-bold leading-[1.15] tracking-tight text-orange-950 sm:text-5xl">{t.heroTitle}</h1>
          <p className="max-w-3xl text-base leading-8 text-zinc-700">{t.heroDescription}</p>
          <p className="max-w-4xl text-[15px] leading-8 text-zinc-700">{t.aboutExtra}</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {t.donationPlans.map((plan) => (
              <div key={plan.title} className="rounded-2xl border border-orange-100 bg-gradient-to-br from-amber-50/90 to-orange-100/80 p-4 shadow-sm">
                <p className="text-sm font-medium tracking-wide text-orange-700">{plan.title}</p>
                <p className="text-2xl font-semibold text-orange-900">{plan.amount}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="testimonials" className="scroll-mt-40 space-y-5 rounded-3xl border border-white/70 bg-white/75 p-7 shadow-[0_20px_45px_rgb(15_23_42/0.08)] backdrop-blur md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-rose-900 sm:text-3xl">{t.testimonialsTitle}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {t.testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50/90 to-amber-50 p-5 shadow-sm">
                <p className="text-[15px] leading-7 text-zinc-800">“{testimonial.text}”</p>
                <p className="mt-4 text-sm font-semibold tracking-wide text-rose-900">- {testimonial.name}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="scroll-mt-40 space-y-5 rounded-3xl border border-white/70 bg-white/75 p-7 shadow-[0_20px_45px_rgb(15_23_42/0.08)] backdrop-blur md:p-10">
          <h2 className="text-2xl font-semibold tracking-tight text-orange-900 sm:text-3xl">{t.galleryTitle}</h2>
          <p className="text-base leading-8 text-zinc-800">{t.galleryDescription}</p>
          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-amber-50/90 to-orange-100/80 p-3 shadow-sm sm:p-4">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-orange-100">
              {gallerySlides.map((slide, index) => (
                <div
                  key={slide.src}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === activeSlide ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={withBasePath(slide.src)}
                    alt={slide.caption[language]}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={showPreviousSlide}
                onMouseEnter={handleArrowMouseEnter}
                onMouseLeave={handleArrowMouseLeave}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-orange-900/80 px-3 py-2 text-sm text-white shadow"
                aria-label={t.prevPhoto}
              >
                ←
              </button>
              <button
                type="button"
                onClick={showNextSlide}
                onMouseEnter={handleArrowMouseEnter}
                onMouseLeave={handleArrowMouseLeave}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-orange-900/80 px-3 py-2 text-sm text-white shadow"
                aria-label={t.nextPhoto}
              >
                →
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-[15px] leading-7 text-zinc-800">{gallerySlides[activeSlide].caption[language]}</p>
              <div className="flex gap-1.5">
                {gallerySlides.map((slide, index) => (
                  <button
                    key={`${slide.src}-dot`}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 w-2.5 rounded-full ${index === activeSlide ? "bg-orange-700" : "bg-orange-200"}`}
                    aria-label={`Slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="volunteer" className="scroll-mt-40 grid gap-8 rounded-3xl border border-white/70 bg-white/75 p-7 shadow-[0_20px_45px_rgb(15_23_42/0.08)] backdrop-blur lg:grid-cols-2 md:p-10">
          <div className="space-y-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/95 to-amber-50 p-5 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-emerald-900 sm:text-3xl">{t.volunteerTitle}</h2>
            <p className="text-base leading-8 text-zinc-800">{t.volunteerDescription}</p>
            <form onSubmit={handleBookingSubmit} className="space-y-3 rounded-xl border border-emerald-100 bg-white/95 p-4 shadow-sm">
              <input
                required
                name="name"
                type="text"
                placeholder={t.formNamePlaceholder}
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2.5 text-[15px]"
              />
              <input
                required
                name="phone"
                type="tel"
                placeholder={t.formPhonePlaceholder}
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2.5 text-[15px]"
              />
              <input
                required
                name="date"
                type="date"
                className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2.5 text-[15px]"
              />
              <select required name="slot" className="w-full rounded-md border border-emerald-200 bg-white px-3 py-2.5 text-[15px]">
                <option value="">{t.slotPlaceholder}</option>
                <option value="morning">{t.slotMorning}</option>
                <option value="afternoon">{t.slotAfternoon}</option>
                <option value="evening">{t.slotEvening}</option>
              </select>
              <button
                type="submit"
                disabled={bookingStatus === "submitting" || isStaticMode}
                className="rounded-lg bg-emerald-700 px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:opacity-60"
              >
                {t.bookButton}
              </button>
              {bookingStatus === "submitting" ? (
                <p className="text-sm text-zinc-800">{language === "ta" ? "அனுப்பப்படுகிறது..." : "Sending..."}</p>
              ) : null}
              {bookingStatus === "success" ? <p className="text-sm text-emerald-800">{t.bookingSuccess}</p> : null}
              {bookingStatus === "error" ? (
                <p className="text-sm text-red-600">
                  {isStaticMode
                    ? t.staticFeatureDisabled
                    : language === "ta"
                      ? "அனுப்ப முடியவில்லை. மின்னஞ்சல் அமைப்புகளை சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
                      : "Could not submit right now. Please verify email setup and try again."}
                </p>
              ) : null}
            </form>
          </div>

          <div className="space-y-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/95 to-amber-50 p-5 shadow-sm">
            <h2 className="text-2xl font-semibold tracking-tight text-orange-900 sm:text-3xl">{t.feedbackTitle}</h2>
            <p className="text-base leading-8 text-zinc-800">{t.feedbackDescription}</p>
            <form onSubmit={handleFeedbackSubmit} className="space-y-3 rounded-xl border border-orange-100 bg-white/95 p-4 shadow-sm">
              <input
                required
                name="name"
                type="text"
                placeholder={t.formNamePlaceholder}
                className="w-full rounded-md border border-orange-200 bg-white px-3 py-2.5 text-[15px]"
              />
              <textarea
                required
                name="feedback"
                placeholder={t.feedbackPlaceholder}
                rows={5}
                className="w-full rounded-md border border-orange-200 bg-white px-3 py-2.5 text-[15px] leading-7"
              />
              <button
                type="submit"
                disabled={feedbackStatus === "submitting" || isStaticMode}
                className="rounded-lg bg-orange-700 px-4 py-2.5 text-[15px] font-medium text-white shadow-sm transition hover:bg-orange-800 disabled:opacity-60"
              >
                {t.feedbackButton}
              </button>
              {feedbackStatus === "submitting" ? (
                <p className="text-sm text-zinc-800">{language === "ta" ? "அனுப்பப்படுகிறது..." : "Sending..."}</p>
              ) : null}
              {feedbackStatus === "success" ? <p className="text-sm text-orange-800">{t.feedbackSuccess}</p> : null}
              {feedbackStatus === "error" ? (
                <p className="text-sm text-red-600">
                  {isStaticMode
                    ? t.staticFeatureDisabled
                    : language === "ta"
                      ? "அனுப்ப முடியவில்லை. மின்னஞ்சல் அமைப்புகளை சரிபார்த்து மீண்டும் முயற்சிக்கவும்."
                      : "Could not submit right now. Please verify email setup and try again."}
                </p>
              ) : null}
            </form>
          </div>
        </section>

        <section
          id="contact"
          className="scroll-mt-40 space-y-5 rounded-3xl border border-white/70 bg-gradient-to-br from-emerald-50/95 to-amber-50 p-7 shadow-[0_20px_45px_rgb(15_23_42/0.08)] backdrop-blur md:p-10"
        >
          <h2 className="text-2xl font-semibold tracking-tight text-emerald-900 sm:text-3xl">{t.contactTitle}</h2>
          <div className="grid gap-4 text-[15px] leading-7 text-zinc-800 sm:grid-cols-2">
            <p>
              <span className="font-semibold">{t.trustAddressLabel}</span> {t.trustAddress}
            </p>
            <p>
              <span className="font-semibold">{t.contactNumberLabel}</span> {t.contactNumber}
            </p>
            <p>
              <span className="font-semibold">{t.upiLabel}</span> {t.upiId}
            </p>
            <p>
              <span className="font-semibold">{t.youtubeLabel}</span> {t.youtubeHandle}
            </p>
            <p>
              <span className="font-semibold">{t.twitterLabel}</span> {t.twitterHandle}
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/60 bg-gradient-to-r from-orange-700 via-amber-600 to-emerald-700 shadow-[0_-8px_30px_rgb(15_23_42/0.08)]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-7 text-white sm:px-6 lg:px-8">
          <p className="text-lg font-semibold tracking-wide">{t.siteName}</p>
          <p className="text-sm font-medium text-orange-50">Annadhanam • Compassion • Service to Humanity</p>
          <p className="text-xs text-orange-100/90">Built for food donation, volunteering, and community care.</p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-orange-50">
            <p className="text-sm font-semibold">{t.reachUs}</p>
            <a
              href="tel:+919363616263"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
              aria-label="Phone"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.24 1l-2.2 2.21Z" />
              </svg>
            </a>
            <a
              href="https://wa.me/919363616263"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.61 0 .34 5.26.34 11.73c0 2.07.54 4.09 1.57 5.88L0 24l6.58-1.86a11.69 11.69 0 0 0 5.48 1.39h.01c6.46 0 11.73-5.26 11.73-11.73 0-3.13-1.22-6.08-3.48-8.32Zm-8.45 18.1h-.01a9.7 9.7 0 0 1-4.95-1.35l-.35-.21-3.9 1.1 1.04-3.8-.23-.39a9.76 9.76 0 0 1-1.5-5.2c0-5.38 4.38-9.76 9.77-9.76 2.6 0 5.05 1.01 6.89 2.86a9.67 9.67 0 0 1 2.86 6.9c0 5.39-4.39 9.77-9.77 9.77Zm5.36-7.34c-.29-.15-1.73-.85-2-.94-.27-.1-.46-.15-.66.14-.19.29-.75.94-.92 1.13-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.34-1.42-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.51-.08-.15-.66-1.59-.91-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.08-.78.37-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.2 3.06.15.19 2.08 3.18 5.03 4.46.7.3 1.25.49 1.68.62.71.22 1.35.19 1.85.12.57-.09 1.73-.71 1.97-1.39.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.56-.35Z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-24 right-4 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => void toggleOmAudio()}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-amber-600 text-white shadow-lg transition hover:scale-[1.04] hover:bg-amber-700"
          aria-label={isOmMuted ? t.omUnmute : t.omMute}
          title={isOmMuted ? t.omUnmute : t.omMute}
        >
          {isOmMuted ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M5 10v4h3l4 4V6L8 10H5Zm11.59 2 2.7-2.7-1.42-1.42L15.17 10.6l-2.7-2.72-1.42 1.42 2.71 2.7-2.71 2.7 1.42 1.42 2.7-2.71 2.7 2.71 1.42-1.42-2.7-2.7Z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M5 10v4h3l4 4V6L8 10H5Zm10.5 2a3.5 3.5 0 0 0-2.5-3.35v6.7A3.5 3.5 0 0 0 15.5 12Zm0-7v2.06a5.5 5.5 0 0 1 0 9.88V19a7.5 7.5 0 0 0 0-14Z" />
            </svg>
          )}
        </button>
        <a
          href="tel:+919363616263"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg transition hover:scale-[1.04] hover:bg-emerald-800"
          aria-label="Phone"
          title="Phone"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.49a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.24 1l-2.2 2.21Z" />
          </svg>
        </a>
        <a
          href="https://wa.me/919363616263"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-green-600 text-white shadow-lg transition hover:scale-[1.04] hover:bg-green-700"
          aria-label="WhatsApp"
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
            <path d="M20.52 3.48A11.84 11.84 0 0 0 12.07 0C5.61 0 .34 5.26.34 11.73c0 2.07.54 4.09 1.57 5.88L0 24l6.58-1.86a11.69 11.69 0 0 0 5.48 1.39h.01c6.46 0 11.73-5.26 11.73-11.73 0-3.13-1.22-6.08-3.48-8.32Zm-8.45 18.1h-.01a9.7 9.7 0 0 1-4.95-1.35l-.35-.21-3.9 1.1 1.04-3.8-.23-.39a9.76 9.76 0 0 1-1.5-5.2c0-5.38 4.38-9.76 9.77-9.76 2.6 0 5.05 1.01 6.89 2.86a9.67 9.67 0 0 1 2.86 6.9c0 5.39-4.39 9.77-9.77 9.77Zm5.36-7.34c-.29-.15-1.73-.85-2-.94-.27-.1-.46-.15-.66.14-.19.29-.75.94-.92 1.13-.17.2-.34.22-.63.08-.29-.15-1.23-.45-2.34-1.42-.86-.77-1.45-1.72-1.62-2.01-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.51.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.51-.08-.15-.66-1.59-.91-2.17-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.08-.78.37-.27.29-1.03 1.01-1.03 2.46 0 1.45 1.06 2.86 1.2 3.06.15.19 2.08 3.18 5.03 4.46.7.3 1.25.49 1.68.62.71.22 1.35.19 1.85.12.57-.09 1.73-.71 1.97-1.39.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.56-.35Z" />
          </svg>
        </a>
      </div>

      <audio ref={omAudioRef} loop preload="auto" src={withBasePath("/audio/om-chanting.mp4")} />

      <div className="fixed bottom-4 right-4 z-20 w-80 max-w-[calc(100%-2rem)]">
        {isChatOpen ? (
          <section className="rounded-xl border border-orange-100 bg-white/95 shadow-lg backdrop-blur">
            <div className="flex items-center justify-between border-b border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2">
              <p className="text-sm font-semibold">{t.chatTitle}</p>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded px-2 py-1 text-xs hover:bg-zinc-100"
                type="button"
              >
                {t.chatClose}
              </button>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto p-3 text-sm">
              {messages.map((message, index) => (
                <p
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "user"
                      ? "ml-auto w-fit max-w-[90%] rounded-lg bg-orange-700 px-3 py-2 text-orange-50"
                      : "mr-auto w-fit max-w-[90%] rounded-lg bg-amber-100 px-3 py-2"
                  }
                >
                  {message.text}
                </p>
              ))}
            </div>
            <div className="space-y-2 border-t border-zinc-200 p-3">
              <div className="flex flex-wrap gap-2">
                {t.quickQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    disabled={isStaticMode}
                    className="rounded border border-orange-200 px-2 py-1 text-xs text-orange-900 hover:bg-orange-100"
                    onClick={() => void sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  void sendMessage(chatInput);
                }}
                className="flex gap-2"
              >
                <input
                  value={chatInput}
                  onChange={(event) => setChatInput(event.target.value)}
                  placeholder={t.chatInputPlaceholder}
                  className="w-full rounded-lg border border-orange-100 bg-white px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={isSending || isStaticMode}
                  className="rounded-lg bg-orange-700 px-3 py-2 text-sm text-white transition hover:bg-orange-800 disabled:opacity-60"
                >
                  {t.chatSend}
                </button>
              </form>
            </div>
          </section>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="ml-auto block rounded-full bg-gradient-to-r from-orange-600 to-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:scale-[1.02]"
            type="button"
          >
            {t.chatOpen}
          </button>
        )}
      </div>
    </div>
  );
}
