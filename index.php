<?php include 'includes/header.php'; ?>

<!-- HERO -->
<main id="top">
    <section class="hero">
        <div class="container hero-grid">
            <!-- LEFT -->
            <div>
                <div class="pill" data-i18n="hero.pill">⚡ Real-time FX with transparent rates</div>
                <h1 class="fade-up" data-i18n="hero.title">
                    Borderless money <span class="accent">made simple</span>
                </h1>
                <p class="lead fade-up" style="transition-delay:.08s" data-i18n="hero.lead">
                    PRAC unifies sending, receiving and converting money into one secure, global wallet.
                    Instant transfers, live FX, and transparent pricing—built for a modern, international life.
                </p>

                <div class="cta-row fade-up" style="transition-delay:.16s">
                    <a class="btn primary large" href="signup.html" data-i18n="hero.primaryCta">Create your wallet →</a>
                    <a class="btn ghost" href="#features" data-i18n="hero.secondaryCta">Explore features</a>
                </div>

                <div class="stats fade-up" style="margin-top:12px; transition-delay:.24s">
                    <div class="stat">
                        <div style="font-size:12px;color:var(--muted);margin-bottom:4px"
                            data-i18n="hero.statSpeedLabel">Transfer speed</div>
                        <div style="font-weight:800;font-size:16px" data-i18n="hero.statSpeedValue">Instant</div>
                    </div>
                    <div class="stat">
                        <div style="font-size:12px;color:var(--muted);margin-bottom:4px"
                            data-i18n="hero.statCurrenciesLabel">Currencies</div>
                        <div style="font-weight:800;font-size:16px" data-i18n="hero.statCurrenciesValue">50+ wallets
                        </div>
                    </div>
                    <div class="stat">
                        <div style="font-size:12px;color:var(--muted);margin-bottom:4px" data-i18n="hero.statFeesLabel">
                            Fees</div>
                        <div style="font-weight:800;font-size:16px" data-i18n="hero.statFeesValue">Transparent</div>
                    </div>
                </div>
            </div>

            <!-- RIGHT (card) -->
            <div class="card-wrap">
                <div class="glow-orb" aria-hidden="true"></div>

                <div class="card card-anim" id="floatingCard" role="img" aria-label="animated card">
                    <div class="dot-mesh" aria-hidden="true"></div>
                    <div class="shine" aria-hidden="true"></div>
                    <div class="neon-rim" aria-hidden="true"></div>

                    <div class="card-content">
                        <div>
                            <div class="card-header">
                                <div class="chip" aria-hidden="true">P</div>
                                <div>
                                    <div style="font-weight:700;font-size:16px" data-i18n="card.title">PRAC Wallet</div>
                                    <div style="font-size:13px;color:var(--muted)" data-i18n="card.subtitle">USD •
                                        Primary</div>
                                </div>
                            </div>

                            <div class="card-body">
                                <div
                                    style="display:flex;justify-content:space-between;align-items:center;margin-top:28px">
                                    <div>
                                        <div style="color:var(--muted);font-size:13px;margin-bottom:8px"
                                            data-i18n="card.balanceLabel">Balance</div>
                                        <div class="amount">$ <span id="balanceAmount">12,430</span></div>
                                    </div>
                                    <div style="text-align:right">
                                        <div style="color:var(--muted);font-size:13px;margin-bottom:8px"
                                            data-i18n="card.fxLabel">FX rate</div>
                                        <div style="font-weight:700;font-size:15px" id="fxRate">1 USD → 0.93 EUR</div>
                                    </div>
                                </div>

                                <div style="margin-top:28px;color:var(--muted);font-size:13px;line-height:1.5"
                                    data-i18n="card.recent">
                                    Recent: Received 500 USD • Sent 200 USD • Exchanged 120 USD
                                </div>
                            </div>
                        </div>

                        <div class="card-footer">
                            <div style="font-size:13px" data-i18n="card.footer">⚡ Instant transfers</div>
                            <div style="display:flex;gap:10px;align-items:center">
                                <button class="btn ghost" type="button" onclick="simulateTransfer()"
                                    style="padding:8px 14px;font-size:14px" data-i18n="card.send">Send</button>
                                <button class="btn primary" type="button" onclick="simulateReceive()"
                                    style="padding:8px 14px;font-size:14px" data-i18n="card.receive">Receive</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </section>

    <!-- ONE WALLET SECTION -->
    <section class="section">
        <div class="container">
            <div class="divider"></div>
            <h2 class="section-title fade-up" data-i18n="onewallet.title">One wallet. Every border.</h2>
            <p class="subtitle fade-up" style="transition-delay:.06s" data-i18n="onewallet.subtitle">
                Move money at the speed of the internet with a platform that's faster than banks, cheaper than exchange
                books, and simpler than multiple accounts.
            </p>

            <div class="grid-3">
                <div class="feature fade-up">
                    <strong data-i18n="onewallet.f1Title">⚡ Instant PRAC-to-PRAC</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="onewallet.f1Body">
                        Send and receive money worldwide in seconds with zero friction between PRAC users.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.08s">
                    <strong data-i18n="onewallet.f2Title">🔒 Security by design</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="onewallet.f2Body">
                        Encryption, fraud detection, and dispute management keep your funds protected 24/7.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.16s">
                    <strong data-i18n="onewallet.f3Title">💱 Real-time conversion</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="onewallet.f3Body">
                        Live FX rates with full price transparency. Convert only what you need—no hidden spreads.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="section">
        <div class="container">
            <h2 class="section-title fade-up" data-i18n="features.title">Features built for you</h2>
            <div class="grid-3">
                <div class="feature fade-up">
                    <strong data-i18n="features.f1Title">🚀 Fast Transfers</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="features.f1Body">
                        Move money internationally in seconds with competitive FX rates.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.08s">
                    <strong data-i18n="features.f2Title">🌍 Multiple Wallets</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="features.f2Body">
                        Hold balances in 50+ currencies and switch instantly between them.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.16s">
                    <strong data-i18n="features.f3Title">💎 Transparent Fees</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="features.f3Body">
                        No hidden charges—see live FX and fees before you send.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- LIVE EXCHANGE -->
    <section id="live-exchange" class="section">
        <div class="container">
            <h2 class="section-title fade-up" data-i18n="live.title">Live exchange rates</h2>
            <p class="subtitle fade-up" style="transition-delay:.06s" data-i18n="live.subtitle">
                Real-time currency rates updated every second. What you see is what you get.
            </p>
            <div style="display:flex;gap:16px;flex-wrap:wrap">
                <div class="feature fade-up" style="min-width:180px;flex:1">
                    <div style="font-size:13px;color:var(--muted);margin-bottom:8px">USD → EUR</div>
                    <div style="font-weight:800;font-size:24px;background:linear-gradient(90deg,#00d4ff,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent"
                        id="rate-usd-eur">0.93</div>
                    <div style="font-size:12px;color:var(--muted);margin-top:6px" data-i18n="live.updated">Updated live
                    </div>
                </div>
                <div class="feature fade-up" style="min-width:180px;flex:1;transition-delay:.08s">
                    <div style="font-size:13px;color:var(--muted);margin-bottom:8px">USD → GBP</div>
                    <div style="font-weight:800;font-size:24px;background:linear-gradient(90deg,#00d4ff,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent"
                        id="rate-usd-gbp">0.79</div>
                    <div style="font-size:12px;color:var(--muted);margin-top:6px" data-i18n="live.updated">Updated live
                    </div>
                </div>
                <div class="feature fade-up" style="min-width:180px;flex:1;transition-delay:.16s">
                    <div style="font-size:13px;color:var(--muted);margin-bottom:8px">USD → MAD</div>
                    <div style="font-weight:800;font-size:24px;background:linear-gradient(90deg,#00d4ff,#7c3aed);-webkit-background-clip:text;background-clip:text;color:transparent"
                        id="rate-usd-mad">10.25</div>
                    <div style="font-size:12px;color:var(--muted);margin-top:6px" data-i18n="live.updated">Updated live
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- USE CASES -->
    <section id="usecases" class="section">
        <div class="container">
            <h2 class="section-title fade-up" data-i18n="usecases.title">Built for borderless living</h2>
            <p class="subtitle fade-up" style="transition-delay:.06s" data-i18n="usecases.subtitle">
                For freelancers, travelers, remote workers and businesses operating across borders.
            </p>

            <div class="grid-3">
                <div class="feature fade-up">
                    <strong data-i18n="usecases.f1Title">💼 Multi-currency wallet</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="usecases.f1Body">
                        Hold, manage, and execute business transactions in 50+ currencies from one global wallet.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.08s">
                    <strong data-i18n="usecases.f2Title">📊 Track in real time</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="usecases.f2Body">
                        Instant notifications and live transaction tracking for complete peace of mind.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.16s">
                    <strong data-i18n="usecases.f3Title">🏢 Business tools</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="usecases.f3Body">
                        Invoice clients globally and get paid into local currencies with ease.
                    </p>
                </div>
            </div>

            <div class="grid-3" style="margin-top:20px">
                <div class="feature fade-up">
                    <strong data-i18n="usecases.f4Title">✈️ For Travelers</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="usecases.f4Body">
                        Convert currency when you need it and avoid surprise fees abroad.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.08s">
                    <strong data-i18n="usecases.f5Title">💻 Remote Workers</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="usecases.f5Body">
                        Receive salaries from foreign employers and withdraw to local currency easily.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.16s">
                    <strong data-i18n="usecases.f6Title">🏭 Businesses</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="usecases.f6Body">
                        Pay suppliers worldwide at low cost and track every transaction in real time.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- SECURITY -->
    <section id="security" class="section">
        <div class="container">
            <div class="divider"></div>
            <h2 class="section-title fade-up" data-i18n="security.title">Security, compliance, trust</h2>
            <p class="subtitle fade-up" style="transition-delay:.06s" data-i18n="security.subtitle">
                Every transfer is protected with bank-grade encryption, rigorous monitoring, and layered fraud
                prevention. Dispute management gives you confidence when something needs attention.
            </p>

            <div class="grid-3">
                <div class="feature fade-up">
                    <strong data-i18n="security.f1Title">✓ Verified transfers</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="security.f1Body">
                        Every transaction is verified and encrypted with industry-leading security.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.08s">
                    <strong data-i18n="security.f2Title">🌐 Global coverage</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="security.f2Body">
                        Cross-border support with local payout options where available.
                    </p>
                </div>
                <div class="feature fade-up" style="transition-delay:.16s">
                    <strong data-i18n="security.f3Title">🔐 Privacy & controls</strong>
                    <p style="color:var(--muted);margin-top:12px;line-height:1.6" data-i18n="security.f3Body">
                        Role-based access, secure authentication, and complete audit trails.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CALL TO ACTION -->
    <section class="section"
        style="background:linear-gradient(135deg,rgba(124,58,237,0.05),rgba(0,212,255,0.05));border-radius:24px;margin:0 20px">
        <div class="container"
            style="display:flex;align-items:center;justify-content:space-between;gap:32px;flex-wrap:wrap;padding:48px 32px">
            <div>
                <h3 style="font-size:28px;margin-bottom:12px;font-weight:800" data-i18n="cta.title">Ready to move money
                    across borders?</h3>
                <div style="color:var(--muted);font-size:17px" data-i18n="cta.subtitle">Create a PRAC wallet and start
                    sending instantly—no fees for your first month.</div>
            </div>
            <div>
                <a class="btn primary large" href="signup.html" style="white-space:nowrap" data-i18n="cta.button">Get
                    started—it's free →</a>
            </div>
        </div>
    </section>

</main>

<?php include 'includes/footer.php'; ?>