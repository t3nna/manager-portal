<?php
/**
 * Shared bot detection helpers for Form Kit.
 */

function fk_log_bot(string $reason, array $post = []): void
{
    $log_entry = date('Y-m-d H:i:s')
        . " | BOT: $reason"
        . " | IP: " . fk_get_client_ip()
        . " | UA: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'unknown')
        . " | Data: " . json_encode($post, JSON_UNESCAPED_UNICODE)
        . "\n";

    file_put_contents(__DIR__ . '/botsyka.txt', $log_entry, FILE_APPEND);
}

function fk_bot_redirect(string $lang = 'en'): void
{
    if (!function_exists('fk_normalize_lang')) {
        require_once __DIR__ . '/lang.php';
    }
    header('Location: success.php?lang=' . urlencode(fk_normalize_lang($lang)) . '&bot=1');
    exit();
}

function fk_get_client_ip(): string
{
    $candidates = [];

    if (!empty($_SERVER['HTTP_CF_CONNECTING_IP'])) {
        $candidates[] = $_SERVER['HTTP_CF_CONNECTING_IP'];
    }

    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $candidates[] = trim($parts[0]);
    }

    if (!empty($_SERVER['HTTP_X_REAL_IP'])) {
        $candidates[] = $_SERVER['HTTP_X_REAL_IP'];
    }

    if (!empty($_SERVER['REMOTE_ADDR'])) {
        $candidates[] = $_SERVER['REMOTE_ADDR'];
    }

    foreach ($candidates as $ip) {
        if (filter_var($ip, FILTER_VALIDATE_IP)) {
            return $ip;
        }
    }

    return 'unknown';
}

function fk_rate_limit_file(): string
{
    return __DIR__ . '/ip-leads.json';
}

function fk_rate_limit_load(): array
{
    $file = fk_rate_limit_file();
    if (!file_exists($file)) {
        return [];
    }

    $raw = file_get_contents($file);
    $data = json_decode($raw, true);

    return is_array($data) ? $data : [];
}

function fk_rate_limit_save(array $data): void
{
    $file = fk_rate_limit_file();
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT), LOCK_EX);
}

function fk_rate_limit_check(string $ip, int $maxLeads, int $windowSeconds): ?string
{
    if ($ip === 'unknown' || $maxLeads <= 0) {
        return null;
    }

    $data = fk_rate_limit_load();
    $now = time();
    $cutoff = $now - $windowSeconds;

    $entries = $data[$ip] ?? [];
    $entries = array_values(array_filter($entries, static function ($ts) use ($cutoff) {
        return (int) $ts > $cutoff;
    }));

    $data[$ip] = $entries;
    fk_rate_limit_save($data);

    if (count($entries) >= $maxLeads) {
        return 'rate:ip_limit';
    }

    return null;
}

function fk_rate_limit_record(string $ip, int $windowSeconds): void
{
    if ($ip === 'unknown') {
        return;
    }

    $data = fk_rate_limit_load();
    $now = time();
    $cutoff = $now - $windowSeconds;

    $entries = $data[$ip] ?? [];
    $entries = array_values(array_filter($entries, static function ($ts) use ($cutoff) {
        return (int) $ts > $cutoff;
    }));

    $entries[] = $now;
    $data[$ip] = $entries;
    fk_rate_limit_save($data);
}

function fk_honeypot_triggered(array $post, array $fields): ?string
{
    foreach ($fields as $field) {
        if (!empty($post[$field])) {
            return "honeypot:$field";
        }
    }

    return null;
}

function fk_form_token_check(array $post, int $maxAgeSeconds = 7200): ?string
{
    $token = (string) ($post['form_token'] ?? '');
    if ($token === '') {
        return 'token:missing';
    }

    if (!empty($_SESSION['fk_form_tokens']) && is_array($_SESSION['fk_form_tokens'])) {
        if (!isset($_SESSION['fk_form_tokens'][$token])) {
            return 'token:invalid';
        }

        $created = (int) $_SESSION['fk_form_tokens'][$token];
        if ($created === 0 || (time() - $created) > $maxAgeSeconds) {
            return 'token:expired';
        }

        return null;
    }

    if (empty($_SESSION['fk_form_token'])) {
        return 'token:missing';
    }

    if (!hash_equals((string) $_SESSION['fk_form_token'], $token)) {
        return 'token:invalid';
    }

    $created = (int) ($_SESSION['fk_form_token_time'] ?? 0);
    if ($created === 0 || (time() - $created) > $maxAgeSeconds) {
        return 'token:expired';
    }

    return null;
}

function fk_js_stamp_check(array $post): ?string
{
    if (empty($post['form_token']) || empty($post['js_stamp']) || empty($post['form_started'])) {
        return 'js:missing_stamp';
    }

    $token = (string) $post['form_token'];
    $stamp = (string) $post['js_stamp'];
    $started = (int) $post['form_started'];
    $expected = substr($token, 0, 12) . '-' . ($started % 100000);

    if (!hash_equals($expected, $stamp)) {
        return 'js:bad_stamp';
    }

    if (empty($post['js_active']) || $post['js_active'] !== '1') {
        return 'js:not_active';
    }

    return null;
}

function fk_timing_check(array $post, int $minSeconds = 3, int $maxSeconds = 7200): ?string
{
    if (empty($post['form_started']) || !is_numeric($post['form_started'])) {
        return 'timing:missing';
    }

    $started = (int) $post['form_started'];
    $elapsed = (int) (round(microtime(true) * 1000) - $started);

    if ($elapsed < ($minSeconds * 1000)) {
        return 'timing:too_fast';
    }

    if ($elapsed > ($maxSeconds * 1000)) {
        return 'timing:expired';
    }

    return null;
}

