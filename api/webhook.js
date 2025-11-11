export default async function handler(req, res) {
  try {
    const data = req.body;

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
