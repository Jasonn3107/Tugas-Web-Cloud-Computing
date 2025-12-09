# InspireMe! Random Quote Generator

Aplikasi web statis untuk menampilkan kutipan acak tanpa backend, siap di-deploy ke Microsoft Azure Static Web Apps (SWA).

## Fitur
- 15+ kutipan statis dalam array lokal (tanpa API eksternal).
- Tombol generate kutipan baru dengan anti-duplikasi berturut-turut.
- Tombol salin kutipan (alert sukses).
- Tombol bagikan ke Twitter (intent URL).
- Desain modern, responsif, animasi fade/slide.

## Struktur
- `index.html` – markup utama.
- `style.css` – styling tema teal/navy, responsive, animasi.
- `script.js` – logika kutipan acak, salin, dan share.
- `package.json` – dummy build untuk Azure SWA.

## Menjalankan Lokal
1. Buka `index.html` di browser, atau
2. Jalankan server static sederhana, mis. dengan Python:
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

Selamat mencoba!

