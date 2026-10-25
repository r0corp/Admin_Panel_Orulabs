/* Wizard bertahap: validasi per langkah, ringkasan di langkah akhir. */
(function () {
    "use strict";

    var form = document.getElementById("wizard");
    if (!form) { return; }

    var panes = Array.prototype.slice.call(form.querySelectorAll("[data-wizard-pane]"));
    var steps = Array.prototype.slice.call(document.querySelectorAll("[data-wizard-steps] .ol-step"));
    var prev = form.querySelector("[data-wizard-prev]");
    var next = form.querySelector("[data-wizard-next]");
    var summary = form.querySelector("[data-wizard-summary]");
    var current = 0;

    function show(index) {
        current = index;
        panes.forEach(function (p, i) { p.hidden = i !== index; });
        steps.forEach(function (s, i) {
            s.classList.toggle("is-active", i === index);
            s.classList.toggle("is-done", i < index);
        });
        prev.disabled = index === 0;
        var last = index === panes.length - 1;
        next.innerHTML = last ? '<i class="bi bi-send me-1"></i> Kirim pengajuan' : 'Lanjut <i class="bi bi-arrow-right ms-1"></i>';
        next.classList.toggle("btn-success", last);
        next.classList.toggle("btn-primary", !last);
        if (last) { fillSummary(); }
    }

    function fillSummary() {
        var rows = [];
        panes.slice(0, -1).forEach(function (p) {
            p.querySelectorAll("input, select, textarea").forEach(function (f) {
                // Input asli flatpickr (altInput) tetap punya id & nilai
                // Y-m-d; input tampilannya tanpa id sehingga terlewati.
                var label = form.querySelector('label[for="' + f.id + '"]');
                if (!label) { return; }
                rows.push('<dt class="col-5 text-muted-ol fw-normal">' + OL.escapeHtml(label.textContent) + '</dt><dd class="col-7 fw-semibold">' + OL.escapeHtml(f.value || "-") + "</dd>");
            });
        });
        summary.innerHTML = rows.join("");
    }

    function valid(pane) {
        var ok = true;
        pane.querySelectorAll("input, select, textarea").forEach(function (f) {
            if (!f.checkValidity()) { ok = false; }
        });
        pane.classList.add("was-validated");
        return ok;
    }

    next.addEventListener("click", function () {
        if (!valid(panes[current])) { return; }
        if (current < panes.length - 1) {
            show(current + 1);
        } else {
            OL.toast("Pengajuan terkirim!", "success");
            form.reset();
            panes.forEach(function (p) { p.classList.remove("was-validated"); });
            show(0);
        }
    });

    prev.addEventListener("click", function () {
        if (current > 0) { show(current - 1); }
    });

    show(0);
})();
