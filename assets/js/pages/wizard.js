/* Halaman Wizard: perilaku tambahan di atas komponen [data-ol-wizard]. */
(function () {
    "use strict";

    // --- Onboarding: pratinjau warna & layar selesai ---
    var onboarding = document.getElementById("onboarding");
    if (onboarding) {
        var themeBefore = Object.assign({}, window.OL_THEME.current);
        var panes = onboarding.querySelector("[data-onboarding-panes]");
        var done = onboarding.querySelector("[data-onboarding-done]");
        var nav = onboarding.querySelector("[data-onboarding-nav]");
        var stepper = onboarding.querySelector(".ol-stepper");
        var counter = document.querySelector("[data-onboarding-count]");

        onboarding.addEventListener("change", function (e) {
            if (e.target.name === "obColor") { OL.setTheme({ primary: e.target.value }); }
            if (e.target.id === "obDark") { OL.setTheme({ mode: e.target.checked ? "dark" : "light" }); }
        });

        onboarding.addEventListener("ol:wizardstep", function (e) {
            if (counter) { counter.textContent = "Langkah " + (e.detail.index + 1) + " dari 5"; }
        });

        onboarding.addEventListener("ol:wizardfinish", function (e) {
            e.preventDefault(); // tampilkan layar selesai, bukan toast bawaan
            OL.progress.start();
            var unblock = OL.blockCard(onboarding, "Menyiapkan akun...");
            setTimeout(function () {
                unblock();
                OL.progress.done();
                panes.hidden = true;
                nav.classList.add("d-none");
                stepper.querySelectorAll("[data-wizard-step]").forEach(function (s) {
                    s.classList.remove("is-active");
                    s.classList.add("is-done");
                });
                onboarding.querySelector("[data-wizard-progress]").style.width = "100%";
                done.hidden = false;
            }, 1200);
        });

        onboarding.querySelector("[data-onboarding-restart]").addEventListener("click", function () {
            done.hidden = true;
            panes.hidden = false;
            nav.classList.remove("d-none");
            OL.setTheme({ primary: themeBefore.primary, mode: themeBefore.mode });
            onboarding.olWizard.reset();
        });
    }

    // --- Wizard di modal: tutup & reset setelah disimpan ---
    var modalWizard = document.getElementById("modalWizard");
    if (modalWizard) {
        var modalEl = document.getElementById("wizardModal");
        modalWizard.addEventListener("ol:wizardfinish", function () {
            bootstrap.Modal.getInstance(modalEl).hide();
        });
        modalEl.addEventListener("hidden.bs.modal", function () {
            modalWizard.olWizard.reset();
        });
    }
})();
