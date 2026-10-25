/* Halaman Loading & Skeleton: contoh pemakaian OL.progress, OL.blockCard, OL.buttonLoading. */
(function () {
    "use strict";

    var q = function (s) { return document.querySelector(s); };

    q("[data-demo-progress]").addEventListener("click", function () {
        OL.progress.start();
        setTimeout(OL.progress.done, 2500);
    });
    q("[data-demo-progress-done]").addEventListener("click", function () { OL.progress.done(); });

    document.querySelectorAll("[data-demo-button]").forEach(function (btn) {
        btn.addEventListener("click", function () {
            OL.buttonLoading(btn, true);
            setTimeout(function () {
                OL.buttonLoading(btn, false);
                OL.toast("Selesai.", "success");
            }, 1500);
        });
    });

    q("[data-demo-block]").addEventListener("click", function () {
        var done = OL.blockCard("#demoBlockCard", "Memuat status...");
        setTimeout(function () {
            done();
            q("[data-demo-time]").textContent = new Date().toLocaleTimeString("id-ID");
        }, 1500);
    });

    var area = q("[data-skeleton-area]");
    var real = q("[data-skeleton-real]");
    function showReal() {
        area.hidden = true;
        real.hidden = false;
    }
    setTimeout(showReal, 2500);
    q("[data-demo-skeleton]").addEventListener("click", function () {
        area.hidden = false;
        real.hidden = true;
        setTimeout(showReal, 2000);
    });
})();
