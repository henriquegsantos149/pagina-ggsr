import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function StickyCTA() {
  const checkoutUrl = "https://pay.voompcreators.com.br/12211";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <motion.a
        href={checkoutUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto flex items-center gap-3 bg-brand-gradient text-[var(--color-brand-dark)] px-4 py-3 md:px-6 md:py-4 shape-leaf shadow-[0_10px_30px_rgba(88,174,105,0.4)] group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        
        <div className="relative z-10 flex items-center gap-2 md:gap-3">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          <span className="font-primary font-extrabold uppercase tracking-wider text-base md:text-lg">
            Matricule-se Agora
          </span>
        </div>

        {/* Outer pulse effect */}
        <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-20 animate-ping -z-10 scale-150"></div>
      </motion.a>
    </div>
  );
}
