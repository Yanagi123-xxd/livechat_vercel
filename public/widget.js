(function() {
  // 🧭 BASE URL backend kamu di Vercel
  const API_BASE = "https://livechat-vercel.vercel.app";

  // Buat bubble
  const bubble = document.createElement('div');
  bubble.id = 'chat-bubble';
  bubble.innerHTML = '💬';
  Object.assign(bubble.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: '#0078FF',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    zIndex: 9999
  });
  document.body.appendChild(bubble);

  // Buat container chat
  const chatBox = document.createElement('div');
  chatBox.id = 'chat-box';
  chatBox.innerHTML = `
    <div style="background:#0078FF;color:white;padding:10px;border-radius:8px 8px 0 0;font-weight:bold">Live Chat</div>
    <div id="chat-messages" style="height:250px;overflow-y:auto;padding:8px;background:white"></div>
    <div style="display:flex;border-top:1px solid #ddd">
      <input id="chat-input" style="flex:1;padding:8px;border:none;outline:none" placeholder="Tulis pesan...">
      <button id="chat-send" style="background:#0078FF;color:white;border:none;padding:8px 12px;cursor:pointer;">Kirim</button>
    </div>
  `;
  Object.assign(chatBox.style, {
    position: 'fixed',
    bottom: '100px',
    right: '20px',
    width: '300px',
    borderRadius: '8px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
    display: 'none',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 9998,
    background: 'white',
    fontFamily: 'sans-serif'
  });
  document.body.appendChild(chatBox);

  const session = localStorage.getItem("session") || Math.random().toString(36).slice(2);
  localStorage.setItem("session", session);
  const chat = chatBox.querySelector("#chat-messages");
  const input = chatBox.querySelector("#chat-input");
  const sendBtn = chatBox.querySelector("#chat-send");

  // Toggle bubble
  bubble.onclick = () => {
    const visible = chatBox.style.display === 'flex';
    chatBox.style.display = visible ? 'none' : 'flex';
  };

  // Kirim pesan
  sendBtn.onclick = async () => {
    const text = input.value.trim();
    if (!text) return;
    chat.innerHTML += `<div><b>Anda:</b> ${text}</div>`;
    input.value = '';
    chat.scrollTop = chat.scrollHeight;

    try {
      const res = await fetch(`${API_BASE}/api/send.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, session })
      });
      if (!res.ok) console.error("Gagal kirim pesan:", res.statusText);
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // Stream balasan (real-time)
  const evt = new EventSource(`${API_BASE}/api/stream?session=${session}`);
  evt.onmessage = (e) => {
    const data = JSON.parse(e.data);
    chat.innerHTML += `<div style="color:blue"><b>Admin:</b> ${data.text}</div>`;
    chat.scrollTop = chat.scrollHeight;
  };
})();
