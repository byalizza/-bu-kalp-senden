const AnilarWidget = {
  memories: [],
  dbRef: null,

  init() {
    this.gridEl = document.getElementById('anilarGrid');
    this.viewerEl = document.getElementById('anilarViewer');
    this.viewerImg = document.getElementById('anilarViewerImg');
    this.viewerTitle = document.getElementById('anilarViewerTitle');
    this.viewerDate = document.getElementById('anilarViewerDate');
    this.viewerStory = document.getElementById('anilarViewerStory');

    document.getElementById('anilarViewerClose').addEventListener('click', () => this.closeViewer());
    this.viewerEl.addEventListener('click', (e) => { if (e.target === this.viewerEl) this.closeViewer(); });

    this.setupFirebase();
    this.loadLocal();
  },

  setupFirebase() {
    const db = getDatabase();
    if (!db) return;
    db.ref(APP_CONFIG.firebasePaths.memories).on('value', (snap) => {
      const data = snap.val();
      this.memories = [];
      if (data) Object.keys(data).forEach(k => { const m = data[k]; if (m) { m._key = k; this.memories.push(m); } });
      this.renderGrid();
    }, () => {});
  },

  loadLocal() {
    if (this.memories.length > 0) return;
    try {
      const s = JSON.parse(localStorage.getItem('memories_data') || '[]');
      if (s.length > 0) { this.memories = s; this.renderGrid(); }
    } catch (e) {}
  },

  renderGrid() {
    this.gridEl.innerHTML = '';
    this.memories.forEach((mem, i) => {
      const btn = document.createElement('button');
      btn.className = 'ani-btn';
      btn.innerHTML = `<div class="ani-ring"><div class="ani-avatar">${mem.image ? '<img src="' + mem.image + '" loading="lazy">' : '<span class="ani-emoji">' + (mem.emoji || '💖') + '</span>'}</div></div><span class="ani-label">${mem.title || ''}</span>`;
      btn.addEventListener('click', () => this.openViewer(i));
      this.gridEl.appendChild(btn);
    });
  },

  openViewer(idx) {
    const mem = this.memories[idx];
    if (!mem) return;
    this.viewerImg.src = mem.image || '';
    this.viewerImg.alt = mem.title || '';
    this.viewerTitle.textContent = mem.title || '';
    this.viewerDate.textContent = mem.date || '';
    this.viewerStory.textContent = mem.story || '';
    this.viewerEl.style.display = 'flex';
  },

  closeViewer() {
    this.viewerEl.style.display = 'none';
  }
};
