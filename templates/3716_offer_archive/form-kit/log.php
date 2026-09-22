<?php
/**
 * Form Kit API / debug logging.
 */

function fk_log_enabled(array $config): bool
{
    return !empty($config['api_log']);
}

function fk_log_file(array $config): string
{
    return $config['api_log_file'] ?? (__DIR__ . '/api-log.txt');
}

function fk_log_write(array $config, string $event, array $context = []): void
{
    if (!fk_log_enabled($config)) {
        return;
    }

    $lines = [date('Y-m-d H:i:s') . ' | ' . $event];

    foreach ($context as $key => $value) {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }

        $lines[] = '  ' . $key . ': ' . $value;
    }

    $entry = implode("\n", $lines) . "\n" . str_repeat('-', 80) . "\n";
    file_put_contents(fk_log_file($config), $entry, FILE_APPEND | LOCK_EX);
}

function fk_api_parse_response(?string $response): ?array
{
    if ($response === null || $response === '') {
        return null;
    }

    $data = json_decode($response, true);

    return is_array($data) ? $data : null;
}

function fk_api_error_message(int $httpStatusCode, ?string $response, ?array $data): string
{
    if (is_array($data)) {
        if (!empty($data[0]['message']) && is_string($data[0]['message'])) {
            return $data[0]['message'];
        }

        if (!empty($data['message']) && is_string($data['message'])) {
            return $data['message'];
        }

        if (!empty($data['error'])) {
            return is_string($data['error']) ? $data['error'] : json_encode($data['error'], JSON_UNESCAPED_UNICODE);
        }
    }

    $snippet = trim((string) $response);
    if ($snippet !== '') {
        $short = function_exists('mb_substr') ? mb_substr($snippet, 0, 500) : substr($snippet, 0, 500);
        return 'API error (' . $httpStatusCode . '): ' . $short;
    }

    return 'Server error (' . $httpStatusCode . ')';
}
