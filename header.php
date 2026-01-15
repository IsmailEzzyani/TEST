<?php
// Security Headers
header("X-Frame-Options: DENY");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");
?>
<!DOCTYPE html>
<html lang="en" data-theme="dark">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="PRAC unifies sending, receiving and converting money into one secure, global wallet. Instant transfers, live FX, and transparent pricing.">
    <meta name="keywords" content="money transfer, currency exchange, global wallet, fintech, PRAC">
    <meta name="author" content="PRAC">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://prac.com/">
    <meta property="og:title" content="PRAC — Borderless money made simple">
    <meta property="og:description" content="PRAC unifies sending, receiving and converting money into one secure, global wallet.">
    <meta property="og:image" content="assets/img/og-image.jpg">

    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="https://prac.com/">
    <meta property="twitter:title" content="PRAC — Borderless money made simple">
    <meta property="twitter:description" content="PRAC unifies sending, receiving and converting money into one secure, global wallet.">
    <meta property="twitter:image" content="assets/img/og-image.jpg">

    <link rel="icon" type="image/png" href="assets/img/favicon.png">
    <title>PRAC — Borderless money made simple</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <!-- Scroll Progress Indicator -->
    <div class="scroll-indicator" id="scrollProgress"></div>

    <!-- Animated Background Particles -->
    <div class="bg-particles" id="particles"></div>

    <!-- NAV -->
    <header class="nav" id="mainHeader">
        <div class="container nav-inner">
            <a class="logo" href="#top" aria-label="PRAC home">
                <div class="logo-mark" aria-hidden="true">P</div>
                <div class="logo-text">PRAC</div>
            </a>

            <nav class="main-nav" id="mainNav" aria-label="Main navigation">
                <a data-i18n="nav.features" href="#features">Features</a>
                <a data-i18n="nav.live" href="#live-exchange">Live exchange</a>
                <a data-i18n="nav.usecases" href="#usecases">Use cases</a>
                <a data-i18n="nav.security" href="#security">Security</a>
                <a class="btn ghost" data-i18n="nav.login" href="login.html">Log in</a>
                <a class="btn primary" data-i18n="nav.getStarted" href="signup.html">Get started</a>
            </nav>

            <div class="nav-actions">
                <!-- THEME TOGGLE BUTTON -->
                <button id="themeToggle" class="btn ghost toggle-btn" type="button" aria-label="Toggle theme">
                    🌙 Dark
                </button>
                <!-- LANGUAGE SELECTOR DROPDOWN -->
                <div class="lang-selector">
                    <button id="langBtn" class="lang-btn" type="button" aria-label="Select language">
                        <span class="lang-flag" id="langFlag">🇺🇸</span>
                        <span id="langCode">EN</span>
                        <span style="font-size: 10px; margin-left: 4px;">▼</span>
                    </button>
                    <div class="lang-dropdown" id="langDropdown">
                        <div class="lang-search">
                            <input type="text" class="lang-search-input" id="langSearch"
                                placeholder="Search language..." autocomplete="off">
                        </div>
                        <div class="lang-list" id="langList"></div>
                    </div>
                </div>
                <button id="menuBtn" class="menu-btn" aria-label="Toggle menu" type="button">☰</button>
            </div>
        </div>
    </header>