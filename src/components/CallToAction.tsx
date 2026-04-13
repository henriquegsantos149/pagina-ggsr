import { motion } from 'framer-motion';
import { ArrowRight, Globe2 } from 'lucide-react';

export default function CallToAction() {
  return (
    <section id="inscreva-se" className="py-24 relative overflow-hidden bg-[var(--color-brand-dark)] border-t border-white/5">
      
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,174,105,0.15)_0%,rgba(1,4,4,1)_70%)] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="shape-leaf bg-black/50 border border-[var(--color-brand-green2)]/30 p-12 md:p-20 shadow-[0_0_50px_rgba(88,174,105,0.05)] relative overflow-hidden backdrop-blur-sm"
        >
          {/* subtle glowing lines to represent "tech" limits */}
          <div className="absolute top-0 left-0 w-full height-[2px] bg-brand-gradient opacity-50"></div>
          
          {/* subtle moving element */}
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.03]">
            <Globe2 className="w-64 h-64" />
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-[var(--color-brand-light)] relative z-10 font-primary uppercase tracking-wide leading-tight">
            Pronto para dar o <br/>
            <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-4 py-2 mt-3 shape-leaf transform -skew-x-6"><span className="inline-block transform skew-x-6">Próximo Passo?</span></span>
          </h2>
          
          <p className="text-xl text-[var(--color-brand-light)]/70 mb-12 max-w-3xl mx-auto relative z-10 font-secondary mt-6">
            Junte-se à próxima turma e torne-se um especialista certificado apto para atuar em projetos de impacto em Georreferenciamento e Geoprocessamento.
          </p>
          
          <div className="relative z-10 space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:gap-6">
            <a 
              href="#whatsapp" 
              className="shape-leaf group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand-gradient text-[var(--color-brand-dark)] font-bold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 w-full sm:w-auto shadow-[0_0_30px_rgba(111,176,58,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2 uppercase tracking-wide font-primary">
                Inscreva-se Agora
                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            </a>
            
            <a 
              href="#ementa" 
              className="shape-leaf-inverse inline-flex items-center justify-center gap-2 px-10 py-5 bg-transparent border border-white/20 text-[var(--color-brand-light)] font-bold text-lg transition-all hover:bg-white/5 hover:border-[var(--color-brand-light)] w-full sm:w-auto uppercase tracking-wide font-primary"
            >
              Baixar Ementa Completa
            </a>
          </div>

        </motion.div>
        
      </div>
    </section>
  );
}
