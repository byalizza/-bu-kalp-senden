// ============================================
// APP CONFIGURATION - "Bu Kalp Senden Vazgeçmeyecek"
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
    playlist: 'data/playlist',
    songs: 'songs'
  },

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

  // Gizli anılar (şablon)
  // DEĞİŞTİR: Kendi anılarınızla doldurun
  memories: [
    {
      id: 'mem1',
      title: 'İlk Tanışma',
      date: '14 Şubat 2024',
      story: 'İlk kez göz göze geldiğimiz o an, zaman durmuştu. Etraftaki her şey silikleşmiş, sadece sen kalmıştın gözümde. O gün bugündür bu kalp sadece senin için atıyor. Konuşmaya başladığımızda sesinin bu kadar güzel olacağını tahmin etmezdim. Her sözcüğün kulağıma bir melodi gibi geliyordu. O an anladım ki bu bir başlangıçtı, hiç bitmeyecek bir hikayenin ilk sayfası...',
      emoji: '💫'
    },
    {
      id: 'mem2',
      title: 'İlk Buluşma',
      date: '20 Şubat 2024',
      story: 'Ellerim ilk kez ellerini tuttuğunda dünyanın en güzel hissiydi bu. O an her şey yerli yerine oturdu. Kalbim öyle hızlı atıyordu ki duyacağından korktum. Saatlerce konuştuk, hiç bitmesin istedik o gece. Yıldızlar bile o gece bizim için daha parlak parlıyordu. Seninle geçen her dakika ayrı bir güzellik katıyor hayatıma.',
      emoji: '🌙'
    },
    {
      id: 'mem3',
      title: 'İlk "Seni Seviyorum"',
      date: '14 Mart 2024',
      story: 'O üç kelime... İçimde fırtınalar kopuyordu. Gözlerinin içine bakıp söylediğinde dünyanın en güzel sesini duymuştum. Seni seviyorum dediğin an kalbim durdu sandım. Sonra yeniden başladı, ama bu sefer sadece senin için atıyordu. O andan beri bu kalp hep senin için çarpıyor, hep seni seviyor.',
      emoji: '💖'
    },
    {
      id: 'mem4',
      title: 'İlk Tatilimiz',
      date: '1 Temmuz 2024',
      story: 'Deniz, kum, güneş ve sen... Daha ne isterdim ki? Gün batımında el ele yürümek, dalgaların sesinde sana fısıldamak. O an dondurmak istedim zamanı. Güldüğünde gözlerinin kenarında oluşan çizgiler, saçlarının rüzgarda dağılışı, her şeyinle mükemmeldin. Keşke o tatil hiç bitmeseydi.',
      emoji: '🌊'
    }
  ]
};
