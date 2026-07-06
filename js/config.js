// ============================================
// APP CONFIGURATION - "Bu Aşk Bitmez"
// ============================================

const APP_CONFIG = {
  // Özel tarih şifresi (GG/AA/YYYY)
  // DEĞİŞTİR: Buraya kendi özel tarihinizi girin
  secretDate: {
    day: 18,
    month: 4,
    year: 2025
  },

  // İlişki başlangıç tarihi (sayaç için)
  relationshipStart: {
    day: 19,
    month: 3,
    year: 2025,
    hour: 15,
    minute: 30
  },

  // Kullanıcılar
  users: {
    efe: { name: 'Efe', emoji: '💪', color: '#4a90d9' },
    ela: { name: 'Ela', emoji: '🌸', color: '#ff6b6b' }
  },

  // Hoş geldin mesajında görünecek isim
  welcomeName: 'Ela',

  // Bildirim aralığı (milisaniye cinsinden) - varsayılan: 1 saat
  notificationInterval: 60 * 60 * 1000,

  // Firebase yolu
  firebasePaths: {
    photos: 'locket/photos',
    messages: 'chat/messages',
    memories: 'data/memories',
    kalbim: 'data/kalbim'
  },

  // Lokal veri dosyaları (Firebase'den hızlı, fetch ile yüklenir)
  localDataPaths: {
    kalbim: 'data/kalbim.json',
    memories: 'data/memories.json'
  },

  // Şarkı listesi (assets/sounds/ klasöründen çalar)
  // Kullanım: MP3'ü assets/sounds/ klasörüne yükle, buraya adını ekle
  playlist: [
    { title: 'Liselim', artist: 'Cengiz Kurtoğlu', fileName: 'Cengiz Kurtoğlu - Liselim.mp3', lyrics: '' }
  ],

  // Sanal evcil hayvan mesajları
  petMessages: [
    'Seni çok seviyorum! 💕',
    'Seni çok özledim! 😊',
    'Karnım acıktı, beni doyur! 🐾',
    'Hadi oyun oynayalım! 🎾',
    'Seninle olmak çok güzel! ✨',
    'Dünyanın en tatlı insanısın! 🌟',
    'Sarıl bana lütfen! 🤗',
    'Bugün harika görünüyorsun! 💫',
    'Seni düşünüyorum hep... 💭',
    'Beraber çok mutluyum! 🥰',
    'Şanslı bir maskotum seninle! 🍀',
    'Hiç bıkmam senden! 💖',
    'Gülüşün dünyayı aydınlatıyor! ☀️',
    'Bir öpücük alabilir miyim? 😘',
    'Sen benim her şeyimsin! 💝'
  ],

  // Sohbet yanıtları (anahtar kelimeye göre)
  chatResponses: [
    { keywords: ['aşk', 'sevgi', 'love'], response: 'Seni sonsuza kadar seveceğim! 💕' },
    { keywords: ['özledim', 'miss', 'hasret'], response: 'Ben de seni çok özledim! Ne zaman geleceksin? 😊' },
    { keywords: ['nasılsın', 'naber', 'hello', 'merhaba'], response: 'Harikayım! Seni gördüğüm için çok mutluyum! 🥰' },
    { keywords: ['iyi', 'güzel', 'mutlu'], response: 'İyi olman beni de mutlu ediyor! Hep böyle mutlu ol! ✨' },
    { keywords: ['üzgün', 'kötü', 'mutsuz', 'ağlıyor'], response: 'Üzülme, ben buradayım! Seni her zaman neşelendiririm! 🤗' },
    { keywords: ['öp', 'öpticik', 'öpücük'], response: 'Öptüm! Bir tane daha ister misin? 😘😘' },
    { keywords: ['sarıl', 'hug', 'sarılmak'], response: 'Kocaman sarıldım! Sıcacık oldum! 🤗💕' },
    { keywords: ['acık', 'yemek', 'mama'], response: 'Yaşasın yemek! Ama önce seninle oynamak istiyorum! 🐾' },
    { keywords: ['uyku', 'uyu', 'yorgun'], response: 'Uykun mu geldi? Masallar anlatırım sana, uyku masalı... 🌙' },
    { keywords: ['dans', 'oyna', 'şarkı', 'müzik'], response: 'Müzik mi? Hadi dans edelim! 🎵💃' }
  ],

};
