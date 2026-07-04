// ============================================
// MUSIC WIDGET - Romantik Şarkı Listesi
// ============================================

const MusicWidget = {
  currentIndex: 0,
  isPlaying: false,
  audio: null,
  progressInterval: null,
  lyricsVisible: false,

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
    this.musicToggleBtn = document.getElementById('musicToggleBtn');

    this.setupListeners();
    this.renderPlaylist();
  },

  setupListeners() {
    this.playBtn.addEventListener('click', () => this.togglePlay());
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

    this.musicToggleBtn.addEventListener('click', () => {
      const widget = document.getElementById('musicWidget');
      widget.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  },

  renderPlaylist() {
    this.playlistEl.innerHTML = '';
    APP_CONFIG.playlist.forEach((song, index) => {
      const item = document.createElement('button');
      item.className = 'playlist-item' + (index === this.currentIndex ? ' active' : '');
      item.innerHTML = `
        <span class="pl-index">${index + 1}</span>
        <div class="pl-info">
          <div class="pl-name">${song.title}</div>
          <div class="pl-artist">${song.artist}</div>
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

  play(index) {
    this.currentIndex = index;
    const song = APP_CONFIG.playlist[index];

    this.currentSongName.textContent = song.title;
    this.currentArtist.textContent = song.artist;

    // YouTube URL'sini ayarla
    // Not: Gerçek kullanımda her şarkı için farklı YouTube ID kullanın
    const youtubeUrl = `https://www.youtube.com/watch?v=${song.youtubeId}`;
    this.audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 16) + 1}.mp3`;
    this.audio.load();

    // Playlist görünümünü güncelle
    document.querySelectorAll('.playlist-item').forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });

    if (this.isPlaying) {
      this.audio.play().catch(() => {
        this.isPlaying = false;
        this.updatePlayButton();
      });
    }

    this.nowPlayingBadge.textContent = song.title.substring(0, 15) + (song.title.length > 15 ? '...' : '');
    this.hideLyrics();
  },

  togglePlay() {
    if (this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    } else {
      if (!this.audio.src) {
        this.play(this.currentIndex);
      }
      this.audio.play().catch(() => {
        this.isPlaying = false;
        this.updatePlayButton();
        return;
      });
      this.isPlaying = true;
      this.startProgressUpdate();
    }
    this.updatePlayButton();
  },

  updatePlayButton() {
    this.playBtn.innerHTML = this.isPlaying
      ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
  },

  updateProgress() {
    if (!this.audio.duration) return;
    const percent = (this.audio.currentTime / this.audio.duration) * 100;
    this.progressFill.style.width = percent + '%';
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

  next() {
    this.play((this.currentIndex + 1) % APP_CONFIG.playlist.length);
  },

  prev() {
    this.play((this.currentIndex - 1 + APP_CONFIG.playlist.length) % APP_CONFIG.playlist.length);
  },

  toggleLyrics(index) {
    const song = APP_CONFIG.playlist[index];
    if (this.lyricsVisible && this.lyricsPanel.dataset.song === song.id) {
      this.hideLyrics();
      return;
    }
    this.lyricsContent.textContent = song.lyrics;
    this.lyricsPanel.dataset.song = song.id;
    this.lyricsPanel.style.display = 'block';
    this.lyricsVisible = true;
  },

  hideLyrics() {
    this.lyricsPanel.style.display = 'none';
    this.lyricsVisible = false;
  },

  autoPlay() {
    setTimeout(() => {
      this.play(0);
      setTimeout(() => {
        this.togglePlay();
      }, 500);
    }, 1000);
  }
};
