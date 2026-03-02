import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Sparkles, Camera, Brain, GitBranch, Layers, Zap } from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function GuideAbout({ onBack }) {
    return (
        <section className="min-h-screen flex flex-col items-center px-6 py-20">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.05] blur-[120px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.06] blur-[100px]" />
                <div className="absolute top-2/3 left-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/[0.04] blur-[80px]" />
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
                        <BookOpen size={24} className="text-cyan-300" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Guide & About
                    </h1>
                </div>

                {/* ══════════════════════════════════════════
                    SECTION 1 — About the Project
                   ══════════════════════════════════════════ */}
                <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <div className="flex items-center gap-2.5 mb-4">
                        <Sparkles size={18} className="text-cyan-400" />
                        <h2 className="guide-heading">About the Project</h2>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        <strong className="text-white/80">Invisible Chess: Master Void</strong> — marketed under
                        the brand <strong className="text-white/80">Two Lives Chess</strong> — is an indie passion
                        project designed, developed, and maintained by a solo developer. Born from a love of chess
                        and modern interface design, the application reimagines how players study positions by
                        introducing a revolutionary <em>branching-timeline</em> mechanic that allows you to explore
                        two parallel futures simultaneously.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        The mission is simple yet ambitious: <strong className="text-white/80">to revolutionize chess
                            visualization using modern AI and branching timeline mechanics</strong>. Rather than forcing
                        players to rewind an engine line and mentally reconstruct a position, Two Lives Chess lets you
                        split the board at any critical moment and play out both candidate moves side by side — giving
                        you an instant, visual understanding of every consequence.
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════
                    SECTION 2 — How to Play: Split Life
                   ══════════════════════════════════════════ */}
                <motion.div custom={1} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <div className="flex items-center gap-2.5 mb-4">
                        <GitBranch size={18} className="text-cyan-400" />
                        <h2 className="guide-heading">How to Play — The Split Life Mechanic</h2>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mb-4">
                        The <strong className="text-white/80">Split Life</strong> mechanic is the heart of Two Lives Chess.
                        It lets you branch the game at any position and explore two completely independent lines of play
                        at the same time. Here's how it works, step by step:
                    </p>

                    <div className="flex flex-col gap-3">
                        <div className="guide-step">
                            <span className="guide-step-num">1</span>
                            <div>
                                <strong className="text-white/80">Reach a critical position.</strong>
                                <span className="text-white/50"> Play your game normally until you hit a fork — a moment
                                    where two candidate moves look equally promising (or dangerous).</span>
                            </div>
                        </div>

                        <div className="guide-step">
                            <span className="guide-step-num">2</span>
                            <div>
                                <strong className="text-white/80">Tap "Split Life."</strong>
                                <span className="text-white/50"> The button clones the current board state. Two boards
                                    appear side by side — one wrapped in a <span className="text-cyan-400 font-semibold">Cyan</span> border
                                    (Life A) and the other in a <span className="text-fuchsia-400 font-semibold">Magenta</span> border (Life B).</span>
                            </div>
                        </div>

                        <div className="guide-step">
                            <span className="guide-step-num">3</span>
                            <div>
                                <strong className="text-white/80">Play different moves on each board.</strong>
                                <span className="text-white/50"> Try your first candidate move on the Cyan timeline and
                                    your second candidate on the Magenta timeline. Each board runs its own independent Stockfish
                                    engine, so the AI responds to each line separately.</span>
                            </div>
                        </div>

                        <div className="guide-step">
                            <span className="guide-step-num">4</span>
                            <div>
                                <strong className="text-white/80">Compare outcomes.</strong>
                                <span className="text-white/50"> After a few moves you can visually compare the resulting
                                    positions. Which line gives you a better pawn structure? Where is your king safer? The
                                    parallel view makes the answer obvious at a glance.</span>
                            </div>
                        </div>

                        <div className="guide-step">
                            <span className="guide-step-num">5</span>
                            <div>
                                <strong className="text-white/80">Merge back (optional).</strong>
                                <span className="text-white/50"> Once you've decided which line you prefer, tap "Merge Back"
                                    to return to a single board and continue from the original position. The knowledge you
                                    gained from both timelines stays with you.</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ══════════════════════════════════════════
                    SECTION 3 — AI Vision / Import Game
                   ══════════════════════════════════════════ */}
                <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <div className="flex items-center gap-2.5 mb-4">
                        <Camera size={18} className="text-cyan-400" />
                        <h2 className="guide-heading">AI Vision — Import a Game from a Photo</h2>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        Ever wanted to quickly analyze a position from a book, a tournament broadcast, or your own
                        over-the-board game? The <strong className="text-white/80">AI Vision</strong> feature makes that
                        effortless. Take a photo of any physical chess board, upload it into Two Lives Chess, and
                        let <strong className="text-white/80">Google Gemini 1.5 Flash</strong> do the rest.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        Behind the scenes, the image is converted to a Base64 string and sent to the Gemini multimodal
                        API with a carefully crafted prompt. The AI identifies each piece, maps it to its square, and
                        returns a valid <strong className="text-white/80">FEN (Forsyth–Edwards Notation)</strong> string —
                        the standard way to describe a chess position. The board instantly loads with the recognized
                        position, ready for you to play, split, or analyze.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        If the image is unclear or the AI cannot parse it confidently, a friendly toast notification lets
                        you know so you can try again with a better photo. All processing happens through a direct API
                        call — no backend server, no data stored — keeping things fast and private.
                    </p>
                </motion.div>

                {/* ══════════════════════════════════════════
                    SECTION 4 — Chess Strategy Tips
                   ══════════════════════════════════════════ */}
                <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="guide-section">
                    <div className="flex items-center gap-2.5 mb-4">
                        <Brain size={18} className="text-cyan-400" />
                        <h2 className="guide-heading">Chess Strategy Tips — Why Branching Beats Rewinding</h2>
                    </div>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60">
                        Traditional chess engines offer a single, linear analysis line. When you want to compare two
                        candidate moves you have to play one, study it, undo all the moves, play the other, and then
                        mentally reconstruct how the two lines differed. This is <em>cognitively expensive</em> — it
                        overloads your working memory and makes it easy to confuse the positions.
                    </p>
                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-3">
                        <strong className="text-white/80">Branching analysis</strong> eliminates that friction entirely.
                        By placing two diverging timelines side by side you can:
                    </p>

                    <ul className="mt-3 flex flex-col gap-2 text-sm sm:text-base text-white/55 pl-5 list-disc marker:text-cyan-500/50">
                        <li>
                            <strong className="text-white/75">See structural differences instantly.</strong> Pawn
                            structures, piece activity, and king safety are visible at the same time — no mental
                            juggling required.
                        </li>
                        <li>
                            <strong className="text-white/75">Build intuition faster.</strong> Pattern recognition
                            thrives on comparison. Seeing two outcomes together wires your brain to spot the
                            consequences of a move more quickly in future games.
                        </li>
                        <li>
                            <strong className="text-white/75">Reduce analysis errors.</strong> When you rewind and
                            replay, it's easy to accidentally deviate from the original line. With branching, each
                            timeline is independent and immutable until you decide to merge.
                        </li>
                        <li>
                            <strong className="text-white/75">Train candidate-move discipline.</strong> Strong players
                            always identify at least two candidate moves before choosing. The Split Life mechanic
                            makes this practice habitual and visual, reinforcing one of the most important skills in
                            competitive chess.
                        </li>
                    </ul>

                    <p className="text-sm sm:text-base leading-relaxed text-white/60 mt-4">
                        Whether you're a beginner learning to evaluate positions or an advanced player preparing an
                        opening repertoire, branching analysis gives you a cognitive shortcut that traditional tools
                        simply cannot match. Try it — split the board at your next critical decision, and watch how
                        much clearer the answer becomes.
                    </p>
                </motion.div>

                {/* ── Back Button ─────────────────────────── */}
                <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
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
