<p align="center">
  <img src="assets/img/brand/orulabs-logo.png" alt="Orulabs" height="56">
</p>

<h1 align="center">Orulabs Admin Panel</h1>

<p align="center">
  Template dashboard admin berbasis <b>Bootstrap 5.3</b>, berupa HTML/CSS/JS statis tanpa build tool.<br>
  Bisa jalan <b>offline</b> (semua library ada di <code>assets/vendor</code>) atau lewat CDN.
</p>

<p align="center">
  <a href="https://r0corp.github.io/Admin_Panel_Orulabs/"><b>Lihat demo langsung</b></a> ·
  <a href="#edisi-pro--limited">Edisi Pro &amp; Limited</a> ·
  <a href="https://wa.me/6281388611977?text=Halo%2C%20saya%20tertarik%20dengan%20Orulabs%20Admin%20Panel%20edisi%20Pro%20%2F%20Limited%20dan%20ingin%20bertanya.">WhatsApp</a> ·
  <a href="LICENSE">Lisensi MIT</a>
</p>

![Dashboard](docs/screenshots/dashboard-light.png)

## Isi paket (26 halaman)

| Bagian | Halaman / fitur |
|---|---|
| Layout | Sidebar melayang (lebar / mini ikon / overlay di ponsel) dengan logo Orulabs panjang & ikon, navbar sticky dengan progress scroll, footer |
| Bahasa | Indonesia, English, 日本語, 中文: pemilih di navbar & panel Tema; menu, panel, notes, palette, tanggal & jam ikut bahasa |
| Navbar | **Command palette** (`Ctrl+K`: cari & buka halaman atau aksi), jam, mini kalender, sticky notes, notifikasi, layar penuh, mode gelap, menu user |
| Tema | Panel **Pengaturan Tema**: preset warna (termasuk biru & oranye Orulabs) + warna bebas, mode terang/gelap/otomatis, sidebar terang/gelap/berwarna, radius sudut, sidebar mini, **pilihan loading screen**. Tersimpan otomatis di browser |
| Loading | Loading screen 5 gaya (Logo, Ring, Spinner, Titik, Bar) atau mati; `loaders.html`: progress bar atas, overlay loading kartu, tombol loading, skeleton shimmer |
| Dashboard | `index.html`: kartu KPI, grafik, transaksi, mini kalender, timeline, ticker pengumuman |
| UI Elements | `buttons.html`, `elements.html` (alert, badge, avatar, progress, spinner, modal, toast, tooltip, popover, tab, accordion, pagination, offcanvas, empty state), `cards.html`, `loaders.html`, `typography.html` (termasuk panduan logo) |
| Forms | `forms.html` (semua input, date picker, select berpencarian, tags, upload drag & drop, validasi), `form-advanced.html` (wizard sederhana, form horizontal), **`wizard.html`** (onboarding dengan stepper ikon + pilihan kartu + pratinjau tema, stepper vertikal, wizard di dalam modal) |
| Data | `tables.html` (cari, urutkan, paging, pilih semua), `charts.html` (line, bar, stacked, doughnut, radar) |
| Aplikasi | `calendar.html` (event bulanan), **`kanban.html`** (drag & drop), **`chat.html`**, **`invoice.html`** (siap cetak/PDF) |
| Sticky Notes | Panel samping: tambah, cari, 6 warna, sematkan, hapus |
| Autentikasi | 4 variasi login (`login.html` Split, `login-centered.html`, `login-glass.html`, `login-minimal.html`), `register.html`, `forgot-password.html` (dengan OTP), `lock-screen.html` |
| Lainnya | `profile.html`, `pricing.html`, `404.html`, `blank.html` (titik awal halaman baru) |

## Screenshot

| | |
|---|---|
| ![Mode gelap](docs/screenshots/dashboard-dark.png) | ![Sidebar berwarna, tema oranye](docs/screenshots/dashboard-sidebar-color.png) |
| Mode gelap | Sidebar berwarna + tema oranye Orulabs |
| ![Wizard](docs/screenshots/wizard.png) | ![Kanban](docs/screenshots/kanban.png) |
| Wizard | Kanban drag & drop |
| ![Chat](docs/screenshots/chat.png) | ![Invoice](docs/screenshots/invoice.png) |
| Chat | Invoice |
| ![Kalender](docs/screenshots/calendar.png) | ![Loading & Skeleton](docs/screenshots/loaders.png) |
| Kalender | Loading & Skeleton |
| ![Form](docs/screenshots/forms.png) | ![Tabel](docs/screenshots/tables.png) |
| Form input | Tabel data |
| ![Login split](docs/screenshots/login-split.png) | ![Login glass](docs/screenshots/login-glass.png) |
| Login - Split | Login - Glass |
| ![Login centered](docs/screenshots/login-centered.png) | ![Login minimal](docs/screenshots/login-minimal.png) |
| Login - Centered | Login - Minimal |
| ![Sidebar mini](docs/screenshots/dashboard-mini-sidebar.png) | ![Logo](docs/screenshots/typography-brand.png) |
| Sidebar mini (ikon logo) | Panduan logo |

