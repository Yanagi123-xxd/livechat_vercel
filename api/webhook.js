export const config = {
  api: {
    bodyParser: false, // ❌ jangan parse otomatis
  },
};

export default async function handler(req, res) {
  try {
    // 🧠 Header CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight (OPTIONS)
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }

    // 🧩 Parse body JSON manual
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const bodyString = Buffer.concat(chunks).toString();
    const data = JSON.parse(bodyString || "{}");

    // pastikan pesan ada
    if (!data.message || !data.message.text) return res.status(200).end();

    const text = data.message.text;
    const sessionMatch = text.match(/\[#(\w+)\]/); // cari session ID
    if (!sessionMatch) return res.status(200).end();

    const session = sessionMatch[1];
    const reply = text.replace(/\[#\w+\]\s?/, ""); // hapus tag session

    // Kirim ke SSE endpoint (jika ada listener)
    globalThis._chats = globalThis._chats || {};
    if (globalThis._chats[session]) {
      globalThis._chats[session].forEach((res) => {
        res.write(`data: ${JSON.stringify({ text: reply })}\n\n`);
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
