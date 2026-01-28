# Migration Log: Resend to EmailJS

## Tanggal: 28 Januari 2026

### Perubahan yang Dilakukan:

✅ **1. Dihapus dari package.json**
- Menghapus dependency `"resend": "^6.9.1"`
- Menjalankan `npm uninstall resend` untuk membersihkan node_modules

✅ **2. Update API Route (route.ts)** 
- File: `src/app/api/send-email/route.ts`
- Menghapus import Resend API
- Menghapus kode pengiriman email via Resend
- Mengubah menjadi route handler sederhana untuk validasi saja
- Email sekarang dikirim langsung dari client-side menggunakan EmailJS

✅ **3. Update Dokumentasi**
- File: `EMAIL-SETUP.md`
- Menghapus section perbandingan "EmailJS vs Resend"
- Dokumentasi sekarang fokus hanya pada EmailJS

✅ **4. Environment Variables**
- Variable `RESEND_API_KEY` sudah tidak digunakan lagi
- Sekarang menggunakan:
  - `NEXT_PUBLIC_EMAILJS_SERVICE_ID`
  - `NEXT_PUBLIC_EMAILJS_TEMPLATE_ID`
  - `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY`

### Alasan Migrasi:

**EmailJS lebih cocok karena:**
- ✅ Tidak perlu domain verification
- ✅ Setup lebih mudah (5 menit)
- ✅ Free tier 200 emails/bulan
- ✅ No backend needed (client-side)
- ✅ Langsung connect dengan Gmail

**Resend lebih cocok untuk:**
- Aplikasi enterprise dengan domain sendiri
- Butuh kontrol penuh di backend
- Volume email tinggi

### Status: ✅ Selesai

Semua referensi Resend sudah dibersihkan dari codebase.
