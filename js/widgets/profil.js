const ProfilWidget = {
  needs: { hunger: 100, happiness: 100, energy: 100 },
  messages: [
    'Çok güzel kokuyorsun 💕',
    'Çok güzel gözüküyorsun ✨',
    'Saçların çok güzel 🌸',
    'Güneş seni kıskanıyor ☀️',
    'Hayatımı aydınlatıyorsun 💫',
    'Işıltınla dünyam güzelleşiyor 🌟',
    'Bu kalp senden vazgeçmez fıstıkk 💖',
    'Kalbimm 🫀',
    'Prenses her zaman prensestir 👑',
    'Prensesimm 🌷'
  ],
  currentState: 'normal',
  animFrame: null,
  animTime: 0,
  currentAnim: 'idle',

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

    const svg = document.getElementById('catSvg');
    this.catAll = svg.querySelector('.cat-all');
    this.bodyPart = svg.querySelector('.cat-body-part');
    this.headPart = svg.querySelector('.cat-head-part');
    this.tailPart = svg.querySelector('.cat-tail-part');
    this.pawL = svg.querySelector('.cat-paw-l');
    this.pawR = svg.querySelector('.cat-paw-r');
    this.earL = svg.querySelector('.cat-ear-l');
    this.earR = svg.querySelector('.cat-ear-r');
    this.openEyes = svg.querySelector('.cat-eyes-open');
    this.closedEyes = svg.querySelector('.cat-eyes-closed');
    this.bigEyes = svg.querySelector('.cat-eyes-big');
    this.hearts = svg.querySelector('.cat-hearts');
    this.whiskers = svg.querySelector('.cat-whiskers');
    this.noseMouth = svg.querySelector('.cat-nose-mouth');

    this.loadNeeds();
    this.render();
    this.startAnimLoop();
    this.startNeedsDecay();
    this.startAutoMessages();

    this.petEl.addEventListener('click', () => this.petTap());
    this.feedBtn.addEventListener('click', () => this.feed());
    this.playBtn.addEventListener('click', () => this.playtime());
    this.setupPetting();
  },

  startAnimLoop() {
    const loop = (t) => {
      this.animTime = (t || 0) / 1000;
      this.updateAnimation();
      this.animFrame = requestAnimationFrame(loop);
    };
    this.animFrame = requestAnimationFrame(loop);
  },

  updateAnimation() {
    const t = this.animTime;
    switch (this.currentAnim) {
      case 'idle': this.animateIdle(t); break;
      case 'happy': this.animateHappy(t); break;
      case 'walk': this.animateWalk(t); break;
      case 'shake': this.animateShake(t); break;
    }
  },

  setAnim(name) {
    this.currentAnim = name;
    if (name === 'idle') {
      if (this.openEyes) this.openEyes.style.display = 'block';
      if (this.closedEyes) this.closedEyes.style.display = 'none';
      if (this.bigEyes) this.bigEyes.style.display = 'none';
      if (this.hearts) this.hearts.style.display = 'none';
    } else if (name === 'happy') {
      if (this.openEyes) this.openEyes.style.display = 'none';
      if (this.closedEyes) this.closedEyes.style.display = 'none';
      if (this.bigEyes) this.bigEyes.style.display = 'block';
      if (this.hearts) {
        this.hearts.style.display = 'block';
        this.hearts.style.opacity = '1';
        this.hearts.style.transform = 'translateY(0) scale(0.5)';
      }
    } else if (name === 'walk') {
      if (this.openEyes) this.openEyes.style.display = 'none';
      if (this.closedEyes) this.closedEyes.style.display = 'none';
      if (this.bigEyes) this.bigEyes.style.display = 'block';
      if (this.hearts) this.hearts.style.display = 'none';
    } else if (name === 'shake') {
      if (this.openEyes) this.openEyes.style.display = 'none';
      if (this.closedEyes) this.closedEyes.style.display = 'block';
      if (this.bigEyes) this.bigEyes.style.display = 'none';
      if (this.hearts) this.hearts.style.display = 'none';
    }
  },

  animateIdle(t) {
    const breathe = Math.sin(t * 2) * 1.5;
    const tailWag = Math.sin(t * 2.5) * 6;
    const nod = Math.sin(t * 2) * 0.5;
    const blink = (t % 4) > 3.85 ? 0 : 1;

    if (this.bodyPart) this.bodyPart.setAttribute('transform', `scaleY(${1 + breathe/100})`);
    if (this.headPart) this.headPart.setAttribute('transform', `translate(0, ${nod})`);
    if (this.tailPart) this.tailPart.setAttribute('transform', `rotate(${tailWag}, 155, 150)`);
    if (this.openEyes) this.openEyes.style.opacity = blink;
  },

  animateHappy(t) {
    const bounce = Math.sin(t * 3) * 3;
    const headTilt = 8 + Math.sin(t * 2.5) * 2;
    const pawLift = 18 + Math.sin(t * 3) * 2;
    const tailUp = -18 + Math.sin(t * 4) * 3;
    const earTwitch = -3 + Math.sin(t * 5) * 2;
    const whiskerWiggle = 1 + Math.sin(t * 4) * 0.1;
    const mouthOpen = 1 + Math.sin(t * 3) * 0.2;

    if (this.bodyPart) this.bodyPart.setAttribute('transform', `translate(0, ${-25 + bounce}) rotate(-4)`);
    if (this.headPart) this.headPart.setAttribute('transform', `translate(0, ${-28 + bounce * 0.5}) rotate(${headTilt})`);
    if (this.tailPart) this.tailPart.setAttribute('transform', `rotate(${tailUp}, 155, 150)`);
    if (this.pawL) this.pawL.setAttribute('transform', `translate(-8, ${-pawLift})`);
    if (this.pawR) this.pawR.setAttribute('transform', `translate(8, ${-pawLift})`);
    if (this.earL) this.earL.setAttribute('transform', `rotate(${earTwitch}, 66, 31)`);
    if (this.earR) this.earR.setAttribute('transform', `rotate(${earTwitch}, 134, 31)`);
    if (this.whiskers) this.whiskers.setAttribute('transform', `scale(${whiskerWiggle}, 1)`);
    if (this.noseMouth) this.noseMouth.setAttribute('transform', `scale(1, ${mouthOpen})`);

    if (this.hearts && this.hearts.style.display !== 'none') {
      this.hearts.style.opacity = Math.max(0, 1 - (t % 2));
      this.hearts.style.transform = `translateY(${-30 * (t % 2)}px) scale(${0.5 + 0.5 * (t % 2)})`;
    }
  },

  animateWalk(t) {
    const sway = Math.sin(t * 8) * 3;
    const headBob = Math.sin(t * 8) * 4;
    const pawStepL = Math.max(0, Math.sin(t * 8)) * 6;
    const pawStepR = Math.max(0, Math.sin(t * 8 + Math.PI)) * 6;
    const tailSway = Math.sin(t * 8) * 12;

    if (this.bodyPart) this.bodyPart.setAttribute('transform', `translate(${sway}, -5) rotate(${sway * 0.3})`);
    if (this.headPart) this.headPart.setAttribute('transform', `translate(${headBob * 0.5}, ${-3 + Math.abs(headBob) * 0.5}) rotate(${sway * 0.5})`);
    if (this.tailPart) this.tailPart.setAttribute('transform', `rotate(${tailSway}, 155, 150)`);
    if (this.pawL) this.pawL.setAttribute('transform', `translate(${-pawStepL * 0.5}, ${-pawStepL * 0.3})`);
    if (this.pawR) this.pawR.setAttribute('transform', `translate(${pawStepR * 0.5}, ${-pawStepR * 0.3})`);
  },

  animateShake(t) {
    const duration = 0.3;
    const localT = Math.min(t, duration * 3);
    const phase = localT / duration;
    const intensity = Math.max(0, 1 - (phase - Math.floor(phase)));

    if (this.bodyPart) this.bodyPart.setAttribute('transform', `translate(${Math.sin(phase * 50) * 5 * intensity}, 0) rotate(${Math.sin(phase * 40) * 2 * intensity})`);
    if (this.headPart) this.headPart.setAttribute('transform', `translate(${Math.sin(phase * 60) * 7 * intensity}, 0) rotate(${Math.sin(phase * 50) * 4 * intensity})`);
    if (this.tailPart) this.tailPart.setAttribute('transform', `rotate(${Math.sin(phase * 30) * 15 * intensity}, 155, 150)`);
    if (this.earL) this.earL.setAttribute('transform', `rotate(${Math.sin(phase * 40) * 8 * intensity}, 66, 31)`);
    if (this.earR) this.earR.setAttribute('transform', `rotate(${Math.sin(phase * 40 + 1) * 8 * intensity}, 134, 31)`);
    if (this.noseMouth) this.noseMouth.setAttribute('transform', `translate(${Math.sin(phase * 50) * 2 * intensity}, 0)`);
  },

  setupPetting() {
    let isPetting = false;
    let petCount = 0;

    const startPet = () => {
      isPetting = true;
      petCount++;
      this.setAnim('happy');
      setTimeout(() => {
        if (!isPetting) this.setAnim('idle');
      }, 800);
    };

    const endPet = () => {
      if (!isPetting) return;
      isPetting = false;
      this.setAnim('shake');
      setTimeout(() => { this.setAnim('idle'); }, 900);
      if (petCount > 3) {
        const msg = this.messages[Math.floor(Math.random() * this.messages.length)];
        this.showBubblePop(msg);
        this.needs.happiness = Math.min(100, this.needs.happiness + 3);
        this.saveNeeds();
      }
      petCount = 0;
    };

    this.petEl.addEventListener('mousemove', (e) => {
      if (e.buttons === 1) startPet();
    });
    this.petEl.addEventListener('mouseleave', endPet);
    this.petEl.addEventListener('touchmove', startPet, { passive: true });
    this.petEl.addEventListener('touchend', endPet);
    this.petEl.addEventListener('touchcancel', endPet);
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
    const bgColors = {
      normal: 'linear-gradient(145deg, rgba(255,215,160,0.18), rgba(255,165,0,0.1))',
      happy: 'linear-gradient(145deg, rgba(255,215,160,0.25), rgba(255,165,0,0.18))',
      hungry: 'linear-gradient(145deg, rgba(255,200,100,0.15), rgba(255,165,2,0.12))',
      sleepy: 'linear-gradient(145deg, rgba(150,150,255,0.12), rgba(100,100,255,0.08))'
    };
    this.petBubble.style.background = bgColors[this.currentState] || bgColors.normal;
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
    this.showBubblePop(msg);
    this.setAnim('happy');
    this.animHappyStart = this.animTime;
    setTimeout(() => {
      this.setAnim('shake');
      setTimeout(() => { this.setAnim('idle'); }, 900);
    }, 1200);
    this.needs.happiness = Math.min(100, this.needs.happiness + 5);
    this.updateState();
    this.saveNeeds();
    this.render();
  },

  showBubblePop(text) {
    this.petText.textContent = text;
    this.petBubble.classList.remove('bubble-pop');
    void this.petBubble.offsetWidth;
    this.petBubble.classList.add('bubble-pop');
  },

  feed() {
    this.needs.hunger = Math.min(100, this.needs.hunger + 30);
    this.petText.textContent = 'Çok lezzetliydi! 🥰';
    this.currentState = 'happy';
    this.saveNeeds();
    this.render();
    this.setAnim('happy');
    setTimeout(() => {
      this.setAnim('shake');
      setTimeout(() => { this.setAnim('idle'); }, 900);
    }, 1200);
  },

  playtime() {
    this.needs.happiness = Math.min(100, this.needs.happiness + 25);
    this.needs.energy = Math.max(0, this.needs.energy - 10);
    this.petText.textContent = 'Oyun oynadığımız için çok mutluyum! 🎉';
    this.currentState = 'happy';
    this.saveNeeds();
    this.render();
    this.setAnim('happy');
    setTimeout(() => {
      this.setAnim('walk');
      setTimeout(() => { this.setAnim('idle'); }, 1500);
    }, 1000);
  },

  startAutoMessages() {
    setInterval(() => {
      if (Math.random() > 0.6) return;
      const msgs = [];
      if (this.needs.hunger < 40) msgs.push('Karnım acıktı! 🍽️');
      if (this.needs.energy < 30) msgs.push('Uykum geldi... 😴');
      if (this.needs.happiness < 30) msgs.push('Benimle ilgilenir misin? 🥺');
      if (msgs.length === 0) msgs.push(this.messages[Math.floor(Math.random() * this.messages.length)]);
      this.showBubblePop(msgs[Math.floor(Math.random() * msgs.length)]);
    }, 15000 + Math.random() * 10000);
  }
};