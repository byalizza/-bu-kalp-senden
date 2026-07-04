// ============================================
// MAIN APP - Bu Kalp Senden Vazgeçmeyecek
// ============================================

const App = {
  isReady: false,

  async init() {
    // Firebase başlat
    initFirebase();

    // Splash ekranını bekle
    setTimeout(() => {
      document.getElementById('splashScreen').style.display = 'none';
      document.getElementById('loginScreen').style.display = 'flex';
      document.getElementById('loginScreen').style.animation = 'fadeIn 0.6s ease';

      // Widget'ları başlat
      this.initializeWidgets();
      this.setupNavigation();
    }, 2800);
  },

  initializeWidgets() {
    LoginWidget.init();
    CounterWidget.init();
    MusicWidget.init();
    MascotWidget.init();
    MemoriesWidget.init();
    LocketWidget.init();

    this.isReady = true;
    console.log('💖 Bu Kalp Senden Vazgeçmeyecek - Uygulama hazır!');
  },

  setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const widgets = document.querySelectorAll('.widget');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const targetId = item.dataset.target;
        const targetWidget = document.getElementById(targetId);

        if (targetWidget) {
          // Aktif nav'ı güncelle
          navItems.forEach(n => n.classList.remove('active'));
          item.classList.add('active');

          // Widget'a kaydır
          targetWidget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Scroll ile aktif nav'ı güncelle
    const container = document.getElementById('widgetContainer');
    container.addEventListener('scroll', () => {
      this.updateActiveNav();
    });
  },

  updateActiveNav() {
    const container = document.getElementById('widgetContainer');
    const widgets = document.querySelectorAll('.widget');
    const navItems = document.querySelectorAll('.nav-item');

    let closestWidget = null;
    let closestDist = Infinity;

    widgets.forEach(widget => {
      const rect = widget.getBoundingClientRect();
      const dist = Math.abs(rect.top - 100);
      if (dist < closestDist) {
        closestDist = dist;
        closestWidget = widget;
      }
    });

    if (closestWidget) {
      navItems.forEach(item => {
        item.classList.toggle('active', item.dataset.target === closestWidget.id);
      });
    }
  }
};

// ============================================
// CONFETTI EFFECTS
// ============================================

const ConfettiEffects = {
  fire(duration = 2000) {
    const canvas = document.getElementById('confettiCanvas');
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

    // Canvas'ı temizle
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

// ============================================
// GLOBAL NAVIGATION
// ============================================

// Sayfa yeniden boyutlandığında düzgün görüntüleme
window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

// İlk yüklemede de çalıştır
document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
