import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function PrivacyPolicy({ onBack }) {
    return (
        <section className="min-h-screen flex flex-col items-center px-6 py-20">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/3 w-[320px] h-[320px] rounded-full bg-purple-500/[0.05] blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass max-w-3xl w-full p-8 sm:p-12 flex flex-col gap-10 relative z-10"
            >
                {/* ── Page Header ─────────────────────────── */}
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                        <ShieldCheck size={24} className="text-cyan-300" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-xs text-white/30 mt-1">
                            Last updated: March 2, 2026
                        </p>
                    </div>
                </div>

                <motion.p custom={0} initial="hidden" animate="visible" variants={fadeUp}
                    className="text-sm sm:text-base leading-relaxed text-white/60"
                >
                    At <strong className="text-white/80">Two Lives Chess</strong> (also known
                    as <em>Invisible Chess: Master Void</em>), your privacy is a core
                    priority. This policy explains what data we collect — and, just as
                    importantly, what we <strong className="text-white/80">don't</strong> collect — when you use our
                    application.
                </motion.p>

                {/* ══════════════════════════════════════════
                    SECTION 1 — Data Collection
                   ══════════════════════════════════════════ */}
                <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <h2 className="guide-heading mb-3">1. Data Collection</h2>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        Two Lives Chess is a <strong className="text-white/80">client-side application</strong>.
                        We do <strong className="text-white/80">not</strong> store personal user data, chess games,
                        or board photos on our servers. All game logic — including AI opponent
                        moves (Stockfish) — runs entirely in your browser via WebAssembly.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        When you use the <strong className="text-white/80">AI Vision / Import Game</strong> feature,
                        photos of your chess board are sent directly from your browser to
                        the <strong className="text-white/80">Google Gemini API</strong> for real-time processing.
                        The image is converted to a board position (FEN string) and immediately
                        discarded — it is never saved, cached, or transmitted to any other
                        service. We do not have access to these images at any point.
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════
                    SECTION 2 — Cookies & Third-Party Services
                   ══════════════════════════════════════════ */}
                <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <h2 className="guide-heading mb-3">2. Cookies & Third-Party Services</h2>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        Our website uses the following third-party services that may place
                        cookies on your device:
                    </p>

                    <ul className="mt-3 flex flex-col gap-2.5 text-sm sm:text-base text-white/55 pl-5 list-disc marker:text-cyan-500/50">
                        <li>
                            <strong className="text-white/75">Google AdSense</strong> — serves
                            advertisements on our pages. Google may use cookies to personalize
                            the ads you see based on your browsing history. You can learn more
                            about how Google manages ad data at{' '}
                            <a
                                href="https://policies.google.com/technologies/ads"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400/80 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                            >
                                Google's Advertising Policies
                            </a>.
                        </li>
                        <li>
                            <strong className="text-white/75">Vercel Analytics</strong> — provides
                            privacy-friendly, aggregated website analytics. Vercel Analytics
                            collects anonymous usage data (page views, visitor counts) to help
                            us understand traffic patterns. It does not use cookies for
                            cross-site tracking and does not collect personally identifiable
                            information.
                        </li>
                    </ul>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        You can manage or disable cookies at any time through your browser
                        settings. Please note that disabling cookies may affect the
                        functionality of certain third-party features such as personalized
                        advertising.
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════
                    SECTION 3 — Camera Usage
                   ══════════════════════════════════════════ */}
                <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <h2 className="guide-heading mb-3">3. Camera & Photo Access</h2>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        Two Lives Chess may request access to your device's camera or photo
                        library. This permission is used <strong className="text-white/80">solely</strong> for
                        the <strong className="text-white/80">Import Game</strong> feature, which allows you to
                        scan a physical chess board and convert it into a digital position.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        Camera access is entirely optional and is never activated without your
                        explicit consent. Captured images are processed in real time via the
                        Google Gemini API and are <strong className="text-white/80">never stored, uploaded to our
                            servers, or shared with any third party</strong> beyond the necessary
                        API call.
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════
                    SECTION 4 — GDPR & European Users
                   ══════════════════════════════════════════ */}
                <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <h2 className="guide-heading mb-3">4. Your Rights (GDPR — European Users)</h2>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        If you are located in the European Economic Area (EEA), you are
                        entitled to the following rights under the General Data Protection
                        Regulation (GDPR):
                    </p>

                    <ul className="mt-3 flex flex-col gap-2 text-sm sm:text-base text-white/55 pl-5 list-disc marker:text-cyan-500/50">
                        <li>
                            <strong className="text-white/75">Right to consent</strong> — You
                            will be shown a consent banner (powered by Google's Consent
                            Management Platform) before any non-essential cookies are set. You
                            may accept or reject personalized advertising at any time.
                        </li>
                        <li>
                            <strong className="text-white/75">Right to access & deletion</strong> — Since
                            we do not store personal data on our servers, there is no personal
                            data to request or delete. Cookie-based data can be cleared via
                            your browser settings.
                        </li>
                        <li>
                            <strong className="text-white/75">Right to object</strong> — You may
                            opt out of personalized ads at any time through{' '}
                            <a
                                href="https://adssettings.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400/80 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                            >
                                Google Ad Settings
                            </a>{' '}
                            or by adjusting your cookie preferences in the consent banner.
                        </li>
                    </ul>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        For further information about Google's compliance with GDPR and their
                        Consent Management Platform, visit{' '}
                        <a
                            href="https://www.google.com/about/company/consenthelptext"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400/80 underline underline-offset-2 hover:text-cyan-300 transition-colors"
                        >
                            Google's CMP Help Center
                        </a>.
                    </p>
                </motion.div>

                {/* ── Contact ─────────────────────────────── */}
                <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <h2 className="guide-heading mb-3">5. Contact</h2>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        If you have any questions or concerns about this privacy policy,
                        please reach out to us through our project's official channels. We are
                        committed to transparency and will address any privacy-related
                        inquiries promptly.
                    </p>
                </motion.div>

                {/* ── Back Button ─────────────────────────── */}
                <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
                    <button
                        onClick={onBack}
                        className="glass-sm self-start flex items-center gap-2 px-5 py-2.5 text-sm text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}
