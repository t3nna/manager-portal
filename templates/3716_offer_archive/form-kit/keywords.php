<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

$config = require __DIR__ . '/config.php';
require_once __DIR__ . '/lang.php';

$map = $config['keyword_map'] ?? [];
$brandKey = $config['brand_key'] ?? ($map['brand-key'] ?? 'cl-es');
$offerKey = $config['offer_key'] ?? ($map['offer-key'] ?? 'offer');
$dir = strtolower(trim((string) ($config['dir'] ?? 'auto')));
if ($dir !== 'rtl' && $dir !== 'ltr' && $dir !== 'auto') {
    $dir = 'auto';
}

echo json_encode([
    'map' => $map,
    'brand_key' => $brandKey,
    'offer_key' => $offerKey,
    'dir' => $dir,
    'default_lang' => fk_normalize_lang($config['default_lang'] ?? 'en'),
], JSON_UNESCAPED_UNICODE);
