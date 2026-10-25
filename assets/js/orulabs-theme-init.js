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
        primary: "#0190fb",   // warna utama (hex) - biru logo Orulabs
        mode: "light",        // light | dark | auto
        sidebar: "light",     // light | dark | primary
        radius: "14",         // sudut kartu dalam px: 6 | 14 | 20
        mini: false,          // sidebar diciutkan (desktop)
        loader: "logo"        // loading screen: logo | ring | spinner | dots | bar | none
    };

    // Plugin tema (opsional): skrip yang dimuat SEBELUM file ini boleh
    // menambahkan objek ke window.OL_THEME_PLUGINS:
    //   { defaults: {kunci: nilai}, params: ["kunci"], apply: function (t, root) {} }
    // defaults ikut disimpan/di-reset bersama tema, params bisa diisi
    // lewat URL, dan apply dipanggil setiap kali tema dipasang.
    var PLUGINS = window.OL_THEME_PLUGINS || [];
    PLUGINS.forEach(function (plugin) {
        for (var k in plugin.defaults || {}) { OL_DEFAULTS[k] = plugin.defaults[k]; }
    });

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

    // Pratinjau lewat URL (tidak disimpan), mis. untuk demo/screenshot:
    // index.html?mode=dark&primary=7c3aed&sidebar=primary&radius=20&mini=1&loader=ring
    var params = new URLSearchParams(location.search);
    if (params.has("primary")) { theme.primary = "#" + params.get("primary").replace("#", ""); }
    if (params.has("mode")) { theme.mode = params.get("mode"); }
    if (params.has("sidebar")) { theme.sidebar = params.get("sidebar"); }
    if (params.has("radius")) { theme.radius = params.get("radius"); }
    if (params.has("mini")) { theme.mini = params.get("mini") === "1"; }
    if (params.has("loader")) { theme.loader = params.get("loader"); }
    PLUGINS.forEach(function (plugin) {
        (plugin.params || []).forEach(function (k) {
            if (params.has(k)) { theme[k] = params.get(k); }
        });
    });

    function hexToRgb(hex) {
        var h = String(hex).replace("#", "");
        if (h.length === 3) {
            h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        }
        var n = parseInt(h, 16);
        if (isNaN(n) || h.length !== 6) {
            return "1, 144, 251";
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
        root.setAttribute("data-ol-loader", t.loader || "none");
        PLUGINS.forEach(function (plugin) {
            if (plugin.apply) { plugin.apply(t, root); }
        });
    }

    apply(theme);

    // Dipakai ulang oleh orulabs.js (panel Tema).
    window.OL_THEME = {
        defaults: OL_DEFAULTS,
        current: theme,
        storageKey: STORAGE_KEY,
        hexToRgb: hexToRgb,
        resolveMode: resolveMode,
        plugins: PLUGINS,
        apply: apply
    };
})();
