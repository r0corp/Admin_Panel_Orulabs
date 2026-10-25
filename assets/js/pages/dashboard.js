/* Dashboard: grafik pendapatan & kategori. Warna diambil dari
   tema (OL.color / OL.rgba) dan digambar ulang saat tema diganti. */
(function () {
    "use strict";

    if (!window.Chart) { return; }

    var charts = [];

    function applyChartDefaults() {
        Chart.defaults.font.family = getComputedStyle(document.body).fontFamily;
        Chart.defaults.color = OL.color("muted");
        Chart.defaults.borderColor = OL.color("border");
    }

    function draw() {
        charts.forEach(function (c) { c.destroy(); });
        charts = [];
        applyChartDefaults();

        var revenue = document.getElementById("chartRevenue");
        if (revenue) {
            var ctx = revenue.getContext("2d");
            var fill = ctx.createLinearGradient(0, 0, 0, 300);
            fill.addColorStop(0, OL.rgba(0.28));
            fill.addColorStop(1, OL.rgba(0));

            charts.push(new Chart(revenue, {
                type: "line",
                data: {
                    labels: ["Nov", "Des", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt"],
                    datasets: [{
                        label: "Pendapatan",
                        data: [142, 158, 149, 171, 186, 179, 205, 198, 221, 214, 236, 248],
                        borderColor: OL.color("primary"),
                        backgroundColor: fill,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2.5,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }, {
                        label: "Pengeluaran",
                        data: [98, 104, 101, 112, 120, 117, 131, 126, 138, 135, 144, 151],
                        borderColor: "#94a3b8",
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.4,
                        borderWidth: 2,
                        pointRadius: 0,
                        pointHoverRadius: 5
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    interaction: { mode: "index", intersect: false },
                    plugins: {
                        legend: { position: "top", align: "end", labels: { usePointStyle: true, boxWidth: 8 } },
                        tooltip: { callbacks: { label: function (c) { return c.dataset.label + ": Rp " + c.parsed.y + " jt"; } } }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: { beginAtZero: true, ticks: { callback: function (v) { return v + " jt"; } } }
                    }
                }
            }));
        }

        var category = document.getElementById("chartCategory");
        if (category) {
            charts.push(new Chart(category, {
                type: "doughnut",
                data: {
                    labels: ["Elektronik", "Perlengkapan Kantor", "Furniture", "Lainnya"],
                    datasets: [{
                        data: [42, 28, 18, 12],
                        backgroundColor: [OL.color("primary"), OL.rgba(0.65), OL.rgba(0.4), OL.rgba(0.18)],
                        borderColor: OL.color("surface"),
                        borderWidth: 3
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: "70%",
                    plugins: { legend: { display: false } }
                }
            }));
        }
    }

    draw();
    document.addEventListener("ol:themechange", draw);
})();
