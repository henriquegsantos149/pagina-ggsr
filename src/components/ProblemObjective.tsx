import { motion } from 'framer-motion';
import { Target, AlertCircle, TrendingUp } from 'lucide-react';

export default function ProblemObjective() {
  return (
    <section id="problema" className="py-24 relative overflow-hidden bg-[var(--color-brand-dark)]">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 text-[var(--color-brand-primary)] mb-6 font-primary uppercase tracking-[0.2em] font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>O Desafio do Mercado</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 font-primary uppercase leading-tight">
              A lacuna técnica no <span className="text-brand-gradient">Georreferenciamento</span>
            </h2>
            <div className="space-y-6 text-lg text-[var(--color-brand-light)]/70 font-secondary">
              <p>
                O mercado de inspeção e demarcação de terras no Brasil vive uma contradição: alta demanda por serviços de precisão e escassez de profissionais que dominam a fundo as novas normas do INCRA e CONFEA.
              </p>
              <p>
                A falta de domínio técnico em Geoprocessamento e Sensoriamento Remoto impede que muitos profissionais alcancem cargos de liderança ou executem projetos complexos de alto valor agregado.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="shape-leaf bg-white/5 border border-white/10 p-10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-gradient opacity-[0.05] rounded-full blur-[60px]"></div>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 shape-leaf bg-brand-gradient flex items-center justify-center text-[var(--color-brand-dark)]">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold font-primary uppercase tracking-wide">Nosso Objetivo</h3>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-brand-primary)] shrink-0 shadow-[0_0_10px_var(--color-brand-primary)]"></div>
                <div>
                  <h4 className="font-bold text-[var(--color-brand-light)] mb-1 uppercase tracking-wider text-sm">Autoridade Técnica</h4>
                  <p className="text-[var(--color-brand-light)]/60 text-sm">Capacitar você para atuar com 100% de confiança em geotecnologias de ponta.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-brand-secondary)] shrink-0 shadow-[0_0_10px_var(--color-brand-secondary)]"></div>
                <div>
                  <h4 className="font-bold text-[var(--color-brand-light)] mb-1 uppercase tracking-wider text-sm">Resultados Práticos</h4>
                  <p className="text-[var(--color-brand-light)]/60 text-sm">Garantir que cada módulo se traduza em uma nova habilidade monetizável no mercado.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 w-2 h-2 rounded-full bg-[var(--color-brand-accent)] shrink-0 shadow-[0_0_10px_var(--color-brand-accent)]"></div>
                <div>
                  <h4 className="font-bold text-[var(--color-brand-light)] mb-1 uppercase tracking-wider text-sm">Conformidade Legal</h4>
                  <p className="text-[var(--color-brand-light)]/60 text-sm">Dominar as exigências regulatórias para emissão de laudos e certificações oficiais.</p>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 flex items-center gap-3 text-[var(--color-brand-accent)] font-bold italic">
              <TrendingUp className="w-5 h-5" />
              <span>Sua ascensão profissional começa aqui.</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
