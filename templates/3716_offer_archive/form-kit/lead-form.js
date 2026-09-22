(function () {
    "use strict";

    var script = document.currentScript;
    var BASE = (function () {
        if (script && script.src) {
            return script.src.replace(/[^/]*([?#].*)?$/, "");
        }
        return "./form-kit/";
    })();

    var LOCALE_MAP = {
        en: "en-US",
        ru: "ru-RU",
        pl: "pl-PL",
        el: "el-GR",
        fr: "fr-FR",
        es: "es-ES",
        pt: "pt-PT",
        "pt-PT": "pt-PT",
        "pt-BR": "pt-BR",
        af: "af-ZA",
        bn: "bn-BD",
        hu: "hu-HU",
        it: "it-IT",
        de: "de-DE",
        nl: "nl-NL",
        ko: "ko-KR",
        ja: "ja-JP",
        ro: "ro-RO",
        tr: "tr-TR",
        ar: "ar-SA",
        th: "th-TH",
        cs: "cs-CZ",
        ch: "zh-CN",
        zh: "zh-CN",
        "zh-CN": "zh-CN",
        "zh-TW": "zh-TW",
        sv: "sv-SE",
        se: "sv-SE",
    };

    var GEO_PROVIDERS = [
        {
            url: "https://ipapi.co/json/",
            parse: function (data) {
                if (!data || !data.country) {
                    return null;
                }
                return { country: String(data.country).toLowerCase(), ip: data.ip || "" };
            },
        },
        {
            url: "https://ipwho.is/",
            parse: function (data) {
                if (!data || data.success === false || !data.country_code) {
                    return null;
                }
                return { country: String(data.country_code).toLowerCase(), ip: data.ip || "" };
            },
        },
        {
            url: "https://ipinfo.io/json",
            parse: function (data) {
                if (!data || !data.country) {
                    return null;
                }
                return { country: String(data.country).toLowerCase(), ip: data.ip || "" };
            },
        },
        {
            url: "https://free.freeipapi.com/api/json",
            parse: function (data) {
                if (!data || !data.countryCode) {
                    return null;
                }
                return { country: String(data.countryCode).toLowerCase(), ip: data.ipAddress || data.ip || "" };
            },
        },
        {
            url: "https://get.geojs.io/v1/ip/geo.json",
            parse: function (data) {
                if (!data || !data.country_code) {
                    return null;
                }
                return { country: String(data.country_code).toLowerCase(), ip: data.ip || "" };
            },
        },
    ];

    function loadCss(href) {
        if (document.querySelector('link[href="' + href + '"]')) {
            return;
        }
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
    }

    function loadScript(src) {
        if (!window.__formKitScriptLoads) {
            window.__formKitScriptLoads = {};
        }
        if (window.__formKitScriptLoads[src]) {
            return window.__formKitScriptLoads[src];
        }

        window.__formKitScriptLoads[src] = new Promise(function (resolve, reject) {
            var existing = document.querySelector('script[src="' + src + '"]');
            if (existing) {
                if (existing.getAttribute("data-fk-loaded") === "1") {
                    resolve();
                    return;
                }
                existing.addEventListener("load", function onLoad() {
                    existing.setAttribute("data-fk-loaded", "1");
                    resolve();
                });
                existing.addEventListener("error", reject);
                return;
            }

            var el = document.createElement("script");
            el.src = src;
            el.onload = function () {
                el.setAttribute("data-fk-loaded", "1");
                resolve();
            };
            el.onerror = reject;
            document.head.appendChild(el);
        });

        return window.__formKitScriptLoads[src];
    }

    function esc(str) {
        return String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function getAttr(scriptEl, container, name) {
        if (container && container.hasAttribute(name)) {
            return container.getAttribute(name);
        }
        if (scriptEl && scriptEl.hasAttribute(name)) {
            return scriptEl.getAttribute(name);
        }
        return null;
    }

    function hasAttr(scriptEl, container, name) {
        return Boolean(getAttr(scriptEl, container, name));
    }

    function normalizeLang(lang) {
        if (window.FormKitI18n && typeof window.FormKitI18n.normalize === "function") {
            return window.FormKitI18n.normalize(lang);
        }

        var raw = String(lang || "en")
            .trim()
            .toLowerCase()
            .replace(/_/g, "-");
        if (!raw) {
            return "en";
        }

        var aliases = {
            zh: "zh-CN",
            "zh-cn": "zh-CN",
            "zh-hans": "zh-CN",
            ch: "zh-CN",
            "zh-tw": "zh-TW",
            "zh-hant": "zh-TW",
            "pt-br": "pt-BR",
            ptbr: "pt-BR",
            "pt-pt": "pt-PT",
            ptpt: "pt-PT",
            se: "sv",
            "sv-se": "sv",
        };
        if (aliases[raw]) {
            return aliases[raw];
        }
        if (raw.indexOf("-") !== -1) {
            var parts = raw.split("-");
            return parts[0] + "-" + parts[1].toUpperCase();
        }
        return raw.slice(0, 2);
    }

    function parseLang(scriptEl, container) {
        var lang = getAttr(scriptEl, container, "data-lang") || document.documentElement.lang || "en";
        return normalizeLang(lang);
    }

    function resolveDir(raw, lang) {
        var val = String(raw == null ? "auto" : raw)
            .toLowerCase()
            .trim();
        if (val === "rtl" || val === "ltr") {
            return val;
        }
        if (window.FormKitI18n && typeof window.FormKitI18n.isRtl === "function") {
            return window.FormKitI18n.isRtl(lang) ? "rtl" : "ltr";
        }
        var code = normalizeLang(lang);
        return code === "ar" || code.indexOf("ar-") === 0 ? "rtl" : "ltr";
    }

    function parseDir(scriptEl, container, lang, configDir) {
        var attr = getAttr(scriptEl, container, "data-dir");
        return resolveDir(attr != null ? attr : configDir, lang);
    }

    function parseCaptcha(scriptEl, container) {
        var val = getAttr(scriptEl, container, "data-captcha") || "0";
        val = String(val).toLowerCase().trim();
        if (val === "0" || val === "off" || val === "false" || val === "no") {
            return null;
        }
        if (val === "1" || val === "on" || val === "true" || val === "yes") {
            return "easy";
        }
        if (val === "easy" || val === "medium" || val === "hard") {
            return val;
        }
        return "easy";
    }

    function parseFlag(scriptEl, container, name, defaultOn) {
        var val = getAttr(scriptEl, container, name);
        if (val == null || val === "") {
            return !!defaultOn;
        }
        val = String(val).toLowerCase().trim();
        return !(val === "0" || val === "off" || val === "false" || val === "no");
    }

    function parseColor(scriptEl, container, name) {
        var val = getAttr(scriptEl, container, name);
        if (val == null) {
            return null;
        }
        val = String(val).trim();
        return val || null;
    }

    function makeUid(containerId) {
        return "fk-" + String(containerId || "form").replace(/[^a-zA-Z0-9_-]/g, "-");
    }

    function resolveContainerIds(scriptEl) {
        var listAttr = scriptEl && scriptEl.getAttribute("data-containers");
        if (listAttr) {
            return listAttr
                .split(",")
                .map(function (item) {
                    return item.trim();
                })
                .filter(Boolean);
        }

        var autoNodes = document.querySelectorAll("[data-fk-form][id]");
        if (autoNodes.length > 1) {
            return Array.prototype.map.call(autoNodes, function (node) {
                return node.id;
            });
        }

        return [(scriptEl && scriptEl.getAttribute("data-container")) || "lead-form"];
    }

    function buildSettings(scriptEl, container, configDir) {
        var lang = parseLang(scriptEl, container);
        return {
            lang: lang,
            dir: parseDir(scriptEl, container, lang, configDir),
            action: getAttr(scriptEl, container, "data-action") || BASE + "send.php",
            customButton: getAttr(scriptEl, container, "data-button"),
            clickId: getAttr(scriptEl, container, "data-click-id"),
            keywordsEnabled: getAttr(scriptEl, container, "data-keywords") !== "0",
            keywordsMapUrl: getAttr(scriptEl, container, "data-keywords-url") || BASE + "keywords.php",
            offerUrl: getAttr(scriptEl, container, "data-offer-url") || "../../lander/adminka/offer.txt",
            brandUrl: getAttr(scriptEl, container, "data-brand-url") || "../../lander/adminka/brand.txt",
            brandKey: getAttr(scriptEl, container, "data-brand-key"),
            offerKey: getAttr(scriptEl, container, "data-offer-key"),
            captcha: parseCaptcha(scriptEl, container),
            frame: parseFlag(scriptEl, container, "data-frame", true),
            frameColor: parseColor(scriptEl, container, "data-frame-color"),
            btnColor: parseColor(scriptEl, container, "data-btn-color"),
            btnText: parseColor(scriptEl, container, "data-btn-text"),
        };
    }

    function applyTheme(inst) {
        var el = inst.container;
        var s = inst.settings;

        el.classList.toggle("fk-has-frame", !!s.frame);

        if (s.btnColor) {
            el.style.setProperty("--fk-btn-bg", s.btnColor);
        }
        if (s.btnText) {
            el.style.setProperty("--fk-btn-text", s.btnText);
        }
        if (s.frameColor) {
            el.style.setProperty("--fk-frame-color", s.frameColor);
        }
    }

    function isLocalPreview() {
        var host = window.location.hostname;
        return host === "localhost" || host === "127.0.0.1" || host === "" || window.location.protocol === "file:";
    }

    function populateDates(lang) {
        var code = normalizeLang(lang);
        var locale = LOCALE_MAP[code] || code || "en-US";
        var formatted = "";

        try {
            formatted = new Date().toLocaleDateString(locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
            });
        } catch (e) {
            formatted = new Date().toLocaleDateString();
        }

        document.querySelectorAll("#datusa, .current-date, [data-fk-date]").forEach(function (node) {
            node.textContent = formatted;
        });
    }

    var DEFAULT_KEYWORD_MAP = {
        "brand-key": "co-es",
        "offer-key": "offer",
        "cur-key": "cur",
    };

    function fetchJson(url) {
        return fetch(url + "?v=" + new Date().getTime()).then(function (response) {
            if (!response.ok) {
                throw new Error("Network response was not ok.");
            }
            return response.json();
        });
    }

    function parseKeywordMapAttr(scriptEl) {
        var raw = scriptEl && scriptEl.getAttribute("data-keyword-map");
        if (!raw) {
            return {};
        }

        try {
            var parsed = JSON.parse(raw);
            return parsed && typeof parsed === "object" ? parsed : {};
        } catch (e) {
            console.error("FormKit: invalid data-keyword-map JSON");
            return {};
        }
    }

    var RESERVED_KEYWORD_CLASSES = {
        "brand-key": true,
        "offer-key": true,
        "cur-key": true,
    };

    function valueFromFile(sourceKey, data) {
        if (!sourceKey || !data || typeof data[sourceKey] === "undefined") {
            return "";
        }
        return data[sourceKey];
    }

    function applyKeywordClass(className, value) {
        if (!className || value === "") {
            return;
        }

        document.querySelectorAll("." + className).forEach(function (element) {
            element.textContent = value;
        });
    }

    function populateDirectOfferClasses(offerData, mappedKeys) {
        if (!offerData || typeof offerData !== "object") {
            return;
        }

        Object.keys(offerData).forEach(function (key) {
            if (!key || mappedKeys[key] || RESERVED_KEYWORD_CLASSES[key]) {
                return;
            }
            applyKeywordClass(key, offerData[key]);
        });
    }

    function applyKeywordsFromData(settings, scriptEl, mapConfig, offerData, brandData) {
        if (!settings.keywordsEnabled) {
            return;
        }

        var attrMap = parseKeywordMapAttr(scriptEl);
        var map = Object.assign({}, DEFAULT_KEYWORD_MAP, (mapConfig && mapConfig.map) || {}, attrMap);

        // config.php brand_key / offer_key, then data-* overrides
        if (mapConfig && mapConfig.brand_key) {
            map["brand-key"] = mapConfig.brand_key;
        }
        if (mapConfig && mapConfig.offer_key) {
            map["offer-key"] = mapConfig.offer_key;
        }
        if (settings.brandKey) {
            map["brand-key"] = settings.brandKey;
        }
        if (settings.offerKey) {
            map["offer-key"] = settings.offerKey;
        }

        var brandKey = map["brand-key"] || DEFAULT_KEYWORD_MAP["brand-key"];
        var offerKey = map["offer-key"] || DEFAULT_KEYWORD_MAP["offer-key"];
        var curKey = map["cur-key"] || DEFAULT_KEYWORD_MAP["cur-key"];
        var mappedSourceKeys = {};

        mappedSourceKeys[brandKey] = true;
        mappedSourceKeys[offerKey] = true;
        if (curKey) {
            mappedSourceKeys[curKey] = true;
        }

        // Real server convention:
        //   offer.txt  → what users see on the page (.brand-key / .offer-key)
        //   brand.txt  → what goes to CRM (hidden p4)
        applyKeywordClass("brand-key", valueFromFile(brandKey, offerData));
        applyKeywordClass("offer-key", valueFromFile(offerKey, offerData));
        applyKeywordClass("cur-key", valueFromFile(curKey, offerData));

        Object.keys(map).forEach(function (aliasClass) {
            if (RESERVED_KEYWORD_CLASSES[aliasClass]) {
                return;
            }
            var sourceKey = map[aliasClass];
            if (!sourceKey) {
                return;
            }
            mappedSourceKeys[sourceKey] = true;
            applyKeywordClass(aliasClass, valueFromFile(sourceKey, offerData));
        });

        populateDirectOfferClasses(offerData, mappedSourceKeys);

        // Re-apply reserved classes last so nothing can overwrite them
        applyKeywordClass("brand-key", valueFromFile(brandKey, offerData));
        applyKeywordClass("offer-key", valueFromFile(offerKey, offerData));
        applyKeywordClass("cur-key", valueFromFile(curKey, offerData));

        // p4 (CRM) = brand.txt[brand_key] only
        if (brandData && brandData[brandKey]) {
            document.querySelectorAll('input[name="p4"]').forEach(function (input) {
                input.value = brandData[brandKey];
            });
        }
    }

    function loadKeywordBundle(settings) {
        var mapUrl = settings.keywordsMapUrl || BASE + "keywords.php";

        return Promise.all([
            fetchJson(mapUrl).catch(function () {
                return {
                    map: DEFAULT_KEYWORD_MAP,
                    brand_key: DEFAULT_KEYWORD_MAP["brand-key"],
                    offer_key: DEFAULT_KEYWORD_MAP["offer-key"],
                    dir: "auto",
                };
            }),
            settings.keywordsEnabled
                ? fetchJson(settings.offerUrl).catch(function () {
                      return null;
                  })
                : Promise.resolve(null),
            settings.keywordsEnabled
                ? fetchJson(settings.brandUrl).catch(function () {
                      return null;
                  })
                : Promise.resolve(null),
        ]).then(function (results) {
            return {
                mapConfig: results[0] || {},
                offerData: results[1],
                brandData: results[2],
            };
        });
    }

    function bindScrollToForm(containerIds, scrollTarget, enabled) {
        if (!enabled || window.FormKitScrollBound) {
            return;
        }

        window.FormKitScrollBound = true;

        function getTarget() {
            if (scrollTarget && document.getElementById(scrollTarget)) {
                return document.getElementById(scrollTarget);
            }

            for (var i = 0; i < containerIds.length; i++) {
                var node = document.getElementById(containerIds[i]);
                if (node) {
                    return node;
                }
            }

            return null;
        }

        function scrollHandler(event) {
            var target = getTarget();
            if (!target) {
                return;
            }
            if (event) {
                event.preventDefault();
            }
            target.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        function insideAnyForm(node) {
            for (var i = 0; i < containerIds.length; i++) {
                if (node.closest("#" + containerIds[i])) {
                    return true;
                }
            }
            return false;
        }

        document.querySelectorAll("a").forEach(function (link) {
            if (insideAnyForm(link)) {
                return;
            }
            var href = link.getAttribute("href") || "";
            if (href.indexOf("mailto:") === 0 || href.indexOf("tel:") === 0) {
                return;
            }
            link.addEventListener("click", scrollHandler);
            link.style.cursor = "pointer";
        });

        document.querySelectorAll("button").forEach(function (button) {
            if (insideAnyForm(button) || button.classList.contains("send-form")) {
                return;
            }
            button.addEventListener("click", scrollHandler);
            button.style.cursor = "pointer";
        });
    }

    function createInstance(container, scriptEl, configDir) {
        var settings = buildSettings(scriptEl, container, configDir);
        var T = window.FormKitI18n ? window.FormKitI18n.get(settings.lang) : {};
        var uid = makeUid(container.id);

        return {
            container: container,
            id: container.id,
            uid: uid,
            settings: settings,
            T: T,
            iti: null,
            captchaData: null,
            formStartedAt: Date.now(),
            form: null,
        };
    }

    function headerBlockHtml(inst) {
        var headersOff = getAttr(script, inst.container, "data-headers");
        if (headersOff === "0" || headersOff === "off" || headersOff === "false") {
            return "";
        }

        var title = hasAttr(script, inst.container, "data-title") ? getAttr(script, inst.container, "data-title") : inst.T.title || "";
        var subtitle = hasAttr(script, inst.container, "data-subtitle")
            ? getAttr(script, inst.container, "data-subtitle")
            : inst.T.subtitle || "";
        var hasTitle = String(title).trim() !== "";
        var hasSubtitle = String(subtitle).trim() !== "";

        if (!hasTitle && !hasSubtitle) {
            return "";
        }

        var html = '<div class="fk-heading">';
        if (hasTitle) {
            html += '<div class="fk-heading-title">' + esc(title) + "</div>";
        }
        if (hasSubtitle) {
            html += '<div class="fk-heading-subtitle">' + esc(subtitle) + "</div>";
        }
        html += "</div>";
        return html;
    }

    function captchaBlockHtml(inst) {
        if (!inst.settings.captcha) {
            return "";
        }

        return (
            '      <div class="fk-captcha" id="' +
            inst.uid +
            '-captcha">' +
            '        <div class="fk-captcha-box">' +
            '          <div class="fk-captcha-row">' +
            '            <span class="fk-captcha-equation" aria-hidden="true">' +
            '              <span class="fk-captcha-num" id="' +
            inst.uid +
            '-c-a">…</span>' +
            '              <span class="fk-captcha-sign" id="' +
            inst.uid +
            '-c-op">+</span>' +
            '              <span class="fk-captcha-num" id="' +
            inst.uid +
            '-c-b">…</span>' +
            '              <span class="fk-captcha-eq">=</span>' +
            '              <span class="fk-captcha-qmark">?</span>' +
            "            </span>" +
            '            <span class="fk-captcha-prompt" id="' +
            inst.uid +
            '-captcha-prompt">' +
            esc(inst.T.captchaPrompt) +
            "</span>" +
            "          </div>" +
            '          <div class="fk-captcha-field">' +
            '            <input type="text" name="captcha_answer" id="' +
            inst.uid +
            '-captcha-input" data-validation_type="captcha" inputmode="numeric" autocomplete="off" placeholder="' +
            esc(inst.T.captchaPlaceholder) +
            '" required>' +
            "          </div>" +
            "        </div>" +
            '        <input type="hidden" name="captcha_enabled" value="1">' +
            '        <input type="hidden" name="captcha_id" value="' +
            esc(inst.id) +
            '">' +
            '        <input type="hidden" name="captcha_token" id="' +
            inst.uid +
            '-captcha-token" value="">' +
            "      </div>"
        );
    }

    function honeypotHtml(T) {
        T = T || {};
        return (
            '      <div class="fk-hp" aria-hidden="true">' +
            "        <label>" +
            esc(T.hpMiddleName || "Do not fill") +
            '<input type="text" name="middle_name" tabindex="-1" autocomplete="off"></label>' +
            "        <label>" +
            esc(T.hpWebsite || "Website") +
            '<input type="text" name="url" tabindex="-1" autocomplete="off"></label>' +
            "        <label>" +
            esc(T.hpCompany || "Company") +
            '<input type="text" name="company" tabindex="-1" autocomplete="off"></label>' +
            "        <label>" +
            esc(T.hpConfirmEmail || "Confirm email") +
            '<input type="email" name="email_confirm" tabindex="-1" autocomplete="off"></label>' +
            "      </div>"
        );
    }

    function fieldErrorMessage(inst, type, empty) {
        var T = inst.T || {};
        switch (type) {
            case "firstname":
                return T.eFirst || "";
            case "lastname":
                return T.eLast || "";
            case "email":
                return empty ? T.eMail || "" : T.eMail || "";
            case "phone":
                return empty ? T.ePhone || "" : T.ePhoneBad || "";
            case "captcha":
                return T.eCaptcha || "";
            default:
                return "";
        }
    }

    function renderForm(inst) {
        var dir = inst.settings.dir === "rtl" ? "rtl" : "ltr";
        inst.container.setAttribute("dir", dir);
        inst.container.classList.toggle("fk-dir-rtl", dir === "rtl");
        inst.container.classList.toggle("fk-dir-ltr", dir === "ltr");

        var buttonText = inst.settings.customButton || inst.T.submit;
        inst.formStartedAt = Date.now();

        inst.container.innerHTML =
            '<div class="fk-card">' +
            '  <div class="fk-preloader" id="' +
            inst.uid +
            '-preloader"><div class="fk-spinner"></div></div>' +
            '  <div class="fk-body">' +
            '    <form class="form-container" method="post" action="' +
            esc(inst.settings.action) +
            '" novalidate>' +
            headerBlockHtml(inst) +
            '      <div class="fk-group">' +
            '        <input type="text" name="firstname" data-validation_type="firstname" placeholder="' +
            esc(inst.T.firstname) +
            '" autocomplete="given-name" required>' +
            "      </div>" +
            '      <div class="fk-group">' +
            '        <input type="text" name="lastname" data-validation_type="lastname" placeholder="' +
            esc(inst.T.lastname) +
            '" autocomplete="family-name" required>' +
            "      </div>" +
            '      <div class="fk-group">' +
            '        <input type="email" name="email" data-validation_type="email" placeholder="' +
            esc(inst.T.email) +
            '" autocomplete="email" required>' +
            "      </div>" +
            '      <div class="fk-group">' +
            '        <input type="tel" class="phone" name="phone" data-validation_type="phone" autocomplete="tel" required>' +
            "      </div>" +
            captchaBlockHtml(inst) +
            honeypotHtml(inst.T) +
            '      <div class="form_input--hidden">' +
            '        <input type="hidden" name="full-phone">' +
            '        <input type="hidden" name="country">' +
            '        <input type="hidden" name="ip">' +
            '        <input type="hidden" name="domain">' +
            '        <input type="hidden" name="prefix">' +
            '        <input type="hidden" name="lang" value="' +
            esc(inst.settings.lang) +
            '">' +
            '        <input type="hidden" name="form_started" value="' +
            inst.formStartedAt +
            '">' +
            '        <input type="hidden" name="form_token" id="' +
            inst.uid +
            '-form-token" value="">' +
            '        <input type="hidden" name="js_stamp" id="' +
            inst.uid +
            '-js-stamp" value="">' +
            '        <input type="hidden" name="js_active" id="' +
            inst.uid +
            '-js-active" value="0">' +
            '        <input type="hidden" name="p4" value="">' +
            '        <input type="hidden" name="click_id" value="{subid}">' +
            "      </div>" +
            '      <div class="fk-error" id="' +
            inst.uid +
            '-error"></div>' +
            '      <button type="submit" class="fk-submit send-form" disabled>' +
            esc(buttonText) +
            "</button>" +
            "    </form>" +
            "  </div>" +
            "</div>";

        inst.form = inst.container.querySelector("form");
    }

    function showError(inst, msg) {
        var el = document.getElementById(inst.uid + "-error");
        if (el) {
            el.textContent = msg;
            el.style.display = "block";
        }
    }

    function hideError(inst) {
        var el = document.getElementById(inst.uid + "-error");
        if (el) {
            el.style.display = "none";
        }
    }

    function setFieldState(el, state) {
        var group = el.closest(".fk-group");
        if (!group && el.dataset.validation_type === "captcha") {
            group = el.closest(".fk-captcha-field");
        }

        el.classList.remove("valid", "invalid");
        if (group) {
            group.classList.remove("is-valid", "is-invalid");
        }

        if (state === "valid") {
            el.classList.add("valid");
            if (group) {
                group.classList.add("is-valid");
            }
        } else if (state === "invalid") {
            el.classList.add("invalid");
            if (group) {
                group.classList.add("is-invalid");
            }
        }
    }

    function validInput(el) {
        setFieldState(el, "valid");
    }

    function invalidInput(el) {
        setFieldState(el, "invalid");
    }

    function clearFieldState(el) {
        setFieldState(el, null);
    }

    function updateCaptchaDisplay(inst, data) {
        var numA = document.getElementById(inst.uid + "-c-a");
        var numB = document.getElementById(inst.uid + "-c-b");
        var opEl = document.getElementById(inst.uid + "-c-op");
        var tokenInput = document.getElementById(inst.uid + "-captcha-token");

        if (numA) {
            numA.textContent = String(data.a);
        }
        if (numB) {
            numB.textContent = String(data.b);
        }
        if (opEl) {
            opEl.textContent = data.op || "+";
        }
        if (tokenInput) {
            tokenInput.value = data.token || "";
        }
    }

    function isCaptchaValid(inst, form) {
        if (!inst.settings.captcha) {
            return true;
        }

        var input = form.querySelector("#" + inst.uid + "-captcha-input");
        if (!input || !inst.captchaData) {
            return false;
        }

        var val = input.value.trim();
        return val !== "" && Number(val) === Number(inst.captchaData.answer);
    }

    function checkForm(inst, form) {
        var submit = form.querySelector(".send-form");
        var email = form.querySelector('input[type="email"][name="email"]');
        var phone = form.querySelector('input[type="tel"]');
        if (!submit || !email || !phone) {
            return;
        }

        var ready = email.dataset.bool === "true" && phone.dataset.bool === "true" && isCaptchaValid(inst, form);
        if (ready) {
            submit.removeAttribute("disabled");
        } else {
            submit.setAttribute("disabled", "");
        }
    }

    function checkValidation(inst, target, form) {
        var validType = target.dataset.validation_type;
        var val = target.value;
        var rvName =
            /^[(a-zA-Zа-яА-Я\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC-`\s+)]*$/;

        switch (validType) {
            case "firstname":
            case "lastname":
                val = val.split(" ").join("");
                if (val === "") {
                    clearFieldState(target);
                } else if (rvName.test(val)) {
                    validInput(target);
                } else {
                    invalidInput(target);
                }
                break;
            case "email":
                var rvEmail = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/;
                var emailOk = rvEmail.test(val);
                target.setAttribute("data-bool", emailOk);
                checkForm(inst, form);
                if (val === "") {
                    clearFieldState(target);
                } else if (emailOk) {
                    validInput(target);
                } else {
                    invalidInput(target);
                }
                break;
            case "phone":
                if (!inst.iti) {
                    break;
                }
                var checkNum = inst.iti.isValidNumber();
                var numPrefix = inst.iti.getSelectedCountryData().dialCode;
                var getNum = inst.iti.getNumber();
                var getCountry = (inst.iti.getSelectedCountryData().iso2 || "").toUpperCase();

                form.querySelectorAll('input[name="full-phone"]').forEach(function (item) {
                    item.setAttribute("value", getNum);
                });
                form.querySelectorAll('input[name="country"]').forEach(function (item) {
                    item.setAttribute("value", getCountry);
                });
                form.querySelectorAll('input[name="prefix"]').forEach(function (item) {
                    item.setAttribute("value", numPrefix);
                });
                target.setAttribute("data-bool", checkNum);
                checkForm(inst, form);
                if (val === "") {
                    clearFieldState(target);
                } else if (checkNum) {
                    validInput(target);
                } else {
                    invalidInput(target);
                }
                break;
            case "captcha":
                if (val !== "" && isCaptchaValid(inst, form)) {
                    validInput(target);
                    target.setAttribute("data-bool", "true");
                } else if (val !== "") {
                    invalidInput(target);
                    target.setAttribute("data-bool", "false");
                } else {
                    clearFieldState(target);
                    target.setAttribute("data-bool", "false");
                }
                checkForm(inst, form);
                break;
            default:
                val !== "" ? validInput(target) : clearFieldState(target);
        }
    }

    function resolveClickId(inst) {
        if (inst.settings.clickId && inst.settings.clickId !== "{subid}") {
            return inst.settings.clickId;
        }

        var params = new URLSearchParams(window.location.search);
        return params.get("click_id") || params.get("clickid") || params.get("subid") || params.get("external_id") || "";
    }

    function applyClickId(inst, form) {
        var clickId = resolveClickId(inst);
        var input = form.querySelector('input[name="click_id"]');
        if (!input || !clickId) {
            return;
        }
        input.value = clickId;
    }

    function addUrlParams(form) {
        var hiddenWrap = form.querySelector(".form_input--hidden");
        if (!hiddenWrap) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        params.forEach(function (value, key) {
            var exists = form.querySelector('input[name="' + key + '"]');
            if (!exists) {
                var input = document.createElement("input");
                input.type = "hidden";
                input.name = key;
                input.value = value;
                hiddenWrap.appendChild(input);
            } else if (!exists.value || exists.value === "{subid}") {
                exists.value = value;
            }
        });
    }

    function prefillFromUrl(form) {
        var params = new URLSearchParams(window.location.search);
        var first = params.get("firstname");
        var email = params.get("email");

        if (first) {
            var firstInput = form.querySelector('input[name="firstname"]');
            if (firstInput) {
                firstInput.value = decodeURIComponent(first.replace(/\+/g, " "));
            }
        }

        if (email) {
            var emailInput = form.querySelector('input[name="email"]');
            if (emailInput) {
                emailInput.value = decodeURIComponent(email);
            }
        }
    }

    function setFormIp(form, ip) {
        form.querySelectorAll('input[name="ip"]').forEach(function (item) {
            item.setAttribute("value", ip || "");
        });
    }

    function geoIpLookupWithFallback(form, callback, index) {
        if (index >= GEO_PROVIDERS.length) {
            callback("us");
            return;
        }

        var provider = GEO_PROVIDERS[index];
        fetch(provider.url, { cache: "no-store" })
            .then(function (r) {
                if (!r.ok) {
                    throw new Error("geo http");
                }
                return r.json();
            })
            .then(function (data) {
                var result = provider.parse(data);
                if (!result || !result.country) {
                    throw new Error("geo parse");
                }
                setFormIp(form, result.ip);
                callback(result.country);
            })
            .catch(function () {
                geoIpLookupWithFallback(form, callback, index + 1);
            });
    }

    function isolatePhoneLtr(phoneInput) {
        if (!phoneInput) {
            return;
        }

        var phoneGroup = phoneInput.closest(".fk-group");
        var itiWrap = phoneInput.closest(".iti");

        // intlTelInput paints flag + dial code on the left; isolate from RTL parents.
        if (phoneGroup) {
            phoneGroup.setAttribute("dir", "ltr");
            phoneGroup.style.direction = "ltr";
            phoneGroup.style.unicodeBidi = "isolate";
            phoneGroup.classList.add("fk-phone-group");
        }

        if (itiWrap) {
            itiWrap.setAttribute("dir", "ltr");
            itiWrap.style.direction = "ltr";
            itiWrap.style.unicodeBidi = "isolate";
        }

        phoneInput.setAttribute("dir", "ltr");
        phoneInput.style.direction = "ltr";
        phoneInput.style.textAlign = "left";
        phoneInput.style.unicodeBidi = "plaintext";
    }

    function syncPhonePadding(phoneInput) {
        if (!phoneInput) {
            return;
        }

        isolatePhoneLtr(phoneInput);

        var itiWrap = phoneInput.closest(".iti");
        if (!itiWrap) {
            return;
        }

        var selectedFlag = itiWrap.querySelector(".iti__selected-flag");
        if (selectedFlag) {
            var pad = Math.max(selectedFlag.offsetWidth + 12, 78) + "px";
            phoneInput.style.setProperty("padding-left", pad, "important");
            phoneInput.style.setProperty("padding-right", "36px", "important");
        }
    }

    function initPhone(inst, form) {
        var phoneInput = form.querySelector(".phone");
        if (!phoneInput || !window.intlTelInput) {
            return;
        }

        isolatePhoneLtr(phoneInput);

        inst.iti = window.intlTelInput(phoneInput, {
            utilsScript: BASE + "intlTelInput/js/utils.js",
            nationalMode: true,
            separateDialCode: true,
            initialCountry: "auto",
            autoPlaceholder: "aggressive",
            placeholderNumberType: "MOBILE",
            geoIpLookup: function (callback) {
                geoIpLookupWithFallback(form, callback, 0);
            },
        });

        phoneInput.addEventListener("countrychange", function () {
            syncPhonePadding(phoneInput);
        });

        phoneInput.addEventListener("input", function () {
            syncPhonePadding(phoneInput);
        });

        syncPhonePadding(phoneInput);

        window.setTimeout(function () {
            syncPhonePadding(phoneInput);
        }, 50);

        window.setTimeout(function () {
            syncPhonePadding(phoneInput);
        }, 300);

        window.setTimeout(function () {
            syncPhonePadding(phoneInput);
        }, 1200);

        if (typeof ResizeObserver !== "undefined") {
            var itiWrap = phoneInput.closest(".iti");
            var flag = itiWrap && itiWrap.querySelector(".iti__selected-flag");
            if (flag) {
                var ro = new ResizeObserver(function () {
                    syncPhonePadding(phoneInput);
                });
                ro.observe(flag);
            }
        }

        form.querySelectorAll('input[name="domain"]').forEach(function (item) {
            item.setAttribute("value", window.location.hostname);
        });
    }

    function applyFormToken(inst, form, token) {
        var tokenInput = form.querySelector("#" + inst.uid + "-form-token");
        var stampInput = form.querySelector("#" + inst.uid + "-js-stamp");
        var activeInput = form.querySelector("#" + inst.uid + "-js-active");

        if (tokenInput) {
            tokenInput.value = token;
        }
        if (stampInput) {
            stampInput.value = token.substring(0, 12) + "-" + (inst.formStartedAt % 100000);
        }
        if (activeInput) {
            activeInput.value = "1";
        }
    }

    function loadFormToken(inst, form) {
        return fetch(BASE + "token.php", { credentials: "same-origin", cache: "no-store" })
            .then(function (r) {
                if (!r.ok) {
                    throw new Error("token http");
                }
                return r.json();
            })
            .then(function (data) {
                if (!data || !data.token) {
                    throw new Error("no token");
                }
                applyFormToken(inst, form, data.token);
            })
            .catch(function () {
                if (isLocalPreview()) {
                    applyFormToken(inst, form, "local-preview-token-" + inst.id);
                    return;
                }
                throw new Error("token failed");
            });
    }

    function localCaptchaFallback() {
        var a = Math.floor(Math.random() * 9) + 1;
        var b = Math.floor(Math.random() * 9) + 1;
        return { a: a, b: b, op: "+", answer: a + b, token: "", question: a + " + " + b + " = ?" };
    }

    function applyCaptchaData(inst, data) {
        inst.captchaData = {
            question: data.question,
            token: data.token,
            answer: Number(data.answer),
        };
        updateCaptchaDisplay(inst, data);
    }

    function loadCaptcha(inst) {
        if (!inst.settings.captcha) {
            return Promise.resolve();
        }

        return fetch(BASE + "captcha.php?difficulty=" + encodeURIComponent(inst.settings.captcha) + "&id=" + encodeURIComponent(inst.id))
            .then(function (r) {
                if (!r.ok) {
                    throw new Error("captcha http");
                }
                return r.json();
            })
            .then(function (data) {
                if (!data || typeof data.a === "undefined" || typeof data.b === "undefined") {
                    throw new Error("captcha payload");
                }
                applyCaptchaData(inst, data);
            })
            .catch(function () {
                if (isLocalPreview()) {
                    applyCaptchaData(inst, localCaptchaFallback());
                    return;
                }
                throw new Error("captcha failed");
            });
    }

    function bindForm(inst, form) {
        form.addEventListener("input", function (event) {
            checkValidation(inst, event.target, form);
        });

        form.addEventListener(
            "blur",
            function (event) {
                var el = event.target;
                if (!el.dataset || !el.dataset.validation_type) {
                    return;
                }

                if (el.value.trim() === "" && el.hasAttribute("required")) {
                    invalidInput(el);
                    if (el.type === "email" || el.type === "tel" || el.dataset.validation_type === "captcha") {
                        el.setAttribute("data-bool", "false");
                    }
                    var emptyMsg = fieldErrorMessage(inst, el.dataset.validation_type, true);
                    if (emptyMsg) {
                        showError(inst, emptyMsg);
                    }
                    checkForm(inst, form);
                    return;
                }

                checkValidation(inst, el, form);
                if (el.classList.contains("invalid")) {
                    var badMsg = fieldErrorMessage(inst, el.dataset.validation_type, false);
                    if (badMsg) {
                        showError(inst, badMsg);
                    }
                } else if (el.classList.contains("valid")) {
                    hideError(inst);
                }
            },
            true,
        );

        form.addEventListener("submit", function (event) {
            hideError(inst);

            var tokenInput = form.querySelector("#" + inst.uid + "-form-token");
            if (!tokenInput || !tokenInput.value) {
                event.preventDefault();
                showError(inst, inst.T.eExpired || "Form expired. Please refresh the page.");
                return;
            }

            if (inst.settings.captcha && !isCaptchaValid(inst, form)) {
                event.preventDefault();
                showError(inst, inst.T.eCaptcha);
                var preloader = document.getElementById(inst.uid + "-preloader");
                if (preloader) {
                    preloader.classList.remove("is-visible");
                }
                return;
            }

            if (inst.settings.keywordsEnabled) {
                var p4Input = form.querySelector('input[name="p4"]');
                if (p4Input && !p4Input.value) {
                    event.preventDefault();
                    showError(inst, inst.T.eBrand || "Brand ID is not loaded. Please refresh the page.");
                    var preloaderBrand = document.getElementById(inst.uid + "-preloader");
                    if (preloaderBrand) {
                        preloaderBrand.classList.remove("is-visible");
                    }
                    return;
                }
            }

            var startedInput = form.querySelector('input[name="form_started"]');
            if (startedInput) {
                startedInput.value = String(inst.formStartedAt);
            }

            var submitBtn = form.querySelector(".send-form");
            if (submitBtn && inst.T.sending) {
                submitBtn.textContent = inst.T.sending;
            }

            var preloader = document.getElementById(inst.uid + "-preloader");
            if (preloader) {
                preloader.classList.add("is-visible");
            }
        });
    }

    function initInstance(inst) {
        inst.container.classList.add("fk-form-root");
        applyTheme(inst);
        renderForm(inst);

        if (!inst.form) {
            return Promise.resolve();
        }

        addUrlParams(inst.form);
        applyClickId(inst, inst.form);
        prefillFromUrl(inst.form);
        initPhone(inst, inst.form);
        bindForm(inst, inst.form);

        return loadFormToken(inst, inst.form)
            .then(function () {
                return loadCaptcha(inst);
            })
            .catch(function () {
                showError(inst, (inst.T && inst.T.eSecurity) || "Security check failed. Refresh the page.");
                var submit = inst.form.querySelector(".send-form");
                if (submit) {
                    submit.setAttribute("disabled", "");
                }
            });
    }

    function boot() {
        var containerIds = resolveContainerIds(script);
        var scrollEnabled = !script || script.getAttribute("data-scroll") !== "0";
        var scrollTarget = (script && script.getAttribute("data-scroll-target")) || containerIds[0];
        var probeSettings = buildSettings(script, null, "auto");

        if (!containerIds.length) {
            return;
        }

        var hasContainer = containerIds.some(function (id) {
            return document.getElementById(id);
        });
        if (!hasContainer) {
            console.warn("FormKit: no containers found");
            return;
        }

        populateDates(probeSettings.lang);
        bindScrollToForm(containerIds, scrollTarget, scrollEnabled);

        loadCss(BASE + "intlTelInput/css/intlTelInput.css");
        loadCss(BASE + "lead-form.css");

        var chain = Promise.resolve();

        if (!window.FormKitI18n) {
            chain = loadScript(BASE + "i18n.js");
        }

        chain
            .then(function () {
                return loadScript(BASE + "intlTelInput/js/intlTelInput.js");
            })
            .then(function () {
                return loadKeywordBundle(probeSettings);
            })
            .then(function (bundle) {
                var mapConfig = (bundle && bundle.mapConfig) || {};
                var configDir = mapConfig.dir || "auto";
                var instances = [];

                containerIds.forEach(function (containerId) {
                    var container = document.getElementById(containerId);
                    if (!container) {
                        console.warn("FormKit: container not found:", containerId);
                        return;
                    }
                    instances.push(createInstance(container, script, configDir));
                });

                if (!instances.length) {
                    return;
                }

                var defaultSettings = instances[0].settings;
                applyKeywordsFromData(defaultSettings, script, mapConfig, bundle.offerData, bundle.brandData);

                return Promise.all(
                    instances.map(function (inst) {
                        inst.settings.lang = normalizeLang(inst.settings.lang);
                        inst.settings.dir = parseDir(script, inst.container, inst.settings.lang, configDir);
                        inst.T = window.FormKitI18n.get(inst.settings.lang);
                        return initInstance(inst);
                    }),
                ).then(function () {
                    // Re-apply keywords after forms render (p4 inputs exist now).
                    applyKeywordsFromData(defaultSettings, script, mapConfig, bundle.offerData, bundle.brandData);
                });
            })
            .catch(function (error) {
                console.error("FormKit: failed to load dependencies", error);
            });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot);
    } else {
        boot();
    }
})();
