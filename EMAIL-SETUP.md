# 📧 Setup Email Contact Form dengan EmailJS

Form contact di website portfolio sudah dikonfigurasi untuk mengirim email ke **bangkennn29@gmail.com** menggunakan **EmailJS**.

---

## 🚀 Cara Setup EmailJS (Mudah & Gratis!)

### **Langkah 1: Daftar EmailJS**

1. Buka https://www.emailjs.com/
2. Klik **"Sign Up Free"**
3. Pilih **"Sign up with Google"** atau email biasa
4. Verifikasi email Anda

---

### **Langkah 2: Tambahkan Email Service**

1. Setelah login, klik **"Email Services"** di sidebar kiri
2. Klik tombol **"Add New Service"**
3. Pilih **"Gmail"** (karena email tujuan adalah Gmail)
4. Klik **"Connect Account"**
5. Login dengan akun Gmail **bangkennn29@gmail.com**
6. Berikan izin akses ke EmailJS
7. Klik **"Create Service"**
8. **COPY Service ID** yang muncul (contoh: `service_abc123`)

---

### **Langkah 3: Buat Email Template**

1. Klik **"Email Templates"** di sidebar kiri
2. Klik **"Create New Template"**
3. Edit template dengan konfigurasi berikut:

**Template Settings:**
- Template Name: `Portfolio Contact Form`

**Email Content:**

```
Subject: 📧 Pesan Baru dari {{from_name}} - Portfolio Contact

From: {{from_email}}
To: bangkennn29@gmail.com
```

**Email Body (HTML):**

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #10b981; }
        .label { font-weight: bold; color: #059669; }
        .message-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; }
        .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 10px 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Pesan Baru dari Portfolio</h1>
        </div>
        
        <div class="content">
            <p>Hai! Anda mendapat pesan baru dari website portfolio:</p>
            
            <div class="info-box">
                <div class="label">👤 Nama:</div>
                <div>{{from_name}}</div>
            </div>
            
            <div class="info-box">
                <div class="label">📧 Email:</div>
                <div>{{from_email}}</div>
            </div>
            
            <div class="message-box">
                <div class="label">💬 Pesan:</div>
                <div style="margin-top: 10px; white-space: pre-wrap;">{{message}}</div>
            </div>
        </div>
        
        <div class="footer">
            <p>Email dikirim otomatis dari Portfolio Contact Form</p>
        </div>
    </div>
</body>
</html>
```

4. Klik **"Save"**
5. **COPY Template ID** (contoh: `template_xyz789`)

---

### **Langkah 4: Dapatkan Public Key**

1. Klik **"Account"** di sidebar kiri
2. Scroll ke bagian **"API Keys"**
3. **COPY Public Key** (contoh: `abc123XYZ`)

---

### **Langkah 5: Update .env.local**

1. Buka file `.env.local` di root project
2. Ganti placeholder dengan nilai yang sudah di-copy:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_abc123
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xyz789
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=abc123XYZ
```

3. **Save file**

---

### **Langkah 6: Restart Server**

```bash
# Stop server (Ctrl+C di terminal)
# Jalankan lagi
npm run dev
```

---

## ✅ **Testing Form**

1. Buka `localhost:3000/contact`
2. Scroll ke form "Atau kirim saya pesan"
3. Isi form:
   - **Name**: Test User
   - **Email**: your-email@gmail.com
   - **Message**: This is a test message from portfolio contact form
4. Klik **"Send Email"**
5. Tunggu notifikasi sukses ✅
6. **Cek inbox Gmail** di **bangkennn29@gmail.com**
7. **Cek juga folder Spam** jika tidak ada di inbox

---

## 📊 **Batasan Free Tier EmailJS**

- ✅ **200 emails/bulan** (gratis selamanya!)
- ✅ **Tidak perlu domain verification**
- ✅ **Tanpa credit card**
- ✅ **Support Gmail, Outlook, Yahoo, dll**

---

## 🚨 **Troubleshooting**

### **Error: "EmailJS Error: Missing parameters"**
- Pastikan semua environment variables sudah diisi
- Restart dev server setelah update `.env.local`

### **Email tidak masuk:**
1. Cek folder **Spam/Junk** di Gmail
2. Cek dashboard EmailJS di https://dashboard.emailjs.com/admin
   - Lihat tab **"History"** untuk melihat email yang terkirim
3. Pastikan Service terhubung dengan Gmail yang benar

### **Error: "Public Key is invalid"**
- Copy ulang Public Key dari dashboard EmailJS
- Pastikan tidak ada spasi di awal/akhir

---

## 📞 **Dokumentasi EmailJS**

- Dashboard: https://dashboard.emailjs.com/
- Dokumentasi: https://www.emailjs.com/docs/
- React Integration: https://www.emailjs.com/docs/examples/reactjs/

---

## 💡 **Tips**

1. **Whitelist EmailJS di Gmail**: Tambahkan alamat EmailJS ke kontak untuk memastikan tidak masuk spam
2. **Monitor Usage**: Cek dashboard EmailJS untuk melihat berapa email yang sudah terkirim
3. **Upgrade jika perlu**: Jika butuh lebih dari 200 emails/bulan, upgrade ke paid plan ($7/month untuk 1000 emails)

---

**Selamat! Form contact Anda sudah siap menerima pesan! 🎉**
