/* Halaman Charts: contoh tiap jenis grafik, digambar ulang saat tema berubah. */
(function () {
    "use strict";

    if (!window.Chart) { return; }

    var charts = [];
    var months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    function make(id, config) {
        var el = document.getElementById(id);
        if (el) { charts.push(new Chart(el, config)); }
    }

    function draw() {
        charts.forEach(function (c) { c.destroy(); });
        charts = [];

        Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
        Chart.defaults.color = OL.color("muted");
        Chart.defaults.borderColor = OL.color("border");
        Chart.defaults.plugins.legend.labels.usePointStyle = true;
        Chart.defaults.plugins.legend.labels.boxWidth = 8;

        var primary = OL.color("primary");
        var base = { maintainAspectRatio: false };

        make("cLine", {
            type: "line",
            data: {
                labels: months,
                datasets: [
                    { label: "2026", data: [30, 42, 38, 51, 56, 62, 58, 71, 76, 82, 88, 95], borderColor: primary, backgroundColor: OL.rgba(0.15), fill: true, tension: 0.4, pointRadius: 3 },
                    { label: "2025", data: [22, 30, 33, 38, 41, 45, 47, 52, 55, 60, 63, 70], borderColor: "#94a3b8", borderDash: [5, 5], tension: 0.4, pointRadius: 0 }
                ]
            },
            options: Object.assign({ interaction: { mode: "index", intersect: false } }, base)
        });

        make("cBar", {
            type: "bar",
            data: {
                labels: ["IT", "HRGA", "Finance", "Marketing", "Operasional", "Sales"],
                datasets: [
                    { label: "Anggaran", data: [120, 90, 75, 110, 140, 95], backgroundColor: primary, borderRadius: 6 },
                    { label: "Realisasi", data: [98, 84, 70, 118, 120, 80], backgroundColor: OL.rgba(0.35), borderRadius: 6 }
                ]
            },
            options: Object.assign({ scales: { x: { grid: { display: false } } } }, base)
        });

        make("cHBar", {
            type: "bar",
            data: {
                labels: ["Laptop", "Monitor", "Printer", "Kursi", "AC"],
                datasets: [
                    { label: "Baik", data: [62, 48, 12, 120, 18], backgroundColor: "#16a34a", borderRadius: 4 },
                    { label: "Servis", data: [6, 3, 4, 8, 3], backgroundColor: "#eab308", borderRadius: 4 },
                    { label: "Rusak", data: [2, 1, 2, 5, 1], backgroundColor: "#dc2626", borderRadius: 4 }
                ]
            },
            options: Object.assign({ indexAxis: "y", scales: { x: { stacked: true }, y: { stacked: true, grid: { display: false } } } }, base)
        });

        make("cDoughnut", {
            type: "doughnut",
            data: {
                labels: ["Aktif", "Cuti", "Probation"],
                datasets: [{ data: [72, 8, 20], backgroundColor: [primary, OL.rgba(0.55), OL.rgba(0.25)], borderColor: OL.color("surface"), borderWidth: 3 }]
            },
            options: Object.assign({ cutout: "68%", plugins: { legend: { position: "bottom" } } }, base)
        });

        make("cRadar", {
            type: "radar",
            data: {
                labels: ["Kualitas", "Kecepatan", "Komunikasi", "Disiplin", "Inisiatif"],
                datasets: [{ label: "Skor", data: [85, 72, 90, 78, 66], borderColor: primary, backgroundColor: OL.rgba(0.2), pointBackgroundColor: primary }]
            },
            options: Object.assign({ plugins: { legend: { display: false } }, scales: { r: { suggestedMin: 0, suggestedMax: 100, ticks: { display: false } } } }, base)
        });
    }

    draw();
    document.addEventListener("ol:themechange", draw);
})();
