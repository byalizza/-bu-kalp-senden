// ============================================
// MASCOT WIDGET - Sanal Evcil Hayvan (Pofuduk)
// ============================================

const MascotWidget = {
  messageQueue: [],
  notificationTimer: null,

  init() {
    this.pet = document.getElementById('pet');
    this.petBubble = document.getElementById('petBubble');
    this.petMessage = document.getElementById('petMessage');
    this.chatMessages = document.getElementById('petChatMessages');
    this.chatInput = document.getElementById('petChatInput');
    this.chatSend = document.getElementById('petChatSend');
    this.petContainer = document.getElementById('petContainer');
    this.statusBadge = document.getElementById('petStatusBadge');
    this.petEyes = document.querySelectorAll('.pet-pupil');

    this.messages = [...APP_CONFIG.petMessages];
    this.responses = APP_CONFIG.chatResponses;

    this.setupListeners();
    this.startIdleAnimations();
    this.showRandomMessage(3000);
  },

  setupListeners() {
    this.petContainer.addEventListener('click', () => {
      this.petInteraction();
    });

    this.chatSend.addEventListener('click', () => this.sendChatMessage());
    this.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.sendChatMessage();
    });

    // Fare/göz takibi
    document.addEventListener('mousemove', (e) => this.followCursor(e));
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      if (touch) this.followCursor(touch);
    }, { passive: true });
  },

  followCursor(e) {
    const rect = this.pet.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    const moveX = Math.max(-3, Math.min(3, deltaX * 4));
    const moveY = Math.max(-3, Math.min(3, deltaY * 4));

    this.petEyes.forEach(eye => {
      eye.style.transform = `translate(calc(-50% + ${moveX}px), calc(-30% + ${moveY}px))`;
    });
  },

  petInteraction() {
    this.pet.classList.add('jump');
    this.pet.classList.add('happy');

    setTimeout(() => {
      this.pet.classList.remove('jump');
    }, 500);

    setTimeout(() => {
      this.pet.classList.remove('happy');
    }, 1500);

    this.showRandomMessage(0);
    this.statusBadge.textContent = 'Mutlu';

    setTimeout(() => {
      this.statusBadge.textContent = 'Sakin';
    }, 3000);
  },

  showRandomMessage(delay = 0) {
    setTimeout(() => {
      const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
      this.petMessage.textContent = msg;
      this.petBubble.style.opacity = '1';
      this.petBubble.style.transform = 'translateY(0)';

      setTimeout(() => {
        this.petBubble.style.opacity = '0.7';
      }, 4000);
    }, delay);
  },

  sendChatMessage() {
    const text = this.chatInput.value.trim();
    if (!text) return;

    // Kullanıcı mesajını ekle
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user-msg';
    userMsg.textContent = text;
    this.chatMessages.appendChild(userMsg);

    this.chatInput.value = '';

    // Yanıt bul
    const response = this.findResponse(text);
    setTimeout(() => {
      const petMsg = document.createElement('div');
      petMsg.className = 'chat-msg pet-msg';
      petMsg.textContent = response;
      this.chatMessages.appendChild(petMsg);

      // Konuşma balonunu güncelle
      this.petMessage.textContent = response;
      this.petBubble.style.opacity = '1';

      // Otomatik kaydır
      this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }, 600 + Math.random() * 600);

    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },

  findResponse(text) {
    const lower = text.toLowerCase();

    for (const item of this.responses) {
      for (const keyword of item.keywords) {
        if (lower.includes(keyword)) {
          return item.response;
        }
      }
    }

    const fallbacks = [
      'Çok tatlısın! Bunu söylediğine sevindim! 💕',
      'Ne güzel bir şey söyledin! 😊',
      'Her sözün çok değerli benim için! ✨',
      'Bunu duymak harikaydı! 💖',
      'Seninle konuşmak çok güzel! 🥰',
      'Anlıyorum, devam et lütfen... 🐾'
    ];

    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  },

  startIdleAnimations() {
    // Her 8-12 saniyede bir mesaj göster
    setInterval(() => {
      if (Math.random() > 0.4) return;
      this.showRandomMessage(0);
    }, 8000 + Math.random() * 4000);
  },

  startNotificationTimer() {
    const interval = APP_CONFIG.notificationInterval || 3600000;

    // Test için 2 dakikada bir bildirim (gerçekte 1 saat)
    const testInterval = 2 * 60 * 1000;

    this.notificationTimer = setInterval(() => {
      this.showNotification();
    }, testInterval);

    // İlk bildirimi 30 sn sonra göster
    setTimeout(() => {
      this.showNotification();
    }, 30000);
  },

  showNotification() {
    const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
    const toast = document.getElementById('notificationToast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');

    toastIcon.textContent = '🐣';
    toastMessage.textContent = msg;

    toast.style.display = 'flex';
    toast.style.animation = 'none';
    void toast.offsetHeight;
    toast.style.animation = 'toastSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        toast.style.display = 'none';
        toast.style.opacity = '1';
      }, 500);
    }, 4000);
  }
};
