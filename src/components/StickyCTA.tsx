import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

interface StickyCTAProps {
  onOpenModal: () => void;
}

export default function StickyCTA({ onOpenModal }: StickyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past 80% of the window height (after Hero)
      if (window.scrollY > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger initially in case page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto z-50 pointer-events-none flex justify-center md:justify-end">
      <motion.button
        onClick={onOpenModal}
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ 
          scale: isVisible ? 1 : 0, 
          opacity: isVisible ? 1 : 0,
          y: isVisible ? 0 : 50
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`${isVisible ? 'pointer-events-auto' : 'pointer-events-none'} w-full sm:w-auto flex items-center justify-center gap-3 bg-brand-gradient text-[var(--color-brand-dark)] px-5 py-3.5 sm:px-6 sm:py-4 shape-leaf shadow-[0_10px_30px_rgba(59,162,217,0.3)] group relative overflow-hidden cursor-pointer`}
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
        
        <div className="relative z-10 flex items-center gap-2 md:gap-3">
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
          <span className="font-primary font-extrabold uppercase tracking-wider text-sm sm:text-base md:text-lg">
            Matricule-se Agora
          </span>
        </div>

        {/* Outer pulse effect */}
        <div className="absolute inset-0 rounded-full bg-brand-gradient opacity-20 animate-ping -z-10 scale-150"></div>
      </motion.button>
    </div>
  );
}
