import { motion } from 'framer-motion';

export default function AdSlot({ className = '' }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`w-full flex justify-center ${className}`}
        >
            <div
                className="
          relative overflow-hidden
          w-[320px] h-[50px]
          sm:w-[728px] sm:h-[90px]
          rounded-xl
          flex items-center justify-center
          border border-white/[0.08]
          cursor-default
          select-none
        "
                style={{
                    background:
                        'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(34,211,238,0.03) 50%, rgba(168,85,247,0.04) 100%)',
                    backdropFilter: 'blur(16px) saturate(1.4)',
                    WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
                    boxShadow:
                        '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
            >
                {/* Glossy shine line */}
                <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
                    }}
                />

                {/* Ad label */}
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/20">
                    Advertisement
                </span>

                {/* Bottom shine */}
                <div
                    className="absolute inset-x-0 bottom-0 h-px"
                    style={{
                        background:
                            'linear-gradient(90deg, transparent, rgba(34,211,238,0.08), transparent)',
                    }}
                />
            </div>
        </motion.div>
    );
}
