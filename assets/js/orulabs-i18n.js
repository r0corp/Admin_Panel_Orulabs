/* ============================================================
   ORULABS ADMIN - BAHASA (i18n)
   ------------------------------------------------------------
   Dimuat sebelum orulabs.js. Elemen diterjemahkan lewat atribut:
     data-i18n="kunci"              -> textContent
     data-i18n-placeholder="kunci"  -> placeholder
     data-i18n-title="kunci"        -> title & aria-label
   Dari JavaScript: OL.t("kunci"), OL.setLang("en").

   Menambah bahasa: salin blok "en", ganti kodenya (mis. "ms"),
   terjemahkan nilainya, lalu tambahkan ke LANGS di bawah.
   Kunci yang belum diterjemahkan otomatis memakai bahasa Indonesia.
   ============================================================ */
(function () {
    "use strict";

    var LANGS = [
        { code: "id", name: "Bahasa Indonesia", short: "ID", locale: "id-ID" },
        { code: "en", name: "English", short: "EN", locale: "en-US" },
        { code: "ja", name: "日本語", short: "JA", locale: "ja-JP" },
        { code: "zh", name: "中文", short: "ZH", locale: "zh-CN" }
    ];

    var DICT = {
        id: {
            "nav.main": "Utama",
            "nav.dashboard": "Dashboard",
            "nav.calendar": "Kalender",
            "nav.notes": "Sticky Notes",
            "nav.components": "Komponen",
            "nav.ui": "UI Elements",
            "nav.buttons": "Buttons",
            "nav.elements": "Elements",
            "nav.cards": "Cards & Widgets",
            "nav.loaders": "Loading & Skeleton",
            "nav.typography": "Typography & Logo",
            "nav.forms": "Forms",
            "nav.formInput": "Form Input",
            "nav.formAdvanced": "Form Lanjutan",
            "nav.wizard": "Wizard",
            "nav.tables": "Tables",
            "nav.charts": "Charts",
            "nav.apps": "Aplikasi",
            "nav.kanban": "Kanban",
            "nav.chat": "Chat",
            "nav.invoice": "Invoice",
            "nav.pages": "Halaman",
            "nav.profile": "Profil",
            "nav.auth": "Autentikasi",
            "nav.loginSplit": "Login - Split",
            "nav.loginCentered": "Login - Centered",
            "nav.loginGlass": "Login - Glass",
            "nav.loginMinimal": "Login - Minimal",
            "nav.register": "Register",
            "nav.forgot": "Lupa Password + OTP",
            "nav.lock": "Lock Screen",
            "nav.otherPages": "Halaman Lain",
            "nav.pricing": "Pricing",
            "nav.error404": "Error 404",
            "nav.blank": "Halaman Kosong",
            "nav.theme": "Pengaturan Tema",
            "badge.new": "Baru",

            "top.search": "Cari menu, data, laporan...",
            "top.fullCalendar": "Buka kalender lengkap",
            "top.notifications": "Notifikasi",
            "top.markRead": "Tandai dibaca",
            "top.seeAll": "Lihat semua",
            "top.language": "Bahasa",
            "top.toggleSidebar": "Buka/tutup sidebar",
            "top.toggleMode": "Ganti mode terang/gelap",
            "top.fullscreen": "Layar penuh",
            "user.signedIn": "Masuk sebagai",
            "user.profile": "Profil saya",
            "user.notes": "Catatan",
            "user.settings": "Pengaturan",
            "user.logout": "Keluar",
            "user.role": "Administrator",

            "theme.title": "Pengaturan Tema",
            "theme.saved": "Tersimpan otomatis di browser ini",
            "theme.color": "Warna utama",
            "theme.custom": "Warna bebas",
            "theme.mode": "Mode",
            "theme.light": "Terang",
            "theme.dark": "Gelap",
            "theme.auto": "Otomatis",
            "theme.sidebar": "Gaya sidebar",
            "theme.colored": "Berwarna",
            "theme.radius": "Sudut kartu",
            "theme.sharp": "Tegas",
            "theme.standard": "Standar",
            "theme.round": "Bulat",
            "theme.loader": "Loading screen",
            "theme.preview": "Pratinjau",
            "theme.loaderLogo": "Logo",
            "theme.loaderRing": "Ring",
            "theme.loaderSpinner": "Spinner",
            "theme.loaderDots": "Titik",
            "theme.loaderBar": "Bar",
            "theme.off": "Mati",
            "theme.desktopSidebar": "Sidebar desktop",
            "theme.wide": "Lebar",
            "theme.mini": "Mini (ikon)",
            "theme.reset": "Kembalikan ke bawaan",
            "theme.resetDone": "Tema dikembalikan ke bawaan.",
            "theme.language": "Bahasa",

            "notes.title": "Sticky Notes",
            "notes.subtitle": "Catatan pribadi, tersimpan di browser",
            "notes.placeholder": "Tulis catatan... (Ctrl+Enter untuk simpan)",
            "notes.add": "Tambah",
            "notes.search": "Cari catatan...",
            "notes.empty": "Belum ada catatan.",
            "notes.noMatch": "Tidak ada catatan yang cocok.",

            "palette.placeholder": "Ketik nama halaman atau aksi...",
            "palette.pages": "Halaman",
            "palette.actions": "Aksi",
            "palette.select": "pilih",
            "palette.open": "buka",
            "palette.close": "tutup",
            "palette.noResult": "Tidak ada hasil untuk",
            "action.toggleMode": "Ganti mode terang / gelap",
            "action.theme": "Buka pengaturan tema",
            "action.notes": "Buka sticky notes",
            "action.sidebar": "Ciutkan / lebarkan sidebar",
            "action.fullscreen": "Layar penuh",
            "action.logout": "Keluar",

            "footer.rights": "Semua hak dilindungi.",
            "footer.version": "Versi",
            "common.loading": "Memuat",
            "greet.morning": "Selamat pagi",
            "greet.noon": "Selamat siang",
            "greet.afternoon": "Selamat sore",
            "greet.evening": "Selamat malam"
        },

        en: {
            "nav.main": "Main",
            "nav.calendar": "Calendar",
            "nav.components": "Components",
            "nav.formAdvanced": "Advanced Forms",
            "nav.apps": "Apps",
            "nav.pages": "Pages",
            "nav.profile": "Profile",
            "nav.auth": "Authentication",
            "nav.forgot": "Forgot Password + OTP",
            "nav.otherPages": "Other Pages",
            "nav.blank": "Blank Page",
            "nav.theme": "Theme Settings",
            "badge.new": "New",

            "top.search": "Search menus, data, reports...",
            "top.fullCalendar": "Open full calendar",
            "top.notifications": "Notifications",
            "top.markRead": "Mark as read",
            "top.seeAll": "See all",
            "top.language": "Language",
            "top.toggleSidebar": "Toggle sidebar",
            "top.toggleMode": "Toggle light/dark mode",
            "top.fullscreen": "Fullscreen",
            "user.signedIn": "Signed in as",
            "user.profile": "My profile",
            "user.notes": "Notes",
            "user.settings": "Settings",
            "user.logout": "Sign out",

            "theme.title": "Theme Settings",
            "theme.saved": "Saved automatically in this browser",
            "theme.color": "Primary color",
            "theme.custom": "Custom color",
            "theme.light": "Light",
            "theme.dark": "Dark",
            "theme.auto": "Auto",
            "theme.sidebar": "Sidebar style",
            "theme.colored": "Colored",
            "theme.radius": "Card corners",
            "theme.sharp": "Sharp",
            "theme.standard": "Standard",
            "theme.round": "Round",
            "theme.preview": "Preview",
            "theme.loaderDots": "Dots",
            "theme.off": "Off",
            "theme.desktopSidebar": "Desktop sidebar",
            "theme.wide": "Wide",
            "theme.mini": "Mini (icons)",
            "theme.reset": "Reset to default",
            "theme.resetDone": "Theme reset to default.",
            "theme.language": "Language",

            "notes.subtitle": "Personal notes, stored in your browser",
            "notes.placeholder": "Write a note... (Ctrl+Enter to save)",
            "notes.add": "Add",
            "notes.search": "Search notes...",
            "notes.empty": "No notes yet.",
            "notes.noMatch": "No matching notes.",

            "palette.placeholder": "Type a page or action name...",
            "palette.pages": "Pages",
            "palette.actions": "Actions",
            "palette.select": "select",
            "palette.open": "open",
            "palette.close": "close",
            "palette.noResult": "No results for",
            "action.toggleMode": "Toggle light / dark mode",
            "action.theme": "Open theme settings",
            "action.notes": "Open sticky notes",
            "action.sidebar": "Collapse / expand sidebar",
            "action.fullscreen": "Fullscreen",
            "action.logout": "Sign out",

            "footer.rights": "All rights reserved.",
            "footer.version": "Version",
            "common.loading": "Loading",
            "greet.morning": "Good morning",
            "greet.noon": "Good afternoon",
            "greet.afternoon": "Good afternoon",
            "greet.evening": "Good evening"
        },

        ja: {
            "nav.main": "メイン",
            "nav.dashboard": "ダッシュボード",
            "nav.calendar": "カレンダー",
            "nav.notes": "付箋メモ",
            "nav.components": "コンポーネント",
            "nav.ui": "UI要素",
            "nav.buttons": "ボタン",
            "nav.elements": "エレメント",
            "nav.cards": "カード＆ウィジェット",
            "nav.loaders": "ローディング＆スケルトン",
            "nav.typography": "タイポグラフィ＆ロゴ",
            "nav.forms": "フォーム",
            "nav.formInput": "入力フォーム",
            "nav.formAdvanced": "高度なフォーム",
            "nav.wizard": "ウィザード",
            "nav.tables": "テーブル",
            "nav.charts": "チャート",
            "nav.apps": "アプリ",
            "nav.kanban": "カンバン",
            "nav.chat": "チャット",
            "nav.invoice": "請求書",
            "nav.pages": "ページ",
            "nav.profile": "プロフィール",
            "nav.auth": "認証",
            "nav.loginSplit": "ログイン - 分割",
            "nav.loginCentered": "ログイン - 中央",
            "nav.loginGlass": "ログイン - ガラス",
            "nav.loginMinimal": "ログイン - ミニマル",
            "nav.register": "新規登録",
            "nav.forgot": "パスワード再設定 + OTP",
            "nav.lock": "ロック画面",
            "nav.otherPages": "その他のページ",
            "nav.pricing": "料金プラン",
            "nav.error404": "404エラー",
            "nav.blank": "空白ページ",
            "nav.theme": "テーマ設定",
            "badge.new": "新着",

            "top.search": "メニュー、データ、レポートを検索...",
            "top.fullCalendar": "カレンダーを開く",
            "top.notifications": "通知",
            "top.markRead": "既読にする",
            "top.seeAll": "すべて表示",
            "top.language": "言語",
            "top.toggleSidebar": "サイドバーの切り替え",
            "top.toggleMode": "ライト/ダーク切り替え",
            "top.fullscreen": "全画面",
            "user.signedIn": "ログイン中",
            "user.profile": "マイプロフィール",
            "user.notes": "メモ",
            "user.settings": "設定",
            "user.logout": "ログアウト",
            "user.role": "管理者",

            "theme.title": "テーマ設定",
            "theme.saved": "このブラウザに自動保存されます",
            "theme.color": "メインカラー",
            "theme.custom": "カスタムカラー",
            "theme.mode": "モード",
            "theme.light": "ライト",
            "theme.dark": "ダーク",
            "theme.auto": "自動",
            "theme.sidebar": "サイドバーのスタイル",
            "theme.colored": "カラー",
            "theme.radius": "カードの角",
            "theme.sharp": "シャープ",
            "theme.standard": "標準",
            "theme.round": "丸み",
            "theme.loader": "ローディング画面",
            "theme.preview": "プレビュー",
            "theme.loaderLogo": "ロゴ",
            "theme.loaderRing": "リング",
            "theme.loaderSpinner": "スピナー",
            "theme.loaderDots": "ドット",
            "theme.loaderBar": "バー",
            "theme.off": "オフ",
            "theme.desktopSidebar": "デスクトップのサイドバー",
            "theme.wide": "ワイド",
            "theme.mini": "ミニ（アイコン）",
            "theme.reset": "初期設定に戻す",
            "theme.resetDone": "テーマを初期設定に戻しました。",
            "theme.language": "言語",

            "notes.title": "付箋メモ",
            "notes.subtitle": "ブラウザに保存される個人メモ",
            "notes.placeholder": "メモを入力...（Ctrl+Enterで保存）",
            "notes.add": "追加",
            "notes.search": "メモを検索...",
            "notes.empty": "メモはまだありません。",
            "notes.noMatch": "一致するメモはありません。",

            "palette.placeholder": "ページ名や操作を入力...",
            "palette.pages": "ページ",
            "palette.actions": "操作",
            "palette.select": "選択",
            "palette.open": "開く",
            "palette.close": "閉じる",
            "palette.noResult": "該当なし：",
            "action.toggleMode": "ライト/ダーク切り替え",
            "action.theme": "テーマ設定を開く",
            "action.notes": "付箋メモを開く",
            "action.sidebar": "サイドバーを折りたたむ/広げる",
            "action.fullscreen": "全画面",
            "action.logout": "ログアウト",

            "footer.rights": "All rights reserved.",
            "footer.version": "バージョン",
            "common.loading": "読み込み中",
            "greet.morning": "おはようございます",
            "greet.noon": "こんにちは",
            "greet.afternoon": "こんにちは",
            "greet.evening": "こんばんは"
        },

        zh: {
            "nav.main": "主要",
            "nav.dashboard": "仪表盘",
            "nav.calendar": "日历",
            "nav.notes": "便签",
            "nav.components": "组件",
            "nav.ui": "界面元素",
            "nav.buttons": "按钮",
            "nav.elements": "元素",
            "nav.cards": "卡片和小部件",
            "nav.loaders": "加载与骨架屏",
            "nav.typography": "排版与标志",
            "nav.forms": "表单",
            "nav.formInput": "表单输入",
            "nav.formAdvanced": "高级表单",
            "nav.wizard": "向导",
            "nav.tables": "表格",
            "nav.charts": "图表",
            "nav.apps": "应用",
            "nav.kanban": "看板",
            "nav.chat": "聊天",
            "nav.invoice": "发票",
            "nav.pages": "页面",
            "nav.profile": "个人资料",
            "nav.auth": "身份验证",
            "nav.loginSplit": "登录 - 分栏",
            "nav.loginCentered": "登录 - 居中",
            "nav.loginGlass": "登录 - 玻璃",
            "nav.loginMinimal": "登录 - 极简",
            "nav.register": "注册",
            "nav.forgot": "忘记密码 + OTP",
            "nav.lock": "锁屏",
            "nav.otherPages": "其他页面",
            "nav.pricing": "价格",
            "nav.error404": "404 错误",
            "nav.blank": "空白页",
            "nav.theme": "主题设置",
            "badge.new": "新",

            "top.search": "搜索菜单、数据、报告...",
            "top.fullCalendar": "打开完整日历",
            "top.notifications": "通知",
            "top.markRead": "标为已读",
            "top.seeAll": "查看全部",
            "top.language": "语言",
            "top.toggleSidebar": "切换侧边栏",
            "top.toggleMode": "切换浅色/深色",
            "top.fullscreen": "全屏",
            "user.signedIn": "当前登录",
            "user.profile": "我的资料",
            "user.notes": "便签",
            "user.settings": "设置",
            "user.logout": "退出",
            "user.role": "管理员",

            "theme.title": "主题设置",
            "theme.saved": "自动保存在此浏览器",
            "theme.color": "主色",
            "theme.custom": "自定义颜色",
            "theme.mode": "模式",
            "theme.light": "浅色",
            "theme.dark": "深色",
            "theme.auto": "自动",
            "theme.sidebar": "侧边栏样式",
            "theme.colored": "彩色",
            "theme.radius": "卡片圆角",
            "theme.sharp": "直角",
            "theme.standard": "标准",
            "theme.round": "圆润",
            "theme.loader": "加载画面",
            "theme.preview": "预览",
            "theme.loaderLogo": "标志",
            "theme.loaderRing": "圆环",
            "theme.loaderSpinner": "旋转",
            "theme.loaderDots": "圆点",
            "theme.loaderBar": "进度条",
            "theme.off": "关闭",
            "theme.desktopSidebar": "桌面侧边栏",
            "theme.wide": "宽",
            "theme.mini": "迷你（图标）",
            "theme.reset": "恢复默认",
            "theme.resetDone": "主题已恢复默认。",
            "theme.language": "语言",

            "notes.title": "便签",
            "notes.subtitle": "个人便签，保存在浏览器中",
            "notes.placeholder": "写便签...（Ctrl+Enter 保存）",
            "notes.add": "添加",
            "notes.search": "搜索便签...",
            "notes.empty": "还没有便签。",
            "notes.noMatch": "没有匹配的便签。",

            "palette.placeholder": "输入页面或操作名称...",
            "palette.pages": "页面",
            "palette.actions": "操作",
            "palette.select": "选择",
            "palette.open": "打开",
            "palette.close": "关闭",
            "palette.noResult": "没有结果：",
            "action.toggleMode": "切换浅色 / 深色",
            "action.theme": "打开主题设置",
            "action.notes": "打开便签",
            "action.sidebar": "收起 / 展开侧边栏",
            "action.fullscreen": "全屏",
            "action.logout": "退出",

            "footer.rights": "版权所有。",
            "footer.version": "版本",
            "common.loading": "加载中",
            "greet.morning": "早上好",
            "greet.noon": "中午好",
            "greet.afternoon": "下午好",
            "greet.evening": "晚上好"
        }
    };

    var KEY = "orulabs-lang";
    var lang = "id";
    try { lang = localStorage.getItem(KEY) || "id"; } catch (e) { /* abaikan */ }
    var urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang) { lang = urlLang; }
    if (!DICT[lang]) { lang = "id"; }

    var OL = window.OL = window.OL || {};

    OL.LANGS = LANGS;
    OL.I18N = DICT;

    OL.t = function (key) {
        return (DICT[lang] && DICT[lang][key]) || DICT.id[key] || key;
    };

    OL.lang = function () { return lang; };

    OL.locale = function () {
        for (var i = 0; i < LANGS.length; i++) {
            if (LANGS[i].code === lang) { return LANGS[i].locale; }
        }
        return "id-ID";
    };

    OL.applyI18n = function (root) {
        var scope = root || document;
        scope.querySelectorAll("[data-i18n]").forEach(function (el) {
            el.textContent = OL.t(el.getAttribute("data-i18n"));
        });
        scope.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
            el.setAttribute("placeholder", OL.t(el.getAttribute("data-i18n-placeholder")));
        });
        scope.querySelectorAll("[data-i18n-title]").forEach(function (el) {
            var text = OL.t(el.getAttribute("data-i18n-title"));
            el.setAttribute("title", text);
            el.setAttribute("aria-label", text);
        });
        document.querySelectorAll("[data-ol-lang-current]").forEach(function (el) {
            el.textContent = lang.toUpperCase();
        });
        document.querySelectorAll("[data-ol-lang]").forEach(function (el) {
            el.classList.toggle("active", el.getAttribute("data-ol-lang") === lang);
        });
    };

    OL.setLang = function (code) {
        if (!DICT[code]) { return; }
        lang = code;
        try { localStorage.setItem(KEY, code); } catch (e) { /* abaikan */ }
        document.documentElement.setAttribute("lang", code);
        OL.applyI18n();
        document.dispatchEvent(new CustomEvent("ol:langchange", { detail: { lang: code } }));
    };

    document.documentElement.setAttribute("lang", lang);
})();
