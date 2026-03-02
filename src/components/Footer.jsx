export default function Footer({ onPrivacy, onGuide }) {
    return (
        <footer className="w-full py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs text-white/25 tracking-wide">
                    © {new Date().getFullYear()} Two Lives Chess
                </span>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onGuide}
                        className="text-xs text-white/30 hover:text-cyan-400 transition-colors underline underline-offset-2 decoration-white/10 hover:decoration-cyan-400/40"
                    >
                        Learn More
                    </button>
                    <button
                        onClick={onPrivacy}
                        className="text-xs text-white/30 hover:text-cyan-400 transition-colors underline underline-offset-2 decoration-white/10 hover:decoration-cyan-400/40"
                    >
                        Privacy Policy
                    </button>
                </div>
            </div>
        </footer>
    );
}
