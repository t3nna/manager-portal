<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$difficulty = strtolower($_GET['difficulty'] ?? 'easy');
if (!in_array($difficulty, ['easy', 'medium', 'hard'], true)) {
    $difficulty = 'easy';
}

function fk_rand_int(int $min, int $max): int
{
    return random_int($min, $max);
}

$answer = 0;
$a = 0;
$b = 0;
$op = '+';

switch ($difficulty) {
    case 'easy':
        $a = fk_rand_int(1, 9);
        $b = fk_rand_int(1, 9);
        $op = '+';
        $answer = $a + $b;
        break;

    case 'medium':
        $a = fk_rand_int(1, 15);
        $b = fk_rand_int(1, 15);
        if (fk_rand_int(0, 1) === 1) {
            if ($a < $b) {
                [$a, $b] = [$b, $a];
            }
            $op = '-';
            $answer = $a - $b;
        } else {
            $op = '+';
            $answer = $a + $b;
        }
        break;

    case 'hard':
        $mode = fk_rand_int(0, 2);
        if ($mode === 0) {
            $a = fk_rand_int(5, 20);
            $b = fk_rand_int(1, 15);
            $op = '+';
            $answer = $a + $b;
        } elseif ($mode === 1) {
            $a = fk_rand_int(10, 30);
            $b = fk_rand_int(1, 9);
            $op = '-';
            $answer = $a - $b;
        } else {
            $a = fk_rand_int(2, 9);
            $b = fk_rand_int(2, 9);
            $op = '×';
            $answer = $a * $b;
        }
        break;
}

$question = "$a $op $b = ?";

$token = bin2hex(random_bytes(16));
$captchaId = preg_replace('/[^a-zA-Z0-9_-]/', '', $_GET['id'] ?? 'default');
if ($captchaId === '') {
    $captchaId = 'default';
}

if (!isset($_SESSION['fk_captchas']) || !is_array($_SESSION['fk_captchas'])) {
    $_SESSION['fk_captchas'] = [];
}

$_SESSION['fk_captchas'][$captchaId] = [
    'token' => $token,
    'answer' => $answer,
    'time' => time(),
];

// Backward compatibility.
$_SESSION['fk_captcha_token'] = $token;
$_SESSION['fk_captcha_answer'] = $answer;
$_SESSION['fk_captcha_time'] = time();

echo json_encode([
    'a' => $a,
    'b' => $b,
    'op' => $op,
    'answer' => $answer,
    'question' => $question,
    'token' => $token,
    'difficulty' => $difficulty,
], JSON_UNESCAPED_UNICODE);
