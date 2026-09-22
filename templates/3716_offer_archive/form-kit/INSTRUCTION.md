# Form Kit — краткая инструкция

## Подключение

```html
<div id="form_submit" data-fk-form
     data-lang="zh-TW"
     data-button="立即登記"
     data-frame="1"
     data-frame-color="#0b5ed7"
     data-btn-color="#0b5ed7"
     data-btn-text="#ffffff"></div>

<script src="./form-kit/lead-form.js"
        data-container="form_submit"
        data-scroll-target="form_submit"></script>
```

`data-*` можно ставить на **контейнер** или на **скрипт** (контейнер важнее).

---

## Несколько форм

**Один скрипт + список id:**
```html
<div id="form_1"></div>
<div id="form_2"></div>
<script src="./form-kit/lead-form.js" data-containers="form_1,form_2" data-lang="zh-TW"></script>
```

**Авто-поиск:**
```html
<div id="form_1" data-fk-form data-button="Регистрация"></div>
<div id="form_2" data-fk-form data-button="Заявка"></div>
<script src="./form-kit/lead-form.js"></script>
```

У каждой формы — свои `data-*`. Общие настройки — на скрипте.

---

## Data-атрибуты

| Атрибут | Что делает |
|---|---|
| `data-container` / `data-containers` | id формы / несколько через `,` |
| `data-fk-form` | авто-поиск контейнеров |
| `data-lang` | язык (`zh-TW`, `en`, `ru`…) |
| `data-dir` | `ltr` / `rtl` / `auto` |
| `data-button` | текст кнопки |
| `data-title` / `data-subtitle` | заголовок / подзаголовок |
| `data-headers="0"` | скрыть заголовки |
| `data-captcha` | `0` / `1` / `easy` / `medium` / `hard` |
| `data-frame` | `1` рамка / `0` без |
| `data-frame-color` | цвет рамки |
| `data-btn-color` | фон кнопки |
| `data-btn-text` | цвет текста кнопки |
| `data-scroll="0"` | выкл. скролл к форме по клику |
| `data-scroll-target` | id куда скроллить |
| `data-action` | URL отправки (дефолт `send.php`) |
| `data-click-id` | click_id лида |
| `data-keywords="0"` | выкл. подстановку keywords |
| `data-keywords-url` | URL `keywords.php` |
| `data-offer-url` / `data-brand-url` | пути к offer/brand |
| `data-brand-key` | ключ в `brand.txt` → уходит в CRM (`p4`) |
| `data-offer-key` | ключ в `offer.txt` → текст на сайте (`.brand-key`) |
| `data-keyword-map` | JSON: класс → ключ в файле |

Дата на странице: `#datusa`, `.current-date`, `[data-fk-date]`.

---

## Keywords / `class="brand-key"`

| Что | Файл | Ключ | Куда |
|---|---|---|---|
| Текст на сайте (`.brand-key`) | `offer.txt` | `UAE-AR` | что видит юзер |
| В CRM (`p4`) | `brand.txt` | `UAE-AR` | что уходит в API |

```html
<a href="#" class="brand-key"></a>   <!-- с offer.txt -->
```

Маппинг — в `config.php` (предпочтительно) или на форме:

```php
'brand_key' => 'UAE-AR',  // brand.txt → p4 / CRM
'offer_key' => 'UAE-AR',  // offer.txt → текст на сайте
'keyword_map' => [
    'brand-key' => 'UAE-AR',
    'offer-key' => 'UAE-AR',
    'cur-key' => 'cur',
],
```

```html
data-brand-key="UAE-AR"
data-offer-key="UAE-AR"
```

Выкл.: `data-keywords="0"`.

---

## `config.php` (бэкенд оффера)

| Ключ | Что |
|---|---|
| `p1` / `p7` | параметры API |
| `call_centre` | язык КЦ |
| `token` | токен API |
| `default_lang` / `dir` | язык / направление |
| `brand_key` / `offer_key` / `keyword_map` | ключи brand.txt (CRM) / offer.txt (сайт) |
| `api_url` / `api_log` / `api_log_file` | API и лог |
| `bot_protection` | защита (капча отдельно через `data-captcha`) |
| `honeypot_fields` | honeypot-поля |
| `min_submit_seconds` / `max_form_seconds` | мин/макс время заполнения |
| `max_leads_per_ip` / `rate_limit_window` | лимит лидов с IP |
| `require_form_token` / `check_referer` | токен формы / referer |

---

## CSS-дефолты (`lead-form.css` сверху)

`--fk-btn-bg`, `--fk-btn-text`, `--fk-frame-color`, `--fk-frame-bg`, `--fk-frame-radius`, `--fk-frame-padding`

Меняются глобально в CSS или точечно через `data-btn-color` / `data-btn-text` / `data-frame*`.
