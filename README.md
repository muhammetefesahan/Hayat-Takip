# Sweet Habits

Okuma ve su takibi için geliştirilmiş, küçük ödül sistemine sahip bir kişisel alışkanlık takip uygulaması.

Uygulama, günlük okuma sayfası ve içilen su miktarını kaydeder; bu işlemler için yıldız puanı üretir ve ödül mağazasına erişim sağlar. Kullanıcıların ilerlemelerini görsel olarak takip etmeleri amaçlanır.

## Özellikler

- Günlük okuma kaydı
- Su tüketimi takibi (ml cinsinden)
- Yıldız puanı sistemi
- Görev listesi ve tamamlanma durumu
- Ödül mağazası
- PWA desteği
- Offline kullanım için service worker

## Teknoloji Yığını

- React
- Vite
- Firebase (hazır yapılandırma için alanlar bulunur)
- LocalStorage ile yerel veri saklama

## Proje Yapısı

```bash
.
├── public/
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── manifest.json
│   └── service-worker.js
├── src/
│   ├── App.jsx
│   ├── firebase.js
│   ├── main.jsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Kurulum

1. Depoyu klonlayın:

```bash
git clone https://github.com/muhammetefesahan/Hayat-Takip.git
cd Hayat-Takip
```

2. Bağımlılıkları yükleyin:

```bash
npm install
```

3. Geliştirme sunucusunu başlatın:

```bash
npm run dev
```

4. Prodüksiyon build çıkarın:

```bash
npm run build
```

5. Build önizlemesini açın:

```bash
npm run preview
```

## Firebase Ayarı

`src/firebase.js` dosyasında Firebase yapılandırma bilgileri yer alır. Gerçek bir Firebase projesi için bu alanları kendi proje değerlerinizle doldurmanız gerekir.

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Not: Bu proje şu an temel bir frontend demo yapısı üzerinden çalışmaktadır. Üretim ortamında güvenlik ve veri bütünlüğü için arka uç veya veritabanı doğrulama katmanı eklenmesi önerilir.

## Kullanım

- Okuma kayıt formuna günlük okunan sayfa sayısını girin.
- Su miktarını ml cinsinden yazın.
- Görev ekleyip tamamlayıp silebilirsiniz.
- Yıldız puanlar ödül mağazasındaki ürünleri kullanmak için birikir.
- Uygulama verileri tarayıcıda yerel olarak saklanır.

## Notlar

- Bu uygulama kişisel kullanım amaçlıdır.
- PWA desteği sayesinde mobil cihazlarda daha iyi bir deneyim sunar.
- Veriler mevcut haliyle yerel tarayıcı depolama alanında tutulur; bunun için güvenli arka uç doğrulaması eklemek faydalı olacaktır.

## Lisans

Bu proje kişisel kullanım ve geliştirme amaçlıdır. Gerekirse lisans eklenebilir.
