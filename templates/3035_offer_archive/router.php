<?php
/**
 * PHP built-in server router for local preview.
 * Usage: php -S localhost:8080 router.php
 */
$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');

if ($uri !== '/' && $uri !== '/index.php') {
    $file = __DIR__ . $uri;
    if (is_file($file)) {
        return false;
    }
}

$rawClick = true;
require __DIR__ . '/index.php';
