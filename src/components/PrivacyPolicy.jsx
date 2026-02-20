import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicy({ onBack }) {
    return (
        <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute top-1/3 left-1/3 w-[420px] h-[420px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/3 w-[320px] h-[320px] rounded-full bg-purple-500/[0.05] blur-[80px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="glass max-w-2xl w-full p-8 sm:p-12 flex flex-col gap-6 relative z-10"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20">
                        <ShieldCheck size={22} className="text-cyan-300" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                        Privacy Policy
                    </h1>
                </div>

                {/* Body */}
                <p className="text-sm sm:text-base leading-relaxed text-white/60">
                    At Two Lives Chess, we value your privacy. This website uses Google
                    AdSense to display advertisements. Google uses cookies to serve ads
                    based on your visits to our website. You may opt out of personalized
                    advertising in your Google settings. We do not collect personal chess
                    data.
                </p>

                {/* Back button */}
                <button
                    onClick={onBack}
                    className="glass-sm self-start flex items-center gap-2 px-5 py-2.5 text-sm text-white/60 hover:text-white transition-colors mt-2"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </button>
            </motion.div>
        </section>
    );
}
