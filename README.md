# Orulabs Admin Panel

Template dashboard admin berbasis **Bootstrap 5.3**, berupa HTML/CSS/JS statis tanpa build tool. Tinggal salin lalu dipakai di proyek Flask, Laravel, PHP, atau backend lainnya.

![Bootstrap 5.3](https://img.shields.io/badge/Bootstrap-5.3-7952b3) ![Tanpa build tool](https://img.shields.io/badge/build-tidak%20perlu-success)

## Isi paket

| Bagian | Halaman / fitur |
|---|---|
| Layout | Sidebar melayang (mode lebar / mini ikon / overlay di ponsel), navbar sticky dengan progress scroll, footer |
| Navbar | Pencarian (`Ctrl+K`), jam, mini kalender, sticky notes, notifikasi, layar penuh, mode gelap, menu user |
| Tema | Panel **Pengaturan Tema**: 10 warna preset + warna bebas (color picker / hex), mode terang/gelap/otomatis, sidebar terang/gelap/berwarna, radius sudut, sidebar mini. Tersimpan otomatis di browser |
| Dashboard | `index.html`: kartu KPI, grafik, transaksi, mini kalender, timeline, ticker pengumuman |
| UI Elements | `buttons.html`, `elements.html` (alert, badge, avatar, progress, spinner, modal, toast, tooltip, popover, tab, accordion, pagination, offcanvas, empty state), `cards.html`, `typography.html` |
| Forms | `forms.html` (semua input, date picker, select berpencarian, multi select, tags, upload drag & drop, validasi), `form-advanced.html` (wizard bertahap, form horizontal) |
| Data | `tables.html` (cari, urutkan, paging, pilih semua, tanpa library), `charts.html` (line, bar, stacked, doughnut, radar) |
| Kalender | `calendar.html`: tampilan bulanan, tambah/ubah/hapus event, daftar event mendatang |
| Sticky Notes | Panel samping: tambah, cari, 6 warna, sematkan, hapus |
| Autentikasi | 4 variasi login (`login.html` Split, `login-centered.html`, `login-glass.html`, `login-minimal.html`), `register.html`, `forgot-password.html` (dengan OTP), `lock-screen.html` |
| Lainnya | `profile.html`, `pricing.html`, `404.html`, `blank.html` (titik awal halaman baru) |

## Cara pakai

Buka `index.html` langsung di browser, atau jalankan server lokal supaya semua fitur berjalan normal:

```bash
python -m http.server 8000
```

Lalu buka <http://localhost:8000>.

## Mengganti warna

**Dari tampilan:** klik ikon palet di navbar (atau tombol gerigi di tepi kanan), lalu pilih warna. Pilihan ini tersimpan di browser masing-masing pengguna.

**Warna bawaan untuk semua pengguna:** ubah `OL_DEFAULTS` di [`assets/js/orulabs-theme-init.js`](assets/js/orulabs-theme-init.js):

```js
var OL_DEFAULTS = {
    primary: "#7c3aed",   // warna utama (hex)
    mode: "light",        // light | dark | auto
    sidebar: "dark",      // light | dark | primary
    radius: "14",         // 6 | 14 | 20
    mini: false           // sidebar mini di desktop
};
```

**Dari JavaScript:**

```js
OL.setTheme({ primary: "#16a34a", sidebar: "primary" });
```

Semua warna aksen (tombol, link, form, badge, sidebar, chart) diturunkan dari satu variabel CSS, `--ol-primary`.

## Struktur folder

```
assets/
  css/orulabs.css              # semua style template
  js/orulabs-theme-init.js     # tema, dimuat di <head> (tanpa kedipan warna)
  js/orulabs.js                # sidebar, navbar, tema, notes, kalender, tabel, form
  js/pages/*.js                # script khusus halaman (dashboard, charts, calendar, wizard)
  img/favicon.svg
src/
  partials/*.html              # head, sidebar, navbar, footer, panel tema & notes, scripts
  pages/*.html                 # isi tiap halaman
tools/build.py                 # merakit src/ menjadi *.html di root
*.html                         # halaman siap pakai (hasil build)
```

### Mengubah menu sidebar atau navbar

Sidebar dan navbar ada di setiap halaman. Supaya tidak perlu mengedit 21 file, ubah sumbernya sekali saja lalu build ulang:

1. Edit `src/partials/sidebar.html` (atau partial lain), atau isi halaman di `src/pages/`.
2. Jalankan `python tools/build.py` (hanya butuh Python 3, tanpa paket tambahan).

Menu yang aktif ditandai otomatis dari nama file halaman, jadi markup sidebar tidak perlu diubah per halaman.

Untuk membuat halaman baru, salin `src/pages/blank.html`, ganti `title` di blok `<!--@ ... -->`, lalu build ulang.

### Memasang ke framework (Flask / Laravel)

- `src/partials/head.html` + `sidebar.html` + `navbar.html` + `footer.html` + `offcanvas.html` + `scripts.html` menjadi layout dasar (`base.html` di Jinja, `layouts/app.blade.php` di Laravel).
- Isi `src/pages/*.html` menjadi blok konten (`{% block content %}` / `@section('content')`).
- Ganti tautan `*.html` dengan route aplikasi Anda.

## Data contoh

Sticky notes dan event kalender disimpan di `localStorage` browser sebagai demo. Untuk produksi, ganti isi `OL.events` dan fungsi `initNotes` di `assets/js/orulabs.js` dengan panggilan API ke backend Anda.

## Library yang dipakai (via CDN)

Bootstrap 5.3.8, Bootstrap Icons 1.13.1, Chart.js 4.4.7, Flatpickr 4.6.13, Tom Select 2.4.3, dan font Inter. Semuanya berlisensi terbuka (MIT, Apache-2.0, dan SIL OFL). Detailnya ada di [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Lisensi

Hak cipta © 2026 Orulabs. Lihat [LICENSE](LICENSE).
