<?php
/**
 * Form Kit configuration — edit per offer.
 */
return [
    'p1' => 'BNT',
    'p7' => 'Gucci',
    'call_centre' => 'en',
    'token' => 'k9xHhZhNdMzNGrarWxDKwn7kaUZVydE2',
    'default_lang' => 'en',

    // Form text direction: 'rtl' | 'ltr' | 'auto' (auto = from language, e.g. ar → rtl)
    'dir' => 'auto',

    // Keywords (server convention):
    //   offer.txt  → .brand-key / .offer-key on page (what the user sees)
    //   brand.txt  → hidden p4 (what goes to CRM)
    // Change only these keys when switching geo.
    'brand_key' => 'au-en',   // key in lander/adminka/brand.txt → p4 / CRM
    'offer_key' => 'au-en',   // key in lander/adminka/offer.txt → text on page
    'keyword_map' => [
        'brand-key' => 'au-en',
        'offer-key' => 'au-en',
        'cur-key' => 'cur',
    ],

    // API
    'api_url' => 'https://traffadmin.com/api/split-registration',
    'api_log' => true,
    'api_log_file' => __DIR__ . '/api-log.txt',

    // Bot protection — false = выключить все проверки (капча отдельно, через data-captcha)
    'bot_protection' => true,

    'honeypot_fields' => ['middle_name', 'url', 'company', 'email_confirm'],
    'min_submit_seconds' => 3,
    'max_form_seconds' => 7200,
    'max_leads_per_ip' => 2,
    'rate_limit_window' => 3600,
    'require_form_token' => true,
    'check_referer' => true,
];
