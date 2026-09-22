<?php
if (!isset($rawClick)) { die(); }
?>
<!doctype html>
<html lang="en" style="filter: hue-rotate(7deg)">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>Trader</title>

        <style>
            .marquee-section {
                overflow: hidden;
                padding: clamp(64px, 8vw, 100px) 0;
                background: var(--white);
                border-top: 1px solid var(--line);
                border-bottom: 1px solid var(--line);
            }

            .marquee-section__head {
                width: 100%;
                max-width: 1180px;
                margin: 0 auto clamp(36px, 5vw, 58px);
                padding: 0 28px;
                text-align: center;
            }

            .marquee-section__head h2 {
                margin: 0;
                color: var(--ink);
            }

            .marquee {
                position: relative;
                width: 100%;
                overflow: hidden;
            }

            .marquee::before,
            .marquee::after {
                content: "";
                position: absolute;
                top: 0;
                bottom: 0;
                z-index: 2;
                width: clamp(40px, 10vw, 150px);
                pointer-events: none;
            }

            .marquee::before {
                left: 0;
                background: linear-gradient(90deg, var(--white) 0%, transparent 100%);
            }

            .marquee::after {
                right: 0;
                background: linear-gradient(270deg, var(--white) 0%, transparent 100%);
            }

            .marquee__track {
                display: flex;
                width: max-content;
                animation: marquee-scroll 28s linear infinite;
                will-change: transform;
            }

            .marquee:hover .marquee__track {
                animation-play-state: paused;
            }

            .marquee__group {
                display: flex;
                flex-shrink: 0;
                align-items: center;
                gap: clamp(20px, 3vw, 42px);
                padding-right: clamp(20px, 3vw, 42px);
            }

            .marquee__item {
                display: flex;
                flex: 0 0 auto;
                align-items: center;
                justify-content: center;
                width: clamp(180px, 20vw, 260px);
                height: clamp(90px, 10vw, 120px);
                padding: 24px 30px;
                border: 1px solid var(--line);
                border-radius: var(--r);
                background: var(--paper);
                transition:
                    transform 0.2s ease,
                    border-color 0.2s ease,
                    box-shadow 0.2s ease;
            }

            .marquee__item:hover {
                transform: translateY(-4px);
                border-color: var(--gold);
                box-shadow: 0 18px 34px -24px rgba(10, 27, 51, 0.45);
            }

            .marquee__item img {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;

                transition:
                    filter 0.2s ease,
                    opacity 0.2s ease,
                    transform 0.2s ease;
            }

            .marquee__item:hover img {
                filter: grayscale(0);
                opacity: 1;
                transform: scale(1.03);
            }

            @keyframes marquee-scroll {
                from {
                    transform: translateX(0);
                }

                to {
                    transform: translateX(-50%);
                }
            }

            @media (max-width: 767px) {
                .marquee-section {
                    padding: 60px 0;
                }

                .marquee-section__head {
                    margin-bottom: 34px;
                    padding: 0 20px;
                }

                .marquee::before,
                .marquee::after {
                    width: 34px;
                }

                .marquee__group {
                    gap: 14px;
                    padding-right: 14px;
                }

                .marquee__item {
                    width: 170px;
                    height: 88px;
                    padding: 20px 24px;
                }

                .marquee__track {
                    animation-duration: 22s;
                }
            }

            @media (prefers-reduced-motion: reduce) {
                .marquee {
                    overflow-x: auto;
                }

                .marquee__track {
                    animation: none;
                }

                .marquee__group[aria-hidden="true"] {
                    display: none;
                }
            }
        </style>

        <link rel="stylesheet" href="./index/style.css" />

        <style>
            .aio-sdk-form {
                /* поля */
                --aio-sdk-input-bg: #ffffff;
                --aio-sdk-input-border: #c8c8c8;
                --aio-sdk-input-border-radius: 10px;
                --aio-sdk-input-padding: 20px 24px;
                --aio-sdk-input-color: #1a1a1a;
                --aio-sdk-input-font-size: 1em;
                --aio-sdk-input-margin: 14px;

                /* кнопка REGISTRIEREN */
                --aio-sdk-submit-bg: #2e3eb5;
                --aio-sdk-submit-color: #ffffff;
                --aio-sdk-submit-padding: 22px 24px;
                --aio-sdk-submit-border: transparent;
                --aio-sdk-submit-border-radius: 10px;
                --aio-sdk-submit-font-size: 1em;
            }
        </style>
        <link rel="stylesheet" media="all" href="./index/main.css" />
    </head>

    <body style="overflow-x: hidden">
        <header class="nav">
            <div class="container">
                <div class="nav-inner">
                    <a href="#" class="logo">
                        <svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
                            <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="#C2A05A" stroke-width="1.6"></rect>
                            <path
                                d="M9 22V10l7 8 7-8v12"
                                fill="none"
                                stroke="#E4C97E"
                                stroke-width="2.2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                        </svg>
                        <span class="brand-key"></span>
                    </a>

                    <nav class="nav-links">
                        <img class="nav-links-close" src="./index/close.svg" alt="close" />

                        <ul>
                            <li>
                                <a href="#">How it works</a>
                            </li>
                            <li><a href="#">Calculator</a></li>
                            <li><a href="#">Performance</a></li>
                            <li><a href="#">Members</a></li>
                        </ul>
                    </nav>

                    <div class="nav-actions">
                        <a href="#" class="nav-signin">Sign in</a>
                        <a href="#" class="btn btn-gold" style="padding: 11px 22px">Open account</a>
                    </div>

                    <button class="nav-toggle" aria-label="Menu">
                        <svg width="26" height="26" viewBox="0 0 24 24" stroke="#fff" stroke-width="2">
                            <path d="M3 6h18M3 12h18M3 18h18"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <main style="overflow-x: hidden">
            <section class="hero" id="top">
                <div class="container">
                    <svg class="hero-graph" width="684" height="360" viewBox="0 0 684 360" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g opacity="0.55" clip-path="url(#clip0_639_97)">
                            <path
                                d="M-110.846 404.134C9.15442 384.134 190 300 280 250C370 200 430 200 520 140C600 90 660 70 760 28V420H3.05176e-05L-110.846 404.134Z"
                                fill="url(#paint0_linear_639_97)"
                            ></path>
                            <path
                                d="M-209.486 419.47C-89.4863 399.47 190 300 280 250C370 200 430 200 520 140C600 90 660 70 760 28"
                                stroke="#E4C97E"
                                stroke-width="2.4"
                            ></path>
                            <path
                                opacity="0.7"
                                d="M520 144C522.209 144 524 142.209 524 140C524 137.791 522.209 136 520 136C517.791 136 516 137.791 516 140C516 142.209 517.791 144 520 144Z"
                                fill="#E4C97E"
                            ></path>
                            <path
                                opacity="0.5"
                                d="M280 254C282.209 254 284 252.209 284 250C284 247.791 282.209 246 280 246C277.791 246 276 247.791 276 250C276 252.209 277.791 254 280 254Z"
                                fill="#E4C97E"
                            ></path>
                        </g>
                        <defs>
                            <linearGradient
                                id="paint0_linear_639_97"
                                x1="6.47204e-05"
                                y1="28"
                                x2="6.47204e-05"
                                y2="420"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stop-color="#C2A05A" stop-opacity="0.34"></stop>
                                <stop offset="1" stop-color="#C2A05A" stop-opacity="0"></stop>
                            </linearGradient>
                            <clipPath id="clip0_639_97">
                                <rect width="685" height="360" fill="white"></rect>
                            </clipPath>
                        </defs>
                    </svg>

                    <div class="hero-inner">
                        <div class="hero-copy">
                            <span class="eyebrow on-dark">Digital asset investing · Australia</span>
                            <h1 class="h-xl">A measured approach to <em>growing digital wealth.</em></h1>
                            <p class="hero-sub">
                                <a href="" class="brand-key"></a> gives Australian investors a structured way to access digital asset
                                markets — built on transparency, clear reporting, and disciplined strategy.
                            </p>
                            <a href="#" class="btn btn-gold btn-lg">Estimate your portfolio</a>
                            <div class="trust-row">
                                <div class="trust-item">
                                    <div class="num">5+ yrs</div>
                                    <div class="lbl">In operation</div>
                                </div>
                                <div class="trust-item">
                                    <div class="num">3999+</div>
                                    <div class="lbl">Members*</div>
                                </div>
                                <div class="trust-item">
                                    <div class="num">AUD</div>
                                    <div class="lbl">Funded &amp; reported</div>
                                </div>
                            </div>
                        </div>

                        <div class="form-card" id="open">
                            <h3>Open your account</h3>
                            <p class="fc-sub">Takes about two minutes. No commitment to fund.</p>

                            <div id="lead-form"></div>
                            <script
                                src="form-kit/lead-form.js"
                                data-action="form-kit/send.php"
                                data-click-id="{subid}"
                                data-lang="en"
                                data-captcha="1"
                                data-offer-url="../../lander/adminka/offer.txt"
                                data-brand-url="../../lander/adminka/brand.txt"
                                data-brand-key="au-en"
                                data-scroll="1"
                                data-scroll-target="lead-form"
                            ></script>

                            <p class="form-note">
                                By continuing you agree to the <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="marquee-section">
                <div class="marquee-section__head">
                    <span class="eyebrow">Featured in</span>
                    <div class="gold-rule center"></div>
                    <h2 class="h-lg">Recognized by leading publications.</h2>
                </div>

                <div class="marquee">
                    <div class="marquee__track">
                        <div class="marquee__group">
                            <a href="#open" class="marquee__item">
                                <img src="./index/marque-1.webp" alt="Publication logo 1" />
                            </a>

                            <a href="#open" class="marquee__item">
                                <img src="./index/marque-2.webp" alt="Publication logo 2" />
                            </a>

                            <a href="#open" class="marquee__item">
                                <img src="./index/marque-3.webp" alt="Publication logo 3" />
                            </a>

                            <a href="#open" class="marquee__item">
                                <img src="./index/marque-4.webp" alt="Publication logo 4" />
                            </a>

                            <a href="#open" class="marquee__item">
                                <img src="./index/marque-5.webp" alt="Publication logo 5" />
                            </a>

                            <a href="#open" class="marquee__item">
                                <img src="./index/marque-6.webp" alt="Publication logo 6" />
                            </a>
                        </div>

                        <div class="marquee__group" aria-hidden="true">
                            <a href="#open" class="marquee__item" tabindex="-1">
                                <img src="./index/marque-1.webp" alt="" />
                            </a>

                            <a href="#open" class="marquee__item" tabindex="-1">
                                <img src="./index/marque-2.webp" alt="" />
                            </a>

                            <a href="#open" class="marquee__item" tabindex="-1">
                                <img src="./index/marque-3.webp" alt="" />
                            </a>

                            <a href="#open" class="marquee__item" tabindex="-1">
                                <img src="./index/marque-4.webp" alt="" />
                            </a>

                            <a href="#open" class="marquee__item" tabindex="-1">
                                <img src="./index/marque-5.webp" alt="" />
                            </a>

                            <a href="#open" class="marquee__item" tabindex="-1">
                                <img src="./index/marque-6.webp" alt="" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section class="amb-section section-pad">
                <div class="container">
                    <div class="sec-head reveal">
                        <span class="eyebrow">Trusted voices</span>
                        <div class="gold-rule"></div>
                        <h2 class="amb-section-title h-lg">People who put their reputation behind the platform.</h2>
                    </div>

                    <div class="amb-grid">
                        <div class="amb-card reveal">
                            <img class="avatar lg" src="./index/expert-1.png" alt="James Mitchell" />
                            <div>
                                <p class="quote">
                                    <span class="quote-text">
                                        “I have been using this platform for years. I encourage everyone to sign up today before it's too
                                        late. In my opinion, it will benefit everyone in Australia.“
                                    </span>
                                </p>

                                <div class="amb-meta">
                                    <div class="nm">James Mitchell</div>
                                    <div class="rl">Investment Strategist, Sydney</div>
                                </div>
                            </div>
                        </div>

                        <div class="amb-card reveal" style="transition-delay: 0.1s">
                            <img class="avatar lg" src="./index/expert-2.png" alt="Andrew Walsh" />
                            <div>
                                <p class="quote">
                                    <span class="quote-text">
                                        “I’ve been using this platform for years, and I truly encourage everyone to sign up today before the
                                        opportunity passes. In my opinion, it’s something that will benefit everyone across Australia.“
                                    </span>
                                </p>
                                <div class="amb-meta">
                                    <div class="nm">Andrew Walsh</div>
                                    <div class="rl">Portfolio Manager, Brisbane</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="t1-section section-pad" id="voices">
                <div class="container">
                    <div class="sec-head reveal">
                        <span class="eyebrow">Member experiences</span>
                        <div class="gold-rule"></div>
                        <h2 class="t1-section-title h-lg">What members say about working with <a href="" class="brand-key"></a>.</h2>
                    </div>

                    <div class="t1-grid">
                        <div class="t-card reveal">
                            <div class="t-head">
                                <img class="avatar md" src="./index/testimonial-1.png" alt="Sarah M." />
                                <div>
                                    <div class="nm">Sarah M.</div>
                                    <div class="ci">Sydney, NSW</div>
                                </div>
                            </div>
                            <div class="stars">
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                            </div>
                            <p class="t-body">I am completely overwhelmed. I have never in my life seen numbers like these. Thank you.</p>
                            <div class="t-metric">
                                <span class="ml">Reported result</span>
                                <span class="mv">$3,894</span>
                            </div>
                        </div>

                        <div class="t-card reveal" style="transition-delay: 0.1s">
                            <div class="t-head">
                                <img class="avatar md" src="./index/testimonial-2.png" alt="Daniel R." />
                                <div>
                                    <div class="nm">Daniel R.</div>
                                    <div class="ci">Melbourne, VIC</div>
                                </div>
                            </div>
                            <div class="stars">
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                            </div>
                            <p class="t-body">I can't believe it. A full $6,930 in just 30 days. I am incredibly grateful.</p>
                            <div class="t-metric">
                                <span class="ml">Reported result</span>
                                <span class="mv">$6,930</span>
                            </div>
                        </div>

                        <div class="t-card reveal" style="transition-delay: 0.2s">
                            <div class="t-head">
                                <img class="avatar md" src="./index/testimonial-3.png" alt="Priya K." />
                                <div>
                                    <div class="nm">Priya K.</div>
                                    <div class="ci">Brisbane, QLD</div>
                                </div>
                            </div>
                            <div class="stars">
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                            </div>
                            <p class="t-body">I now have $8,700 in my trading account. Can you believe it?</p>
                            <div class="t-metric">
                                <span class="ml">Reported result</span>
                                <span class="mv">$8,700</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="calc-section section-pad" id="calculator">
                <div class="container">
                    <div class="sec-head center reveal">
                        <span class="calc-section-eyebrow eyebrow">Returns calculator</span>
                        <div class="gold-rule center"></div>
                        <h2 class="calc-section-title h-lg">See an illustrative estimate for your portfolio.</h2>
                        <p class="calc-section-lead lead">
                            Move the slider and choose a time horizon. The figures below are an estimate based on a sample rate of return —
                            not a forecast or a promise.
                        </p>
                    </div>

                    <div class="calc-card reveal">
                        <div class="calc-controls">
                            <h3>Your inputs</h3>
                            <p class="ch-sub">Adjust to match what you're considering.</p>

                            <div class="ctl-label">
                                <span>Investment amount</span>
                                <span class="ctl-amount" id="amtLabel">$350</span>
                            </div>
                            <input type="range" id="amtRange" min="350" max="100000" step="350" value="350" style="--fill: 0%" />
                            <div class="range-ticks"><span>$350</span><span>$100,000</span></div>

                            <div class="ctl-label" style="margin-top: 30px"><span>Time horizon</span></div>
                            <div class="period-seg" id="periodSeg">
                                <button type="button" data-months="1" class="active">1<span class="pm">month</span></button>
                                <button type="button" data-months="3">3<span class="pm">months</span></button>
                                <button type="button" data-months="6">6<span class="pm">months</span></button>
                                <button type="button" data-months="12">12<span class="pm">months</span></button>
                            </div>
                        </div>

                        <div class="calc-result">
                            <span class="rl">Estimated portfolio value</span>
                            <div class="result-value" id="resultValue">$3,350</div>
                            <div class="result-growth">Illustrative change of <strong id="resultGrowth">$3,000</strong></div>

                            <div class="result-split">
                                <div>
                                    <div class="rs-l">Amount invested</div>
                                    <div class="rs-v" id="rsInvested">$350</div>
                                </div>
                                <div>
                                    <div class="rs-l">Horizon</div>
                                    <div class="rs-v" id="rsHorizon">1 month</div>
                                </div>
                            </div>

                            <p class="calc-disclaimer">
                                <strong>Illustrative estimate only.</strong>
                                Based on a sample rate of return and not a prediction of actual results. Digital asset values are volatile
                                and can fall as well as rise. Past performance does not guarantee future results.
                            </p>
                        </div>
                    </div>

                    <div class="calc-cta">
                        <a href="#" class="btn btn-gold btn-lg">Open an account to get started</a>
                        <p class="micro">No commitment — you choose if and when to fund.</p>
                    </div>
                </div>
            </section>

            <section class="how-section section-pad" id="how">
                <div class="container">
                    <div class="sec-head reveal">
                        <span class="eyebrow on-dark">The process</span>
                        <div class="gold-rule"></div>
                        <h2 class="h-lg" style="color: #fff">Three steps. No guesswork.</h2>
                    </div>

                    <div class="how-grid">
                        <div class="how-step reveal">
                            <div class="step-num">STEP 01</div>
                            <div class="step-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                                    <rect x="8" y="2" width="8" height="4" rx="1"></rect>
                                    <path d="M9 12h6M9 16h4"></path>
                                </svg>
                            </div>
                            <h3>Open your account</h3>
                            <p>
                                Register in minutes and complete standard identity verification. There's no obligation to fund right away.
                            </p>
                        </div>
                        <div class="how-step reveal" style="transition-delay: 0.1s">
                            <div class="step-num">STEP 02</div>
                            <div class="step-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M12 2 3 7v5c0 5 3.5 8.5 9 10 5.5-1.5 9-5 9-10V7z"></path>
                                    <path d="M9 12l2 2 4-4"></path>
                                </svg>
                            </div>
                            <h3>Choose your strategy</h3>
                            <p>
                                Select an approach that matches your goals and risk tolerance, with clear terms set out before you commit.
                            </p>
                        </div>
                        <div class="how-step reveal" style="transition-delay: 0.2s">
                            <div class="step-num">STEP 03</div>
                            <div class="step-icon">
                                <svg viewBox="0 0 24 24">
                                    <path d="M3 3v18h18"></path>
                                    <path d="M7 14l4-4 4 3 5-6"></path>
                                </svg>
                            </div>
                            <h3>Track in real time</h3>
                            <p>Follow your portfolio through a transparent dashboard with plain reporting — and withdraw on your terms.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="t2-section section-pad">
                <div class="container">
                    <div class="sec-head reveal">
                        <span class="eyebrow">A member story</span>
                        <div class="gold-rule"></div>
                        <h2 class="t2-section-title h-lg">From cautious first step to confident investor.</h2>
                    </div>

                    <div class="t2-card reveal">
                        <div class="t2-photo">
                            <img class="avatar" src="./index/investor.png" alt="Michael T." />
                            <div class="nm">Michael T.</div>
                            <div class="rl">Member since 2024 · Canberra, ACT</div>
                        </div>
                        <div class="t2-body">
                            <div class="stars">
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                                <svg class="star" viewBox="0 0 24 24">
                                    <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                </svg>
                            </div>
                            <p class="t2-quote">
                                <span class="mark">“</span>I have never traded before, but the&nbsp;makes it so easy. I never thought I
                                would say this since the crypto world can be so complicated… but you do make it so easy to earn unimaginable
                                amounts!<span class="mark">”</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="stats-section section-pad" id="stats">
                <div class="container">
                    <div class="sec-head reveal">
                        <span class="eyebrow">Performance &amp; transparency</span>
                        <div class="gold-rule"></div>
                        <h2 class="stats-section-title h-lg">The numbers, presented plainly.</h2>
                        <p class="stats-section-lead lead">
                            All figures below are placeholders. Replace with verified, reportable data and dates.
                        </p>
                    </div>

                    <div class="stats-row">
                        <div class="stat-block reveal">
                            <div class="sv">53</div>
                            <div class="sl">Assets under management</div>
                        </div>
                        <div class="stat-block reveal" style="transition-delay: 0.08s">
                            <div class="sv">3999</div>
                            <div class="sl">Active members</div>
                        </div>
                        <div class="stat-block reveal" style="transition-delay: 0.16s">
                            <div class="sv">4</div>
                            <div class="sl">Years operation</div>
                        </div>
                        <div class="stat-block reveal" style="transition-delay: 0.24s">
                            <div class="sv">$170,240</div>
                            <div class="sl">Withdrawals processed</div>
                        </div>
                    </div>

                    <div class="charts-grid">
                        <div class="chart-card reveal">
                            <h3>Sample portfolio trajectory</h3>

                            <svg class="chart-svg" viewBox="0 0 520 240" width="100%" aria-hidden="true">
                                <g stroke="#E6E3D8" stroke-width="1">
                                    <line x1="0" y1="40" x2="520" y2="40"></line>
                                    <line x1="0" y1="100" x2="520" y2="100"></line>
                                    <line x1="0" y1="160" x2="520" y2="160"></line>
                                    <line x1="0" y1="220" x2="520" y2="220"></line>
                                </g>
                                <defs>
                                    <linearGradient id="cfill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0" stop-color="#C2A05A" stop-opacity=".28"></stop>
                                        <stop offset="1" stop-color="#C2A05A" stop-opacity="0"></stop>
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M10,200 C70,190 110,170 170,150 C230,130 270,135 330,100 C390,70 440,60 510,30 L510,220 L10,220 Z"
                                    fill="url(#cfill)"
                                ></path>
                                <path
                                    d="M10,200 C70,190 110,170 170,150 C230,130 270,135 330,100 C390,70 440,60 510,30"
                                    fill="none"
                                    stroke="#0A1B33"
                                    stroke-width="2.6"
                                ></path>
                                <circle cx="510" cy="30" r="5" fill="#C2A05A"></circle>
                            </svg>
                            <div class="chart-legend">
                                <span><span class="lg-dot" style="background: #0a1b33"></span>Portfolio value (sample)</span>
                            </div>
                            <p class="chart-foot">Hypothetical illustration. Not based on any specific member account.</p>
                        </div>

                        <div class="chart-card reveal" style="transition-delay: 0.1s">
                            <h3>For comparison</h3>

                            <div class="bar-row bar-row-1">
                                <span class="bl">Savings account</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="background: rgb(122, 132, 146); width: 25%">$5,890</div>
                                </div>
                            </div>
                            <div class="bar-row bar-row-2">
                                <span class="bl">1-yr Term Deposit</span>
                                <div class="bar-track">
                                    <div class="bar-fill" style="background: rgb(70, 80, 95); width: 45%">$33,780</div>
                                </div>
                            </div>
                            <div class="bar-row bar-row-3">
                                <span class="bl"> <a href="" class="brand-key"></a> </span>
                                <div class="bar-track">
                                    <div
                                        class="bar-fill"
                                        style="
                                            background: linear-gradient(90deg, rgb(194, 160, 90), rgb(228, 201, 126));
                                            color: rgb(10, 27, 51);
                                            width: 64%;
                                        "
                                    >
                                        $42,560
                                    </div>
                                </div>
                            </div>
                            <p class="chart-foot">
                                Different products carry different risk — a digital asset portfolio is not equivalent to an insured deposit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="t3-section section-pad">
                <div class="container">
                    <div class="sec-head center reveal">
                        <span class="t3-section-eyebrow eyebrow">Member voices</span>
                        <div class="gold-rule center"></div>
                        <h2 class="t3-section-title h-lg">A few more words from the community.</h2>
                    </div>
                </div>

                <div class="marquee reveal">
                    <div class="mq-row-1">
                        <div class="mq-track" id="mqTrack1">
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">JL</div>
                                    <div>
                                        <div class="nm">Jen L.</div>
                                        <div class="ci">Hobart, TAS</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I recommended it to the whole family</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-4.png" alt="Robert A." />
                                    <div>
                                        <div class="nm">Robert A.</div>
                                        <div class="ci">Adelaide, SA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>In just 2 months, I increased my income 3 times.</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-5.png" alt="Amélie D." />
                                    <div>
                                        <div class="nm">Amélie D.</div>
                                        <div class="ci">Perth, WA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Unbelievable!</p>
                            </div>

                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">JL</div>
                                    <div>
                                        <div class="nm">Jen L.</div>
                                        <div class="ci">Hobart, TAS</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I recommended it to the whole family</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">RB</div>
                                    <div>
                                        <div class="nm">Robert B.</div>
                                        <div class="ci">Adelaide, SA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Now I'm not afraid to take risks!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-5.png" alt="Amélie D." />
                                    <div>
                                        <div class="nm">Amélie D.</div>
                                        <div class="ci">Perth, WA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Unbelievable!</p>
                            </div>

                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">JL</div>
                                    <div>
                                        <div class="nm">Jen L.</div>
                                        <div class="ci">Hobart, TAS</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I recommended it to the whole family</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-4.png" alt="Robert A." />
                                    <div>
                                        <div class="nm">Robert A.</div>
                                        <div class="ci">Adelaide, SA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>In just 2 months, I increased my income 3 times.</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-5.png" alt="Amélie D." />
                                    <div>
                                        <div class="nm">Amélie D.</div>
                                        <div class="ci">Perth, WA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Unbelievable!</p>
                            </div>

                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">JL</div>
                                    <div>
                                        <div class="nm">Jen L.</div>
                                        <div class="ci">Hobart, TAS</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I recommended it to the whole family</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">RB</div>
                                    <div>
                                        <div class="nm">Robert B.</div>
                                        <div class="ci">Adelaide, SA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Now I'm not afraid to take risks!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-5.png" alt="Amélie D." />
                                    <div>
                                        <div class="nm">Amélie D.</div>
                                        <div class="ci">Perth, WA</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Unbelievable!</p>
                            </div>
                        </div>
                    </div>
                    <div class="mq-row-2">
                        <div class="mq-track" id="mqTrack2">
                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-6.png" alt="Tom W." />
                                    <div>
                                        <div class="nm">Tom W.</div>
                                        <div class="ci">Darwin, NT</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>My friend told me about this platform, I'm so glad!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">GO</div>
                                    <div>
                                        <div class="nm">Grace O.</div>
                                        <div class="ci">Sydney, NSW</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Really cool, thanks!!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">LF</div>
                                    <div>
                                        <div class="nm">Liam F.</div>
                                        <div class="ci">Cairns, QLD</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I closed the mortgage ahead of schedule!</p>
                            </div>

                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-6.png" alt="Tom W." />
                                    <div>
                                        <div class="nm">Tom W.</div>
                                        <div class="ci">Darwin, NT</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>My friend told me about this platform, I'm so glad!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">GT</div>
                                    <div>
                                        <div class="nm">Grace T.</div>
                                        <div class="ci">Sydney, NSW</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I mean, it’s the best realy</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">LF</div>
                                    <div>
                                        <div class="nm">Liam F.</div>
                                        <div class="ci">Cairns, QLD</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I closed the mortgage ahead of schedule!</p>
                            </div>

                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-6.png" alt="Tom W." />
                                    <div>
                                        <div class="nm">Tom W.</div>
                                        <div class="ci">Darwin, NT</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>My friend told me about this platform, I'm so glad!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">GO</div>
                                    <div>
                                        <div class="nm">Grace O.</div>
                                        <div class="ci">Sydney, NSW</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>Really cool, thanks!!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">LF</div>
                                    <div>
                                        <div class="nm">Liam F.</div>
                                        <div class="ci">Cairns, QLD</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I closed the mortgage ahead of schedule!</p>
                            </div>

                            <div class="mq-card">
                                <div class="mq-top">
                                    <img class="avatar sm" src="./index/testimonial-6.png" alt="Tom W." />
                                    <div>
                                        <div class="nm">Tom W.</div>
                                        <div class="ci">Darwin, NT</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>My friend told me about this platform, I'm so glad!</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">GT</div>
                                    <div>
                                        <div class="nm">Grace T.</div>
                                        <div class="ci">Sydney, NSW</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I mean, it’s the best realy</p>
                            </div>
                            <div class="mq-card">
                                <div class="mq-top">
                                    <div class="avatar sm">LF</div>
                                    <div>
                                        <div class="nm">Liam F.</div>
                                        <div class="ci">Cairns, QLD</div>
                                    </div>
                                </div>
                                <div class="stars">
                                    <svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path></svg
                                    ><svg class="star" viewBox="0 0 24 24">
                                        <path d="M12 2l3 6.5 7 .9-5 4.9 1.2 7-6.4-3.4L5.8 21l1.2-7-5-4.9 7-.9z"></path>
                                    </svg>
                                </div>
                                <p>I closed the mortgage ahead of schedule!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="final-cta section-pad">
                <div class="wrap">
                    <span class="eyebrow on-dark reveal">Get started</span>
                    <h2 class="h-xl reveal" style="color: #fff">Take a measured first step today.</h2>
                    <p class="fc-lead reveal">
                        Open your <a href="" class="brand-key"></a> account in minutes. Review the strategy, ask questions, and decide on
                        your own terms — there's no pressure to fund.
                    </p>

                    <a href="#" class="final-cta-btn btn btn-gold btn-lg reveal">Open my account</a>
                </div>
            </section>

            <footer>
                <div class="container">
                    <div class="foot-top">
                        <a href="#" class="logo">
                            <svg class="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
                                <rect x="2" y="2" width="28" height="28" rx="7" fill="none" stroke="#C2A05A" stroke-width="1.6"></rect>
                                <path
                                    d="M9 22V10l7 8 7-8v12"
                                    fill="none"
                                    stroke="#E4C97E"
                                    stroke-width="2.2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                ></path>
                            </svg>
                            <span class="brand-key"></span>
                        </a>
                        <div class="foot-cols">
                            <div class="foot-col">
                                <h4>Platform</h4>
                                <a href="#">How it works</a>
                                <a href="#">Calculator</a>
                                <a href="#">Performance</a>
                            </div>

                            <div class="foot-col">
                                <h4>Legal</h4>
                                <a href="#">Terms</a>
                                <a href="#">Privacy</a>
                                <a href="#">Risk disclosure</a>
                            </div>
                        </div>
                    </div>

                    <p class="risk-disclaimer">
                        IMPORTANT: Earnings and Legal Disclaimer. The information provided by immediatedefiniinfo (collectively ""This
                        Website"") regarding income and profits is used exclusively as an aspirational example of potential earnings. The
                        results reported in testimonials and other examples are exceptional and therefore do not guarantee that you or
                        others will achieve the same results. Individual results may vary and depend entirely on how you use
                        immediatedefiniinfo. This website is not responsible for your actions. You are solely responsible for your own
                        decisions and actions when using the products and services, and therefore you should always act with prudence and
                        caution. You agree that this website is not in any way responsible for the results derived from the use of our
                        services. We invite you to consult our Terms and Conditions to read the full version of our disclaimer and other
                        limitations. Trading can offer significant advantages but also involves the risk of partial or total loss of
                        invested capital. Therefore, you must carefully consider whether you can afford an investment. © 2025 USA REGULATION
                        NOTICE: Trading forex, CFDs, and cryptocurrencies is not regulated in the United States. Investing in
                        cryptocurrencies is not subject to supervision or regulation by US financial institutions or authorities.
                        Unregulated trading activities by US residents are considered illegal. This website does not accept clients located
                        in the United States or who hold American citizenship. This website is not responsible for the actions of clients
                        located in the United States or who hold American citizenship. Clients in the United States or with American
                        citizenship are solely responsible for their actions and decisions in using the products and services of this
                        website. In all circumstances, the choice to use the website, service, and/or software rests exclusively with the
                        user, who must comply with current laws.
                    </p>

                    <div class="foot-bottom">
                        <span>© <span id="year">2026</span> <a href="" class="brand-key"></a>. All rights reserved. </span>
                        <span>Australia · AUD</span>
                    </div>
                </div>
            </footer>

            <div class="overlay"></div>
        </main>

        <script>
            document.addEventListener("DOMContentLoaded", function () {
                const revealItems = document.querySelectorAll(".reveal");

                if ("IntersectionObserver" in window) {
                    const revealObserver = new IntersectionObserver(
                        function (entries, observer) {
                            entries.forEach(function (entry) {
                                if (!entry.isIntersecting) return;

                                entry.target.classList.add("in");
                                observer.unobserve(entry.target);
                            });
                        },
                        {
                            threshold: 0.12,
                            rootMargin: "0px 0px -40px 0px",
                        },
                    );

                    revealItems.forEach(function (item) {
                        revealObserver.observe(item);
                    });
                } else {
                    revealItems.forEach(function (item) {
                        item.classList.add("in");
                    });
                }

                const amountRange = document.getElementById("amtRange");
                const amountLabel = document.getElementById("amtLabel");
                const periodButtons = document.querySelectorAll("#periodSeg button");
                const resultValue = document.getElementById("resultValue");
                const resultGrowth = document.getElementById("resultGrowth");
                const investedValue = document.getElementById("rsInvested");
                const horizonValue = document.getElementById("rsHorizon");

                let selectedMonths = 1;

                const moneyFormatter = new Intl.NumberFormat("en-AU", {
                    style: "currency",
                    currency: "AUD",
                    maximumFractionDigits: 0,
                });

                function formatMoney(value) {
                    return moneyFormatter.format(Math.round(value));
                }

                function updateCalculator() {
                    if (!amountRange) return;

                    const amount = Number(amountRange.value);
                    const min = Number(amountRange.min);
                    const max = Number(amountRange.max);
                    const fill = ((amount - min) / (max - min)) * 100;

                    const illustrativeMonthlyRate = 3000 / 350;
                    const growth = amount * illustrativeMonthlyRate * selectedMonths;
                    const total = amount + growth;

                    amountRange.style.setProperty("--fill", fill + "%");

                    if (amountLabel) {
                        amountLabel.textContent = formatMoney(amount);
                    }

                    if (resultValue) {
                        resultValue.textContent = formatMoney(total);
                    }

                    if (resultGrowth) {
                        resultGrowth.textContent = formatMoney(growth);
                    }

                    if (investedValue) {
                        investedValue.textContent = formatMoney(amount);
                    }

                    if (horizonValue) {
                        horizonValue.textContent = selectedMonths + (selectedMonths === 1 ? " month" : " months");
                    }
                }

                amountRange?.addEventListener("input", updateCalculator);

                periodButtons.forEach(function (button) {
                    button.addEventListener("click", function () {
                        periodButtons.forEach(function (item) {
                            item.classList.remove("active");
                        });

                        button.classList.add("active");
                        selectedMonths = Number(button.dataset.months) || 1;

                        updateCalculator();
                    });
                });

                updateCalculator();

                const year = document.getElementById("year");

                if (year) {
                    year.textContent = String(new Date().getFullYear());
                }
            });
        </script>
    </body>
</html>