<p align="center"><img src="docs/screenshots/mobile-dashboard.png" alt="Tampilan ponsel" width="300"></p>

## Edisi Pro & Limited

Butuh tampilan yang lebih premium? Ada dua edisi berbayar yang dibangun di atas template ini (semua fitur di atas tetap ada):

| | |
|---|---|
| ![Pro Glass Light](docs/editions/pro-glass-light.jpg) | ![Pro Glass Dark](docs/editions/pro-glass-dark.jpg) |
| **Pro** - skin Glass Light & Glass Dark, gambar latar per area (halaman, sidebar, navbar, header, login), 5 preset + upload foto | Gambar berbeda di sidebar, navbar, dan header |
| ![Limited Liquid Light](docs/editions/limited-liquid-light.jpg) | ![Limited Liquid Dark](docs/editions/limited-liquid-dark.jpg) |
| **Orulabs Liquid - Edisi Limited** - kaca cair ala iOS 26, Liquid Light & Liquid Dark | Palet dikunci ke warna logo Orulabs |

<p align="center">
  <a href="https://wa.me/6281388611977?text=Halo%2C%20saya%20tertarik%20dengan%20Orulabs%20Admin%20Panel%20edisi%20Pro%20%2F%20Limited%20dan%20ingin%20bertanya."><img src="https://img.shields.io/badge/Tanya%20%26%20beli%20lewat%20WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Hubungi lewat WhatsApp"></a>
</p>

<p align="center"><sub>Chat WhatsApp Orulabs: +62 813-8861-1977</sub></p>

## Cara pakai

Buka `index.html` langsung di browser (tanpa internet pun jalan), atau jalankan server lokal:

```bash
python -m http.server 8000
```

Lalu buka <http://localhost:8000>.

## Offline atau CDN

Secara bawaan semua halaman memakai library dari **`assets/vendor/`** (Bootstrap, Bootstrap Icons, Chart.js, Flatpickr, Tom Select, font Inter), jadi bisa dikembangkan tanpa internet.

Kalau ingin memakai CDN (jsDelivr + Google Fonts), build ulang dengan:

```bash
python tools/build.py --cdn
```

Untuk kembali ke mode offline cukup `python tools/build.py`. Daftar library dan URL-nya ada di `VENDOR` dalam [`tools/build.py`](tools/build.py).

## Mengganti warna & tampilan

**Dari tampilan:** klik ikon palet di navbar (atau tombol gerigi di tepi kanan). Pilihan tersimpan di browser masing-masing pengguna.

**Bawaan untuk semua pengguna:** ubah `OL_DEFAULTS` di [`assets/js/orulabs-theme-init.js`](assets/js/orulabs-theme-init.js):

```js
var OL_DEFAULTS = {
    primary: "#0190fb",   // warna utama (hex) - biru logo Orulabs
    mode: "light",        // light | dark | auto
    sidebar: "light",     // light | dark | primary
    radius: "14",         // 6 | 14 | 20
    mini: false,          // sidebar mini di desktop
    loader: "logo"        // loading screen: logo | ring | spinner | dots | bar | none
};
```

**Lewat URL** (untuk demo, tidak disimpan): `index.html?mode=dark&primary=f47a20&sidebar=primary&loader=ring`

**Dari JavaScript:** `OL.setTheme({ primary: "#16a34a", sidebar: "primary" })`

## Bahasa

Pilih bahasa dari tombol kode bahasa (ID/EN/JA/ZH) di navbar atau dari panel Tema. Pilihan tersimpan di browser; untuk demo bisa juga lewat URL: `index.html?lang=en`.

Teks diterjemahkan lewat atribut:

```html
<span data-i18n="nav.dashboard">Dashboard</span>
<input data-i18n-placeholder="top.search">
<button data-i18n-title="top.fullscreen">...</button>
```

Kamus ada di [`assets/js/orulabs-i18n.js`](assets/js/orulabs-i18n.js). Menambah bahasa: salin blok `en`, ganti kodenya, terjemahkan, lalu daftarkan di `LANGS`. Kunci yang belum diterjemahkan otomatis memakai teks Indonesia. Dari JavaScript: `OL.t("kunci")`, `OL.setLang("en")`, event `ol:langchange`.

Yang diterjemahkan adalah bagian layout (sidebar, navbar, panel Tema, sticky notes, command palette, footer, loading screen) serta format tanggal/jam. Isi contoh di tiap halaman tetap berbahasa Indonesia; tambahkan `data-i18n` sesuai kebutuhan.

## Logo

File ada di `assets/img/brand/`:

| File | Pemakaian |
|---|---|
| `orulabs-logo.png` | Logo panjang (sidebar lebar, halaman login, header) |
| `orulabs-logo-white.png` | Logo panjang putih untuk latar berwarna / gelap (otomatis dipakai di sidebar "Berwarna") |
| `orulabs-icon-512.png`, `-192.png`, `-64.png` | Ikon persegi (sidebar mini, loading screen, aplikasi) |
| `orulabs-icon-white-192.png` | Ikon putih untuk latar berwarna |
| `../favicon.ico`, `../apple-touch-icon.png` | Ikon tab browser & layar utama ponsel |

