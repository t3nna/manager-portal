<?php
/**
 * Language helpers for Form Kit.
 */

function fk_normalize_lang(?string $lang): string
{
    $raw = strtolower(str_replace('_', '-', trim((string) $lang)));
    if ($raw === '' || !preg_match('/^[a-z]{2,3}(?:-[a-z0-9]{2,8})?$/', $raw)) {
        return 'en';
    }

    $aliases = [
        'zh' => 'zh-CN',
        'zh-cn' => 'zh-CN',
        'zh-hans' => 'zh-CN',
        'ch' => 'zh-CN',
        'zh-tw' => 'zh-TW',
        'zh-hant' => 'zh-TW',
        'pt-br' => 'pt-BR',
        'ptbr' => 'pt-BR',
        'pt-pt' => 'pt-PT',
        'ptpt' => 'pt-PT',
        'se' => 'sv',
        'sv-se' => 'sv',
    ];

    if (isset($aliases[$raw])) {
        return $aliases[$raw];
    }

    if (strpos($raw, '-') !== false) {
        [$base, $region] = explode('-', $raw, 2);
        return $base . '-' . strtoupper($region);
    }

    return $raw;
}

function fk_is_rtl(string $lang): bool
{
    $base = strtolower(explode('-', fk_normalize_lang($lang))[0]);
    return $base === 'ar';
}

/**
 * Resolve form direction from config.
 * @param array|null $config
 * @param string $lang
 * @return 'rtl'|'ltr'
 */
function fk_resolve_dir(?array $config, string $lang): string
{
    $raw = strtolower(trim((string) ($config['dir'] ?? 'auto')));
    if ($raw === 'rtl' || $raw === 'ltr') {
        return $raw;
    }
    return fk_is_rtl($lang) ? 'rtl' : 'ltr';
}

function fk_lang_api_code(string $lang): string
{
    $normalized = fk_normalize_lang($lang);
    $base = explode('-', $normalized)[0];
    if ($base === 'zh') {
        return $normalized === 'zh-TW' ? 'zh-TW' : 'zh';
    }
    return $base;
}
