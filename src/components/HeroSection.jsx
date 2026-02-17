import { motion } from 'framer-motion';
import { GitBranch, Layers, Zap } from 'lucide-react';

const features = [
    { icon: GitBranch, title: 'Real-time Branching', desc: 'Split any position into two timelines and compare outcomes side by side.' },
    { icon: Layers, title: 'Glossy 3D Board', desc: 'A crystal-clear board wrapped in glass, designed for focus and beauty.' },
    { icon: Zap, title: 'Instant Analysis', desc: 'Play both moves instantly — no rewinding, no guessing, just clarity.' },
];

const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function HeroSection({ onStart }) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center overflow-hidden">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/[0.07] blur-[100px]" />
            </div>

            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-sm inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold uppercase tracking-widest text-cyan-300"
            >
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Chess Reimagined
            </motion.div>

            {/* Headline */}
            <motion.h1
                custom={0}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight max-w-4xl"
            >
                One Game.{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Two Lives.
                </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
                custom={1}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="mt-6 text-lg sm:text-xl text-white/50 max-w-2xl leading-relaxed"
            >
                Don't just guess the outcome.{' '}
                <span className="text-white/80 font-medium">Play both timelines instantly.</span>
            </motion.p>

            {/* CTA */}
            <motion.div custom={2} initial="hidden" animate="visible" variants={fadeUp} className="mt-10">
                <button onClick={onStart} className="btn-glow text-base px-8 py-3.5">
                    Start Playing
                </button>
            </motion.div>

            {/* Feature cards */}
            <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl w-full">
                {features.map(({ icon: Icon, title, desc }, i) => (
                    <motion.div
                        key={title}
                        custom={i + 3}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        className="glass p-6 flex flex-col items-center text-center gap-3 hover:bg-white/[0.06] transition-colors"
                    >
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                            <Icon size={22} className="text-cyan-300" />
                        </div>
                        <h3 className="font-semibold text-sm">{title}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
