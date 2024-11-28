# MTSK Yönetim Sistemi 

Modern ve kullanıcı dostu bir sürücü kursu yönetim sistemi.


## Özellikler

- Responsive tasarım (Mobil ve Desktop uyumlu)
- Güvenli giriş sistemi
- Sürücü kursu yönetimi
- Çoklu kullanıcı desteği
- Kolay kullanım
- Modern arayüz

## Kullanılan Teknolojiler

- **Frontend Framework:** React.js
- **Stil Kütüphanesi:** Tailwind CSS
- **Animasyon:** Framer Motion
- **Backend & Auth:** Firebase
- **State Management:** React Context API
- **Bildirimler:** React Toastify
- **Deployment:** Netlify
- **Icon Pack:** Lucide Icons

## Kurulum

```bash
# Projeyi klonlayın
git clone https://github.com/umideveloper-ux/mtskyonetimsistemi.git

# Proje dizinine gidin
cd mtskyonetimsistemi

# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```

## Özellikler Detayı

### Sürücü Kursu Yönetimi
- Kurs kayıtları
- Öğrenci takibi
- Sınav sonuçları
- Belge durumları

### Kullanıcı Yönetimi
- Çoklu kullanıcı rolleri
- Güvenli giriş sistemi
- Oturum yönetimi

### Modern Arayüz
- Responsive tasarım
- Kullanıcı dostu arayüz
- Animasyonlu geçişler
- Bildirim sistemi

## Deployment

Site Netlify üzerinde yayında.

## Netlify Yapılandırması

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Geliştirici

Bu proje [Haşim Doğan Işık](https://github.com/umideveloper-ux) tarafından tasarlanmış ve geliştirilmiştir.

## Lisans

Bu proje özel lisans altında lisanslanmıştır. İzinsiz paylaşılması ve kullanılması yasaktır.

---
 Bu projeyi beğendiyseniz yıldız vermeyi unutmayın!