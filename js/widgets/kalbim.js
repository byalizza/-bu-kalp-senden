const KalbimWidget = {
  stories: [],
  storyIndex: 0,
  dbRef: null,
  intervalId: null,
  startDate: null,
  isPlaying: false,
  audio: null,
  currentSong: 0,

  init() {
    this.audio = document.getElementById('bgMusic');

    this.setupStories();
    this.setupCounter();
    this.setupMusic();

    const stBtn = document.getElementById('storyViewerClose');
    if (stBtn) stBtn.addEventListener('click', () => this.closeViewer());
  },

  /* ----- STORIES ----- */
  setupStories() {
    this.storiesContainer = document.getElementById('storyCircles');
    this.viewerEl = document.getElementById('storyViewer');
    this.viewerImg = document.getElementById('storyViewerImg');
    this.viewerTitle = document.getElementById('storyViewerTitle');
    this.viewerDate = document.getElementById('storyViewerDate');
    this.viewerStory = document.getElementById('storyViewerStory');
    this.viewerProgress = document.getElementById('storyViewerProgress');

    const db = getDatabase();
    if (db) {
      const path = APP_CONFIG.firebasePaths.memories;
      this.dbRef = db.ref(path);
      this.dbRef.on('value', (snap) => {
        const data = snap.val();
        this.stories = [];
        if (data) {
          Object.keys(data).forEach(k => {
            const m = data[k];
            if (m) { m._key = k; this.stories.push(m); }
          });
        }
        this.renderCircles();
      }, () => {});
    }
    this.loadLocalStories();
  },

  loadLocalStories() {
    if (this.stories.length > 0) return;
    try {
      const saved = JSON.parse(localStorage.getItem('memories_data') || '[]');
      if (saved.length > 0) { this.stories = saved; this.renderCircles(); }
    } catch (e) {}
  },

  renderCircles() {
    this.storiesContainer.innerHTML = '';
    this.stories.forEach((mem, i) => {
      const c = document.createElement('button');
      c.className = 'story-circle';
      c.innerHTML = `<div class="story-ring"><div class="story-avatar">${mem.image ? '<img src="' + mem.image + '" loading="lazy">' : '<span>' + (mem.emoji || '💖') + '</span>'}</div></div><span class="story-label">${mem.title || ''}</span>`;
      c.addEventListener('click', () => this.openStory(i));
      this.storiesContainer.appendChild(c);
    });
  },

  openStory(idx) {
    if (idx < 0 || idx >= this.stories.length) return;
    this.storyIndex = idx;
    const mem = this.stories[idx];
    this.viewerImg.src = mem.image || '';
    this.viewerImg.alt = mem.title || '';
    this.viewerTitle.textContent = mem.title || '';
    this.viewerDate.textContent = mem.date || '';
    this.viewerStory.textContent = mem.story || '';
    this.viewerEl.style.display = 'flex';
    this.viewerEl.style.animation = 'fadeIn 0.3s ease';
    this.updateProgress();
  },

  closeViewer() {
    this.viewerEl.style.display = 'none';
  },

  updateProgress() {
    this.viewerProgress.innerHTML = '';
    this.stories.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'st-progress-dot' + (i === this.storyIndex ? ' active' : '');
      this.viewerProgress.appendChild(d);
    });
  },

  /* ----- COUNTER ----- */
  setupCounter() {
    this.daysEl = document.getElementById('kalbimDays');
    this.hoursEl = document.getElementById('kalbimHours');
    this.minsEl = document.getElementById('kalbimMinutes');
    this.secsEl = document.getElementById('kalbimSeconds');
    this.startDate = this.getStartDate();
    this.updateCounter();
    this.intervalId = setInterval(() => this.updateCounter(), 1000);
  },

  getStartDate() {
    const s = APP_CONFIG.relationshipStart;
    return new Date(s.year, s.month - 1, s.day, s.hour || 0, s.minute || 0);
  },

  updateCounter() {
    const diff = Date.now() - this.startDate.getTime();
    if (diff < 0) return;
    const t = Math.floor(diff / 1000);
    this.setNum(this.daysEl, Math.floor(t / 86400), 3);
    this.setNum(this.hoursEl, Math.floor((t % 86400) / 3600), 2);
    this.setNum(this.minsEl, Math.floor((t % 3600) / 60), 2);
    this.setNum(this.secsEl, t % 60, 2);
  },

  setNum(el, v, pad) {
    const s = String(v).padStart(pad, '0');
    if (el && el.textContent !== s) {
      el.textContent = s;
      el.style.transform = 'scale(1.08)';
      setTimeout(() => { if (el) el.style.transform = 'scale(1)'; }, 150);
    }
  },

  /* ----- MUSIC ----- */
  setupMusic() {
    this.playBtn = document.getElementById('kalbimPlayBtn');
    this.prevBtn = document.getElementById('kalbimPrevBtn');
    this.nextBtn = document.getElementById('kalbimNextBtn');
    this.songName = document.getElementById('kalbimSongName');
    this.artistName = document.getElementById('kalbimArtist');
    this.progressFill = document.getElementById('kalbimProgress');
    this.progressBar = document.getElementById('kalbimProgressBar');

    this.playlist = APP_CONFIG.playlist ? [...APP_CONFIG.playlist] : [];
    if (this.playlist.length > 0) {
      const s = this.playlist[0];
      this.songName.textContent = s.title || '';
      this.artistName.textContent = s.artist || '';
      this.audio.src = 'assets/sounds/' + (s.fileName || '').replace(/^\//, '');
    }
    if (this.audio) this.audio.volume = 0.7;

    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    this.progressBar.addEventListener('click', (e) => {
      const r = this.progressBar.getBoundingClientRect();
      const p = (e.clientX - r.left) / r.width;
      if (this.audio && this.audio.duration) this.audio.currentTime = p * this.audio.duration;
    });
    this.audio.addEventListener('timeupdate', () => this.updateMusicProgress());
    this.audio.addEventListener('ended', () => this.next());
  },

  togglePlay() {
    if (!this.audio.src) return;
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      this.audio.play().then(() => { this.isPlaying = true; }).catch(() => {});
    }
    this.playBtn.innerHTML = this.isPlaying
      ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>'
      : '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21"/></svg>';
  },

  prev() {
    if (this.playlist.length === 0) return;
    this.currentSong = (this.currentSong - 1 + this.playlist.length) % this.playlist.length;
    this.loadSong(this.currentSong);
  },

  next() {
    if (this.playlist.length === 0) return;
    this.currentSong = (this.currentSong + 1) % this.playlist.length;
    this.loadSong(this.currentSong);
  },

  loadSong(idx) {
    const s = this.playlist[idx];
    if (!s) return;
    this.songName.textContent = s.title || '';
    this.artistName.textContent = s.artist || '';
    this.audio.src = 'assets/sounds/' + (s.fileName || '').replace(/^\//, '');
    if (this.isPlaying) {
      this.audio.play().catch(() => {});
    }
  },

  updateMusicProgress() {
    if (!this.audio || !this.audio.duration) return;
    this.progressFill.style.width = (this.audio.currentTime / this.audio.duration * 100) + '%';
  },

  autoPlay() {
    if (this.playlist.length === 0) return;
    setTimeout(() => {
      this.loadSong(0);
      setTimeout(() => this.togglePlay(), 500);
    }, 1000);
  }
};
