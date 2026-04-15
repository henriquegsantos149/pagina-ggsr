import { motion } from 'framer-motion';
import { Users, GraduationCap, CheckCircle } from 'lucide-react';

const targets = [
  "Engenheiros Ambientais e Civis",
  "Engenheiros Agrônomos e Agrimensores",
  "Geógrafos e Geólogos",
  "Arquitetos e Urbanistas",
  "Gestores Ambientais e Biólogos",
  "Profissionais que buscam extensão de atribuição no CREA"
];

export default function TargetAudience() {
  return (
    <section className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-brand-gradient opacity-[0.05] blur-[80px]"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 text-[var(--color-brand-secondary)] mb-6 font-primary uppercase tracking-widest font-bold text-sm">
            <Users className="w-5 h-5" />
            <span>Perfil do Aluno</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 font-primary uppercase leading-tight">
            Para quem é esta <span className="text-brand-gradient">Pós-Graduação?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {targets.map((text, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/5 p-4 shape-leaf group hover:border-white/20 transition-all">
                <CheckCircle className="w-5 h-5 text-[var(--color-brand-accent)] shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-[var(--color-brand-light)]/80">{text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-brand-gradient p-1 shape-leaf"
        >
          <div className="bg-[var(--color-brand-dark)] p-10 shape-leaf h-full">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 shape-leaf bg-white/5 flex items-center justify-center text-[var(--color-brand-primary)]">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-primary uppercase tracking-wide text-brand-gradient">Pré-requisitos</h3>
            </div>
            
            <p className="text-lg text-[var(--color-brand-light)]/70 mb-8 font-secondary leading-relaxed">
              Para ingressar nesta Pós-Graduação e obter a certificação de especialista, o único requisito obrigatório é:
            </p>

            <div className="bg-white/5 border border-white/10 p-6 shape-leaf border-l-4 border-l-[var(--color-brand-primary)]">
              <p className="text-xl font-bold text-[var(--color-brand-light)] font-primary uppercase tracking-wide">
                Diploma de Graduação
              </p>
              <p className="text-sm text-[var(--color-brand-light)]/50 mt-1 uppercase tracking-widest">
                Reconhecido pelo MEC
              </p>
            </div>

            <p className="mt-8 text-sm text-[var(--color-brand-light)]/40 italic">
              * Ideal para quem já atua ou deseja ingressar no mercado de levantamentos espaciais e tecnologia de dados geográficos.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
