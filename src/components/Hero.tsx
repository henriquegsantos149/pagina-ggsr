import { motion } from 'framer-motion';
import { Map, ShieldCheck, GraduationCap, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-brand-dark)]">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid opacity-70"></div>
      <div className="radar-scan opacity-30"></div>
      
      {/* Overlay gradient for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-brand-dark)]/80 to-[var(--color-brand-dark)] opacity-100 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
        
        {/* Badges */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mb-8"
        >
          <div className="shape-leaf flex items-center gap-2 bg-white/5 border border-[var(--color-brand-light)]/20 px-5 py-2.5 text-sm font-medium text-[var(--color-brand-light)]">
            <GraduationCap className="w-4 h-4 text-[var(--color-brand-green1)]" />
            <span>Homologado MEC (Nota 5)</span>
          </div>
          <div className="shape-leaf flex items-center gap-2 bg-white/5 border border-[var(--color-brand-light)]/20 px-5 py-2.5 text-sm font-medium text-[var(--color-brand-light)]">
            <ShieldCheck className="w-4 h-4 text-[var(--color-brand-blue)]" />
            <span>CREA/CONFEA</span>
          </div>
          <div className="shape-leaf flex items-center gap-2 bg-white/5 border border-white/20 px-5 py-2.5 text-sm font-medium text-[var(--color-brand-light)]">
            <Map className="w-4 h-4 text-[var(--color-brand-green2)]" />
            <span>Anhanguera</span>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-5xl uppercase leading-tight font-primary"
        >
          Pós-Graduação em <br className="hidden md:block" />
          <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-4 py-1 mt-2 mb-1 shape-leaf transform -skew-x-6">
            <span className="inline-block skew-x-6">Georreferenciamento, Geoprocessamento</span>
          </span> <br className="hidden md:block" />
          e Sensoriamento Remoto
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-[var(--color-brand-light)]/70 mb-10 max-w-2xl leading-relaxed font-secondary"
        >
          Capacite-se com habilidades técnicas e conhecimento legal para a prestação de serviços em Geotecnologias. Elaborada com base na Decisão Normativa 116 do CONFEA.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <a href="#inscreva-se" aria-label="Inscreva-se agora na Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto" className="shape-leaf group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-gradient text-[var(--color-brand-dark)] font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_var(--color-brand-green2)]/30">
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
          <ChevronDown className="w-8 h-8 text-[var(--color-brand-green2)] opacity-70" />
        </motion.div>

      </div>
    </section>
  );
}
