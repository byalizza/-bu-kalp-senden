// ============================================
// ŞİPŞAK WIDGET - Instagram Instants Tarzı
// Anlık çek, direkt gönder, tek seferlik gör
// ============================================

const LocketWidget = {
  stream: null,
  facingMode: 'environment',
  isCapturing: false,
  incomingData: null,
  holdTimer: null,
  isRevealed: false,

  init() {
    this.cameraEl = document.getElementById('locketCamera');
    this.video = document.getElementById('cameraPreview');
    this.canvas = document.getElementById('cameraCanvas');
    this.placeholder = document.getElementById('cameraPlaceholder');
    this.captureRing = document.getElementById('cameraCaptureRing');
    this.flash = document.getElementById('cameraFlash');
    this.countdown = document.getElementById('cameraCountdown');
    this.statusText = document.getElementById('cameraStatusText');
    this.statusBar = document.getElementById('cameraStatus');
    this.switchBtn = document.getElementById('cameraSwitchBtn');
    this.incoming = document.getElementById('locketIncoming');
    this.incomingImg = document.getElementById('incomingImg');
    this.incomingOverlay = document.getElementById('incomingOverlay');
    this.incomingTime = document.getElementById('incomingTime');
    this.expiryCountdown = document.getElementById('expiryCountdown');

    this.setupListeners();
    this.setupFirebase();
    this.checkIncomingPhotos();
  },

  setupListeners() {
    // Placeholder'a tıkla -> kamerayı başlat
    this.placeholder.addEventListener('click', () => this.startCamera());

    // Capture ring'e tıkla -> fotoğraf çek
    this.captureRing.addEventListener('click', () => this.capture());

    // Kamera değiştir
    this.switchBtn.addEventListener('click', () => {
      this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
      this.stopCamera();
      this.startCamera();
    });

    // Gelen fotoğrafla etkileşim (basılı tut -> gör)
    this.incomingOverlay.addEventListener('mousedown', () => this.startHold());
    this.incomingOverlay.addEventListener('mouseup', () => this.endHold());
    this.incomingOverlay.addEventListener('mouseleave', () => this.endHold());
    this.incomingOverlay.addEventListener('touchstart', (e) => { e.preventDefault(); this.startHold(); });
    this.incomingOverlay.addEventListener('touchend', () => this.endHold());

    // Ekran görüntüsü koruması - PrintScreen engelleme
    document.addEventListener('keydown', (e) => {
      if (e.key === 'PrintScreen') {
        this.showToast('📵 Ekran görüntüsü alınamaz');
        return false;
      }
    });

    // Context menu engelle (sağ tık)
    this.incoming.addEventListener('contextmenu', (e) => e.preventDefault());
  },

  startCamera() {
    this.placeholder.style.opacity = '0';
    setTimeout(() => { this.placeholder.style.display = 'none'; }, 500);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: this.facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: false
      }).then((stream) => {
        this.stream = stream;
        this.video.srcObject = stream;
        this.video.play();
        this.captureRing.classList.add('visible');
        this.switchBtn.classList.add('visible');
        this.statusBar.classList.add('visible');
        this.statusText.textContent = 'Fotoğraf çekmek için dokun';
      }).catch((err) => {
        console.error('Kamera hatası:', err);
        this.placeholder.style.display = 'flex';
        this.placeholder.style.opacity = '1';
        this.placeholder.querySelector('p').textContent = 'Kamera açılamadı 🙁';
      });
    } else {
      this.placeholder.querySelector('p').textContent = 'Kamera desteklenmiyor 🙁';
    }
  },

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.video.srcObject = null;
    this.captureRing.classList.remove('visible');
    this.switchBtn.classList.remove('visible');
    this.statusBar.classList.remove('visible');
  },

  capture() {
    if (this.isCapturing) return;
    this.isCapturing = true;

    // Geri sayım
    this.countdown.textContent = '3';
    this.countdown.classList.add('show');
    this.countdown.style.animation = 'none';
    void this.countdown.offsetHeight;
    this.countdown.style.animation = 'countdownPop 0.6s ease';

    let count = 3;
    const countInterval = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdown.textContent = count;
        this.countdown.style.animation = 'none';
        void this.countdown.offsetHeight;
        this.countdown.style.animation = 'countdownPop 0.6s ease';
      } else {
        clearInterval(countInterval);
        this.countdown.classList.remove('show');
        this.takePhoto();
      }
    }, 700);
  },

  takePhoto() {
    // Flash efekti
    this.flash.classList.add('fire');
    setTimeout(() => this.flash.classList.remove('fire'), 200);

    // Fotoğrafı yakala
    this.canvas.width = this.video.videoWidth || 1080;
    this.canvas.height = this.video.videoHeight || 1920;
    const ctx = this.canvas.getContext('2d');

    // Aynalama (selfie modunda)
    if (this.facingMode === 'user') {
      ctx.translate(this.canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

    // Base64'e çevir
    const dataUrl = this.canvas.toDataURL('image/jpeg', 0.85);

    // Kısa bir an göster
    this.video.style.opacity = '0';
    this.statusText.textContent = '📸 Gönderiliyor...';

    // Firebase'e yükle veya yerel kaydet
    this.uploadPhoto(dataUrl);

    setTimeout(() => {
      this.video.style.opacity = '1';
      this.statusText.textContent = 'Fotoğraf çekmek için dokun';
      this.isCapturing = false;
    }, 1500);
  },

  uploadPhoto(dataUrl) {
    // Blob'a çevir
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });

    const storage = getStorage();
    if (storage) {
      const path = `${APP_CONFIG.firebasePaths.photos}/${Date.now()}_sipsak.jpg`;
      const uploadTask = storage.ref(path).put(blob);
      uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
        .then(url => {
          const db = getDatabase();
          if (db) {
            db.ref(APP_CONFIG.firebasePaths.photos).push({
              url: url,
              from: APP_CONFIG.welcomeName,
              timestamp: Date.now(),
              expiresAt: Date.now() + 24 * 60 * 60 * 1000,
              viewed: false
            });
          }
        }).catch(err => {
          console.error('Yükleme hatası:', err);
          // Yerel dene
          this.saveLocal(dataUrl);
        });
    } else {
      this.saveLocal(dataUrl);
    }
  },

  saveLocal(dataUrl) {
    // LocalStorage'a kaydet
    const photos = JSON.parse(localStorage.getItem('sipsak_photos') || '[]');
    photos.push({
      url: dataUrl,
      from: APP_CONFIG.welcomeName,
      timestamp: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      viewed: false
    });
    localStorage.setItem('sipsak_photos', JSON.stringify(photos));
    this.showToast('📸 Şipşak gönderildi!');
  },

  checkIncomingPhotos() {
    // LocalStorage'dan kontrol et
    const photos = JSON.parse(localStorage.getItem('sipsak_photos') || '[]');
    const active = photos.filter(p => Date.now() < p.expiresAt);

    if (active.length > 0) {
      const latest = active[active.length - 1];
      this.showIncoming(latest);
    }

    // Firebase'den dinle
    const db = getDatabase();
    if (db) {
      db.ref(APP_CONFIG.firebasePaths.photos).limitToLast(1).on('child_added', (snapshot) => {
        const data = snapshot.val();
        if (data && data.url && Date.now() < (data.expiresAt || Infinity)) {
          this.showIncoming(data);
        }
      });
    }

    // 24 saat temizliği
    setInterval(() => {
      const all = JSON.parse(localStorage.getItem('sipsak_photos') || '[]');
      const fresh = all.filter(p => Date.now() < p.expiresAt);
      localStorage.setItem('sipsak_photos', JSON.stringify(fresh));
    }, 60000);
  },

  showIncoming(data) {
    this.incomingData = data;
    this.incomingImg.src = data.url;
    this.incomingTime.textContent = data.timestamp
      ? new Date(data.timestamp).toLocaleString('tr-TR')
      : '';

    this.incomingOverlay.classList.remove('hidden');
    this.incomingImg.classList.remove('revealed');
    this.isRevealed = false;

    this.cameraEl.style.display = 'none';
    this.incoming.style.display = 'flex';

    // 24 saat sayacını başlat
    this.startExpiryTimer(data.expiresAt);

    // Otomatik silme zamanlayıcısı
    if (data.expiresAt) {
      const timeLeft = data.expiresAt - Date.now();
      if (timeLeft > 0) {
        setTimeout(() => {
          this.incoming.style.display = 'none';
          this.cameraEl.style.display = 'flex';
          this.incomingImg.src = '';
          this.incomingData = null;
        }, timeLeft);
      }
    }
  },

  startHold() {
    if (this.isRevealed) return;
    this.holdTimer = setTimeout(() => {
      this.revealPhoto();
    }, 500);
  },

  endHold() {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    if (this.isRevealed) {
      this.hidePhoto();
    }
  },

  revealPhoto() {
    this.incomingOverlay.classList.add('hidden');
    this.incomingImg.classList.add('revealed');
    this.isRevealed = true;
    this.showToast('👁️ Bu fotoğraf bir kez görüntülendi');

    // viewed işaretle
    if (this.incomingData) {
      this.incomingData.viewed = true;
      const photos = JSON.parse(localStorage.getItem('sipsak_photos') || '[]');
      const idx = photos.findIndex(p => p.timestamp === this.incomingData.timestamp);
      if (idx !== -1) {
        photos[idx].viewed = true;
        localStorage.setItem('sipsak_photos', JSON.stringify(photos));
      }
    }
  },

  hidePhoto() {
    this.incomingOverlay.classList.remove('hidden');
    this.incomingImg.classList.remove('revealed');
    this.isRevealed = false;
  },

  startExpiryTimer(expiresAt) {
    if (!expiresAt) return;
    const update = () => {
      const left = expiresAt - Date.now();
      if (left <= 0) {
        this.expiryCountdown.textContent = 'Süresi doldu';
        return;
      }
      const h = Math.floor(left / 3600000);
      const m = Math.floor((left % 3600000) / 60000);
      const s = Math.floor((left % 60000) / 1000);
      this.expiryCountdown.textContent =
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };
    update();
    setInterval(update, 1000);
  },

  showToast(msg) {
    const toast = document.getElementById('notificationToast');
    toast.querySelector('.toast-title').textContent = 'Şipşak';
    toast.querySelector('.toast-message').textContent = msg;
    toast.style.display = 'flex';
    toast.style.animation = 'none';
    void toast.offsetHeight;
    toast.style.animation = 'toastSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.style.display = 'none';
        toast.style.opacity = '1';
      }, 500);
    }, 3000);
  }
};
