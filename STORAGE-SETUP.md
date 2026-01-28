# Setup Supabase Storage untuk File Upload

## Step 1: Buat Storage Bucket

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Buka menu **Storage** di sidebar kiri
4. Klik **New bucket**
5. Isi form:
   - **Name:** `portfolio-images`
   - **Public bucket:** ✅ Centang (agar gambar bisa diakses public)
6. Klik **Create bucket**

## Step 2: Setup Storage Policies

Setelah bucket dibuat, kita perlu setup policies agar file bisa diupload dan diakses:

### Policy untuk Upload (Insert)

1. Buka bucket `portfolio-images`
2. Klik tab **Policies**
3. Klik **New Policy**
4. Pilih **For full customization**
5. Isi:
   - **Policy name:** `Allow authenticated upload`
   - **Allowed operation:** `INSERT`
   - **Policy definition:**
   ```sql
   (bucket_id = 'portfolio-images'::text)
   ```
   - **Target roles:** `authenticated` atau `anon` (untuk testing)
6. Klik **Review** lalu **Save policy**

### Policy untuk Read (Public Access)

1. Klik **New Policy** lagi
2. Pilih **For full customization**
3. Isi:
   - **Policy name:** `Allow public read`
   - **Allowed operation:** `SELECT`
   - **Policy definition:**
   ```sql
   (bucket_id = 'portfolio-images'::text)
   ```
   - **Target roles:** `anon`, `authenticated`
4. Klik **Review** lalu **Save policy**

### Policy untuk Delete (Optional)

Jika ingin bisa delete file:
1. Klik **New Policy**
2. Pilih **For full customization**
3. Isi:
   - **Policy name:** `Allow authenticated delete`
   - **Allowed operation:** `DELETE`
   - **Policy definition:**
   ```sql
   (bucket_id = 'portfolio-images'::text)
   ```
   - **Target roles:** `authenticated` atau `anon`
4. Klik **Review** lalu **Save policy**

## Step 3: Test Upload

Setelah setup selesai, coba upload gambar dari admin panel:
1. Login ke admin panel
2. Buka "Kelola Konten Home"
3. Pilih tipe gambar (About Me atau Project)
4. Drag & drop atau klik untuk upload gambar
5. Gambar akan otomatis terupload dan tersimpan

## Troubleshooting

### Error: "new row violates row-level security policy"
- Pastikan Storage policies sudah dibuat dengan benar
- Pastikan bucket name adalah `portfolio-images` (case-sensitive)

### Error: "Bucket not found"
- Pastikan bucket sudah dibuat dengan nama `portfolio-images`
- Cek di Storage dashboard apakah bucket ada

### Error: "File size too large"
- File maksimal 5MB (bisa diubah di `/api/upload/route.ts`)
- Compress gambar terlebih dahulu jika terlalu besar

### Gambar tidak muncul setelah upload
- Pastikan bucket adalah **Public bucket**
- Cek URL gambar di database apakah benar
- Pastikan policy "Allow public read" sudah dibuat

## Alternative: Quick Setup dengan SQL

Jika lebih mudah, bisa jalankan SQL ini di Supabase SQL Editor:

```sql
-- Buat bucket (jika belum ada)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy untuk public read
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Policy untuk upload (anon - untuk testing, bisa diubah jadi authenticated)
CREATE POLICY "Allow upload" ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'portfolio-images');

-- Policy untuk delete (optional)
CREATE POLICY "Allow delete" ON storage.objects
FOR DELETE
USING (bucket_id = 'portfolio-images');
```

