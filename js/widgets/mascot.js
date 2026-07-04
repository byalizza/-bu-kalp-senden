// ============================================
// MESSAGE WIDGET - Kalıcı Mesajlaşma (Pofuduk)
// Firebase ile senkron, mesajlar hiç silinmez
// ============================================

const MessageWidget = {
  dbRef: null,
  messages: [],
  initialized: false,

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.msgList = document.getElementById('msgList');
    this.msgInput = document.getElementById('msgInput');
    this.msgSendBtn = document.getElementById('msgSendBtn');

    this.user = window.currentUser || 'efe';

    this.setupListeners();
    this.setupFirebase();
    this.loadLocalMessages();
  },

  setupListeners() {
    this.msgSendBtn.addEventListener('click', () => this.sendMessage());
    this.msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  },

  setupFirebase() {
    const db = getDatabase();
    if (!db) return;

    const path = APP_CONFIG.firebasePaths.messages;
    this.dbRef = db.ref(path);

    // Yeni mesajları dinle
    this.dbRef.limitToLast(1).on('child_added', (snapshot) => {
      const msg = snapshot.val();
      if (msg && msg.id) {
        // Local'de yoksa ekle
        const exists = this.messages.some(m => m.id === msg.id);
        if (!exists) {
          this.messages.push(msg);
          this.renderMessage(msg);
          this.saveToLocal(msg);
        }
      }
    });

    // Tüm mesajları ilk yüklemede al
    this.dbRef.once('value', (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const loaded = [];
      Object.values(data).forEach(msg => {
        if (msg && msg.id) {
          const exists = this.messages.some(m => m.id === msg.id);
          if (!exists) {
            loaded.push(msg);
          }
        }
      });

      if (loaded.length > 0) {
        // Tarihe göre sırala
        loaded.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        this.messages = [...this.messages, ...loaded];

        // Local'e kaydet ve render et
        this.msgList.innerHTML = '';
        this.messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        this.messages.forEach(msg => {
          this.renderMessage(msg);
          this.saveToLocal(msg);
        });
        this.scrollToBottom();
      }
    });
  },

  loadLocalMessages() {
    try {
      const saved = JSON.parse(localStorage.getItem('chat_messages') || '[]');
      if (saved.length > 0 && this.messages.length === 0) {
        this.messages = saved;
        this.messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        this.messages.forEach(msg => this.renderMessage(msg));
        this.scrollToBottom();
      }
    } catch (e) {
      console.warn('Local mesaj yüklenemedi:', e);
    }
  },

  sendMessage() {
    const text = this.msgInput.value.trim();
    if (!text) return;

    const msg = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
      from: this.user,
      text: text,
      timestamp: Date.now()
    };

    this.msgInput.value = '';

    // Önce local ekle (anında göster)
    this.messages.push(msg);
    this.renderMessage(msg);
    this.saveToLocal(msg);
    this.scrollToBottom();

    // Firebase'e gönder
    const db = getDatabase();
    if (db && this.dbRef) {
      this.dbRef.push(msg).catch(err => {
        console.warn('Firebase mesaj gönderilemedi:', err);
      });
    }
  },

  renderMessage(msg) {
    const sender = msg.from === 'efe' ? 'Efe' : 'Ela';
    const isMe = msg.from === this.user;
    const bubbleClass = msg.from === 'efe' ? 'msg-efe' : 'msg-ela';

    const div = document.createElement('div');
    div.className = `msg-bubble ${bubbleClass}`;
    div.innerHTML = `
      ${!isMe ? `<span class="msg-sender">${sender}</span>` : ''}
      <span class="msg-text">${this.escapeHtml(msg.text)}</span>
      <span class="msg-time">${this.formatTime(msg.timestamp)}</span>
    `;
    div.dataset.msgId = msg.id;
    this.msgList.appendChild(div);
  },

  saveToLocal(msg) {
    try {
      const saved = JSON.parse(localStorage.getItem('chat_messages') || '[]');
      const exists = saved.some(m => m.id === msg.id);
      if (!exists) {
        saved.push(msg);
        localStorage.setItem('chat_messages', JSON.stringify(saved));
      }
    } catch (e) {
      // ignore
    }
  },

  scrollToBottom() {
    setTimeout(() => {
      this.msgList.scrollTop = this.msgList.scrollHeight;
    }, 50);
  },

  formatTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    if (isToday) return `${hours}:${mins}`;
    return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')} ${hours}:${mins}`;
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};
