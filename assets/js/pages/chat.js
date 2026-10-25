/* Chat: daftar kontak, percakapan, kirim pesan + balasan otomatis (demo). */
(function () {
    "use strict";

    var body = document.querySelector("[data-chat-body]");
    if (!body) { return; }

    var esc = OL.escapeHtml;
    var contacts = [
        { id: "sw", name: "Siti Wulandari", initials: "SW", color: "#16a34a", online: true, unread: 2,
            msgs: [["them", "Pagi! Ruang meeting jam 2 sudah aku booking ya.", "08:12"], ["me", "Siap, makasih Siti 🙏", "08:15"], ["them", "Proyektornya juga sudah dicek, aman.", "08:16"], ["them", "Nanti tolong bawa laporan aset bulan ini ya.", "08:17"]] },
        { id: "bs", name: "Budi Santoso", initials: "BS", color: "#0190fb", online: true, unread: 0,
            msgs: [["them", "Switch lantai 2 sudah normal lagi.", "Kemarin"], ["me", "Mantap, sudah dicatat di tiket.", "Kemarin"]] },
        { id: "ar", name: "Andi Rahman", initials: "AR", color: "#ea580c", online: false, unread: 0,
            msgs: [["them", "Invoice vendor sudah saya teruskan ke finance.", "Senin"]] },
        { id: "dl", name: "Dewi Lestari", initials: "DL", color: "#db2777", online: false, unread: 1,
            msgs: [["them", "Desain banner event sudah siap direview 🎨", "Senin"]] },
        { id: "it", name: "Tim IT", initials: "IT", color: "#475569", online: true, unread: 0,
            msgs: [["them", "Maintenance server Sabtu jam 22:00.", "Jumat"]] }
    ];
    var REPLIES = ["Oke, noted 👍", "Siap, segera saya cek.", "Terima kasih infonya!", "Baik, nanti saya kabari lagi.", "Mantap 🙌"];
    var current = contacts[0];
    var listEl = document.querySelector("[data-chat-contacts]");
    var form = document.querySelector("[data-chat-form]");
    var input = form.querySelector("input");

    function now() {
        return new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    }

    function renderContacts(filter) {
        var q = (filter || "").toLowerCase();
        listEl.innerHTML = contacts.filter(function (c) { return c.name.toLowerCase().indexOf(q) !== -1; }).map(function (c) {
            var last = c.msgs[c.msgs.length - 1];
            return '<div class="ol-chat-contact' + (c === current ? " active" : "") + '" data-id="' + c.id + '" role="button" tabindex="0">' +
                '<span class="ol-avatar' + (c.online ? " ol-online" : "") + '" style="background:' + c.color + '">' + c.initials + "</span>" +
                '<div class="min-w-0 flex-grow-1"><div class="d-flex"><span class="fw-semibold text-truncate">' + esc(c.name) + '</span><span class="small text-muted-ol ms-auto">' + last[2] + "</span></div>" +
                '<div class="d-flex align-items-center"><span class="small text-muted-ol text-truncate">' + (last[0] === "me" ? "Anda: " : "") + esc(last[1]) + "</span>" +
                (c.unread ? '<span class="badge rounded-pill text-bg-primary ms-auto">' + c.unread + "</span>" : "") + "</div></div></div>";
        }).join("");
    }

    function renderMessages() {
        body.innerHTML = '<span class="ol-chat-day">Hari ini</span>' + current.msgs.map(function (m) {
            return '<div class="ol-msg' + (m[0] === "me" ? " me" : "") + '">' + esc(m[1]) + "<time>" + m[2] + (m[0] === "me" ? ' <i class="bi bi-check2-all"></i>' : "") + "</time></div>";
        }).join("");
        body.scrollTop = body.scrollHeight;
    }

    function openContact(c) {
        current = c;
        c.unread = 0;
        document.querySelector("[data-chat-name]").textContent = c.name;
        var av = document.querySelector("[data-chat-avatar]");
        av.textContent = c.initials;
        av.style.background = c.color;
        av.classList.toggle("ol-online", c.online);
        var st = document.querySelector("[data-chat-status]");
        st.textContent = c.online ? "Online" : "Terakhir dilihat kemarin";
        st.className = "small " + (c.online ? "text-success" : "text-muted-ol");
        renderContacts(document.querySelector("[data-chat-search]").value);
        renderMessages();
    }

    listEl.addEventListener("click", function (e) {
        var row = e.target.closest("[data-id]");
        if (row) { openContact(contacts.filter(function (c) { return c.id === row.dataset.id; })[0]); }
    });

    listEl.addEventListener("keydown", function (e) {
        if (e.key === "Enter") { var row = e.target.closest("[data-id]"); if (row) { row.click(); } }
    });

    document.querySelector("[data-chat-search]").addEventListener("input", function (e) { renderContacts(e.target.value); });

    document.querySelector("[data-chat-emoji]").addEventListener("click", function () {
        input.value += " 😊";
        input.focus();
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        var text = input.value.trim();
        if (!text) { return; }
        var target = current;
        target.msgs.push(["me", text, now()]);
        input.value = "";
        renderMessages();
        renderContacts();

        // Indikator mengetik lalu balasan otomatis (hanya demo)
        var typing = document.createElement("div");
        typing.className = "ol-msg ol-typing";
        typing.innerHTML = "<span></span><span></span><span></span>";
        setTimeout(function () {
            if (current === target) { body.appendChild(typing); body.scrollTop = body.scrollHeight; }
        }, 400);
        setTimeout(function () {
            typing.remove();
            target.msgs.push(["them", REPLIES[Math.floor(Math.random() * REPLIES.length)], now()]);
            if (current === target) { renderMessages(); }
            renderContacts();
        }, 1600);
    });

    openContact(current);
})();
