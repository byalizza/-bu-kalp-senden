// ============================================
// LOGIN + USER SELECTION
// ============================================

const LoginWidget = {
  currentUser: null,

  init() {
    this.dayInput = document.getElementById('loginDay');
    this.monthInput = document.getElementById('loginMonth');
    this.yearInput = document.getElementById('loginYear');
    this.loginBtn = document.getElementById('loginBtn');
    this.loginError = document.getElementById('loginError');
    this.loginScreen = document.getElementById('loginScreen');
    this.userSelectScreen = document.getElementById('userSelectScreen');
    this.welcomeOverlay = document.getElementById('welcomeOverlay');
    this.mainApp = document.getElementById('mainApp');

    this.setupListeners();
    this.createParticles('loginParticles');
    this.createParticles('selectParticles');

    // Kayıtlı kullanıcı varsa doğrudan ilerle
    const saved = localStorage.getItem('app_user');
    if (saved) {
      this.currentUser = saved;
      if (saved === 'ela') {
        this.enterAsEla();
      } else {
        this.showLoginScreen();
      }
    } else {
      this.userSelectScreen.style.display = 'flex';
    }
  },

  setupListeners() {
    document.getElementById('selectEfeBtn').addEventListener('click', () => {
      this.currentUser = 'efe';
      localStorage.setItem('app_user', 'efe');
      this.userSelectScreen.style.display = 'none';
      this.showLoginScreen();
    });

    document.getElementById('selectElaBtn').addEventListener('click', () => {
      this.currentUser = 'ela';
      localStorage.setItem('app_user', 'ela');
      this.enterAsEla();
    });

    this.loginBtn.addEventListener('click', () => this.checkPassword());

    const inputs = [this.dayInput, this.monthInput, this.yearInput];
    inputs.forEach((input, i) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.checkPassword();
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

  createParticles(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (4 + Math.random() * 6) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.width = (2 + Math.random() * 4) + 'px';
      p.style.height = p.style.width;
      p.style.opacity = 0.1 + Math.random() * 0.3;
      container.appendChild(p);
    }
  },

  showLoginScreen() {
    this.loginScreen.style.display = 'flex';
    this.loginScreen.style.animation = 'fadeIn 0.6s ease';
  },

  enterAsEla() {
    this.userSelectScreen.style.display = 'none';
    this.loginScreen.style.display = 'none';
    this.goToApp();
  },

  checkPassword() {
    const day = parseInt(this.dayInput.value);
    const month = parseInt(this.monthInput.value);
    const year = parseInt(this.yearInput.value);
    const secret = APP_CONFIG.secretDate;

    if (day === secret.day && month === secret.month && year === secret.year) {
      this.goToApp();
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

  goToApp() {
    const name = this.currentUser === 'ela' ? 'Ela' : 'Efe';
    document.getElementById('welcomeName').textContent = name;

    this.loginScreen.style.display = 'none';
    this.welcomeOverlay.style.display = 'flex';

    if (typeof ConfettiEffects !== 'undefined') {
      ConfettiEffects.fire(3000);
    }

    // Kullanıcı bilgisini global'e yaz
    window.currentUser = this.currentUser;

    setTimeout(() => {
      this.welcomeOverlay.style.opacity = '0';
      this.welcomeOverlay.style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        this.welcomeOverlay.style.display = 'none';
        this.mainApp.style.display = 'flex';

        if (typeof MusicWidget !== 'undefined') MusicWidget.autoPlay();
        if (typeof CounterWidget !== 'undefined') CounterWidget.start();
        if (typeof MessageWidget !== 'undefined') MessageWidget.init();
      }, 600);
    }, 3000);
  }
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
    20%, 40%, 60%, 80% { transform: translateX(6px); }
  }
`;
document.head.appendChild(styleSheet);
