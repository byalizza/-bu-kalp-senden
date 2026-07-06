// ============================================
// YAPILANDIRMA DOSYASI - "Bu Aşk Bitmez"
// ============================================
//
// Bu dosyadaki değerleri değiştirerek uygulamayı
// kendi ilişkinize göre özelleştirebilirsiniz.
//
// ============================================

const APP_CONFIG = {

  // -------------------------------------------
  // 1. UYGULAMA ADI
  // -------------------------------------------
  // Tarayıcı sekmesinde ve başlıklarda görünür.
  appName: 'Bu Aşk Bitmez',
  appTitle: 'Efe ❤️ Ela',

  // -------------------------------------------
  // 2. GİTHUB REPO YOLU
  // -------------------------------------------
  // GitHub Pages'de yayınlarken repo adınız neyse
  // onu yazın. Örn: "benim-repo-adim"
  // https://kullaniciadi.github.io/REPO_ADI/
  repoPath: '-bu-kalp-senden',

  // -------------------------------------------
  // 3. GİRİŞ ŞİFRESİ (Özel Tarih)
  // -------------------------------------------
  // Uygulamaya girmek için istenen tarih.
  // GG/AA/YYYY formatında kendi özel tarihinizi girin.
  secretDate: {
    day: 18,
    month: 4,
    year: 2025
  },

  // Şifreyi atlamak için IP adresleri
  // Bu IP'lerden girilince direkt ana sayfa açılır.
  // IP'nizi öğrenmek için: https://api.ipify.org
  // Boş [] bırakırsanız herkesten şifre istenir.
  bypassIPs: ["78.173.80.181"],

  // -------------------------------------------
  // 4. İLİŞKİ BAŞLANGIÇ TARİHİ (Sayaç)
  // -------------------------------------------
  // "Senle geçen her saniyem bir ömür" sayacının
  // başlangıç noktası.
  relationshipStart: {
    day: 19,
    month: 3,
    year: 2025,
    hour: 15,
    minute: 30
  },

  // -------------------------------------------
  // 5. KULLANICI İSİMLERİ
  // -------------------------------------------
  // İki kullanıcının adı, emojisi ve rengi.
  users: {
    efe: { name: 'Efe', emoji: '💪', color: '#4a90d9' },
    ela: { name: 'Ela', emoji: '🌸', color: '#ff6b6b' }
  },

  // Hoş geldin mesajında görünecek isim
  welcomeName: 'Ela',

  // -------------------------------------------
  // 6. TEMA RENKLERİ
  // -------------------------------------------
  // Uygulamanın ana renk paleti.
  // İstersen CSS'deki :root değişkenlerini de güncelle.
  theme: {
    primary: '#ff4757',
    secondary: '#4a90d9',
    background: '#07070d',
    card: '#1a1a2e',
    text: '#ffffff',
    textMuted: '#888'
  },

  // -------------------------------------------
  // 7. ARKA PLAN GÖRSELLERİ
  // -------------------------------------------
  // Splash, kullanıcı seçim ve giriş ekranlarındaki
  // arka plan resimleri. assets/ klasörüne koyup
  // yolunu buraya yazın.
  backgroundImages: {
    splash: 'assets/splash-bg.jpg',
    select: 'assets/select-bg.jpg',
    login: 'assets/login-bg.jpg'
  },

  // -------------------------------------------
  // 8. FIREBASE YAPILANDIRMASI
  // -------------------------------------------
  // Firebase Console'dan (https://console.firebase.google.com)
  // yeni bir proje oluşturun.
  // Proje Ayarları > Genel > Web uygulaması bölümünden
  // aşağıdaki bilgileri alın.
  firebase: {
    apiKey: "AIzaSyD36TC6n4kR6wBoiownR7L2iCQyBrAwq1k",
    authDomain: "a-79192.firebaseapp.com",
    databaseURL: "https://a-79192-default-rtdb.firebaseio.com",
    projectId: "a-79192",
    messagingSenderId: "29833951990",
    appId: "1:29833951990:web:36cda4e2ce8fb9ef4b4ad7",
    measurementId: "G-7J1189L9M6"
  },

  // Firebase veritabanı yolları (değiştirmeyin)
  firebasePaths: {
    photos: 'locket/photos',
    messages: 'chat/messages'
  },

  // -------------------------------------------
  // 9. VERİ DOSYALARI (değiştirmeyin)
  // -------------------------------------------
  localDataPaths: {
    kalbim: 'data/kalbim.json',
    memories: 'data/memories.json'
  },

  // -------------------------------------------
  // 10. MÜZİK ÇALMA LİSTESİ
  // -------------------------------------------
  // MP3 dosyalarını assets/sounds/ klasörüne atın.
  // İsimler BÜYÜK/KÜÇÜK harf dahil TAM EŞLEŞMELİ.
  playlist: [
    { title: 'Liselim', artist: 'Cengiz Kurtoğlu', fileName: 'Cengiz Kurtoğlu - Liselim.mp3' },
    { title: 'Sensiz Yapamıyorum', artist: 'Uygar Doğanay', fileName: 'Uygar Doğanay - Sensiz Yapamıyorum Klip 2022.mp3' },
    { title: 'İlle de Sen', artist: 'Azer Bülbül', fileName: 'Azer Bülbül - İlle de Sen.mp3' },
    { title: 'Gel', artist: 'Uygar Doğanay', fileName: 'UYGAR DOĞANAY GEL 2017 YENİ.mp3' },
    { title: 'Şiire Gazele', artist: 'Ahmet Kaya', fileName: 'Ahmet Kaya - Şiire Gazele.mp3' },
    { title: 'Aşk', artist: 'Deniz Seki', fileName: 'Deniz Seki - Aşk.mp3' },
    { title: 'Böyle Sever', artist: 'Kahraman Deniz', fileName: 'Kahraman Deniz - Böyle Sever (Official Video).mp3' },
    { title: 'Ömrüm', artist: 'Eypio', fileName: 'Eypio - Ömrüm.mp3' },
    { title: 'Herşeyim Oldun', artist: 'Güllü', fileName: 'Güllü - Herşeyim Oldun ( 1995 ).mp3' },
    { title: 'Sevdiğim', artist: 'Son Yaz', fileName: 'Son Yaz - Sevdiğim (Slowed & Reverb).mp3' }
  ],

  // -------------------------------------------
  // 11. KEDİ MESAJLARI
  // -------------------------------------------
  petMessages: [
    'Seni çok seviyorum 💕',
    'Sen çok özelsin ✨',
    'Seni çok özledim güzelim 😊',
    'Kurban olduğum 💖',
    'Çok güzel kokuyorsun 🌸',
    'Çok güzel gözüküyorsun ✨',
    'Saçların çok güzel 🌸',
    'Güneş seni kıskanıyor ☀️',
    'Hayatımı aydınlatıyorsun 💫',
    'Işıltınla dünyam güzelleşiyor 🌟',
    'Bu kalp senden vazgeçmez fıstıkk 💖',
    'Kalbimm 🫀',
    'Prenses her zaman prensestir 👑',
    'Prensesimm 🌷'
  ],

  // -------------------------------------------
  // 12. SOHBET YANITLARI
  // -------------------------------------------
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

  // -------------------------------------------
  // 13. BİLDİRİM AYARI (değiştirmeyin)
  // -------------------------------------------
  notificationInterval: 60 * 60 * 1000

};

// ============================================
// KURULUM NOTLARI:
// ============================================
// 1. Bu dosyadaki değerleri kendi bilgilerinle değiştir.
// 2. sw.js dosyasının tepesindeki importScripts yolunu
//    kendi repo adına göre güncelle.
// 3. manifest.json dosyasındaki start_url ve scope
//    değerlerini kendi repo adına göre güncelle.
// 4. index.html'deki <title> ve <meta> etiketlerini
//    kendi isimlerinle değiştir.
// 5. MP3 dosyalarını assets/sounds/ klasörüne yükle.
// 6. Arka plan resimlerini assets/ klasörüne yükle.
// 7. Firebase Console'da Realtime Database oluştur.
//    Veri yapısı: data/kalbim.json ve data/memories.json
//    formatında olmalı.
// ============================================