function fk_captcha_check(array $post): ?string
{
    if (empty($post['captcha_enabled']) || $post['captcha_enabled'] !== '1') {
        return null;
    }

    $captchaId = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) ($post['captcha_id'] ?? 'default'));
    if ($captchaId === '') {
        $captchaId = 'default';
    }

    $token = (string) ($post['captcha_token'] ?? '');
    $given = trim((string) ($post['captcha_answer'] ?? ''));

    if (!empty($_SESSION['fk_captchas']) && is_array($_SESSION['fk_captchas']) && isset($_SESSION['fk_captchas'][$captchaId])) {
        $captcha = $_SESSION['fk_captchas'][$captchaId];

        if ($token === '' || empty($captcha['token'])) {
            return 'captcha:missing_token';
        }

        if (!hash_equals((string) $captcha['token'], $token)) {
            return 'captcha:bad_token';
        }

        if (empty($captcha['time']) || (time() - (int) $captcha['time']) > 600) {
            return 'captcha:expired';
        }

        $expected = (int) ($captcha['answer'] ?? -1);
        if ($given === '' || !is_numeric($given) || (int) $given !== $expected) {
            return 'captcha:wrong_answer';
        }

        unset($_SESSION['fk_captchas'][$captchaId]);

        return null;
    }

    if (empty($post['captcha_token']) || empty($_SESSION['fk_captcha_token'])) {
        return 'captcha:missing_token';
    }

    if (!hash_equals((string) $_SESSION['fk_captcha_token'], $token)) {
        return 'captcha:bad_token';
    }

    if (empty($_SESSION['fk_captcha_time']) || (time() - (int) $_SESSION['fk_captcha_time']) > 600) {
        return 'captcha:expired';
    }

    $expected = (int) ($_SESSION['fk_captcha_answer'] ?? -1);

    if ($given === '' || !is_numeric($given) || (int) $given !== $expected) {
        return 'captcha:wrong_answer';
    }

    unset($_SESSION['fk_captcha_token'], $_SESSION['fk_captcha_answer'], $_SESSION['fk_captcha_time']);

    return null;
}

function fk_scrape_check(array $config): ?string
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        return 'scrape:not_post';
    }

    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');
    if ($ua === '' || strlen($ua) < 10) {
        return 'ua:empty';
    }

    $botPatterns = [
        'headless', 'python-requests', 'python/', 'curl/', 'wget/', 'scrapy',
        'httpclient', 'go-http-client', 'java/', 'libwww', 'phantomjs',
        'selenium', 'puppeteer', 'playwright', 'colly', 'aiohttp',
        'httrack', 'webzip', 'teleport', 'sitesucker', 'download',
        'masscan', 'nikto', 'sqlmap', 'nmap', 'zgrab', 'semrush',
        'ahrefsbot', 'petalbot', 'bytespider', 'dataforseo',
    ];

    foreach ($botPatterns as $pattern) {
        if (strpos($ua, $pattern) !== false) {
            return "ua:$pattern";
        }
    }

    if (!empty($config['check_referer'])) {
        $referer = $_SERVER['HTTP_REFERER'] ?? '';
        $host = $_SERVER['HTTP_HOST'] ?? '';

        if ($referer !== '' && $host !== '' && stripos($referer, $host) === false) {
            return 'scrape:bad_referer';
        }
    }

    $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
    if ($accept === '' || (stripos($accept, 'text/html') === false && stripos($accept, '*/*') === false && stripos($accept, 'application') === false)) {
        return 'scrape:no_accept';
    }

    return null;
}

function fk_bot_protection_enabled(array $config): bool
{
    return !array_key_exists('bot_protection', $config) || !empty($config['bot_protection']);
}

function fk_detect_bot(array $post, array $config): ?string
{
    if ($reason = fk_captcha_check($post)) {
        return $reason;
    }

    if (!fk_bot_protection_enabled($config)) {
        return null;
    }

    if ($reason = fk_scrape_check($config)) {
        return $reason;
    }

    $honeypots = $config['honeypot_fields'] ?? ['middle_name', 'url', 'company', 'email_confirm'];

    if ($reason = fk_honeypot_triggered($post, $honeypots)) {
        return $reason;
    }

    if (!empty($config['require_form_token'])) {
        if ($reason = fk_form_token_check($post, (int) ($config['max_form_seconds'] ?? 7200))) {
            return $reason;
        }

        if ($reason = fk_js_stamp_check($post)) {
            return $reason;
        }
    }

    $minSeconds = (int) ($config['min_submit_seconds'] ?? 3);
    $maxSeconds = (int) ($config['max_form_seconds'] ?? 7200);

    if ($reason = fk_timing_check($post, $minSeconds, $maxSeconds)) {
        return $reason;
    }

    $maxLeads = (int) ($config['max_leads_per_ip'] ?? 2);
    $window = (int) ($config['rate_limit_window'] ?? 3600);

    if ($reason = fk_rate_limit_check(fk_get_client_ip(), $maxLeads, $window)) {
        return $reason;
    }

    return null;
}

function fk_consume_form_token(array $post = []): void
{
    $token = (string) ($post['form_token'] ?? '');
    if ($token !== '' && !empty($_SESSION['fk_form_tokens']) && is_array($_SESSION['fk_form_tokens'])) {
        unset($_SESSION['fk_form_tokens'][$token]);
    }

    unset($_SESSION['fk_form_token'], $_SESSION['fk_form_token_time']);
}
