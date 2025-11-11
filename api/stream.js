export default function handler(req, res) {
  const { session } = req.query;

  // 🧠 Izinkan koneksi dari mana pun (CORS untuk SSE)
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });

  // Simpan koneksi visitor
  globalThis._chats = globalThis._chats || {};
  globalThis._chats[session] = globalThis._chats[session] || [];
  globalThis._chats[session].push(res);

  // Hapus koneksi kalau browser tutup
  req.on("close", () => {
    globalThis._chats[session] = globalThis._chats[session].filter(
      (r) => r !== res
    );
  });
}
