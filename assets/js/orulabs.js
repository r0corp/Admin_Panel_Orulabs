/* ============================================================
   ORULABS ADMIN PANEL - SCRIPT UTAMA
   ------------------------------------------------------------
   Butuh: Bootstrap 5.3 bundle, orulabs-theme-init.js (di head).
   Semua fitur aktif otomatis kalau elemennya ada di halaman,
   jadi file ini aman dipasang di semua halaman.

   API global: window.OL
     OL.toast(pesan, varian)        - notifikasi kecil
     OL.color(nama)                 - baca warna tema (untuk chart)
     OL.events.all() / add() / ...  - data event kalender
     OL.setTheme({primary: "#..."}) - ganti tema lewat kode
   Event: document "ol:themechange" saat tema berubah.
   ============================================================ */
(function () {
    "use strict";

    var html = document.documentElement;
    var THEME = window.OL_THEME;
    var OL = window.OL || {};
    window.OL = OL;

    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    function readJSON(key, fallback) {
        try {
            var v = JSON.parse(localStorage.getItem(key));
            return v === null || v === undefined ? fallback : v;
        } catch (e) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) { /* storage penuh / diblokir: abaikan */ }
    }

    function escapeHtml(s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    OL.escapeHtml = escapeHtml;

    // Nama bulan & hari (Senin dulu) mengikuti bahasa aktif; array diisi
    // ulang di tempat saat bahasa diganti supaya referensinya tetap sama.
    var MONTHS = [];
    var DAYS_SHORT = [];
    OL.MONTHS = MONTHS;
    OL.DAYS_SHORT = DAYS_SHORT;

    function loc() {
        return OL.locale ? OL.locale() : "id-ID";
    }

    function t(key) {
        return OL.t ? OL.t(key) : key;
    }

    function fillCalendarNames() {
        var l = loc();
        MONTHS.length = 0;
        DAYS_SHORT.length = 0;
        for (var m = 0; m < 12; m++) {
            MONTHS.push(new Date(2024, m, 1).toLocaleDateString(l, { month: "long" }));
        }
        for (var d = 0; d < 7; d++) {
            // 1 Januari 2024 jatuh pada hari Senin
            DAYS_SHORT.push(new Date(2024, 0, 1 + d).toLocaleDateString(l, { weekday: "short" }).replace(".", ""));
        }
    }

    fillCalendarNames();

    function ymd(d) {
        var m = d.getMonth() + 1;
        var day = d.getDate();
        return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
    }

    OL.ymd = ymd;


    /* ========================================================
       TEMA
       ======================================================== */

    OL.color = function (name) {
        var map = {
            primary: "--ol-primary",
            primaryDark: "--ol-primary-dark",
            text: "--ol-text",
            muted: "--ol-muted",
            border: "--ol-border",
            surface: "--ol-surface"
        };
        var probe = document.createElement("span");
        probe.style.color = "var(" + (map[name] || name) + ")";
        probe.style.display = "none";
        document.body.appendChild(probe);
        var value = getComputedStyle(probe).color;
        probe.remove();
        return value;
    };

    OL.rgba = function (alpha) {
        var rgb = getComputedStyle(html).getPropertyValue("--ol-primary-rgb").trim() || "1, 144, 251";
        return "rgba(" + rgb + ", " + alpha + ")";
    };

    OL.setTheme = function (patch) {
        for (var k in patch) {
            THEME.current[k] = patch[k];
        }
        THEME.apply(THEME.current);
        writeJSON(THEME.storageKey, THEME.current);
        syncCustomizer();
        document.dispatchEvent(new CustomEvent("ol:themechange", { detail: THEME.current }));
    };

    OL.resetTheme = function () {
        try { localStorage.removeItem(THEME.storageKey); } catch (e) { /* abaikan */ }
        var fresh = {};
        for (var k in THEME.defaults) { fresh[k] = THEME.defaults[k]; }
        THEME.current = fresh;
        OL.setTheme({});
    };

    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
        if (THEME.current.mode === "auto") {
            OL.setTheme({});
        }
    });

    var PRESETS = [
        { name: "Orulabs", color: "#0190fb" },
        { name: "Orulabs Oranye", color: "#f47a20" },
        { name: "Biru", color: "#2563eb" },
        { name: "Indigo", color: "#4f46e5" },
        { name: "Ungu", color: "#7c3aed" },
        { name: "Pink", color: "#db2777" },
        { name: "Merah", color: "#dc2626" },
        { name: "Hijau", color: "#16a34a" },
        { name: "Teal", color: "#0d9488" },
        { name: "Slate", color: "#475569" }
    ];

    function buildCustomizer() {
        var box = $("[data-ol-swatches]");
        if (box && !box.children.length) {
            PRESETS.forEach(function (p) {
                var b = document.createElement("button");
                b.type = "button";
                b.className = "ol-swatch";
                b.style.background = p.color;
                b.title = p.name;
                b.setAttribute("aria-label", "Warna " + p.name);
                b.dataset.color = p.color;
                box.appendChild(b);
            });
        }

        document.addEventListener("click", function (e) {
            var sw = e.target.closest(".ol-swatch");
            if (sw) {
                OL.setTheme({ primary: sw.dataset.color });
                return;
            }
            var opt = e.target.closest("[data-ol-set]");
            if (opt) {
                var patch = {};
                var val = opt.dataset.value;
                patch[opt.dataset.olSet] = val === "true" ? true : val === "false" ? false : val;
                OL.setTheme(patch);
                if (opt.dataset.olSet === "loader" && val !== "none") {
                    OL.previewLoader(val, 1200);
                }
                return;
            }
            if (e.target.closest("[data-ol-reset-theme]")) {
                OL.resetTheme();
                OL.toast(t("theme.resetDone"), "primary");
                return;
            }
            var modeBtn = e.target.closest("[data-ol-toggle-mode]");
            if (modeBtn) {
                var dark = html.getAttribute("data-bs-theme") === "dark";
                OL.setTheme({ mode: dark ? "light" : "dark" });
            }
        });

        var picker = $("[data-ol-color-input]");
        if (picker) {
            picker.addEventListener("input", function () {
                OL.setTheme({ primary: picker.value });
            });
        }

        var hexInput = $("[data-ol-hex-input]");
        if (hexInput) {
            hexInput.addEventListener("change", function () {
                var v = hexInput.value.trim();
                if (v[0] !== "#") { v = "#" + v; }
                if (/^#([0-9a-f]{3}){1,2}$/i.test(v)) {
                    OL.setTheme({ primary: v });
                } else {
                    OL.toast("Format warna harus hex, contoh #0190fb", "danger");
                    syncCustomizer();
                }
            });
        }

        syncCustomizer();
    }

    function syncCustomizer() {
        var cur = THEME.current;
        $$(".ol-swatch").forEach(function (s) {
            s.classList.toggle("is-active", s.dataset.color.toLowerCase() === String(cur.primary).toLowerCase());
        });
        $$("[data-ol-set]").forEach(function (o) {
            o.classList.toggle("is-active", String(cur[o.dataset.olSet]) === o.dataset.value);
        });
        var picker = $("[data-ol-color-input]");
        if (picker && /^#[0-9a-f]{6}$/i.test(cur.primary)) { picker.value = cur.primary; }
        var hexInput = $("[data-ol-hex-input]");
        if (hexInput) { hexInput.value = cur.primary; }
        $$("[data-ol-toggle-mode] i").forEach(function (i) {
            var dark = html.getAttribute("data-bs-theme") === "dark";
            i.className = dark ? "bi bi-sun" : "bi bi-moon-stars";
        });
    }


    /* ========================================================
       SIDEBAR
       ======================================================== */

    function initSidebar() {
        var desktop = window.matchMedia("(min-width: 992px)");

        document.addEventListener("click", function (e) {
            if (e.target.closest("[data-ol-toggle-sidebar]")) {
                if (desktop.matches) {
                    OL.setTheme({ mini: !THEME.current.mini });
                } else {
                    html.classList.toggle("ol-sidebar-open");
                }
                return;
            }
            if (e.target.closest(".ol-overlay")) {
                html.classList.remove("ol-sidebar-open");
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") { html.classList.remove("ol-sidebar-open"); }
        });

        // Tandai menu aktif berdasarkan nama file halaman, supaya
        // markup sidebar sama persis di semua halaman.
        var page = location.pathname.split("/").pop() || "index.html";
        $$(".ol-sidebar a.ol-nav-link[href]").forEach(function (a) {
            var href = a.getAttribute("href");
            if (!href || href === "#" || href.indexOf("#") === 0) { return; }
            if (href.split("/").pop() === page) {
                a.classList.add("active");
                var sub = a.closest(".ol-nav-sub");
                if (sub && sub.id) {
                    sub.classList.add("show");
                    var parent = $('[href="#' + sub.id + '"]');
                    if (parent) {
                        parent.setAttribute("aria-expanded", "true");
                        parent.classList.remove("collapsed");
                        parent.classList.add("is-open-parent");
                    }
                }
            }
        });
    }


    /* ========================================================
       NAVBAR: jam, progress scroll, fullscreen, pencarian
       ======================================================== */

    function initNavbar() {
        var clock = $("[data-ol-clock]");
        if (clock) {
            var tick = function () {
                var d = new Date();
                clock.textContent = d.toLocaleDateString(loc(), { weekday: "short", day: "numeric", month: "short" }) +
                    " · " + d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            };
            tick();
            setInterval(tick, 1000);
        }

        var bar = $(".ol-scroll-progress span");
        if (bar) {
            var update = function () {
                var max = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
            };
            window.addEventListener("scroll", update, { passive: true });
            window.addEventListener("resize", update);
            update();
        }

        document.addEventListener("click", function (e) {
            var fs = e.target.closest("[data-ol-fullscreen]");
            if (!fs) { return; }
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen && document.exitFullscreen();
            }
        });

        document.addEventListener("fullscreenchange", function () {
            $$("[data-ol-fullscreen] i").forEach(function (i) {
                i.className = document.fullscreenElement ? "bi bi-fullscreen-exit" : "bi bi-arrows-fullscreen";
            });
        });

        // Ctrl/Cmd + K membuka command palette
        document.addEventListener("keydown", function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k" && OL.openPalette) {
                e.preventDefault();
                OL.openPalette();
            }
        });

        // Tandai semua notifikasi sudah dibaca
        document.addEventListener("click", function (e) {
            if (!e.target.closest("[data-ol-mark-read]")) { return; }
            e.preventDefault();
            $$(".ol-notif-item.unread").forEach(function (n) { n.classList.remove("unread"); });
            $$("[data-ol-notif-count]").forEach(function (c) { c.remove(); });
        });
    }


    /* ========================================================
       TOAST
       ======================================================== */

    OL.toast = function (message, variant) {
        var wrap = $(".ol-toast-wrap");
        if (!wrap) {
            wrap = document.createElement("div");
            wrap.className = "toast-container position-fixed bottom-0 end-0 p-3 ol-toast-wrap";
            wrap.style.zIndex = 1090;
            document.body.appendChild(wrap);
        }
        var icons = { success: "check-circle-fill", danger: "x-circle-fill", warning: "exclamation-triangle-fill", info: "info-circle-fill", primary: "bell-fill" };
        var v = variant || "primary";
        var el = document.createElement("div");
        el.className = "toast align-items-center border-0";
        el.setAttribute("role", "status");
        el.innerHTML =
            '<div class="d-flex align-items-center gap-2 p-3">' +
            '<i class="bi bi-' + (icons[v] || icons.primary) + ' text-' + v + ' fs-5"></i>' +
            '<div class="flex-grow-1">' + escapeHtml(message) + '</div>' +
            '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Tutup"></button></div>';
        wrap.appendChild(el);
        var toast = new bootstrap.Toast(el, { delay: 3500 });
        el.addEventListener("hidden.bs.toast", function () { el.remove(); });
        toast.show();
    };

    document.addEventListener("click", function (e) {
        var b = e.target.closest("[data-ol-toast]");
        if (b) { OL.toast(b.dataset.olToast, b.dataset.variant); }
    });


    /* ========================================================
       EVENT KALENDER (disimpan di localStorage)
       Ganti fungsi-fungsi ini dengan fetch ke API backend Anda
       saat template dipasang ke aplikasi sungguhan.
       ======================================================== */

    var EVENTS_KEY = "orulabs-events";

    function seedEvents() {
        var now = new Date();
        var y = now.getFullYear();
        var m = now.getMonth();
        var at = function (day) { return ymd(new Date(y, m, day)); };
        return [
            { id: "e1", title: "Rapat Mingguan", date: at(3), time: "09:00", color: "primary" },
            { id: "e2", title: "Audit Aset Gudang", date: at(8), time: "13:00", color: "warning" },
            { id: "e3", title: "Deadline Laporan", date: at(14), time: "17:00", color: "danger" },
            { id: "e4", title: "Training Karyawan", date: at(Math.min(now.getDate(), 27)), time: "10:00", color: "success" },
            { id: "e5", title: "Maintenance Server", date: at(21), time: "22:00", color: "info" },
            { id: "e6", title: "Gathering Tim", date: at(26), time: "18:30", color: "primary" }
        ];
    }

    OL.events = {
        all: function () {
            var list = readJSON(EVENTS_KEY, null);
            if (!list) {
                list = seedEvents();
                writeJSON(EVENTS_KEY, list);
            }
            return list;
        },
        save: function (list) {
            writeJSON(EVENTS_KEY, list);
            document.dispatchEvent(new CustomEvent("ol:eventschange"));
        },
        add: function (ev) {
            var list = OL.events.all();
            ev.id = ev.id || "e" + Date.now();
            list.push(ev);
            OL.events.save(list);
            return ev;
        },
        update: function (id, patch) {
            OL.events.save(OL.events.all().map(function (e) {
                if (e.id !== id) { return e; }
                for (var k in patch) { e[k] = patch[k]; }
                return e;
            }));
        },
        remove: function (id) {
            OL.events.save(OL.events.all().filter(function (e) { return e.id !== id; }));
        },
        onDate: function (dateStr) {
            return OL.events.all().filter(function (e) { return e.date === dateStr; })
                .sort(function (a, b) { return (a.time || "").localeCompare(b.time || ""); });
        }
    };


    /* ========================================================
       MINI KALENDER  (elemen [data-ol-minical])
       ======================================================== */

    function initMiniCalendars() {
        $$("[data-ol-minical]").forEach(function (box) {
            var view = new Date();
            view.setDate(1);

            function render() {
                var y = view.getFullYear();
                var m = view.getMonth();
                var first = (new Date(y, m, 1).getDay() + 6) % 7;
                var days = new Date(y, m + 1, 0).getDate();
                var prevDays = new Date(y, m, 0).getDate();
                var today = ymd(new Date());
                var marked = {};
                OL.events.all().forEach(function (e) { marked[e.date] = true; });

                var out = '<div class="ol-minical-head">' +
                    '<button type="button" class="btn btn-sm btn-link text-reset p-0" data-mc="-1" aria-label="Bulan sebelumnya"><i class="bi bi-chevron-left"></i></button>' +
                    '<span>' + MONTHS[m] + " " + y + "</span>" +
                    '<button type="button" class="btn btn-sm btn-link text-reset p-0" data-mc="1" aria-label="Bulan berikutnya"><i class="bi bi-chevron-right"></i></button></div>' +
                    '<div class="ol-minical-grid">';
                DAYS_SHORT.forEach(function (d) { out += '<div class="dow">' + escapeHtml(d.slice(0, 2)) + "</div>"; });
                for (var i = 0; i < first; i++) {
                    out += '<div class="day muted">' + (prevDays - first + i + 1) + "</div>";
                }
                for (var d = 1; d <= days; d++) {
                    var key = ymd(new Date(y, m, d));
                    var cls = "day" + (key === today ? " today" : "") + (marked[key] ? " has-event" : "");
                    out += '<div class="' + cls + '" title="' + key + '">' + d + "</div>";
                }
                var cells = first + days;
                for (var n = 1; cells % 7 !== 0; n++, cells++) {
                    out += '<div class="day muted">' + n + "</div>";
                }
                out += "</div>";

                var upcoming = OL.events.all().filter(function (e) { return e.date >= today; })
                    .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); }).slice(0, 3);
                if (box.hasAttribute("data-upcoming") && upcoming.length) {
                    out += '<div class="border-top mt-2 pt-2 small">';
                    upcoming.forEach(function (e) {
                        out += '<div class="d-flex gap-2 align-items-center py-1"><span class="badge bg-' + e.color + '">&nbsp;</span>' +
                            '<span class="flex-grow-1 text-truncate">' + escapeHtml(e.title) + '</span><span class="text-muted-ol">' +
                            e.date.slice(8) + "/" + e.date.slice(5, 7) + "</span></div>";
                    });
                    out += "</div>";
                }
                box.innerHTML = out;
            }

            box.addEventListener("click", function (e) {
                var b = e.target.closest("[data-mc]");
                if (!b) { return; }
                e.stopPropagation();
                view.setMonth(view.getMonth() + parseInt(b.dataset.mc, 10));
                render();
            });

            document.addEventListener("ol:eventschange", render);
            render();
        });
    }


    /* ========================================================
       STICKY NOTES  (panel #olNotes)
       ======================================================== */

    var NOTES_KEY = "orulabs-notes";
    var NOTE_COLORS = ["yellow", "green", "blue", "pink", "purple", "orange"];

    function initNotes() {
        var list = $("[data-ol-notes-list]");
        if (!list) { return; }

        var notes = readJSON(NOTES_KEY, null);
        if (!notes) {
            notes = [
                { id: "n1", text: "Selamat datang! Catatan ini tersimpan di browser Anda.", color: "yellow", pinned: true, updated: Date.now() },
                { id: "n2", text: "Klik warna di bawah untuk mengganti warna catatan.", color: "blue", pinned: false, updated: Date.now() }
            ];
            writeJSON(NOTES_KEY, notes);
        }

        var newColor = "yellow";
        var filter = "";

        function save() {
            writeJSON(NOTES_KEY, notes);
            var badge = $("[data-ol-notes-count]");
            if (badge) { badge.textContent = notes.length; }
        }

        function timeAgo(ts) {
            var s = Math.floor((Date.now() - ts) / 1000);
            if (s < 60) { return "baru saja"; }
            if (s < 3600) { return Math.floor(s / 60) + " mnt lalu"; }
            if (s < 86400) { return Math.floor(s / 3600) + " jam lalu"; }
            return new Date(ts).toLocaleDateString(loc(), { day: "numeric", month: "short" });
        }

        function render() {
            var shown = notes
                .filter(function (n) { return !filter || n.text.toLowerCase().indexOf(filter) !== -1; })
                .sort(function (a, b) { return (b.pinned - a.pinned) || (b.updated - a.updated); });

            if (!shown.length) {
                list.innerHTML = '<div class="ol-empty"><i class="bi bi-sticky"></i>' +
                    escapeHtml(filter ? t("notes.noMatch") : t("notes.empty")) + "</div>";
                return;
            }

            list.innerHTML = shown.map(function (n) {
                var swatches = NOTE_COLORS.map(function (c) {
                    return '<button type="button" class="ol-note-swatch ol-note-' + c + (c === n.color ? " is-active" : "") +
                        '" data-note-color="' + c + '" aria-label="Warna ' + c + '"></button>';
                }).join("");
                return '<div class="ol-note ol-note-' + n.color + (n.pinned ? " is-pinned" : "") + '" data-id="' + n.id + '">' +
                    '<textarea rows="3" aria-label="Isi catatan">' + escapeHtml(n.text) + "</textarea>" +
                    '<div class="ol-note-bar">' + swatches +
                    '<span class="ms-auto">' + timeAgo(n.updated) + "</span>" +
                    '<button type="button" data-note-pin title="' + (n.pinned ? "Lepas sematan" : "Sematkan") + '"><i class="bi bi-pin' + (n.pinned ? "-fill" : "") + '"></i></button>' +
                    '<button type="button" data-note-del title="Hapus"><i class="bi bi-trash3"></i></button>' +
                    "</div></div>";
            }).join("");
        }

        function find(el) {
            var card = el.closest(".ol-note");
            if (!card) { return null; }
            for (var i = 0; i < notes.length; i++) {
                if (notes[i].id === card.dataset.id) { return notes[i]; }
            }
            return null;
        }

        var addForm = $("[data-ol-notes-form]");
        if (addForm) {
            addForm.addEventListener("submit", function (e) {
                e.preventDefault();
                var input = addForm.querySelector("textarea");
                var text = input.value.trim();
                if (!text) { input.focus(); return; }
                notes.push({ id: "n" + Date.now(), text: text, color: newColor, pinned: false, updated: Date.now() });
                input.value = "";
                save();
                render();
            });

            addForm.addEventListener("keydown", function (e) {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                    addForm.requestSubmit();
                }
            });

            $$("[data-new-note-color]", addForm).forEach(function (b) {
                b.addEventListener("click", function () {
                    newColor = b.dataset.newNoteColor;
                    $$("[data-new-note-color]", addForm).forEach(function (x) { x.classList.toggle("is-active", x === b); });
                });
            });
        }

        var search = $("[data-ol-notes-search]");
        if (search) {
            search.addEventListener("input", function () {
                filter = search.value.trim().toLowerCase();
                render();
            });
        }

        list.addEventListener("input", function (e) {
            if (e.target.tagName !== "TEXTAREA") { return; }
            var n = find(e.target);
            if (n) {
                n.text = e.target.value;
                n.updated = Date.now();
                save();
            }
        });

        list.addEventListener("click", function (e) {
            var n = find(e.target);
            if (!n) { return; }
            var colorBtn = e.target.closest("[data-note-color]");
            if (colorBtn) {
                n.color = colorBtn.dataset.noteColor;
            } else if (e.target.closest("[data-note-pin]")) {
                n.pinned = !n.pinned;
            } else if (e.target.closest("[data-note-del]")) {
                if (n.text.trim() && !confirm("Hapus catatan ini?")) { return; }
                notes = notes.filter(function (x) { return x !== n; });
            } else {
                return;
            }
            n.updated = Date.now();
            save();
            render();
        });

        document.addEventListener("ol:langchange", render);
        save();
        render();
    }


    /* ========================================================
       TABEL DATA  (table[data-ol-table])
       Cari, urutkan (klik header), dan paging tanpa library.
         data-ol-table            aktifkan
         data-page-size="5"       jumlah baris per halaman
         th[data-sort]            kolom bisa diurutkan
         [data-ol-table-search="#idTabel"]   input pencarian
         [data-ol-table-info="#idTabel"]     teks info
         [data-ol-table-pager="#idTabel"]    wadah pagination
       ======================================================== */

    function initTables() {
        $$("table[data-ol-table]").forEach(function (table) {
            var id = "#" + table.id;
            var tbody = table.tBodies[0];
            var rows = $$("tr", tbody);
            var size = parseInt(table.dataset.pageSize || "10", 10);
            var page = 1;
            var query = "";
            var sortCol = -1;
            var sortDir = 1;

            var searchInput = $('[data-ol-table-search="' + id + '"]');
            var info = $('[data-ol-table-info="' + id + '"]');
            var pager = $('[data-ol-table-pager="' + id + '"]');
            var sizeSelect = $('[data-ol-table-size="' + id + '"]');

            function cellValue(row, col) {
                var cell = row.cells[col];
                if (!cell) { return ""; }
                var v = cell.dataset.value !== undefined ? cell.dataset.value : cell.textContent.trim();
                if (/^\d{4}-\d{2}-\d{2}/.test(v)) { return v; }
                var num = parseFloat(String(v).replace(/[^0-9.,-]/g, "").replace(/\./g, "").replace(",", "."));
                return /^[\s\d.,Rp%-]+$/.test(v) && !isNaN(num) ? num : v.toLowerCase();
            }

            function render() {
                var list = rows.filter(function (r) {
                    return !query || r.textContent.toLowerCase().indexOf(query) !== -1;
                });
                if (sortCol >= 0) {
                    list.sort(function (a, b) {
                        var x = cellValue(a, sortCol);
                        var y = cellValue(b, sortCol);
                        return (x > y ? 1 : x < y ? -1 : 0) * sortDir;
                    });
                }
                var pages = Math.max(1, Math.ceil(list.length / size));
                page = Math.min(page, pages);
                var start = (page - 1) * size;

                rows.forEach(function (r) { r.remove(); });
                list.slice(start, start + size).forEach(function (r) { tbody.appendChild(r); });

                var empty = $("tr.ol-table-empty", tbody);
                if (!list.length) {
                    if (!empty) {
                        empty = document.createElement("tr");
                        empty.className = "ol-table-empty";
                        empty.innerHTML = '<td colspan="99"><div class="ol-empty"><i class="bi bi-search"></i>Data tidak ditemukan.</div></td>';
                    }
                    tbody.appendChild(empty);
                } else if (empty) {
                    empty.remove();
                }

                if (info) {
                    info.textContent = list.length
                        ? "Menampilkan " + (start + 1) + "–" + Math.min(start + size, list.length) + " dari " + list.length + " data"
                        : "0 data";
                }

                if (pager) {
                    var h = '<ul class="pagination pagination-sm mb-0">';
                    h += '<li class="page-item' + (page === 1 ? " disabled" : "") + '"><a class="page-link" href="#" data-p="' + (page - 1) + '" aria-label="Sebelumnya">‹</a></li>';
                    for (var p = 1; p <= pages; p++) {
                        if (pages > 7 && p > 2 && p < pages - 1 && Math.abs(p - page) > 1) {
                            if (p === 3 || p === pages - 2) { h += '<li class="page-item disabled"><span class="page-link">…</span></li>'; }
                            continue;
                        }
                        h += '<li class="page-item' + (p === page ? " active" : "") + '"><a class="page-link" href="#" data-p="' + p + '">' + p + "</a></li>";
                    }
                    h += '<li class="page-item' + (page === pages ? " disabled" : "") + '"><a class="page-link" href="#" data-p="' + (page + 1) + '" aria-label="Berikutnya">›</a></li></ul>';
                    pager.innerHTML = h;
                }
            }

            if (searchInput) {
                searchInput.addEventListener("input", function () {
                    query = searchInput.value.trim().toLowerCase();
                    page = 1;
                    render();
                });
            }

            if (sizeSelect) {
                sizeSelect.addEventListener("change", function () {
                    size = parseInt(sizeSelect.value, 10);
                    page = 1;
                    render();
                });
            }

            if (pager) {
                pager.addEventListener("click", function (e) {
                    var a = e.target.closest("[data-p]");
                    if (!a) { return; }
                    e.preventDefault();
                    if (a.parentElement.classList.contains("disabled")) { return; }
                    page = parseInt(a.dataset.p, 10);
                    render();
                });
            }

            $$("th[data-sort]", table).forEach(function (th) {
                th.style.cursor = "pointer";
                th.insertAdjacentHTML("beforeend", ' <i class="bi bi-arrow-down-up opacity-50 small"></i>');
                th.addEventListener("click", function () {
                    var col = th.cellIndex;
                    sortDir = sortCol === col ? -sortDir : 1;
                    sortCol = col;
                    $$("th[data-sort] i", table).forEach(function (i) { i.className = "bi bi-arrow-down-up opacity-50 small"; });
                    th.querySelector("i").className = "bi bi-sort-" + (sortDir === 1 ? "down-alt" : "up") + " small";
                    render();
                });
            });

            // Checkbox "pilih semua"
            var all = $("thead input[type=checkbox]", table);
            if (all) {
                all.addEventListener("change", function () {
                    $$("tbody input[type=checkbox]", table).forEach(function (c) { c.checked = all.checked; });
                });
            }

            render();
        });
    }


    /* ========================================================
       FORM: validasi, dropzone, plugin opsional
       ======================================================== */

    function initForms() {
        $$("form.needs-validation").forEach(function (form) {
            form.addEventListener("submit", function (e) {
                if (!form.checkValidity()) {
                    e.preventDefault();
                    e.stopPropagation();
                } else if (form.dataset.olRedirect) {
                    // Demo halaman auth: langsung pindah halaman.
                    e.preventDefault();
                    location.href = form.dataset.olRedirect;
                    return;
                } else {
                    e.preventDefault();
                    OL.toast("Form valid - siap dikirim ke server.", "success");
                }
                form.classList.add("was-validated");
            });
        });

        $$("[data-ol-dropzone]").forEach(function (zone) {
            var input = zone.querySelector("input[type=file]");
            var out = $(zone.dataset.olDropzone);
            var showFiles = function (files) {
                if (!out) { return; }
                out.innerHTML = Array.prototype.map.call(files, function (f) {
                    return '<li class="list-group-item d-flex align-items-center gap-2"><i class="bi bi-file-earmark text-primary"></i>' +
                        '<span class="flex-grow-1 text-truncate">' + escapeHtml(f.name) + '</span><span class="small text-muted-ol">' +
                        (f.size / 1024).toFixed(1) + " KB</span></li>";
                }).join("");
            };
            zone.addEventListener("click", function () { input && input.click(); });
            zone.addEventListener("dragover", function (e) { e.preventDefault(); zone.classList.add("is-dragover"); });
            zone.addEventListener("dragleave", function () { zone.classList.remove("is-dragover"); });
            zone.addEventListener("drop", function (e) {
                e.preventDefault();
                zone.classList.remove("is-dragover");
                showFiles(e.dataTransfer.files);
            });
            if (input) {
                input.addEventListener("change", function () { showFiles(input.files); });
            }
        });

        // Tampilkan/sembunyikan password
        document.addEventListener("click", function (e) {
            var b = e.target.closest("[data-ol-toggle-password]");
            if (!b) { return; }
            var input = $(b.dataset.olTogglePassword);
            if (!input) { return; }
            var show = input.type === "password";
            input.type = show ? "text" : "password";
            b.querySelector("i").className = show ? "bi bi-eye-slash" : "bi bi-eye";
        });

        // Penghitung karakter: <textarea maxlength data-ol-counter="#id">
        $$("[data-ol-counter]").forEach(function (field) {
            var out = $(field.dataset.olCounter);
            var upd = function () { if (out) { out.textContent = field.value.length + "/" + field.maxLength; } };
            field.addEventListener("input", upd);
            upd();
        });

        // Nilai slider range: <input type=range data-ol-range-output="#id">
        $$("[data-ol-range-output]").forEach(function (r) {
            var out = $(r.dataset.olRangeOutput);
            var upd = function () { if (out) { out.textContent = r.value; } };
            r.addEventListener("input", upd);
            upd();
        });

        if (window.flatpickr) {
            var fpLocale = { firstDayOfWeek: 1 };
            $$("[data-ol-date]").forEach(function (el) {
                window.flatpickr(el, {
                    dateFormat: "Y-m-d",
                    altInput: true,
                    altFormat: "j F Y",
                    locale: fpLocale,
                    mode: el.dataset.olDate === "range" ? "range" : el.dataset.olDate === "multiple" ? "multiple" : "single"
                });
            });
            $$("[data-ol-datetime]").forEach(function (el) {
                window.flatpickr(el, { enableTime: true, time_24hr: true, dateFormat: "Y-m-d H:i", locale: fpLocale });
            });
            $$("[data-ol-time]").forEach(function (el) {
                window.flatpickr(el, { enableTime: true, noCalendar: true, time_24hr: true, dateFormat: "H:i" });
            });
        }

        if (window.TomSelect) {
            $$("select[data-ol-select]").forEach(function (el) {
                new window.TomSelect(el, {
                    plugins: el.multiple ? ["remove_button"] : [],
                    create: el.dataset.olSelect === "tags",
                    maxOptions: 200
                });
            });
        }
    }


    /* ========================================================
       LAIN-LAIN: tooltip, popover, salin teks, ticker
       ======================================================== */

    function initMisc() {
        $$('[data-bs-toggle="tooltip"]').forEach(function (el) { new bootstrap.Tooltip(el); });
        $$('[data-bs-toggle="popover"]').forEach(function (el) { new bootstrap.Popover(el); });

        document.addEventListener("click", function (e) {
            var b = e.target.closest("[data-ol-copy]");
            if (!b) { return; }
            var src = $(b.dataset.olCopy);
            var text = src ? src.textContent : b.dataset.olCopy;
            navigator.clipboard.writeText(text.trim()).then(function () {
                OL.toast("Disalin ke clipboard.", "success");
            });
        });

        updateGreeting();

        $$("[data-ol-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

        // Jam besar (lock screen): HH:MM + tanggal panjang
        var big = $("[data-ol-bigclock]");
        if (big) {
            var dateEl = $("[data-ol-bigdate]");
            var tickBig = function () {
                var d = new Date();
                big.textContent = d.toLocaleTimeString(loc(), { hour: "2-digit", minute: "2-digit" });
                if (dateEl) {
                    dateEl.textContent = d.toLocaleDateString(loc(), { weekday: "long", day: "numeric", month: "long", year: "numeric" });
                }
            };
            tickBig();
            setInterval(tickBig, 1000);
        }

        // Kotak OTP: pindah otomatis ke kotak berikutnya
        $$("[data-ol-otp]").forEach(function (box) {
            var inputs = $$("input", box);
            inputs.forEach(function (input, i) {
                input.addEventListener("input", function () {
                    input.value = input.value.replace(/\D/g, "").slice(-1);
                    if (input.value && inputs[i + 1]) { inputs[i + 1].focus(); }
                });
                input.addEventListener("keydown", function (e) {
                    if (e.key === "Backspace" && !input.value && inputs[i - 1]) { inputs[i - 1].focus(); }
                });
                input.addEventListener("paste", function (e) {
                    var digits = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
                    if (!digits) { return; }
                    e.preventDefault();
                    inputs.forEach(function (x, j) { x.value = digits[j] || ""; });
                    inputs[Math.min(digits.length, inputs.length) - 1].focus();
                });
            });
        });
    }


    /* ========================================================
       LOADING: preloader, progress bar atas, overlay kartu
       ======================================================== */

    var bootTime = Date.now();

    function hidePreloader() {
        // Minimal tampil sebentar supaya tidak sekadar berkedip.
        var wait = Math.max(0, 350 - (Date.now() - bootTime));
        setTimeout(function () { html.classList.add("ol-loaded"); }, wait);
    }

    if (document.readyState === "complete") {
        hidePreloader();
    } else {
        window.addEventListener("load", hidePreloader);
        setTimeout(hidePreloader, 5000); // jaga-jaga kalau ada aset yang lambat
    }

    // Tampilkan loader beberapa saat (dipakai panel Tema & halaman demo).
    OL.previewLoader = function (style, ms) {
        var pre = $(".ol-preloader");
        if (!pre) { return; }
        var before = html.getAttribute("data-ol-loader");
        html.setAttribute("data-ol-loader", style || before);
        pre.classList.add("is-preview");
        setTimeout(function () {
            pre.classList.remove("is-preview");
            html.setAttribute("data-ol-loader", THEME.current.loader || "none");
        }, ms || 1600);
    };

    document.addEventListener("click", function (e) {
        var b = e.target.closest("[data-ol-preview-loader]");
        if (b) { OL.previewLoader(b.dataset.olPreviewLoader || THEME.current.loader); }
    });

    // Progress bar tipis di atas layar, mis. saat request AJAX:
    //   OL.progress.start(); fetch(...).finally(OL.progress.done);
    OL.progress = (function () {
        var bar = null;
        var timer = null;
        var value = 0;

        function set(v) {
            value = v;
            bar.style.width = v + "%";
        }

        return {
            start: function () {
                if (!bar) {
                    bar = document.createElement("div");
                    bar.className = "ol-top-progress";
                    document.body.appendChild(bar);
                }
                clearInterval(timer);
                bar.style.opacity = "1";
                set(8);
                timer = setInterval(function () {
                    if (value < 90) { set(value + (90 - value) * 0.12); }
                }, 250);
            },
            done: function () {
                if (!bar) { return; }
                clearInterval(timer);
                set(100);
                setTimeout(function () {
                    bar.style.opacity = "0";
                    setTimeout(function () { set(0); }, 300);
                }, 250);
            }
        };
    })();

    // Overlay loading di atas elemen (kartu, tabel):
    //   var unblock = OL.blockCard(el, "Menyimpan..."); ... unblock();
    OL.blockCard = function (el, text) {
        if (typeof el === "string") { el = $(el); }
        if (!el) { return function () {}; }
        if (getComputedStyle(el).position === "static") { el.style.position = "relative"; }
        var overlay = document.createElement("div");
        overlay.className = "ol-block-overlay";
        overlay.innerHTML = '<div class="spinner-border text-primary" role="status"></div><span>' + escapeHtml(text || "Memuat...") + "</span>";
        el.appendChild(overlay);
        return function () { overlay.remove(); };
    };

    // Tombol dengan status loading: <button data-ol-loading-text="Menyimpan...">
    OL.buttonLoading = function (btn, on) {
        if (on) {
            btn.dataset.olOriginal = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>' +
                escapeHtml(btn.dataset.olLoadingText || "Memproses...");
        } else if (btn.dataset.olOriginal) {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.olOriginal;
        }
    };


    /* ========================================================
       WIZARD  ([data-ol-wizard])
       Markup:
         <div data-ol-wizard>
           langkah : elemen [data-wizard-step]  (.ol-step / .ol-stepper-item)
           panel   : elemen [data-wizard-pane]  (satu per langkah)
           tombol  : [data-wizard-prev], [data-wizard-next]
           opsional: [data-wizard-progress] (progress-bar), [data-wizard-count]
                     [data-wizard-summary] (ringkasan isian otomatis)
         </div>
       Atribut: data-finish-text="Kirim" pada wizard.
       Event  : "ol:wizardfinish" (detail: { form data }) di elemen wizard.
       ======================================================== */

    function initWizards() {
        $$("[data-ol-wizard]").forEach(function (wiz) {
            var panes = $$("[data-wizard-pane]", wiz);
            var steps = $$("[data-wizard-step]", wiz);
            var prev = $("[data-wizard-prev]", wiz);
            var next = $("[data-wizard-next]", wiz);
            var bar = $("[data-wizard-progress]", wiz);
            var count = $("[data-wizard-count]", wiz);
            var nextHtml = next ? next.innerHTML : "";
            var finishText = wiz.dataset.finishText || "Selesai";
            var current = 0;

            // Lewati input internal Tom Select; select aslinya yang dibaca.
            function fields(pane) {
                return $$("input, select, textarea", pane).filter(function (f) {
                    return !f.disabled && !f.closest(".ts-wrapper");
                });
            }

            function fillSummary() {
                var box = $("[data-wizard-summary]", wiz);
                if (!box) { return; }
                // Label diambil dari <label for>, atau data-summary-label pada
                // pembungkus (untuk grup radio/checkbox). Nilai radio/checkbox
                // dari data-summary-value. Nilai berlabel sama digabung.
                var order = [];
                var values = {};
                panes.slice(0, -1).forEach(function (p) {
                    fields(p).forEach(function (f) {
                        if ((f.type === "radio" || f.type === "checkbox") && !f.checked) { return; }
                        var group = f.closest("[data-summary-label]");
                        // Tom Select memindahkan <label for> ke input internalnya.
                        var forLabel = f.id ? ($('label[for="' + f.id + '"]', wiz) || $('label[for="' + f.id + '-ts-control"]', wiz)) : null;
                        var label = (group ? group.dataset.summaryLabel : forLabel ? forLabel.textContent : "").trim();
                        if (!label) { return; }
                        var value;
                        if (f.type === "radio" || f.type === "checkbox") {
                            value = f.dataset.summaryValue || (f.value && f.value !== "on" ? f.value : "Ya");
                        } else if (f.tagName === "SELECT") {
                            value = Array.prototype.map.call(f.selectedOptions, function (o) { return o.text; }).join(", ");
                        } else if (f._flatpickr && f._flatpickr.altInput) {
                            value = f._flatpickr.altInput.value;
                        } else {
                            value = f.value;
                        }
                        if (!values[label]) {
                            values[label] = [];
                            order.push(label);
                        }
                        if (value) { values[label].push(value); }
                    });
                });
                box.innerHTML = order.map(function (label) {
                    return '<dt class="col-5 text-muted-ol fw-normal">' + escapeHtml(label) + '</dt><dd class="col-7 fw-semibold">' +
                        escapeHtml(values[label].join(", ") || "-") + "</dd>";
                }).join("");
            }

            function show(index) {
                current = index;
                panes.forEach(function (p, i) { p.hidden = i !== index; });
                steps.forEach(function (s, i) {
                    s.classList.toggle("is-active", i === index);
                    s.classList.toggle("is-done", i < index);
                });
                if (prev) { prev.disabled = index === 0; }
                var last = index === panes.length - 1;
                if (next) {
                    next.innerHTML = last ? '<i class="bi bi-check2-circle me-1"></i> ' + escapeHtml(finishText) : nextHtml;
                }
                if (bar) { bar.style.width = Math.round(((index + 1) / panes.length) * 100) + "%"; }
                if (count) { count.textContent = "Langkah " + (index + 1) + " dari " + panes.length; }
                if (last) { fillSummary(); }
                wiz.dispatchEvent(new CustomEvent("ol:wizardstep", { detail: { index: index } }));
            }

            function valid(pane) {
                var ok = fields(pane).every(function (f) { return f.checkValidity(); });
                pane.classList.add("was-validated");
                return ok;
            }

            if (next) {
                next.addEventListener("click", function () {
                    if (!valid(panes[current])) { return; }
                    if (current < panes.length - 1) {
                        show(current + 1);
                        return;
                    }
                    var data = {};
                    panes.forEach(function (p) {
                        fields(p).forEach(function (f) {
                            if ((f.type === "radio" || f.type === "checkbox") && !f.checked) { return; }
                            if (f.name || f.id) { data[f.name || f.id] = f.value; }
                        });
                    });
                    var ev = new CustomEvent("ol:wizardfinish", { detail: data, cancelable: true });
                    if (wiz.dispatchEvent(ev)) {
                        OL.toast(wiz.dataset.finishMessage || "Data berhasil dikirim!", "success");
                    }
                });
            }

            if (prev) {
                prev.addEventListener("click", function () { if (current > 0) { show(current - 1); } });
            }

            // Klik langkah yang sudah selesai untuk kembali ke sana
            steps.forEach(function (s, i) {
                s.addEventListener("click", function () { if (i < current) { show(i); } });
            });

            OL.wizards = OL.wizards || [];
            wiz.olWizard = {
                go: show,
                reset: function () {
                    panes.forEach(function (p) {
                        p.classList.remove("was-validated");
                        fields(p).forEach(function (f) {
                            if (f.type === "radio" || f.type === "checkbox") {
                                f.checked = f.defaultChecked;
                            } else if (f.tagName === "SELECT") {
                                Array.prototype.forEach.call(f.options, function (o) { o.selected = o.defaultSelected; });
                            } else if (f.type !== "hidden" || f._flatpickr) {
                                f.value = f.defaultValue;
                            }
                            if (f._flatpickr) { f._flatpickr.clear(); }
                            if (f.tomselect) { f.tomselect.clear(); }
                        });
                    });
                    show(0);
                }
            };

            show(0);
        });
    }


    /* ========================================================
       COMMAND PALETTE (Ctrl/Cmd + K, atau klik kolom cari)
       Isi diambil otomatis dari menu sidebar + aksi cepat.
       ======================================================== */

    function initPalette() {
        var links = $$(".ol-sidebar a.ol-nav-link[href]").filter(function (a) {
            var href = a.getAttribute("href");
            return href && href.indexOf(".html") !== -1;
        });
        if (!links.length) { return; }

        function buildItems() {
            var items = links.map(function (a) {
                var parent = a.closest(".ol-nav-sub");
                var parentLink = parent ? $('[href="#' + parent.id + '"]') : null;
                var icon = parentLink ? parentLink.querySelector("i").className : a.querySelector("i").className;
                return {
                    group: t("palette.pages"),
                    label: a.querySelector(".ol-nav-text").textContent.trim(),
                    hint: parentLink ? parentLink.querySelector(".ol-nav-text").textContent.trim() : "",
                    icon: icon.replace("nav-icon", "").trim(),
                    href: a.getAttribute("href")
                };
            });
            var g = t("palette.actions");
            return items.concat([
                { group: g, label: t("action.toggleMode"), icon: "bi bi-moon-stars", run: function () { $("[data-ol-toggle-mode]") && $("[data-ol-toggle-mode]").click(); } },
                { group: g, label: t("action.theme"), icon: "bi bi-palette", run: function () { bootstrap.Offcanvas.getOrCreateInstance("#olCustomizer").show(); } },
                { group: g, label: t("action.notes"), icon: "bi bi-sticky", run: function () { bootstrap.Offcanvas.getOrCreateInstance("#olNotes").show(); } },
                { group: g, label: t("action.sidebar"), icon: "bi bi-layout-sidebar", run: function () { OL.setTheme({ mini: !THEME.current.mini }); } },
                { group: g, label: t("action.fullscreen"), icon: "bi bi-arrows-fullscreen", run: function () { $("[data-ol-fullscreen]") && $("[data-ol-fullscreen]").click(); } },
                { group: g, label: t("action.logout"), icon: "bi bi-box-arrow-right", href: "login.html" }
            ]);
        }
        var all = buildItems();

        var modalEl = document.createElement("div");
        modalEl.className = "modal fade ol-palette";
        modalEl.tabIndex = -1;
        modalEl.setAttribute("aria-label", "Cari cepat");
        modalEl.innerHTML =
            '<div class="modal-dialog"><div class="modal-content">' +
            '<div class="position-relative"><i class="bi bi-search ol-palette-search-icon"></i>' +
            '<input type="text" class="form-control ol-palette-input" placeholder="Ketik nama halaman atau aksi..." data-i18n-placeholder="palette.placeholder" aria-label="Cari halaman atau aksi" autocomplete="off"></div>' +
            '<ul class="ol-palette-list" role="listbox"></ul>' +
            '<div class="ol-palette-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> <span data-i18n="palette.select">pilih</span></span><span><kbd>Enter</kbd> <span data-i18n="palette.open">buka</span></span><span><kbd>Esc</kbd> <span data-i18n="palette.close">tutup</span></span></div>' +
            "</div></div>";
        document.body.appendChild(modalEl);

        var modal = new bootstrap.Modal(modalEl);
        var input = $(".ol-palette-input", modalEl);
        var list = $(".ol-palette-list", modalEl);
        var shown = [];
        var active = 0;

        function render() {
            var q = input.value.trim().toLowerCase();
            shown = all.filter(function (it) {
                return !q || (it.label + " " + (it.hint || "") + " " + it.group).toLowerCase().indexOf(q) !== -1;
            });
            active = Math.min(active, Math.max(shown.length - 1, 0));
            if (!shown.length) {
                list.innerHTML = '<li class="ol-empty py-4"><i class="bi bi-search"></i>' + escapeHtml(t("palette.noResult")) + ' "' + escapeHtml(input.value) + '"</li>';
                return;
            }
            var html2 = "";
            var lastGroup = "";
            shown.forEach(function (it, i) {
                if (it.group !== lastGroup) {
                    html2 += '<li class="ol-palette-group">' + it.group + "</li>";
                    lastGroup = it.group;
                }
                html2 += '<li class="ol-palette-item' + (i === active ? " is-active" : "") + '" role="option" data-i="' + i + '">' +
                    '<i class="' + it.icon + '"></i><span class="flex-grow-1">' + escapeHtml(it.label) +
                    (it.hint ? ' <span class="small text-muted-ol">· ' + escapeHtml(it.hint) + "</span>" : "") +
                    '</span><i class="bi bi-arrow-return-left small opacity-50"></i></li>';
            });
            list.innerHTML = html2;
            var act = $(".ol-palette-item.is-active", list);
            if (act) { act.scrollIntoView({ block: "nearest" }); }
        }

        function choose(i) {
            var it = shown[i];
            if (!it) { return; }
            modal.hide();
            if (it.href) {
                location.href = it.href;
            } else if (it.run) {
                setTimeout(it.run, 200);
            }
        }

        OL.openPalette = function () {
            all = buildItems();
            if (OL.applyI18n) { OL.applyI18n(modalEl); }
            input.value = "";
            active = 0;
            render();
            modal.show();
        };

        modalEl.addEventListener("shown.bs.modal", function () { input.focus(); });
        input.addEventListener("input", function () { active = 0; render(); });
        input.addEventListener("keydown", function (e) {
            if (e.key === "ArrowDown") { e.preventDefault(); active = Math.min(active + 1, shown.length - 1); render(); }
            if (e.key === "ArrowUp") { e.preventDefault(); active = Math.max(active - 1, 0); render(); }
            if (e.key === "Enter") { e.preventDefault(); choose(active); }
        });
        list.addEventListener("click", function (e) {
            var li = e.target.closest("[data-i]");
            if (li) { choose(parseInt(li.dataset.i, 10)); }
        });
        list.addEventListener("mousemove", function (e) {
            var li = e.target.closest("[data-i]");
            if (li && parseInt(li.dataset.i, 10) !== active) {
                active = parseInt(li.dataset.i, 10);
                $$(".ol-palette-item", list).forEach(function (x) { x.classList.toggle("is-active", x === li); });
            }
        });

        // Kolom cari di navbar membuka palette
        var search = $("[data-ol-search]");
        if (search) {
            search.readOnly = true;
            search.style.cursor = "pointer";
            search.addEventListener("click", OL.openPalette);
            search.addEventListener("focus", function () { search.blur(); OL.openPalette(); });
        }
        $$("[data-ol-palette]").forEach(function (b) { b.addEventListener("click", OL.openPalette); });
    }


    /* ========================================================
       BAHASA: menu di navbar + pilihan di panel Tema
       ======================================================== */

    function initLanguage() {
        if (!OL.LANGS) { return; }

        $$("[data-ol-lang-menu]").forEach(function (menu) {
            menu.innerHTML = OL.LANGS.map(function (l) {
                return '<li><a class="dropdown-item d-flex align-items-center gap-2" href="#" data-ol-lang="' + l.code + '">' +
                    '<span class="ol-lang-code">' + l.short + "</span>" + escapeHtml(l.name) + "</a></li>";
            }).join("");
        });

        $$("[data-ol-lang-options]").forEach(function (box) {
            box.innerHTML = OL.LANGS.map(function (l) {
                return '<button type="button" class="ol-option" data-ol-lang="' + l.code + '" title="' + escapeHtml(l.name) + '">' +
                    '<span class="ol-lang-code">' + l.short + '</span><span class="small text-truncate mw-100">' + escapeHtml(l.name) + "</span></button>";
            }).join("");
        });

        document.addEventListener("click", function (e) {
            var b = e.target.closest("[data-ol-lang]");
            if (!b) { return; }
            e.preventDefault();
            OL.setLang(b.getAttribute("data-ol-lang"));
        });

        document.addEventListener("ol:langchange", function () {
            fillCalendarNames();
            // Kalender (mini & penuh) menggambar ulang lewat event ini.
            document.dispatchEvent(new CustomEvent("ol:eventschange"));
            updateGreeting();
        });

        OL.applyI18n();
    }

    function updateGreeting() {
        var greet = $("[data-ol-greeting]");
        if (greet) {
            var h = new Date().getHours();
            greet.textContent = t(h < 11 ? "greet.morning" : h < 15 ? "greet.noon" : h < 18 ? "greet.afternoon" : "greet.evening");
        }
    }


    function boot() {
        initLanguage();
        buildCustomizer();
        initWizards();
        initPalette();
        initSidebar();
        initNavbar();
        initMiniCalendars();
        initNotes();
        initTables();
        initForms();
        initMisc();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
