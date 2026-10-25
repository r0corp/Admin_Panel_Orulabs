/* ============================================================
   ORULABS ADMIN - THEME INIT
   ------------------------------------------------------------
   Dimuat SINKRON di <head> (tanpa defer) supaya warna, mode
   gelap/terang, gaya sidebar dan radius sudah terpasang sebelum
   halaman tergambar - tidak ada kedipan warna default.

   Ganti warna bawaan template di OL_DEFAULTS di bawah ini.
   Pilihan user dari panel "Tema" disimpan di localStorage dan
   menimpa nilai bawaan ini.
   ============================================================ */
(function () {
    var OL_DEFAULTS = {
        primary: "#2563eb",   // warna utama (hex)
        mode: "light",        // light | dark | auto
        sidebar: "light",     // light | dark | primary
        radius: "14",         // sudut kartu dalam px: 6 | 14 | 20
        mini: false           // sidebar diciutkan (desktop)
    };

    var STORAGE_KEY = "orulabs-theme";
    var saved = {};

    try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") || {};
    } catch (e) {
        saved = {};
    }

    var theme = {};
    for (var key in OL_DEFAULTS) {
        theme[key] = saved[key] !== undefined ? saved[key] : OL_DEFAULTS[key];
    }

    function hexToRgb(hex) {
        var h = String(hex).replace("#", "");
        if (h.length === 3) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        var n = parseInt(h, 16);
        if (isNaN(n) || h.length !== 6) {
            return "37, 99, 235";
        }
        return ((n >> 16) & 255) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
    }

    function resolveMode(mode) {
        if (mode === "auto") {
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        return mode === "dark" ? "dark" : "light";
    }

    function apply(t) {
        var root = document.documentElement;
        root.style.setProperty("--ol-primary", t.primary);
        root.style.setProperty("--ol-primary-rgb", hexToRgb(t.primary));
        root.style.setProperty("--ol-radius", t.radius + "px");
        root.setAttribute("data-bs-theme", resolveMode(t.mode));
        root.setAttribute("data-ol-sidebar", t.sidebar);
        root.classList.toggle("ol-sidebar-mini", !!t.mini);
    }

    apply(theme);

    // Dipakai ulang oleh orulabs.js (panel Tema).
    window.OL_THEME = {
        defaults: OL_DEFAULTS,
        current: theme,
        storageKey: STORAGE_KEY,
        hexToRgb: hexToRgb,
        resolveMode: resolveMode,
        apply: apply
    };
})();
