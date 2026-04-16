import { motion } from 'framer-motion';
import { GraduationCap, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black/20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-70"></div>
      
      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b0c10]/40 to-black/20 opacity-100 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16 text-center flex flex-col items-center">
        
        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-8 pointer-events-none"
        >
          {/* Ambiental Pro */}
          <img 
            src={`${import.meta.env.BASE_URL}logo-ambientalpro.png`} 
            alt="Ambiental Pro" 
            className="h-10 md:h-12 w-auto object-contain"
          />
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl sm:text-4xl md:text-7xl font-bold tracking-tight mb-6 max-w-5xl uppercase leading-tight font-primary"
        >
          Pós-Graduação em <br className="md:block" />
          <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-3 py-1 md:px-4 md:py-1 mt-2 mb-1 shape-leaf transform -skew-x-6">
            <span className="inline-block skew-x-6">Georreferenciamento, Geoprocessamento</span>
          </span> <br className="md:block" />
          e Sensoriamento Remoto
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[var(--color-brand-light)]/70 mb-8 md:mb-10 max-w-2xl leading-relaxed font-secondary"
        >
          Capacite-se com habilidades técnicas e conhecimento legal para a prestação de serviços em Geotecnologias. Elaborada com base na Decisão Normativa 116 do CONFEA.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="https://pay.voompcreators.com.br/4664/offer/9rKDRq/?utm_source=site_anhanguera" target="_blank" rel="noopener noreferrer" aria-label="Inscreva-se agora na Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto" className="shape-leaf group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-gradient text-[var(--color-brand-dark)] font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_var(--color-brand-green2)]/30">
            <span className="relative z-10 transition-colors uppercase tracking-wider font-primary">Inscreva-se Agora</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          </a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 animate-bounce"
        >
          <ChevronDown className="w-8 h-8 text-[var(--color-brand-secondary)] opacity-70" />
        </motion.div>

      </div>
    </section>
  );
}
