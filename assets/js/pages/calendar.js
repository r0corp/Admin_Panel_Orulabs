/* Kalender bulanan: tampil, tambah, ubah, hapus event (OL.events). */
(function () {
    "use strict";

    var grid = document.querySelector("[data-cal-grid]");
    if (!grid) { return; }

    var title = document.querySelector("[data-cal-title]");
    var upcoming = document.querySelector("[data-cal-upcoming]");
    var modalEl = document.getElementById("eventModal");
    var modal = new bootstrap.Modal(modalEl);
    var form = document.getElementById("eventForm");
    var fId = document.getElementById("evId");
    var fTitle = document.getElementById("evTitle");
    var fDate = document.getElementById("evDate");
    var fTime = document.getElementById("evTime");
    var btnDelete = document.getElementById("evDelete");
    var esc = OL.escapeHtml;

    var datePicker = window.flatpickr
        ? window.flatpickr(fDate, { dateFormat: "Y-m-d", altInput: true, altFormat: "j F Y", locale: { firstDayOfWeek: 1 } })
        : null;

    var view = new Date();
    view.setDate(1);

    function setDate(value) {
        if (datePicker) { datePicker.setDate(value, false); } else { fDate.value = value; }
    }

    function render() {
        var y = view.getFullYear();
        var m = view.getMonth();
        title.textContent = OL.MONTHS[m] + " " + y;

        var first = (new Date(y, m, 1).getDay() + 6) % 7;
        var start = new Date(y, m, 1 - first);
        var today = OL.ymd(new Date());
        var weeks = Math.ceil((first + new Date(y, m + 1, 0).getDate()) / 7);

        var out = OL.DAYS_SHORT.map(function (d) { return '<div class="cal-dow">' + d + "</div>"; }).join("");
        for (var i = 0; i < weeks * 7; i++) {
            var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
            var key = OL.ymd(d);
            var events = OL.events.onDate(key);
            var cls = "cal-cell" + (d.getMonth() !== m ? " muted" : "") + (key === today ? " today" : "");
            out += '<div class="' + cls + '" data-date="' + key + '" role="button" tabindex="0" aria-label="' + d.getDate() + " " + OL.MONTHS[d.getMonth()] + '">' +
                '<span class="cal-num">' + d.getDate() + "</span>" +
                events.map(function (e) {
                    return '<span class="cal-event ev-' + e.color + '" data-id="' + e.id + '" title="' + esc(e.title) + '">' +
                        (e.time ? e.time + " " : "") + esc(e.title) + "</span>";
                }).join("") +
                "</div>";
        }
        grid.innerHTML = out;
        renderUpcoming();
    }

    function renderUpcoming() {
        var today = OL.ymd(new Date());
        var list = OL.events.all()
            .filter(function (e) { return e.date >= today; })
            .sort(function (a, b) { return (a.date + a.time).localeCompare(b.date + b.time); })
            .slice(0, 6);

        if (!list.length) {
            upcoming.innerHTML = '<div class="ol-empty py-4"><i class="bi bi-calendar-x"></i>Tidak ada event.</div>';
            return;
        }

        upcoming.innerHTML = list.map(function (e) {
            var d = new Date(e.date + "T00:00:00");
            return '<a href="#" class="list-group-item list-group-item-action d-flex gap-3 align-items-center" data-id="' + e.id + '">' +
                '<span class="text-center rounded-3 px-2 py-1 bg-' + e.color + '-subtle text-' + e.color + '-emphasis" style="min-width:48px">' +
                '<span class="d-block fw-800 fs-5 lh-1">' + d.getDate() + '</span><span class="small">' + OL.MONTHS[d.getMonth()].slice(0, 3) + "</span></span>" +
                '<span class="min-w-0"><span class="d-block fw-semibold text-truncate">' + esc(e.title) + '</span><span class="small text-muted-ol">' +
                (e.time || "Sepanjang hari") + "</span></span></a>";
        }).join("");
    }

    function openModal(ev, date) {
        form.classList.remove("was-validated");
        fId.value = ev ? ev.id : "";
        fTitle.value = ev ? ev.title : "";
        fTime.value = ev ? ev.time || "" : "";
        if (fTime._flatpickr) { fTime._flatpickr.setDate(fTime.value, false); }
        setDate(ev ? ev.date : date || OL.ymd(new Date()));
        var color = ev ? ev.color : "primary";
        form.querySelector('input[name=evColor][value="' + color + '"]').checked = true;
        btnDelete.hidden = !ev;
        document.getElementById("eventModalLabel").textContent = ev ? "Ubah event" : "Event baru";
        modal.show();
    }

    function findEvent(id) {
        return OL.events.all().filter(function (e) { return e.id === id; })[0];
    }

    grid.addEventListener("click", function (e) {
        var evEl = e.target.closest(".cal-event");
        if (evEl) {
            openModal(findEvent(evEl.dataset.id));
            return;
        }
        var cell = e.target.closest(".cal-cell");
        if (cell) { openModal(null, cell.dataset.date); }
    });

    grid.addEventListener("keydown", function (e) {
        var cell = e.target.closest(".cal-cell");
        if (cell && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openModal(null, cell.dataset.date);
        }
    });

    upcoming.addEventListener("click", function (e) {
        var a = e.target.closest("[data-id]");
        if (!a) { return; }
        e.preventDefault();
        openModal(findEvent(a.dataset.id));
    });

    document.querySelector("[data-cal-new]").addEventListener("click", function () { openModal(null); });
    document.querySelector("[data-cal-today]").addEventListener("click", function () {
        view = new Date();
        view.setDate(1);
        render();
    });
    document.querySelectorAll("[data-cal-nav]").forEach(function (b) {
        b.addEventListener("click", function () {
            view.setMonth(view.getMonth() + parseInt(b.dataset.calNav, 10));
            render();
        });
    });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        form.classList.add("was-validated");
        if (!fTitle.value.trim() || !fDate.value) { return; }

        var data = {
            title: fTitle.value.trim(),
            date: fDate.value,
            time: fTime.value,
            color: form.querySelector("input[name=evColor]:checked").value
        };

        if (fId.value) {
            OL.events.update(fId.value, data);
            OL.toast("Event diperbarui.", "success");
        } else {
            OL.events.add(data);
            OL.toast("Event ditambahkan.", "success");
        }
        modal.hide();
    });

    btnDelete.addEventListener("click", function () {
        if (!fId.value || !confirm("Hapus event ini?")) { return; }
        OL.events.remove(fId.value);
        modal.hide();
        OL.toast("Event dihapus.", "danger");
    });

    document.addEventListener("ol:eventschange", render);
    render();
})();
