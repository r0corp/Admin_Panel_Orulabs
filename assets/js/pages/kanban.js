/* Kanban: drag & drop (HTML5), tambah/ubah/hapus kartu, simpan di localStorage. */
(function () {
    "use strict";

    var board = document.querySelector("[data-kanban]");
    if (!board) { return; }

    var KEY = "orulabs-kanban";
    var esc = OL.escapeHtml;
    var COLUMNS = [
        { id: "todo", title: "To Do", color: "#94a3b8" },
        { id: "doing", title: "Dikerjakan", color: "#0190fb" },
        { id: "review", title: "Review", color: "#f47a20" },
        { id: "done", title: "Selesai", color: "#16a34a" }
    ];
    var COLORS = { BS: "#0190fb", SW: "#16a34a", AR: "#ea580c", DL: "#db2777" };
    var TAGS = { primary: "Umum", success: "Fitur", danger: "Bug", warning: "Urgent", info: "Riset" };

    function seed() {
        return [
            { id: "k1", col: "todo", title: "Pasang ulang switch lantai 2", tag: "warning", who: "BS", due: "" },
            { id: "k2", col: "todo", title: "Survey vendor kursi kantor", tag: "info", who: "SW", due: "" },
            { id: "k3", col: "doing", title: "Migrasi email ke domain baru", tag: "primary", who: "AR", due: "" },
            { id: "k4", col: "doing", title: "Dashboard laporan mingguan", tag: "success", who: "DL", due: "" },
            { id: "k5", col: "review", title: "Perbaiki error login aplikasi aset", tag: "danger", who: "BS", due: "" },
            { id: "k6", col: "done", title: "Backup server bulanan", tag: "primary", who: "AR", due: "" }
        ];
    }

    function load() {
        try { return JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { return seed(); }
    }

    var cards = load();
    var dragId = null;

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(cards)); } catch (e) { /* abaikan */ }
    }

    function render() {
        board.innerHTML = COLUMNS.map(function (col) {
            var list = cards.filter(function (c) { return c.col === col.id; });
            return '<section class="ol-kanban-col" aria-label="' + col.title + '">' +
                '<div class="ol-kanban-head"><span class="ol-kanban-dot" style="background:' + col.color + '"></span>' + col.title +
                '<span class="badge badge-soft-secondary ms-auto">' + list.length + "</span></div>" +
                '<div class="ol-kanban-list" data-col="' + col.id + '">' +
                list.map(function (c) {
                    return '<article class="ol-kanban-card" draggable="true" data-id="' + c.id + '" tabindex="0">' +
                        '<span class="badge badge-soft-' + c.tag + ' mb-2">' + TAGS[c.tag] + "</span>" +
                        '<div class="fw-semibold mb-2">' + esc(c.title) + "</div>" +
                        '<div class="d-flex align-items-center small text-muted-ol">' +
                        (c.due ? '<span><i class="bi bi-calendar-event me-1"></i>' + c.due.slice(8) + "/" + c.due.slice(5, 7) + "</span>" : '<span><i class="bi bi-chat-dots me-1"></i>' + (c.title.length % 5) + "</span>") +
                        '<span class="ol-avatar ol-avatar-sm ms-auto" style="background:' + (COLORS[c.who] || "#475569") + '">' + c.who + "</span></div></article>";
                }).join("") +
                "</div>" +
                '<button type="button" class="ol-kanban-add" data-add="' + col.id + '"><i class="bi bi-plus-lg me-1"></i>Tambah kartu</button>' +
                "</section>";
        }).join("");
    }

    board.addEventListener("dragstart", function (e) {
        var card = e.target.closest(".ol-kanban-card");
        if (!card) { return; }
        dragId = card.dataset.id;
        card.classList.add("is-dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", dragId);
    });

    board.addEventListener("dragend", function (e) {
        var card = e.target.closest(".ol-kanban-card");
        if (card) { card.classList.remove("is-dragging"); }
        board.querySelectorAll(".is-over").forEach(function (l) { l.classList.remove("is-over"); });
    });

    board.addEventListener("dragover", function (e) {
        var list = e.target.closest(".ol-kanban-list");
        if (!list) { return; }
        e.preventDefault();
        board.querySelectorAll(".is-over").forEach(function (l) { if (l !== list) { l.classList.remove("is-over"); } });
        list.classList.add("is-over");
    });

    board.addEventListener("drop", function (e) {
        var list = e.target.closest(".ol-kanban-list");
        if (!list || !dragId) { return; }
        e.preventDefault();
        var moving = cards.filter(function (c) { return c.id === dragId; })[0];
        if (!moving) { return; }

        // Sisipkan di posisi kartu yang dilepas di atasnya
        var target = e.target.closest(".ol-kanban-card");
        cards = cards.filter(function (c) { return c !== moving; });
        moving.col = list.dataset.col;
        var index = target ? cards.findIndex(function (c) { return c.id === target.dataset.id; }) : -1;
        if (index >= 0) {
            var rect = target.getBoundingClientRect();
            if (e.clientY > rect.top + rect.height / 2) { index += 1; }
            cards.splice(index, 0, moving);
        } else {
            cards.push(moving);
        }
        dragId = null;
        save();
        render();
        if (moving.col === "done") { OL.toast("Tugas selesai: " + moving.title, "success"); }
    });

    // --- Modal tambah / ubah ---
    var modal = new bootstrap.Modal(document.getElementById("kanbanModal"));
    var form = document.getElementById("kanbanForm");
    var f = function (id) { return document.getElementById(id); };

    function open(card, col) {
        form.classList.remove("was-validated");
        f("kbId").value = card ? card.id : "";
        f("kbCol").value = card ? card.col : col;
        f("kbTitle").value = card ? card.title : "";
        f("kbTag").value = card ? card.tag : "primary";
        f("kbWho").value = card ? card.who : "BS";
        f("kbDue").value = card ? card.due : "";
        f("kbDelete").hidden = !card;
        f("kanbanModalLabel").textContent = card ? "Ubah kartu" : "Kartu baru";
        modal.show();
    }

    board.addEventListener("click", function (e) {
        var add = e.target.closest("[data-add]");
        if (add) { open(null, add.dataset.add); return; }
        var card = e.target.closest(".ol-kanban-card");
        if (card) { open(cards.filter(function (c) { return c.id === card.dataset.id; })[0]); }
    });

    board.addEventListener("keydown", function (e) {
        var card = e.target.closest(".ol-kanban-card");
        if (card && e.key === "Enter") { card.click(); }
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.classList.add("was-validated");
        if (!f("kbTitle").value.trim()) { return; }
        var data = { title: f("kbTitle").value.trim(), tag: f("kbTag").value, who: f("kbWho").value, due: f("kbDue").value };
        if (f("kbId").value) {
            cards.forEach(function (c) { if (c.id === f("kbId").value) { Object.assign(c, data); } });
        } else {
            data.id = "k" + Date.now();
            data.col = f("kbCol").value;
            cards.push(data);
        }
        save();
        render();
        modal.hide();
    });

    f("kbDelete").addEventListener("click", function () {
        cards = cards.filter(function (c) { return c.id !== f("kbId").value; });
        save();
        render();
        modal.hide();
        OL.toast("Kartu dihapus.", "danger");
    });

    document.querySelector("[data-kanban-reset]").addEventListener("click", function () {
        cards = seed();
        save();
        render();
        OL.toast("Board dikembalikan ke contoh awal.", "info");
    });

    render();
})();
