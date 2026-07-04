const LocketWidget = {
  stream: null,
  facingMode: 'environment',
  isCapturing: false,
  allPhotos: [],
  currentFilter: 'none',

  init() {
    this.cameraEl = document.getElementById('locketCamera');
    this.video = document.getElementById('cameraPreview');
    this.canvas = document.getElementById('cameraCanvas');
    this.placeholder = document.getElementById('cameraPlaceholder');
    this.shutter = document.getElementById('cameraShutter');
    this.flash = document.getElementById('cameraFlash');
    this.countdown = document.getElementById('cameraCountdown');
    this.switchBtn = document.getElementById('cameraSwitchBtn');
    this.filtersEl = document.getElementById('cameraFilters');
    this.galleryScroll = document.getElementById('galleryScroll');

    this.setupListeners();
    this.loadPhotos();
    this.watchFirebase();
    this.startCleanup();
  },

  setupListeners() {
    this.placeholder.addEventListener('click', () => this.startCamera());
    this.shutter.addEventListener('click', () => this.capture());
    this.switchBtn.addEventListener('click', () => {
      this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
      this.stopCamera();
      this.startCamera();
    });

    this.filtersEl.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.filtersEl.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setFilter(btn.dataset.filter);
      });
    });
  },

  setFilter(name) {
    this.currentFilter = name;
    this.video.className = 'camera-preview';
    if (name !== 'none') {
      this.video.classList.add('cam-filter-' + name);
    }
  },

  _startingCamera: false,

  startCamera() {
    if (this._startingCamera) return;
    this._startingCamera = true;
    this.placeholder.style.opacity = '0';
    setTimeout(() => { this.placeholder.style.display = 'none'; }, 500);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false
      }).then((stream) => {
        if (!this._startingCamera) { stream.getTracks().forEach(t => t.stop()); return; }
        this.stream = stream;
        this.video.srcObject = stream;
        this.video.play();
        this.shutter.classList.add('visible');
        this.shutter.style.removeProperty('display');
        this.switchBtn.classList.add('visible');
        this.switchBtn.style.removeProperty('display');
        this.filtersEl.classList.add('visible');
        this.filtersEl.style.removeProperty('display');
        this._startingCamera = false;
      }).catch(() => {
        this._startingCamera = false;
        this.placeholder.style.display = 'flex';
        this.placeholder.style.opacity = '1';
        this.placeholder.querySelector('p').textContent = 'Kamera açılamadı 🙁';
      });
    } else {
      this._startingCamera = false;
      this.placeholder.querySelector('p').textContent = 'Kamera desteklenmiyor 🙁';
    }
  },

  stopCamera() {
    this._startingCamera = false;
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
    this.video.className = 'camera-preview';
    this.shutter.classList.remove('visible');
    this.shutter.style.setProperty('display', 'none', 'important');
    this.switchBtn.classList.remove('visible');
    this.switchBtn.style.setProperty('display', 'none', 'important');
    this.filtersEl.classList.remove('visible');
    this.filtersEl.style.setProperty('display', 'none', 'important');
    this.placeholder.style.display = 'flex';
    this.placeholder.style.opacity = '1';
    this.placeholder.querySelector('p').textContent = 'Kamerayı başlatmak için dokun';
    this.video.style.opacity = '1';
    this.isCapturing = false;
  },

  capture() {
    if (this.isCapturing) return;
    this.isCapturing = true;

    this.countdown.textContent = '3';
    this.countdown.classList.add('show');
    this.countdown.style.animation = 'none';
    void this.countdown.offsetHeight;
    this.countdown.style.animation = 'countdownPop 0.6s ease';

    let count = 3;
    const ci = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdown.textContent = count;
        this.countdown.style.animation = 'none';
        void this.countdown.offsetHeight;
        this.countdown.style.animation = 'countdownPop 0.6s ease';
      } else {
        clearInterval(ci);
        this.countdown.classList.remove('show');
        this.takePhoto();
      }
    }, 700);
  },

  takePhoto() {
    this.flash.classList.add('fire');
    setTimeout(() => this.flash.classList.remove('fire'), 200);

    this.canvas.width = this.video.videoWidth || 1080;
    this.canvas.height = this.video.videoHeight || 1920;
    const ctx = this.canvas.getContext('2d');

    if (this.facingMode === 'user') {
      ctx.translate(this.canvas.width, 0);
      ctx.scale(-1, 1);
    }

    if (this.currentFilter !== 'none') {
      ctx.filter = this.getFilterCSS(this.currentFilter);
    }
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    ctx.filter = 'none';
    const dataUrl = this.canvas.toDataURL('image/jpeg', 0.85);

    this.video.style.opacity = '0';

    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      const max = 720;
      let w = img.width, h = img.height;
      if (w > max || h > max) {
        if (w > h) { h = h * max / w; w = max; }
        else { w = w * max / h; h = max; }
      }
      c.width = w; c.height = h;
      const cx = c.getContext('2d');
      if (this.facingMode === 'user') {
        cx.translate(w, 0);
        cx.scale(-1, 1);
      }
      cx.drawImage(img, 0, 0, w, h);
      const compressed = c.toDataURL('image/jpeg', 0.7);

      const photo = {
        url: compressed,
        from: window.currentUser === 'efe' ? 'Efe' : 'Ela',
        timestamp: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };

      this.allPhotos.unshift(photo);
      this.renderGallery();

      const db = getDatabase();
      if (db) {
        db.ref(APP_CONFIG.firebasePaths.photos).push(photo).catch(() => {});
      }

      this.video.style.opacity = '1';
      this.isCapturing = false;
    };
    img.src = dataUrl;
  },

  getFilterCSS(name) {
    const filters = {
      warm: 'sepia(0.3) saturate(1.3) brightness(1.1)',
      cool: 'hue-rotate(180deg) saturate(0.8) brightness(0.95)',
      vintage: 'sepia(0.6) contrast(0.85) brightness(0.9)',
      dramatic: 'contrast(1.4) saturate(0.7) brightness(0.85)'
    };
    return filters[name] || 'none';
  },

  loadPhotos() {
    const saved = JSON.parse(localStorage.getItem('locket_gallery') || '[]');
    this.allPhotos = saved.filter(p => Date.now() < p.expiresAt);
    this.renderGallery();
  },

  savePhotos() {
    try { localStorage.setItem('locket_gallery', JSON.stringify(this.allPhotos)); } catch (e) {}
  },

  watchFirebase() {
    const db = getDatabase();
    if (!db) return;
    db.ref(APP_CONFIG.firebasePaths.photos).on('child_added', (snapshot) => {
      const data = snapshot.val();
      if (!data || !data.url) return;
      if (Date.now() >= (data.expiresAt || Infinity)) return;
      const exists = this.allPhotos.some(p => p.timestamp === data.timestamp && p.from === data.from);
      if (!exists) {
        this.allPhotos.unshift(data);
        this.renderGallery();
      }
    });
  },

  startCleanup() {
    setInterval(() => {
      const before = this.allPhotos.length;
      this.allPhotos = this.allPhotos.filter(p => Date.now() < p.expiresAt);
      if (this.allPhotos.length !== before) {
        this.savePhotos();
        this.renderGallery();
      }
    }, 60000);
  },

  renderGallery() {
    this.savePhotos();
    this.galleryScroll.innerHTML = '';
    this.allPhotos.forEach(p => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      const badge = p.from === 'Efe' ? '💪' : '🌸';
      div.innerHTML = `<img src="${p.url}" alt="anlik"><span class="gallery-badge">${badge}</span>`;
      div.addEventListener('click', () => this.openFull(p));
      this.galleryScroll.appendChild(div);
    });
  },

  openFull(photo) {
    const overlay = document.createElement('div');
    overlay.className = 'full-photo-overlay';
    overlay.innerHTML = `
      <div class="full-photo-bg" style="background:rgba(0,0,0,0.92);position:fixed;top:0;left:0;width:100%;height:100%;z-index:100;display:flex;align-items:center;justify-content:center;flex-direction:column;">
        <img src="${photo.url}" style="max-width:90%;max-height:70%;border-radius:12px;object-fit:contain;box-shadow:0 8px 40px rgba(0,0,0,0.5);">
        <div style="margin-top:12px;color:rgba(255,255,255,0.5);font-size:13px;">
          ${photo.from} · ${new Date(photo.timestamp).toLocaleString('tr-TR')}
        </div>
      </div>
    `;
    overlay.addEventListener('click', () => document.body.removeChild(overlay));
    document.body.appendChild(overlay);
  }
};
