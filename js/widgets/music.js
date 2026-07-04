// ============================================
// MUSIC WIDGET - assets/sounds klasöründen çalar
// ============================================

const MusicWidget = {
  currentIndex: 0,
  isPlaying: false,
  audio: null,
  lyricsVisible: false,
  playlist: [],

  init() {
    this.audio = document.getElementById('bgMusic');
    this.playBtn = document.getElementById('playPauseBtn');
    this.progressFill = document.getElementById('progressFill');
    this.progressBar = document.getElementById('progressBar');
    this.currentTimeEl = document.getElementById('currentTime');
    this.totalTimeEl = document.getElementById('totalTime');
    this.currentSongName = document.getElementById('currentSongName');
    this.currentArtist = document.getElementById('currentArtist');
    this.playlistEl = document.getElementById('playlist');
    this.lyricsPanel = document.getElementById('lyricsPanel');
    this.lyricsContent = document.getElementById('lyricsContent');
    this.lyricsCloseBtn = document.getElementById('lyricsCloseBtn');
    this.nowPlayingBadge = document.getElementById('nowPlayingBadge');

    this.toggleBtn = document.getElementById('musicToggleBtn');

    this.setupListeners();
    this.loadFromConfig();
  },

  setupListeners() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
    this.toggleBtn.addEventListener('click', () => this.togglePlay());
    this.lyricsCloseBtn.addEventListener('click', () => this.hideLyrics());

    this.progressBar.addEventListener('click', (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      if (this.audio && this.audio.duration) {
        this.audio.currentTime = percent * this.audio.duration;
      }
    });

    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('loadedmetadata', () => this.updateTotalTime());
    this.audio.addEventListener('ended', () => this.next());
    this.audio.addEventListener('error', () => {
      this.nowPlayingBadge.textContent = 'Yükleme hatası';
    });
  },

  loadFromConfig() {
    this.playlist = APP_CONFIG.playlist ? APP_CONFIG.playlist.map(s => ({ ...s })) : [];
    this.renderPlaylist();
    this.updatePlayButton();
  },

  renderPlaylist() {
    this.playlistEl.innerHTML = '';
    this.playlist.forEach((song, index) => {
      const item = document.createElement('button');
      item.className = 'playlist-item' + (index === this.currentIndex ? ' active' : '');
      item.innerHTML = `
        <span class="pl-index">${index + 1}</span>
        <div class="pl-info">
          <div class="pl-name">${this.esc(song.title || '')}</div>
          <div class="pl-artist">${this.esc(song.artist || '')}</div>
        </div>
        <button class="pl-lyric-btn" data-index="${index}">Söz</button>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('pl-lyric-btn')) {
          this.toggleLyrics(index);
          return;
        }
        this.play(index);
      });
      this.playlistEl.appendChild(item);
    });
  },

  getSongUrl(song) {
    if (song.fileName) {
      return `assets/sounds/${song.fileName.replace(/^\/+/, '')}`;
    }
    if (song.audioUrl) return song.audioUrl;
    return '';
  },

  play(index) {
    if (index < 0 || index >= this.playlist.length) return;
    this.currentIndex = index;
    const song = this.playlist[index];

    this.currentSongName.textContent = song.title || 'Bilinmeyen';
    this.currentArtist.textContent = song.artist || '';

    const src = this.getSongUrl(song);
    if (src) {
      this.audio.src = src;
      this.audio.load();
      this.nowPlayingBadge.textContent = (song.title || '').substring(0, 15);
    } else {
      this.audio.src = '';
      this.nowPlayingBadge.textContent = 'Dosya bulunamadı';
    }

    document.querySelectorAll('.playlist-item').forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });

    if (this.isPlaying) {
      this.audio.play().catch(() => { this.isPlaying = false; this.updatePlayButton(); });
    }
    this.hideLyrics();
  },

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      if (!this.audio.src) this.play(this.currentIndex);
      this.audio.play().catch(() => { this.isPlaying = false; this.updatePlayButton(); return; });
      this.isPlaying = true;
    }
    this.updatePlayButton();
  },

  updatePlayButton() {
    const icon = this.isPlaying
      ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>';
    this.playBtn.innerHTML = this.isPlaying
      ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
    this.toggleBtn.innerHTML = icon;
  },

  updateProgress() {
    if (!this.audio.duration) return;
    this.progressFill.style.width = ((this.audio.currentTime / this.audio.duration) * 100) + '%';
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
  },

  updateTotalTime() {
    this.totalTimeEl.textContent = this.formatTime(this.audio.duration || 0);
  },

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  },

  next() { this.play((this.currentIndex + 1) % this.playlist.length); },

  toggleLyrics(index) {
    const song = this.playlist[index];
    if (!song || !song.lyrics) { this.lyricsContent.textContent = 'Söz bulunamadı'; this.lyricsPanel.style.display = 'block'; return; }
    if (this.lyricsVisible && this.lyricsPanel.dataset.song === (song._key || song.id)) { this.hideLyrics(); return; }
    this.lyricsContent.textContent = song.lyrics;
    this.lyricsPanel.dataset.song = song._key || song.id || index;
    this.lyricsPanel.style.display = 'block';
    this.lyricsVisible = true;
  },

  hideLyrics() {
    this.lyricsPanel.style.display = 'none';
    this.lyricsVisible = false;
  },

  autoPlay() {
    if (this.playlist.length === 0) return;
    setTimeout(() => {
      this.play(0);
      setTimeout(() => this.togglePlay(), 500);
    }, 1000);
  },

  esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
};
