// ============================================
// MAIN APP - Bu Kalp Senden Vazgeçmeyecek
// ============================================

const App = {
  isReady: false,

  async init() {
    initFirebase();

    setTimeout(() => {
      document.getElementById('splashScreen').style.display = 'none';
      document.getElementById('loginScreen').style.display = 'flex';
      document.getElementById('loginScreen').style.animation = 'fadeIn 0.6s ease';

      this.initializeWidgets();
      this.setupNavigation();
    }, 2800);
  },

  initializeWidgets() {
    try { LoginWidget.init(); } catch (e) { console.warn('Login hatası:', e); }
    try { CounterWidget.init(); } catch (e) { console.warn('Sayaç hatası:', e); }
    try { MusicWidget.init(); } catch (e) { console.warn('Müzik hatası:', e); }
    try { MemoriesWidget.init(); } catch (e) { console.warn('Anılar hatası:', e); }
    try { LocketWidget.init(); } catch (e) { console.warn('Şipşak hatası:', e); }

    // MessageWidget sadece welcome sonrası init edilir (login.js içinde)
    this.isReady = true;
    console.log('💖 Bu Kalp Senden Vazgeçmeyecek - Uygulama hazır!');
  },

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.dataset.target;

        navItems.forEach(n => n.classList.remove('active'));
        item.classList.add('active');

        document.querySelectorAll('.widget').forEach(w => w.classList.remove('active'));
        const target = document.getElementById(targetId);
        if (target) target.classList.add('active');

        if (targetId === 'petWidget' && typeof MessageWidget !== 'undefined') {
          MessageWidget.hideBadge();
          MessageWidget.scrollToBottom();
        }
      });
    });
  }
};

// ============================================
// CONFETTI EFFECTS
// ============================================

const ConfettiEffects = {
  fire(duration = 2000) {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff6b6b', '#fd79a8', '#ff9f9f', '#e17055', '#fdcb6e', '#ff7675', '#d63031'];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 4,
        speedY: 2 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        decay: 0.005 + Math.random() * 0.01
      });
    }

    const startTime = Date.now();

    function animate() {
      const elapsed = Date.now() - startTime;
      if (elapsed > duration) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.05;
        p.rotation += p.rotationSpeed;
        p.opacity -= p.decay;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation * Math.PI / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      });

      requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, duration + 500);
  }
};

// ============================================
// BAŞLANGIÇ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
