<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();

$honeypot_fields = ['middle_name', 'url'];
$is_bot = false;

foreach ($honeypot_fields as $field) {
    if (!empty($_POST[$field])) {
        $is_bot = true;
        break;
    }
}

if ($is_bot) {
    $log_entry = date('Y-m-d H:i:s') . " | BOT DETECTED | IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . " | Data: " . json_encode($_POST, JSON_UNESCAPED_UNICODE) . "\n";
    file_put_contents('botsyka.txt', $log_entry, FILE_APPEND);
    
  
    header('Location: success.php');
    exit();
}

$lang = 'pt';  
$p1 = 'BNT';
$call_centre = 'pt';
$token = 'k9xHhZhNdMzNGrarWxDKwn7kaUZVydE2';
$p7 = 'Gucci';

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

function generateRandomString($length = 8) {
    $numbers = '0123456789';
    $upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';

    if ($length < 6) $length = 6;
    if ($length > 12) $length = 12;

    $randomString = $upperCaseLetters[rand(0, strlen($upperCaseLetters) - 1)];
    $randomString .= $numbers[rand(0, strlen($numbers) - 1)];

    $characters = $lowerCaseLetters . $upperCaseLetters;
    $charactersLength = strlen($characters);
    for ($i = strlen($randomString); $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }

    return $randomString;
}


file_put_contents('post_debug.txt', print_r($_POST, true), FILE_APPEND);


$required_fields = ['firstname', 'lastname', 'email', 'full-phone', 'prefix'];
foreach ($required_fields as $field) {
    if (empty($_POST[$field])) {
        $_SESSION['error_message'] = "Не заполнено обязательное поле: $field";
        header('Location: error.php');
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


file_put_contents('bef.txt', json_encode($payload, JSON_PRETTY_PRINT) . "\n", FILE_APPEND);

$curl = curl_init('https://traffadmin.com/api/split-registration');
curl_setopt_array($curl, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-language: ' . $lang,
    ],
    CURLOPT_TIMEOUT => 30,
]);

$response = curl_exec($curl);
$httpStatusCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$err = curl_error($curl);
curl_close($curl);


file_put_contents(
    'all.txt',
    date('Y-m-d H:i:s') . " - HTTP: $httpStatusCode\nResponse: $response\n",
    FILE_APPEND
);

if ($err) {
    $_SESSION['error_message'] = "Ошибка соединения: " . $err;
    header('Location: error.php');
    exit();
}

$data = json_decode($response, true);

if ($httpStatusCode == 200) {
    if (isset($data['status']) && $data['status'] == 3) {
        $_SESSION['redirect_url'] = $data['redirect_url'] ?? '';
        header('Location: success.php');
        exit();
    }
    
    if (isset($data[0]['message'])) {
        $_SESSION['error_message'] = $data[0]['message'];
    } else {
        $_SESSION['error_message'] = "Неожиданный ответ API";
    }
    header('Location: error.php');
    exit();
} elseif ($httpStatusCode == 422) {
    $_SESSION['error_message'] = $data[0]['message'] ?? "Ошибка валидации данных";
    header('Location: error.php');
    exit();
} else {
    $_SESSION['error_message'] = "Ошибка сервера ($httpStatusCode)";
    header('Location: error.php');
    exit();
}