Warna brand: biru `#0190fb`, cyan `#16c5fb`, oranye `#f47a20`.

## Komponen JavaScript siap pakai

| API / atribut | Fungsi |
|---|---|
| `data-ol-wizard` + `data-wizard-step` / `data-wizard-pane` / `data-wizard-next` / `data-wizard-prev` | Wizard bertahap dengan validasi per langkah, progress (`data-wizard-progress`), ringkasan otomatis (`data-wizard-summary`), event `ol:wizardfinish` |
| `OL.toast(pesan, varian)` | Notifikasi kecil |
| `OL.progress.start()` / `.done()` | Progress bar tipis di atas layar |
| `OL.blockCard(el, teks)` | Overlay loading di atas kartu; mengembalikan fungsi untuk menutupnya |
| `OL.buttonLoading(btn, true/false)` | Tombol dengan status memproses |
| `OL.previewLoader("ring")` | Tampilkan loading screen sesaat |
| `OL.openPalette()` | Buka command palette |
| `OL.events` | Data event kalender (ganti dengan API backend) |
| `table[data-ol-table]` | Tabel dengan cari, urutkan, paging |
| `form.needs-validation` | Validasi form Bootstrap |

## Struktur folder

```
assets/
  css/orulabs.css              # semua style template
  js/orulabs-theme-init.js     # tema, dimuat di <head> (tanpa kedipan warna)
  js/orulabs.js                # layout, tema, loading, wizard, palette, notes, kalender, tabel, form
  js/pages/*.js                # script khusus halaman
  img/brand/                   # logo Orulabs
  vendor/                      # library pihak ketiga (mode offline)
src/
  partials/*.html              # head, preloader, sidebar, navbar, footer, panel tema & notes, scripts
  pages/*.html                 # isi tiap halaman
docs/screenshots/              # gambar untuk README
tools/build.py                 # merakit src/ menjadi *.html di root (--cdn untuk mode CDN)
tools/screenshots.py           # ambil ulang screenshot (butuh Edge/Chrome)
*.html                         # halaman siap pakai (hasil build)
```

### Mengubah menu sidebar atau navbar

Sidebar dan navbar ada di setiap halaman. Ubah sumbernya sekali saja lalu build ulang:

1. Edit `src/partials/sidebar.html` (atau partial lain), atau isi halaman di `src/pages/`.
2. Jalankan `python tools/build.py` (hanya butuh Python 3, tanpa paket tambahan).

Menu aktif ditandai otomatis dari nama file halaman, dan command palette otomatis mengikuti isi sidebar.

Untuk halaman baru, salin `src/pages/blank.html`, ganti `title` di blok `<!--@ ... -->`, lalu build ulang. Screenshot README bisa diambil ulang dengan `python tools/screenshots.py`.

### Titik sambung untuk ekstensi

Fitur tambahan (mis. edisi Pro) bisa dipasang tanpa mengubah file inti:

- **Plugin tema** - skrip yang dimuat sebelum `orulabs-theme-init.js` boleh menambah objek ke `window.OL_THEME_PLUGINS` (`defaults`, `params`, `apply(t, root)`). Pengaturannya ikut tersimpan, di-reset, dan bisa diisi lewat URL.
- **Partial opsional** - kalau ada, `src/partials/head-extra.html`, `head-css-extra.html`, `scripts-extra.html`, dan `customizer-extra.html` otomatis disisipkan saat build.

### Memasang ke framework (Flask / Laravel)

- `src/partials/head.html` + `preloader.html` + `sidebar.html` + `navbar.html` + `footer.html` + `offcanvas.html` + `scripts.html` menjadi layout dasar (`base.html` di Jinja, `layouts/app.blade.php` di Laravel).
- Isi `src/pages/*.html` menjadi blok konten (`{% block content %}` / `@section('content')`).
- Ganti tautan `*.html` dengan route aplikasi Anda, dan path `assets/...` dengan helper aset framework (`url_for('static', ...)` / `asset(...)`).

## Data contoh

Sticky notes, event kalender, dan kartu kanban disimpan di `localStorage` browser sebagai demo. Untuk produksi, ganti dengan panggilan API ke backend Anda.

## Library pihak ketiga

Bootstrap 5.3.8, Bootstrap Icons 1.13.1, Chart.js 4.4.7, Flatpickr 4.6.13, Tom Select 2.4.3, dan font Inter. Semuanya berlisensi terbuka (MIT, Apache-2.0, SIL OFL) dan disertakan di `assets/vendor/` bersama file lisensinya. Detail di [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

## Lisensi

Edisi ini berlisensi [MIT](LICENSE): bebas dipakai, diubah, dan dipakai di proyek komersial, asal catatan hak cipta tetap disertakan. Nama dan logo Orulabs (`assets/img/brand/`) tidak termasuk dalam lisensi ini; ganti dengan merek Anda sendiri saat menerbitkan produk berbasis template ini.

Edisi Pro dan Limited Edition memakai lisensi komersial terpisah.
