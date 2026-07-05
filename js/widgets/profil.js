const ProfilWidget = {
  needs: { hunger: 100, happiness: 100, energy: 100 },
  messages: [
    'Seni çok seviyorum! 💕', 'Seni çok özledim! 😊', 'Karnım acıktı, beni doyur! 🐾',
    'Hadi oyun oynayalım! 🎾', 'Seninle olmak çok güzel! ✨', 'Dünyanın en tatlı insanısın! 🌟',
    'Sarıl bana lütfen! 🤗', 'Bugün harika görünüyorsun! 💫', 'Beraber çok mutluyum! 🥰',
    'Gülüşün dünyayı aydınlatıyor! ☀️'
  ],
  petStates: {
    normal: { emoji: '🐣', bg: 'rgba(255,71,87,0.12)' },
    happy: { emoji: '🥰', bg: 'rgba(255,71,87,0.2)' },
    hungry: { emoji: '🍽️', bg: 'rgba(255,165,2,0.12)' },
    sleepy: { emoji: '😴', bg: 'rgba(100,100,255,0.12)' }
  },
  currentState: 'normal',

  init() {
    this.petEl = document.getElementById('profilPet');
    this.petEmoji = document.getElementById('profilPetEmoji');
    this.petBubble = document.getElementById('profilPetBubble');
    this.petText = document.getElementById('profilPetText');
    this.hungerBar = document.getElementById('profilHunger');
    this.happinessBar = document.getElementById('profilHappiness');
    this.energyBar = document.getElementById('profilEnergy');
    this.feedBtn = document.getElementById('profilFeedBtn');
    this.playBtn = document.getElementById('profilPlayBtn');

    this.loadNeeds();
    this.render();
    this.startNeedsDecay();
    this.startAutoMessages();

    this.petEl.addEventListener('click', () => this.petTap());
    this.feedBtn.addEventListener('click', () => this.feed());
    this.playBtn.addEventListener('click', () => this.playtime());
  },

  loadNeeds() {
    try {
      const s = JSON.parse(localStorage.getItem('pet_needs') || 'null');
      if (s) this.needs = s;
    } catch (e) {}
  },

  saveNeeds() {
    try { localStorage.setItem('pet_needs', JSON.stringify(this.needs)); } catch (e) {}
  },

  render() {
    const state = this.petStates[this.currentState] || this.petStates.normal;
    this.petEmoji.textContent = state.emoji;
    this.petBubble.style.background = state.bg;

    this.hungerBar.style.width = this.needs.hunger + '%';
    this.happinessBar.style.width = this.needs.happiness + '%';
    this.energyBar.style.width = this.needs.energy + '%';
  },

  startNeedsDecay() {
    setInterval(() => {
      this.needs.hunger = Math.max(0, this.needs.hunger - 2);
      this.needs.happiness = Math.max(0, this.needs.happiness - 1);
      this.needs.energy = Math.max(0, this.needs.energy - 1);
      this.updateState();
      this.saveNeeds();
      this.render();
    }, 30000);
  },

  updateState() {
    if (this.needs.hunger < 30) this.currentState = 'hungry';
    else if (this.needs.energy < 30) this.currentState = 'sleepy';
    else if (this.needs.happiness > 70) this.currentState = 'happy';
    else this.currentState = 'normal';
  },

  petTap() {
    const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
    this.petText.textContent = msg;
    this.petEmoji.style.transform = 'scale(1.4)';
    setTimeout(() => { this.petEmoji.style.transform = 'scale(1)'; }, 300);
    this.needs.happiness = Math.min(100, this.needs.happiness + 5);
    this.updateState();
    this.saveNeeds();
    this.render();
  },

  feed() {
    this.needs.hunger = Math.min(100, this.needs.hunger + 30);
    this.petText.textContent = 'Çok lezzetliydi! 🥰';
    this.currentState = 'happy';
    this.saveNeeds();
    this.render();
    this.petEmoji.style.transform = 'scale(1.3)';
    setTimeout(() => { this.petEmoji.style.transform = 'scale(1)'; }, 300);
  },

  playtime() {
    this.needs.happiness = Math.min(100, this.needs.happiness + 25);
    this.needs.energy = Math.max(0, this.needs.energy - 10);
    this.petText.textContent = 'Oyun oynadığımız için çok mutluyum! 🎉';
    this.currentState = 'happy';
    this.saveNeeds();
    this.render();
  },

  startAutoMessages() {
    setInterval(() => {
      if (Math.random() > 0.6) return;
      const msgs = [];
      if (this.needs.hunger < 40) msgs.push('Karnım acıktı! 🍽️');
      if (this.needs.energy < 30) msgs.push('Uykum geldi... 😴');
      if (this.needs.happiness < 30) msgs.push('Benimle ilgilenir misin? 🥺');
      if (msgs.length === 0) msgs.push(this.messages[Math.floor(Math.random() * this.messages.length)]);
      this.petText.textContent = msgs[Math.floor(Math.random() * msgs.length)];
    }, 15000 + Math.random() * 10000);
  }
};
