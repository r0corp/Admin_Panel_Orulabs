"""Ambil screenshot halaman untuk README (docs/screenshots/).

Memakai Microsoft Edge atau Google Chrome mode headless yang sudah
terpasang, membuka file HTML langsung (tanpa server). Variasi tema
diatur lewat parameter URL (?mode=dark&sidebar=primary ...) sehingga
tidak tergantung pengaturan tersimpan di browser.

    python tools/screenshots.py
"""

import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "docs" / "screenshots"

# (nama file, halaman + parameter, lebar, tinggi)
SHOTS = [
    ("dashboard-light", "index.html", 1440, 900),
    ("dashboard-dark", "index.html?mode=dark", 1440, 900),
    ("dashboard-sidebar-color", "index.html?sidebar=primary&primary=f47a20", 1440, 900),
    ("dashboard-mini-sidebar", "index.html?mini=1&sidebar=dark", 1440, 900),
    ("calendar", "calendar.html", 1440, 900),
    ("wizard", "wizard.html", 1440, 900),
    ("kanban", "kanban.html", 1440, 900),
    ("chat", "chat.html", 1440, 900),
    ("invoice", "invoice.html", 1440, 900),
    ("loaders", "loaders.html", 1440, 900),
    ("forms", "forms.html", 1440, 900),
    ("tables", "tables.html", 1440, 900),
    ("elements", "elements.html", 1440, 900),
    ("typography-brand", "typography.html#brand", 1440, 900),
    ("login-split", "login.html", 1440, 900),
    ("login-centered", "login-centered.html", 1440, 900),
    ("login-glass", "login-glass.html", 1440, 900),
    ("login-minimal", "login-minimal.html", 1440, 900),
    ("mobile-dashboard", "index.html", 500, 1000),
]

CANDIDATES = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "google-chrome",
    "chromium",
    "microsoft-edge",
]


def find_browser():
    for candidate in CANDIDATES:
        path = shutil.which(candidate) or (candidate if Path(candidate).exists() else None)
        if path:
            return path
    raise SystemExit("Edge/Chrome tidak ditemukan.")


def main():
    browser = find_browser()
    OUT.mkdir(parents=True, exist_ok=True)
    only = set(sys.argv[1:])

    with tempfile.TemporaryDirectory() as profile:
        for name, page, width, height in SHOTS:
            if only and name not in only:
                continue
            path, sep, rest = page.partition("?") if "?" in page else page.partition("#")
            url = (ROOT / path).as_uri() + (sep + rest if sep else "")
            target = OUT / f"{name}.png"
            subprocess.run(
                [
                    browser,
                    "--headless=new",
                    "--disable-gpu",
                    "--hide-scrollbars",
                    "--force-device-scale-factor=1",
                    f"--user-data-dir={profile}",
                    f"--window-size={width},{height}",
                    "--virtual-time-budget=4000",
                    f"--screenshot={target}",
                    url,
                ],
                check=True,
                capture_output=True,
                timeout=90,
            )
            print(f"  - {target.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
