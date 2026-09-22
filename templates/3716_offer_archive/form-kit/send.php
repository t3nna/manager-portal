<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/lang.php';
require_once __DIR__ . '/bot-check.php';
require_once __DIR__ . '/log.php';

$lang = fk_normalize_lang(!empty($_POST['lang']) ? $_POST['lang'] : $config['default_lang']);
$langApi = fk_lang_api_code($lang);

fk_log_write($config, 'FORM POST', [
    'lang' => $lang,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'ua' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
    'post' => $_POST,
]);

$botReason = fk_detect_bot($_POST, $config);
if ($botReason !== null) {
    fk_log_write($config, 'BOT BLOCKED', [
        'reason' => $botReason,
        'lang' => $lang,
    ]);

    if ($botReason === 'captcha:wrong_answer') {
        $_SESSION['error_message'] = 'captcha_wrong';
        header('Location: error.php?lang=' . urlencode($lang));
        exit();
    }

    if ($botReason === 'rate:ip_limit') {
        $_SESSION['error_message'] = 'rate_limit';
        header('Location: error.php?lang=' . urlencode($lang));
        exit();
    }

    fk_log_bot($botReason, $_POST);
    fk_bot_redirect($lang);
}

fk_consume_form_token($_POST);

$_SESSION['form_lang'] = $lang;

$p1 = $config['p1'];
$call_centre = $config['call_centre'];
$p7 = $config['p7'];
$apiUrl = $config['api_url'] ?? 'https://traffadmin.com/api/split-registration';

function getDeviceType(): string
{
    if (isset($_SERVER['HTTP_SEC_CH_UA_MOBILE'])) {
        if (strpos($_SERVER['HTTP_SEC_CH_UA_MOBILE'], '?1') !== false) {
            return 'mobile';
        }
    }

    $ua = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');

    if ($ua === '') {
        return 'desktop';
    }

    if (
        strpos($ua, 'ipad') !== false ||
        strpos($ua, 'tablet') !== false ||
        strpos($ua, 'playbook') !== false ||
        strpos($ua, 'kindle') !== false ||
        strpos($ua, 'sm-t') !== false ||
        (strpos($ua, 'android') !== false && strpos($ua, 'mobile') === false)
    ) {
        return 'tablet';
    }

    if (
        strpos($ua, 'iphone') !== false ||
        strpos($ua, 'ipod') !== false ||
        strpos($ua, 'android') !== false ||
        strpos($ua, 'mobi') !== false ||
        strpos($ua, 'phone') !== false
    ) {
        return 'mobile';
    }

    return 'desktop';
}

$required_fields = ['firstname', 'lastname', 'email', 'full-phone', 'prefix'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        fk_log_write($config, 'VALIDATION FAIL', [
            'missing_field' => $field,
            'post' => $_POST,
        ]);

        $_SESSION['error_message'] = "Missing required field: $field";
        header('Location: error.php?lang=' . urlencode($lang));
        exit();
    }
}

$deviceType = getDeviceType();

$payload = [
    'firstname'     => $_POST['firstname'],
    'lastname'      => $_POST['lastname'],
    'email'         => $_POST['email'],
    'phone_number'  => $_POST['full-phone'],
    'phone_code'    => $_POST['prefix'],
    'clickid'       => $_POST['click_id'] ?? '',
    'sync'          => 1,
    'p1'            => $p1,
    'p4'            => $_POST['p4'] ?? '',
    'p7'            => $p7,
    'p5'            => $_POST['sub_id_2'] ?? '',
    'call_centre'   => $call_centre,
    'ip'            => $_SERVER['REMOTE_ADDR'] ?? '',
    'cvu'           => $_POST['cvu'] ?? '',
    'device_type'   => $deviceType,
];

$headers = [
    'Content-Type: application/json',
    'x-language: ' . $langApi,
];

fk_log_write($config, 'API REQUEST', [
    'url' => $apiUrl,
    'headers' => $headers,
    'payload' => $payload,
]);

$curl = curl_init($apiUrl);
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($curl);
$httpStatusCode = (int) curl_getinfo($curl, CURLINFO_HTTP_CODE);
$err = curl_error($curl);
curl_close($curl);

$data = fk_api_parse_response($response !== false ? $response : null);

fk_log_write($config, 'API RESPONSE', [
    'http_code' => $httpStatusCode,
    'curl_error' => $err ?: '-',
    'raw_response' => $response !== false ? $response : '',
    'parsed_response' => $data,
]);

if ($err) {
    $_SESSION['error_message'] = 'Connection error: ' . $err;
    header('Location: error.php?lang=' . urlencode($lang));
    exit();
}

if ($httpStatusCode === 200) {
    if (isset($data['status']) && (int) $data['status'] === 3) {
        if (fk_bot_protection_enabled($config)) {
            fk_rate_limit_record(
                fk_get_client_ip(),
                (int) ($config['rate_limit_window'] ?? 3600)
            );
        }

        fk_log_write($config, 'API SUCCESS', [
            'redirect_url' => $data['redirect_url'] ?? '',
            'status' => $data['status'],
        ]);

        $_SESSION['redirect_url'] = $data['redirect_url'] ?? '';
        header('Location: success.php?lang=' . urlencode($lang));
        exit();
    }

    $_SESSION['error_message'] = fk_api_error_message($httpStatusCode, $response, $data);
    header('Location: error.php?lang=' . urlencode($lang));
    exit();
}

if ($httpStatusCode === 422) {
    $_SESSION['error_message'] = fk_api_error_message($httpStatusCode, $response, $data);
    header('Location: error.php?lang=' . urlencode($lang));
    exit();
}

$_SESSION['error_message'] = fk_api_error_message($httpStatusCode, $response, $data);
header('Location: error.php?lang=' . urlencode($lang));
exit();
