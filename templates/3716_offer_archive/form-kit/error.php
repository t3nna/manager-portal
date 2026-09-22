<?php
session_start();

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/lang.php';

$lang = fk_normalize_lang($_GET['lang'] ?? $_SESSION['form_lang'] ?? $config['default_lang']);
$isRtl = fk_resolve_dir($config, $lang) === 'rtl';

$message = $_SESSION['error_message'] ?? 'error';
unset($_SESSION['error_message']);

if ($message === 'captcha_wrong') {
    $messageKey = 'eCaptcha';
} elseif ($message === 'rate_limit') {
    $messageKey = 'eRateLimit';
} else {
    $messageKey = null;
}
?>
<!doctype html>
<html lang="<?= htmlspecialchars($lang) ?>"<?= $isRtl ? ' dir="rtl"' : '' ?>>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="fk-error-page-title">Error</title>
    <link rel="stylesheet" href="success.css">
    <script src="i18n.js"></script>
</head>
<body class="fk-success"<?= $isRtl ? ' dir="rtl"' : '' ?>>
    <div class="fk-success-card fk-error-card">
        <div class="fk-success-icon">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <h1 class="fk-success-title" id="fk-error-title">Error</h1>
        <p class="fk-success-message" id="fk-error-message"></p>
        <a class="fk-back-btn" id="fk-error-back" href="javascript:history.back()">← Back</a>
    </div>
    <script>
        (function () {
            var lang = <?= json_encode($lang) ?>;
            var T = window.FormKitI18n ? window.FormKitI18n.get(lang) : {};
            var msg = <?= json_encode($message) ?>;
            var key = <?= json_encode($messageKey) ?>;

            document.getElementById('fk-error-page-title').textContent = T.errorTitle || 'Error';
            document.getElementById('fk-error-title').textContent = T.errorTitle || 'Error';
            document.getElementById('fk-error-message').textContent =
                key && T[key] ? T[key] : msg;
            document.getElementById('fk-error-back').textContent = T.back || '← Back';
        })();
    </script>
</body>
</html>
