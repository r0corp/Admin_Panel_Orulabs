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
"""

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
PARTIALS = SRC / "partials"
PAGES = SRC / "pages"

LIBS = {
    "chart": {
        "js": ['<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>'],
    },
    "flatpickr": {
        "css": ['<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.css">'],
        "js": ['<script src="https://cdn.jsdelivr.net/npm/flatpickr@4.6.13/dist/flatpickr.min.js"></script>'],
    },
    "tomselect": {
        "css": ['<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/css/tom-select.bootstrap5.min.css">'],
        "js": ['<script src="https://cdn.jsdelivr.net/npm/tom-select@2.4.3/dist/js/tom-select.complete.min.js"></script>'],
    },
}

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


def build_page(src_path, partials):
    meta, body = parse(read(src_path))
    libs = [name.strip() for name in meta["libs"].split(",") if name.strip()]

    unknown = [name for name in libs if name not in LIBS]
    if unknown:
        raise SystemExit(f"{src_path.name}: library tidak dikenal: {', '.join(unknown)}")

    extra_css = [tag for name in libs for tag in LIBS[name].get("css", [])]
    extra_js = [tag for name in libs for tag in LIBS[name].get("js", [])]
    page_js = (
        [f'<script src="assets/js/pages/{meta["js"]}.js"></script>']
        if meta["js"] else []
    )

    head = (
        partials["head"]
        .replace("{{TITLE}}", meta["title"])
        .replace("{{EXTRA_CSS}}\n", indent(extra_css) + "\n" if extra_css else "")
    )
    scripts = (
        partials["scripts"]
        .replace("{{EXTRA_JS}}\n", indent(extra_js) + "\n" if extra_js else "")
        .replace("{{PAGE_JS}}\n", indent(page_js) + "\n" if page_js else "")
    )

    note = GENERATED_NOTE.format(name=src_path.name)

    if meta["layout"] == "auth":
        return (
            head.replace("<!doctype html>\n", "<!doctype html>\n" + note, 1)
            + "<body>\n"
            + body
            + scripts
        )

    return (
        head.replace("<!doctype html>\n", "<!doctype html>\n" + note, 1)
        + '<body class="ol-layout">\n\n'
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
    print(f"{count} halaman dibuat.")


if __name__ == "__main__":
    main()
