export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { text, session } = req.body;
  const BOT_TOKEN = process.env.BOT_TOKEN;
  const CHAT_ID = process.env.CHAT_ID; // chat admin (misal ID kamu atau grup)

  if (!text || !session)
    return res.status(400).json({ error: "Missing text or session" });

  const message = `[#${session}] 💬 ${text}`;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message }),
  });

  res.status(200).json({ ok: true });
}
