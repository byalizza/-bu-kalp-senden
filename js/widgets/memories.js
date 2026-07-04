// ============================================
// MEMORIES WIDGET - Gizli Anılar (Firebase Sync)
// ============================================

const MemoriesWidget = {
  memories: [],
  dbRef: null,
  editIndex: -1,

  init() {
    this.storiesContainer = document.getElementById('memoriesStories');
    this.memoryModal = document.getElementById('memoryModal');
    this.memoryModalTitle = document.getElementById('memoryModalTitle');
    this.memoryModalStory = document.getElementById('memoryModalStory');
    this.memoryModalDate = document.getElementById('memoryModalDate');
    this.memoryModalImage = document.getElementById('memoryModalImage');
    this.memoryModalClose = document.getElementById('memoryModalClose');
    this.memoryCount = document.getElementById('memoryCount');
    this.widgetHeader = document.querySelector('#memoriesWidget .widget-header');

    this.memories = [];

    this.setupListeners();
    this.setupFirebase();
    this.loadLocal();
    this.addEditButton();
  },

  setupListeners() {
    this.memoryModalClose.addEventListener('click', () => this.closeModal());
    this.memoryModal.addEventListener('click', (e) => {
      if (e.target === this.memoryModal) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });
  },

  addEditButton() {
    const btn = document.createElement('button');
    btn.className = 'widget-edit-btn';
    btn.id = 'memoriesEditBtn';
    btn.textContent = '✏️ Düzenle';
    btn.addEventListener('click', () => this.openEditModal(-1));
    this.widgetHeader.appendChild(btn);
  },

  setupFirebase() {
    const db = getDatabase();
    if (!db) return;

    const path = APP_CONFIG.firebasePaths.memories;
    this.dbRef = db.ref(path);

    // Tüm anıları yükle + canlı dinle
    this.dbRef.on('value', (snapshot) => {
      try {
        const data = snapshot.val();
        this.memories = [];
        if (data) {
          Object.keys(data).forEach(key => {
            const m = data[key];
            if (m) { m._key = key; this.memories.push(m); }
          });
        }
        this.saveLocal();
        this.render();
      } catch (e) { /* ignore */ }
    }, (err) => { /* permission denied */ });
  },

  loadLocal() {
    if (this.memories.length > 0) return;
    try {
      const saved = JSON.parse(localStorage.getItem('memories_data') || '[]');
      if (saved.length > 0) {
        this.memories = saved;
        this.render();
      } else if (APP_CONFIG.memories && APP_CONFIG.memories.length > 0) {
        this.memories = APP_CONFIG.memories.map(m => ({ ...m }));
        this.render();
        this.syncToFirebase();
      } else {
        this.render();
      }
    } catch (e) { this.render(); }
  },

  saveLocal() {
    try { localStorage.setItem('memories_data', JSON.stringify(this.memories)); } catch (e) {}
  },

  syncToFirebase() {
    if (!this.dbRef) return;
    this.memories.forEach(m => {
      const { _key, ...data } = m;
      this.dbRef.push(data);
    });
  },

  render() {
    this.storiesContainer.innerHTML = '';
    this.memoryCount.textContent = this.memories.length;

    if (this.memories.length === 0) {
      this.storiesContainer.innerHTML = `
        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
          Henüz anı eklenmedi. ✏️ Düzenle butonuna basarak ekleyebilirsiniz.
        </div>
      `;
      return;
    }

    this.memories.forEach((memory, index) => {
      const story = document.createElement('div');
      story.className = 'story-circle';
      story.innerHTML = `
        <div class="story-ring">
          <div class="story-ring-inner">
            ${memory.emoji || '📸'}
          </div>
        </div>
        <span class="story-label">${this.escapeHtml(memory.title || '')}</span>
      `;
      story.addEventListener('click', () => this.openModal(index));
      // Uzun basma ile düzenle
      let pressTimer;
      story.addEventListener('touchstart', (e) => { pressTimer = setTimeout(() => { this.openEditModal(index); }, 600); });
      story.addEventListener('touchend', () => clearTimeout(pressTimer));
      story.addEventListener('contextmenu', (e) => { e.preventDefault(); this.openEditModal(index); });
      this.storiesContainer.appendChild(story);
    });
  },

  openModal(index) {
    const memory = this.memories[index];
    if (!memory) return;
    this.memoryModalTitle.textContent = memory.title || '';
    this.memoryModalStory.textContent = memory.story || '';
    this.memoryModalDate.textContent = memory.date || '';
    this.memoryModalImage.innerHTML = memory.image
      ? `<img src="${memory.image}" alt="${memory.title || ''}">`
      : `<div class="memory-modal-img-placeholder">${memory.emoji || '📸'}</div>`;
    this.memoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    this.memoryModal.style.display = 'none';
    document.body.style.overflow = '';
    this.memoryEditModalClose();
  },

  // ========== EDIT MODAL ==========
  openEditModal(index) {
    this.editIndex = index;
    const isEdit = index >= 0 && index < this.memories.length;
    const mem = isEdit ? this.memories[index] : {};

    document.getElementById('memoryEditTitle').textContent = isEdit ? 'Anı Düzenle' : 'Yeni Anı Ekle';
    document.getElementById('memEditTitle').value = mem.title || '';
    document.getElementById('memEditDate').value = mem.date || '';
    document.getElementById('memEditEmoji').value = mem.emoji || '';
    document.getElementById('memEditStory').value = mem.story || '';
    document.getElementById('memEditPhoto').value = '';
    document.getElementById('memEditError').textContent = '';
    document.getElementById('memEditDeleteBtn').style.display = isEdit ? 'inline-block' : 'none';

    document.getElementById('memoryEditModal').style.display = 'flex';

    // Clean up old listeners
    const saveBtn = document.getElementById('memEditSaveBtn');
    const delBtn = document.getElementById('memEditDeleteBtn');
    const closeBtn = document.getElementById('memoryEditClose');
    const newSave = saveBtn.cloneNode(true);
    const newDel = delBtn.cloneNode(true);
    const newClose = closeBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSave, saveBtn);
    delBtn.parentNode.replaceChild(newDel, delBtn);
    closeBtn.parentNode.replaceChild(newClose, closeBtn);

    newSave.addEventListener('click', () => this.saveEdit());
    newDel.addEventListener('click', () => this.deleteEdit());
    newClose.addEventListener('click', () => this.memoryEditModalClose());
  },

  saveEdit() {
    const title = document.getElementById('memEditTitle').value.trim();
    const date = document.getElementById('memEditDate').value.trim();
    const emoji = document.getElementById('memEditEmoji').value.trim() || '📸';
    const story = document.getElementById('memEditStory').value.trim();
    const photoFile = document.getElementById('memEditPhoto').files[0];

    if (!title) { document.getElementById('memEditError').textContent = 'Başlık gerekli'; return; }
    if (!story) { document.getElementById('memEditError').textContent = 'Hikaye gerekli'; return; }

    const memory = { title, date, emoji, story, image: '' };

    const saveToFirebase = (imgUrl) => {
      if (imgUrl) memory.image = imgUrl;
      const db = getDatabase();

      if (this.editIndex >= 0 && this.editIndex < this.memories.length) {
        // Güncelle
        const existing = this.memories[this.editIndex];
        if (existing._key && db) {
          db.ref(`${APP_CONFIG.firebasePaths.memories}/${existing._key}`).update(memory);
        } else {
          this.memories[this.editIndex] = { ...memory };
          if (db) this.dbRef.push(memory);
        }
      } else {
        // Yeni ekle
        if (db) {
          this.dbRef.push(memory);
        } else {
          this.memories.push(memory);
          this.render();
        }
      }

      if (!db) { this.saveLocal(); this.render(); }
      this.memoryEditModalClose();
    };

    if (photoFile) {
      const storage = getStorage();
      if (storage) {
        const path = `memories/${Date.now()}_${photoFile.name}`;
        storage.ref(path).put(photoFile).then(s => s.ref.getDownloadURL()).then(url => {
          saveToFirebase(url);
        }).catch(() => saveToFirebase(''));
      } else {
        const reader = new FileReader();
        reader.onload = (e) => saveToFirebase(e.target.result);
        reader.readAsDataURL(photoFile);
      }
    } else {
      saveToFirebase('');
    }
  },

  deleteEdit() {
    if (this.editIndex < 0 || this.editIndex >= this.memories.length) return;
    const mem = this.memories[this.editIndex];
    const db = getDatabase();

    if (mem._key && db) {
      db.ref(`${APP_CONFIG.firebasePaths.memories}/${mem._key}`).remove();
    } else {
      this.memories.splice(this.editIndex, 1);
      this.saveLocal();
      this.render();
    }
    this.memoryEditModalClose();
  },

  memoryEditModalClose() {
    document.getElementById('memoryEditModal').style.display = 'none';
  },

  escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }
};
