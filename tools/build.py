"""Rakit halaman HTML statis dari src/ ke folder root.

Setiap file di src/pages/ diawali blok pengaturan:

    <!--@
    title: Dashboard
    layout: app            # app | auth (tanpa sidebar/navbar)
    libs: chart, flatpickr # library CDN tambahan (lihat LIBS)
    js: dashboard          # assets/js/pages/<nama>.js
    -->

Sisanya adalah isi halaman. Sidebar, navbar, footer, panel tema
dan sticky notes diambil dari src/partials/ sehingga cukup diubah
di satu tempat lalu jalankan:

    python tools/build.py

Hanya butuh Python 3 standar, tanpa paket tambahan.

Sumber library:

    python tools/build.py          # LOKAL: assets/vendor/ (bisa offline)
    python tools/build.py --cdn    # CDN jsDelivr + Google Fonts
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PARTIALS = SRC / "partials"
PAGES = SRC / "pages"

JSDELIVR = "https://cdn.jsdelivr.net/npm"

# Setiap library punya versi lokal (assets/vendor) dan versi CDN.
# "base" dipasang di semua halaman; sisanya lewat "libs:" di halaman.
VENDOR = {
    "base": {
        "css": [
            ("assets/vendor/inter/inter.css",
             "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"),
            ("assets/vendor/bootstrap/bootstrap.min.css",
             f"{JSDELIVR}/bootstrap@5.3.8/dist/css/bootstrap.min.css"),
            ("assets/vendor/bootstrap-icons/bootstrap-icons.min.css",
             f"{JSDELIVR}/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css"),
        ],
        "js": [
            ("assets/vendor/bootstrap/bootstrap.bundle.min.js",
             f"{JSDELIVR}/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"),
        ],
    },
    "chart": {
        "js": [
            ("assets/vendor/chartjs/chart.umd.min.js",
             f"{JSDELIVR}/chart.js@4.4.7/dist/chart.umd.min.js"),
        ],
    },
    "flatpickr": {
        "css": [
            ("assets/vendor/flatpickr/flatpickr.min.css",
             f"{JSDELIVR}/flatpickr@4.6.13/dist/flatpickr.min.css"),
        ],
        "js": [
            ("assets/vendor/flatpickr/flatpickr.min.js",
             f"{JSDELIVR}/flatpickr@4.6.13/dist/flatpickr.min.js"),
        ],
    },
    "tomselect": {
        "css": [
            ("assets/vendor/tom-select/tom-select.bootstrap5.min.css",
             f"{JSDELIVR}/tom-select@2.4.3/dist/css/tom-select.bootstrap5.min.css"),
        ],
        "js": [
            ("assets/vendor/tom-select/tom-select.complete.min.js",
             f"{JSDELIVR}/tom-select@2.4.3/dist/js/tom-select.complete.min.js"),
        ],
    },
}

USE_CDN = "--cdn" in sys.argv

FRONT_MATTER = re.compile(r"^\s*<!--@(.*?)-->\s*", re.S)
GENERATED_NOTE = (
    "<!-- File ini hasil build dari src/pages/{name}. "
    "Edit sumbernya lalu jalankan: python tools/build.py -->\n"
)


def read(path):
    return path.read_text(encoding="utf-8")


def parse(text):
    meta = {"title": "Halaman", "layout": "app", "libs": "", "js": ""}
    match = FRONT_MATTER.match(text)
    if match:
        for line in match.group(1).strip().splitlines():
            if ":" in line:
                key, value = line.split(":", 1)
                meta[key.strip()] = value.split("#", 1)[0].strip()
        text = text[match.end():]
    return meta, text.rstrip() + "\n"


def indent(lines, spaces=4):
    pad = " " * spaces
    return "\n".join(pad + line for line in lines)


def vendor_tags(libs, kind):
    tags = []
    for name in ["base"] + libs:
        for local, cdn in VENDOR[name].get(kind, []):
            url = cdn if USE_CDN else local
            if kind == "css":
                tags.append(f'<link rel="stylesheet" href="{url}">')
            else:
                tags.append(f'<script src="{url}"></script>')
    return tags


def build_page(src_path, partials):
    meta, body = parse(read(src_path))
    libs = [name.strip() for name in meta["libs"].split(",") if name.strip()]

    unknown = [name for name in libs if name not in VENDOR or name == "base"]
    if unknown:
        raise SystemExit(f"{src_path.name}: library tidak dikenal: {', '.join(unknown)}")

    page_js = (
        [f'<script src="assets/js/pages/{meta["js"]}.js"></script>']
        if meta["js"] else []
    )

    head = (
        partials["head"]
        .replace("{{TITLE}}", meta["title"])
        .replace("{{VENDOR_CSS}}", indent(vendor_tags(libs, "css")))
    )
    scripts = (
        partials["scripts"]
        .replace("{{VENDOR_JS}}", indent(vendor_tags(libs, "js")))
        .replace("{{PAGE_JS}}\n", indent(page_js) + "\n" if page_js else "")
    )

    note = GENERATED_NOTE.format(name=src_path.name)

    if meta["layout"] == "auth":
        return (
            head.replace("<!doctype html>\n", "<!doctype html>\n" + note, 1)
            + "<body>\n"
            + partials["preloader"]
            + "\n"
            + body
            + scripts
        )

    return (
        head.replace("<!doctype html>\n", "<!doctype html>\n" + note, 1)
        + '<body class="ol-layout">\n'
        + partials["preloader"]
        + "\n"
        + partials["sidebar"]
        + "\n"
        + '    <div class="ol-main">\n\n'
        + partials["navbar"]
        + "\n"
        + '        <main class="ol-content">\n'
        + body
        + "        </main>\n\n"
        + partials["footer"]
        + "    </div>\n\n"
        + partials["offcanvas"]
        + "\n"
        + scripts
    )


def main():
    partials = {path.stem: read(path) for path in PARTIALS.glob("*.html")}
    count = 0
    for src_path in sorted(PAGES.glob("*.html")):
        output = ROOT / src_path.name
        output.write_text(build_page(src_path, partials), encoding="utf-8", newline="\n")
        count += 1
        print(f"  - {src_path.name}")
    print(f"{count} halaman dibuat (library dari {'CDN' if USE_CDN else 'assets/vendor - offline'}).")


if __name__ == "__main__":
    main()
