const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

function isRealConfig(value?: string) {
  return Boolean(value && !value.includes("your-") && !value.includes("replace-with"));
}

const isTelegramConfigured = Boolean(isRealConfig(botToken) && isRealConfig(chatId));

export function canSendTelegram() {
  return isTelegramConfigured;
}

export async function sendTelegramMessage(message: string) {
  if (!isTelegramConfigured) {
    throw new Error("Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.");
  }

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      disable_web_page_preview: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram send failed: ${response.status} ${body}`);
  }
}
