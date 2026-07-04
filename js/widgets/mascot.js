// ============================================
// MESSAGE WIDGET - Pofuduk + Kalıcı Mesajlaşma
// Firebase ile senkron, mesajlar hiç silinmez
// ============================================

const MessageWidget = {
  dbRef: null,
  messages: [],
  initialized: false,
  petMessages: [
    'Seni çok seviyorum! 💕',
    'Seni çok özledim! 😊',
    'Karnım acıktı, beni doyur! 🐾',
    'Hadi oyun oynayalım! 🎾',
    'Seninle olmak çok güzel! ✨',
    'Dünyanın en tatlı insanısın! 🌟',
    'Sarıl bana lütfen! 🤗',
    'Bugün harika görünüyorsun! 💫',
    'Beraber çok mutluyum! 🥰',
    'Gülüşün dünyayı aydınlatıyor! ☀️'
  ],

  init() {
    if (this.initialized) return;
    this.initialized = true;

    this.msgList = document.getElementById('msgList');
    this.msgInput = document.getElementById('msgInput');
    this.msgSendBtn = document.getElementById('msgSendBtn');
    this.petEl = document.getElementById('msgPet');
    this.petBubble = document.getElementById('msgPetBubble');
    this.petText = document.getElementById('msgPetText');
    this.petEmoji = document.getElementById('msgPetEmoji');

    this.user = window.currentUser || 'efe';
    this.badge = document.getElementById('msgBadge');
    this.navBtn = document.getElementById('navMesaj');

    this.setupListeners();
    this.setupFirebase();
    this.loadLocalMessages();
    this.startPetAnimations();
  },

  setupListeners() {
    this.msgSendBtn.addEventListener('click', () => this.sendMessage());
    this.msgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Pofuduk'a tıklama / sevme
    this.petEl.addEventListener('click', () => this.petInteraction());
  },

  petInteraction() {
    this.petEmoji.style.transform = 'scale(1.4)';
    setTimeout(() => { this.petEmoji.style.transform = 'scale(1)'; }, 300);

    const msg = this.petMessages[Math.floor(Math.random() * this.petMessages.length)];
    this.petText.textContent = msg;
    this.petBubble.style.background = 'rgba(255,107,107,0.15)';
    setTimeout(() => { this.petBubble.style.background = 'rgba(255,107,107,0.08)'; }, 500);
  },

  startPetAnimations() {
    setInterval(() => {
      if (Math.random() > 0.5) return;
      const msg = this.petMessages[Math.floor(Math.random() * this.petMessages.length)];
      this.petText.textContent = msg;
    }, 10000 + Math.random() * 8000);
  },

  setupFirebase() {
    const db = getDatabase();
    if (!db) return;

    const path = APP_CONFIG.firebasePaths.messages;
    this.dbRef = db.ref(path);

    // Firebase bağlantı hatasını sessizce yönet
    this.dbRef.limitToLast(1).on('child_added', (snapshot) => {
      try {
        const msg = snapshot.val();
        if (msg && msg.id) {
          const exists = this.messages.some(m => m.id === msg.id);
          if (!exists) {
            this.messages.push(msg);
            this.renderMessage(msg);
            this.saveToLocal(msg);
            const isActive = document.getElementById('petWidget').classList.contains('active');
            if (isActive) {
              this.scrollToBottom();
            } else {
              this.showBadge();
            }
          }
        }
      } catch (e) { /* ignore */ }
    }, (err) => { /* permission denied - ignore */ });

    this.dbRef.once('value', (snapshot) => {
      try {
        const data = snapshot.val();
        if (!data) return;

        const loaded = [];
        Object.values(data).forEach(msg => {
          if (msg && msg.id) {
            const exists = this.messages.some(m => m.id === msg.id);
            if (!exists) loaded.push(msg);
          }
        });

        if (loaded.length > 0) {
          loaded.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          this.messages = [...this.messages, ...loaded];
          this.msgList.innerHTML = '';
          this.messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
          this.messages.forEach(msg => { this.renderMessage(msg); this.saveToLocal(msg); });
          this.scrollToBottom();
        }
      } catch (e) { /* ignore */ }
    }, (err) => { /* permission denied - ignore */ });
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
    } catch (e) { /* ignore */ }
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

    this.messages.push(msg);
    this.renderMessage(msg);
    this.saveToLocal(msg);
    this.scrollToBottom();

    const db = getDatabase();
    if (db && this.dbRef) {
      this.dbRef.push(msg).catch(() => {});
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
      if (!saved.some(m => m.id === msg.id)) {
        saved.push(msg);
        localStorage.setItem('chat_messages', JSON.stringify(saved));
      }
    } catch (e) { /* ignore */ }
  },

  showBadge() { if (this.badge) this.badge.style.display = 'block'; },

  hideBadge() { if (this.badge) this.badge.style.display = 'none'; },

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
