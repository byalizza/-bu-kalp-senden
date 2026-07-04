// ============================================
// LOGIN WIDGET - Özel Tarih Şifresi
// ============================================

const LoginWidget = {
  init() {
    this.dayInput = document.getElementById('loginDay');
    this.monthInput = document.getElementById('loginMonth');
    this.yearInput = document.getElementById('loginYear');
    this.loginBtn = document.getElementById('loginBtn');
    this.loginError = document.getElementById('loginError');
    this.loginScreen = document.getElementById('loginScreen');
    this.welcomeOverlay = document.getElementById('welcomeOverlay');
    this.mainApp = document.getElementById('mainApp');

    this.setupListeners();
    this.createParticles();
  },

  setupListeners() {
    this.loginBtn.addEventListener('click', () => this.checkPassword());

    // Enter tuşu ile giriş
    const inputs = [this.dayInput, this.monthInput, this.yearInput];
    inputs.forEach((input, i) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.checkPassword();
        }
        // Otomatik sonraki alana geç
        if (e.key === 'Tab') return;
        const maxLen = parseInt(input.maxLength);
        if (input.value.length >= maxLen && i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      });
      input.addEventListener('input', () => {
        this.loginError.classList.remove('show');
        const maxLen = parseInt(input.maxLength);
        if (input.value.length >= maxLen && i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      });
    });
  },

  createParticles() {
    const container = document.getElementById('loginParticles');
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (4 + Math.random() * 6) + 's';
      particle.style.animationDelay = (Math.random() * 8) + 's';
      particle.style.width = (2 + Math.random() * 4) + 'px';
      particle.style.height = particle.style.width;
      particle.style.opacity = 0.1 + Math.random() * 0.3;
      container.appendChild(particle);
    }
  },

  checkPassword() {
    const day = parseInt(this.dayInput.value);
    const month = parseInt(this.monthInput.value);
    const year = parseInt(this.yearInput.value);

    const secret = APP_CONFIG.secretDate;

    if (day === secret.day && month === secret.month && year === secret.year) {
      this.loginSuccess();
    } else {
      this.showError('Bu tarih bize ait değil... Bir daha dene 💕');
      this.shakeForm();
    }
  },

  showError(msg) {
    this.loginError.textContent = msg;
    this.loginError.classList.add('show');
  },

  shakeForm() {
    const form = document.querySelector('.login-form');
    form.style.animation = 'shake 0.5s ease';
    setTimeout(() => form.style.animation = '', 500);
  },

  loginSuccess() {
    // Hoş geldin mesajını göster
    document.getElementById('welcomeName').textContent = APP_CONFIG.welcomeName;
    this.loginScreen.style.display = 'none';
    this.welcomeOverlay.style.display = 'flex';

    // Özel animasyon - konfeti
    if (typeof ConfettiEffects !== 'undefined') {
      ConfettiEffects.fire(3000);
    }

    // 3 saniye sonra ana uygulamaya geç
    setTimeout(() => {
      this.welcomeOverlay.style.opacity = '0';
      this.welcomeOverlay.style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        this.welcomeOverlay.style.display = 'none';
        this.mainApp.style.display = 'flex';

        // Müzik başlat
        if (typeof MusicWidget !== 'undefined') {
          MusicWidget.autoPlay();
        }

        // Sayaç başlat
        if (typeof CounterWidget !== 'undefined') {
          CounterWidget.start();
        }

        // Bildirim zamanlayıcısını başlat
        if (typeof MascotWidget !== 'undefined') {
          MascotWidget.startNotificationTimer();
        }
      }, 600);
    }, 3000);
  }
};

// Shake animasyonu ekle
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
    20%, 40%, 60%, 80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(styleSheet);
