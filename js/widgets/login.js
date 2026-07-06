// ============================================
// LOGIN + USER SELECTION
// ============================================

const LoginWidget = {
  currentUser: null,

  init() {
    this.pinInput = document.getElementById('loginPin');
    this.loginBtn = document.getElementById('loginBtn');
    this.loginError = document.getElementById('loginError');
    this.loginScreen = document.getElementById('loginScreen');
    this.userSelectScreen = document.getElementById('userSelectScreen');
    this.welcomeOverlay = document.getElementById('welcomeOverlay');
    this.mainApp = document.getElementById('mainApp');

    this.setupListeners();
    this.createParticles('loginParticles');
    this.createParticles('selectParticles');

    // IP bazlı şifre atlama (senkron önce)
    if (this.checkBypass()) return;

    // Eski sistem varsa temizle
    if (localStorage.getItem('last_user')) localStorage.removeItem('last_user');

    // Kayıtlı kullanıcı varsa direkt şifre ekranı
    const saved = localStorage.getItem('app_user');
    if (saved) {
      this.currentUser = saved;
      window.currentUser = saved;
      this.showLoginScreen();
      return;
    }

    // İlk açılış: Firebase'den hangi kullanıcılar alınmış kontrol et
    const db = getDatabase();
    if (db) {
      db.ref('claimed').once('value', (snap) => {
        const data = snap.val() || {};
        if (!data.efe) {
          this.userSelectScreen.style.display = 'flex';
        } else if (!data.ela) {
          this.autoAssign('ela');
        } else {
          this.userSelectScreen.style.display = 'flex';
        }
      }, () => {
        this.userSelectScreen.style.display = 'flex';
      });
    } else {
      this.userSelectScreen.style.display = 'flex';
    }
  },

  // true dönerse bypass yapıldı, init durmalı
  checkBypass() {
    const ips = APP_CONFIG.bypassIPs;
    if (!ips || ips.length === 0) return false;

    const cached = sessionStorage.getItem('bypass_ok');
    if (cached === '1') { this.bypassLogin(); return true; }
    if (cached === '0') return false;

    // İlk defa kontrol: API'ye sor, cevap gelince bypass kararını ver
    this._asyncBypassPending = true;
    fetch('https://api.ipify.org?format=json')
      .then(r => r.json())
      .then(data => {
        if (data.ip && ips.includes(data.ip)) {
          sessionStorage.setItem('bypass_ok', '1');
          // Sayfa zaten yüklenmiş olabilir, mevcut UI'ı gizleyip app'i aç
          this.bypassLogin();
        } else {
          sessionStorage.setItem('bypass_ok', '0');
        }
      })
      .catch(() => { sessionStorage.setItem('bypass_ok', '0'); });
    return false;
  },

  bypassLogin() {
    // Tüm giriş ekranlarını gizle
    const hide = (el) => { if (el) el.style.display = 'none'; };
    hide(this.userSelectScreen);
    hide(this.loginScreen);
    hide(this.welcomeOverlay);
    if (this.mainApp) this.mainApp.style.display = 'flex';

    this.currentUser = localStorage.getItem('app_user') || 'ela';
    window.currentUser = this.currentUser;
    if (typeof KalbimWidget !== 'undefined') KalbimWidget.autoPlay();
  },

  autoAssign(user) {
    this.currentUser = user;
    window.currentUser = user;
    localStorage.setItem('app_user', user);
    // Firebase'e kaydet
    const db = getDatabase();
    if (db) {
      db.ref(`claimed/${user}`).set(navigator.userAgent || 'device').catch(() => {});
    }
    this.showLoginScreen();
  },

  setupListeners() {
    const claimUser = (user) => {
      this.currentUser = user;
      window.currentUser = user;
      localStorage.setItem('app_user', user);
      const db = getDatabase();
      if (db) {
        db.ref(`claimed/${user}`).set(navigator.userAgent || 'device').catch(() => {});
      }
      this.userSelectScreen.style.display = 'none';
      this.showLoginScreen();
    };

    document.getElementById('selectEfeBtn').addEventListener('click', () => claimUser('efe'));
    document.getElementById('selectElaBtn').addEventListener('click', () => claimUser('ela'));

    this.loginBtn.addEventListener('click', () => this.checkPassword());

    this.pinInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.checkPassword();
    });
    this.pinInput.addEventListener('input', () => {
      this.loginError.classList.remove('show');
      if (this.pinInput.value.length >= 8) this.checkPassword();
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

  checkPassword() {
    const pin = this.pinInput.value.trim();
    const secret = APP_CONFIG.secretDate;
    const expected = String(secret.day).padStart(2, '0') + String(secret.month).padStart(2, '0') + String(secret.year);

    if (pin === expected) {
      this.goToApp();
    } else {
      this.showError('Bu şifre bize ait değil... Bir daha dene 💕');
      this.shakeForm();
      this.pinInput.value = '';
      this.pinInput.focus();
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
    this.loginScreen.style.display = 'none';
    this.welcomeOverlay.style.display = 'flex';

    if (typeof ConfettiEffects !== 'undefined') {
      ConfettiEffects.fire(3000);
    }

    window.currentUser = this.currentUser;

    setTimeout(() => {
      this.welcomeOverlay.style.opacity = '0';
      this.welcomeOverlay.style.transition = 'opacity 0.6s ease';
      setTimeout(() => {
        this.welcomeOverlay.style.display = 'none';
        this.mainApp.style.display = 'flex';

        if (typeof KalbimWidget !== 'undefined') KalbimWidget.autoPlay();
        if (typeof MusicWidget !== 'undefined') MusicWidget.autoPlay();
        requestNotificationPermission();
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
