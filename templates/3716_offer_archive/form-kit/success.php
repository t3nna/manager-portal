<?php
session_start();

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/lang.php';

$lang = fk_normalize_lang($_GET['lang'] ?? $_SESSION['form_lang'] ?? $config['default_lang']);

if (isset($_SESSION['redirect_url'])) {
    $redirectUrl = $_SESSION['redirect_url'];

    if (isset($_GET['cvu'])) {
        $redirectUrl .= (strpos($redirectUrl, '?') !== false ? '&' : '?') . 'cvu=' . urlencode($_GET['cvu']);
    }
    unset($_SESSION['redirect_url']);
} else {
    $redirectUrl = 'default-url.php';
}

$cvu = $_GET['cvu'] ?? 'cvu not set';
$isRtl = fk_resolve_dir($config, $lang) === 'rtl';
?>
<!doctype html>
<html lang="<?= htmlspecialchars($lang) ?>"<?= $isRtl ? ' dir="rtl"' : '' ?>>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="referrer" content="no-referrer">
    <title id="fk-page-title">Success</title>
    <link rel="stylesheet" href="success.css">
    <script src="i18n.js"></script>
    <?php if ($cvu !== 'cvu not set'): ?>
    <script>
        !(function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = "2.0";
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
        fbq("init", "<?= htmlspecialchars($cvu, ENT_QUOTES) ?>");
        fbq("track", "PageView");
        fbq("track", "Lead");
        fbq("track", "CompleteRegistration");
    </script>
    <noscript>
        <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=<?= htmlspecialchars($cvu, ENT_QUOTES) ?>&ev=Lead&noscript=1">
    </noscript>
    <?php endif; ?>
</head>
<body class="fk-success"<?= $isRtl ? ' dir="rtl"' : '' ?>>
    <div class="fk-success-card">
        <div class="fk-success-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h1 class="fk-success-title" id="fk-success-title"></h1>
        <p class="fk-success-subtitle" id="fk-success-subtitle"></p>
        <p class="fk-success-message" id="fk-success-message"></p>
        <p class="fk-success-redirect"><span id="fk-redirect-text"></span><span class="fk-dots"></span></p>
    </div>

    <script>
        (function () {
            var lang = <?= json_encode($lang) ?>;
            var redirectUrl = <?= json_encode($redirectUrl) ?>;
            var T = window.FormKitI18n ? window.FormKitI18n.get(lang) : {};

            document.getElementById("fk-page-title").textContent = T.successTitle || "Success";
            document.getElementById("fk-success-title").textContent = T.successTitle || "";
            document.getElementById("fk-success-subtitle").textContent = T.successSubtitle || "";
            document.getElementById("fk-success-message").textContent = T.successMessage || "";
            document.getElementById("fk-redirect-text").textContent = T.redirecting || "Redirecting";

            setTimeout(function () {
                window.location.href = redirectUrl;
            }, 2000);
        })();
    </script>
</body>
</html>
