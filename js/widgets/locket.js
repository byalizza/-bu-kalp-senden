// ============================================
// LOCKET WIDGET - Anlık Fotoğraf Paylaşımı
// ============================================

const LocketWidget = {
  currentPhoto: null,
  dbRef: null,
  storageRef: null,
  listener: null,

  init() {
    this.locketPhoto = document.getElementById('locketPhoto');
    this.locketOverlay = document.getElementById('locketOverlay');
    this.locketFrom = document.getElementById('locketFrom');
    this.locketTime = document.getElementById('locketTime');
    this.locketFileInput = document.getElementById('locketFileInput');
    this.locketRefreshBtn = document.getElementById('locketRefreshBtn');
    this.placeholder = document.querySelector('.locket-placeholder');

    this.setupListeners();
    this.setupFirebase();
  },

  setupListeners() {
    this.locketFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.uploadPhoto(file);
    });

    this.locketRefreshBtn.addEventListener('click', () => this.refresh());
  },

  setupFirebase() {
    const db = getDatabase();
    if (!db) {
      console.log('Firebase yok: Locket yerel modda çalışacak');
      return;
    }

    const path = APP_CONFIG.firebasePaths.photos;
    this.dbRef = db.ref(path).limitToLast(1);

    // Realtime dinleyici
    this.listener = this.dbRef.on('child_added', (snapshot) => {
      const data = snapshot.val();
      if (data && data.url) {
        this.displayPhoto(data);
      }
    });
  },

  uploadPhoto(file) {
    if (file.size > 5 * 1024 * 1024) {
      this.showToast('Fotoğraf çok büyük (max 5MB)');
      return;
    }

    const storage = getStorage();
    if (storage) {
      const path = `${APP_CONFIG.firebasePaths.photos}/${Date.now()}_${file.name}`;
      const uploadTask = storage.ref(path).put(file);

      uploadTask.then(snapshot => {
        return snapshot.ref.getDownloadURL();
      }).then(url => {
        const db = getDatabase();
        if (db) {
          db.ref(APP_CONFIG.firebasePaths.photos).push({
            url: url,
            from: APP_CONFIG.welcomeName,
            timestamp: Date.now()
          });
        } else {
          this.displayPhotoLocal(url);
        }
      }).catch(err => {
        console.error('Yükleme hatası:', err);
        this.displayPhotoLocal(URL.createObjectURL(file));
      });
    } else {
      // Firebase yok, yerel göster
      this.displayPhotoLocal(URL.createObjectURL(file));
    }

    this.locketFileInput.value = '';
  },

  displayPhoto(data) {
    const img = this.locketPhoto.querySelector('img') || new Image();
    img.src = data.url;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    if (!img.parentNode || img.parentNode === this.locketPhoto) {
      this.placeholder.style.display = 'none';
      this.locketPhoto.appendChild(img);
    }

    this.locketPhoto.classList.add('has-image');
    this.locketFrom.textContent = data.from || APP_CONFIG.welcomeName;
    this.locketTime.textContent = data.timestamp
      ? new Date(data.timestamp).toLocaleString('tr-TR')
      : new Date().toLocaleString('tr-TR');

    this.currentPhoto = data;
  },

  displayPhotoLocal(url) {
    const img = new Image();
    img.src = url;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.onload = () => {
      this.placeholder.style.display = 'none';
      this.locketPhoto.innerHTML = '';
      this.locketPhoto.appendChild(img);
      this.locketPhoto.classList.add('has-image');
      this.locketOverlay.style.display = 'flex';
      this.locketFrom.textContent = APP_CONFIG.welcomeName;
      this.locketTime.textContent = new Date().toLocaleString('tr-TR');
    };
  },

  refresh() {
    if (this.dbRef) {
      // Firebase'den son fotoğrafı al
      this.dbRef.once('child_added', (snapshot) => {
        const data = snapshot.val();
        if (data && data.url) {
          this.displayPhoto(data);
        }
      });
    }
  },

  showToast(msg) {
    const toast = document.getElementById('notificationToast');
    toast.querySelector('.toast-title').textContent = 'Locket';
    toast.querySelector('.toast-message').textContent = msg;
    toast.style.display = 'flex';
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.style.display = 'none';
        toast.style.opacity = '1';
      }, 500);
    }, 3000);
  }
};
