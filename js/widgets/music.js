// ============================================
// MUSIC WIDGET - YouTube URL + Firebase Sync
// ============================================

const MusicWidget = {
  currentIndex: 0,
  isPlaying: false,
  audio: null,
  lyricsVisible: false,
  playlist: [],
  dbRef: null,
  player: null,
  playerReady: false,

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
    this.widgetHeader = document.querySelector('#musicWidget .widget-header');

    this.setupListeners();
    this.setupFirebase();
    this.addEditButton();
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
  },

  addEditButton() {
    const btn = document.createElement('button');
    btn.className = 'widget-edit-btn';
    btn.id = 'playlistEditBtn';
    btn.textContent = '➕ Şarkı Ekle';
    btn.addEventListener('click', () => this.openSongModal(-1));
    this.widgetHeader.appendChild(btn);
  },

  setupFirebase() {
    const db = getDatabase();
    if (!db) { this.loadLocal(); return; }

    const path = APP_CONFIG.firebasePaths.playlist;
    this.dbRef = db.ref(path);

    this.dbRef.on('value', (snapshot) => {
      try {
        const data = snapshot.val();
        this.playlist = [];
        if (data) {
          Object.keys(data).forEach(key => {
            const s = data[key];
            if (s) { s._key = key; this.playlist.push(s); }
          });
        }
        this.saveLocal();
        if (this.playlist.length === 0 && APP_CONFIG.playlist) {
          this.playlist = APP_CONFIG.playlist.map(s => ({ ...s }));
          this.syncToFirebase();
        }
        this.renderPlaylist();
      } catch (e) { /* ignore */ }
    }, (err) => { this.loadLocal(); });
  },

  loadLocal() {
    try {
      const saved = JSON.parse(localStorage.getItem('playlist_data') || '[]');
      if (saved.length > 0) {
        this.playlist = saved;
      } else if (APP_CONFIG.playlist) {
        this.playlist = APP_CONFIG.playlist.map(s => ({ ...s }));
      }
      this.renderPlaylist();
    } catch (e) {
      this.playlist = APP_CONFIG.playlist ? APP_CONFIG.playlist.map(s => ({ ...s })) : [];
      this.renderPlaylist();
    }
  },

  saveLocal() {
    try { localStorage.setItem('playlist_data', JSON.stringify(this.playlist)); } catch (e) {}
  },

  syncToFirebase() {
    if (!this.dbRef) return;
    this.playlist.forEach(s => {
      const { _key, ...data } = s;
      this.dbRef.push(data);
    });
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
      let pressTimer;
      item.addEventListener('touchstart', () => { pressTimer = setTimeout(() => this.openSongModal(index), 600); });
      item.addEventListener('touchend', () => clearTimeout(pressTimer));
      item.addEventListener('contextmenu', (e) => { e.preventDefault(); this.openSongModal(index); });
      this.playlistEl.appendChild(item);
    });
  },

  getSongUrl(song) {
    if (song.fileName) {
      return `assets/sounds/${song.fileName.replace(/^\/+/, '')}`;
    }
    if (song.audioUrl) return song.audioUrl;
    if (song.url) {
      // YouTube URL'si değilse direkt kullan
      if (!song.url.includes('youtube') && !song.url.includes('youtu.be')) return song.url;
    }
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
      this.audio.src = `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(index % 16) + 1}.mp3`;
      this.audio.load();
      this.nowPlayingBadge.textContent = (song.title || '').substring(0, 15);
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
    this.playBtn.innerHTML = this.isPlaying
      ? '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>'
      : '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>';
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

  // ========== SONG EDIT MODAL ==========
  openSongModal(index) {
    this.editSongIndex = index;
    const isEdit = index >= 0 && index < this.playlist.length;
    const song = isEdit ? this.playlist[index] : {};

    document.getElementById('songEditTitle').textContent = isEdit ? 'Şarkı Düzenle' : 'Yeni Şarkı Ekle';
    document.getElementById('songEditTitleInput').value = song.title || '';
    document.getElementById('songEditArtist').value = song.artist || '';
    document.getElementById('songEditLyrics').value = song.lyrics || '';
    document.getElementById('songEditFile').value = (song.fileName || '');
    document.getElementById('songEditError').textContent = '';
    document.getElementById('songEditDeleteBtn').style.display = isEdit ? 'inline-block' : 'none';
    document.getElementById('songEditModal').style.display = 'flex';

    ['songEditSaveBtn', 'songEditDeleteBtn', 'songEditClose'].forEach(id => {
      const el = document.getElementById(id);
      const clone = el.cloneNode(true);
      el.parentNode.replaceChild(clone, el);
    });

    document.getElementById('songEditSaveBtn').addEventListener('click', () => this.saveSong());
    document.getElementById('songEditDeleteBtn').addEventListener('click', () => this.deleteSong());
    document.getElementById('songEditClose').addEventListener('click', () => this.songModalClose());
  },

  saveSong() {
    const title = document.getElementById('songEditTitleInput').value.trim();
    const artist = document.getElementById('songEditArtist').value.trim();
    const lyrics = document.getElementById('songEditLyrics').value.trim();
    const fileName = document.getElementById('songEditFile').value.trim();

    if (!title) { document.getElementById('songEditError').textContent = 'Şarkı adı gerekli'; return; }

    const songData = { title, artist: artist || 'Bilinmeyen', lyrics, fileName, audioUrl: '' };

    if (this.editSongIndex >= 0 && this.editSongIndex < this.playlist.length) {
      this.playlist[this.editSongIndex] = { ...songData, _key: this.playlist[this.editSongIndex]._key };
    } else {
      this.playlist.push({ ...songData });
    }
    this.renderPlaylist();
    this.saveLocal();
    this.songModalClose();

    const db = getDatabase();
    if (!db || !this.dbRef) return;
    if (this.editSongIndex >= 0 && this.editSongIndex < this.playlist.length) {
      const existing = this.playlist[this.editSongIndex];
      if (existing._key) db.ref(`${APP_CONFIG.firebasePaths.playlist}/${existing._key}`).update(songData).catch(() => {});
      else this.dbRef.push(songData).catch(() => {});
    } else {
      this.dbRef.push(songData).catch(() => {});
    }
  },

  deleteSong() {
    if (this.editSongIndex < 0 || this.editSongIndex >= this.playlist.length) return;
    const song = this.playlist[this.editSongIndex];
    const db = getDatabase();
    if (song._key && db) {
      db.ref(`${APP_CONFIG.firebasePaths.playlist}/${song._key}`).remove();
    } else {
      this.playlist.splice(this.editSongIndex, 1);
      this.saveLocal();
      this.renderPlaylist();
    }
    this.songModalClose();
  },

  songModalClose() {
    document.getElementById('songEditModal').style.display = 'none';
  },

  esc(t) { const d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
};
