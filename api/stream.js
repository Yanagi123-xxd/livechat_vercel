export default function handler(req, res) {
  const { session } = req.query;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  globalThis._chats = globalThis._chats || {};
  globalThis._chats[session] = globalThis._chats[session] || [];
  globalThis._chats[session].push(res);

  req.on("close", () => {
    globalThis._chats[session] = globalThis._chats[session].filter(
      (r) => r !== res
    );
  });
}
