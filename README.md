# TripMate — Perencana Perjalanan Mini (Client-side CRUD)

Aplikasi web statis untuk mengelola jadwal perjalanan tanpa backend, siap di-deploy ke Microsoft Azure Static Web Apps (SWA). Semua data disimpan di `localStorage` sebagai array of objects.

## Fitur
- **C (Create):** Tambah destinasi/aktivitas beserta tanggal & lokasi.
- **R (Read):** Tampilkan jadwal terurut per tanggal, dengan filter tanggal & pencarian teks.
- **U (Update):** Ubah aktivitas (termasuk memindahkan tanggal/lokasi) via modal edit.
- **D (Delete):** Hapus aktivitas dari rencana dengan konfirmasi.
- Penyimpanan 100% client-side (`localStorage`), aman untuk SWA tanpa API.
- Desain responsif, animasi halus, dan contoh data awal.

## Struktur
- `index.html` – markup utama (form tambah, daftar jadwal, modal edit).
- `style.css` – styling tema teal/navy, responsive grid & modal.
- `script.js` – logika CRUD, filter, sort tanggal, dan penyimpanan `localStorage`.
- `package.json` – dummy build untuk Azure SWA (`"build": "echo 'No build step required for static site'"`).

## Menjalankan Lokal
1. Buka `index.html` langsung di browser, atau
2. Jalankan server statis sederhana, mis. dengan Python:
   ```bash
   python -m http.server 3000
   ```
   lalu buka `http://localhost:3000`.

## Deploy ke Azure Static Web Apps
1. Push semua file ke repositori (branch `main`).
2. Di Azure Portal, buat Static Web App:
   - Source: GitHub (atau repositori yang Anda gunakan).
   - Build presets: Custom.
   - App location: `/`
   - Api location: _(kosongkan)_
   - Output location: `/`
3. Script `build` dummy di `package.json` memastikan pipeline SWA sukses untuk situs statis murni.
4. Setelah build, situs akan tersedia di domain SWA yang diberikan.

Selamat merencanakan perjalanan!



