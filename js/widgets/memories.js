// ============================================
// MEMORIES WIDGET - Gizli Anı Kutucukları
// ============================================

const MemoriesWidget = {
  init() {
    this.storiesContainer = document.getElementById('memoriesStories');
    this.memoryModal = document.getElementById('memoryModal');
    this.memoryModalTitle = document.getElementById('memoryModalTitle');
    this.memoryModalStory = document.getElementById('memoryModalStory');
    this.memoryModalDate = document.getElementById('memoryModalDate');
    this.memoryModalImage = document.getElementById('memoryModalImage');
    this.memoryModalClose = document.getElementById('memoryModalClose');
    this.memoryCount = document.getElementById('memoryCount');

    this.memories = APP_CONFIG.memories || [];
    this.setupListeners();
    this.render();
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

  render() {
    this.storiesContainer.innerHTML = '';
    this.memoryCount.textContent = this.memories.length;

    if (this.memories.length === 0) {
      this.storiesContainer.innerHTML = `
        <div style="text-align:center;padding:20px;color:var(--text-muted);font-size:13px;">
          Henüz anı eklenmedi. Anılarınız burada görünecek.
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
        <span class="story-label">${memory.title}</span>
      `;
      story.addEventListener('click', () => this.openModal(index));
      this.storiesContainer.appendChild(story);
    });
  },

  openModal(index) {
    const memory = this.memories[index];
    if (!memory) return;

    this.memoryModalTitle.textContent = memory.title;
    this.memoryModalStory.textContent = memory.story;
    this.memoryModalDate.textContent = memory.date;

    // Varsa fotoğraf göster
    this.memoryModalImage.innerHTML = memory.image
      ? `<img src="${memory.image}" alt="${memory.title}">`
      : `<div class="memory-modal-img-placeholder">${memory.emoji || '📸'}</div>`;

    this.memoryModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    this.memoryModal.style.display = 'none';
    document.body.style.overflow = '';
  },

  // Dinamik anı ekleme (sonradan kullanılmak üzere)
  addMemory(memory) {
    this.memories.push(memory);
    this.render();
  }
};
