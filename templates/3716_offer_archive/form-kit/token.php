<?php
session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

$maxAge = 7200;
$now = time();

if (empty($_SESSION['fk_form_tokens']) || !is_array($_SESSION['fk_form_tokens'])) {
    $_SESSION['fk_form_tokens'] = [];
}

foreach ($_SESSION['fk_form_tokens'] as $storedToken => $created) {
    if ($now - (int) $created > $maxAge) {
        unset($_SESSION['fk_form_tokens'][$storedToken]);
    }
}

$token = bin2hex(random_bytes(16));
$_SESSION['fk_form_tokens'][$token] = $now;

// Backward compatibility for older single-token checks.
$_SESSION['fk_form_token'] = $token;
$_SESSION['fk_form_token_time'] = $now;

echo json_encode(['token' => $token], JSON_UNESCAPED_UNICODE);
