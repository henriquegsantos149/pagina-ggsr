import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

interface PricingProps {
  onOpenModal: () => void;
  isWaitingList?: boolean;
}

export default function Pricing({ onOpenModal, isWaitingList = false }: PricingProps) {
  const benefits = [
    "Diploma de Pós-Graduação com chancela Anhanguera (Nota 5 no MEC)",
    "Programa completo de 12 meses com 440 horas de carga horária",
    "Aulas 100% EAD gravadas para assistir no seu próprio ritmo",
    "Elaborada com base na Decisão Normativa 116 do CONFEA",
    "Foco em habilidades técnicas e conhecimento legal para Geotecnologias",
    "Corpo docente altamente especializado e ativo no mercado"
  ];

  return (
    <section id="investimento" className="relative py-16 md:py-24 bg-[var(--color-brand-light)] text-[var(--color-brand-dark)] overflow-hidden border-t border-slate-200/80">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gradient opacity-[0.03] rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide text-[var(--color-brand-dark)]">
            Investimento <span className="text-brand-gradient">Exclusivo</span>
          </h2>
          <p className="text-[var(--color-brand-dark)]/70 max-w-2xl mx-auto font-secondary">
            Invista na especialização que está abrindo portas no mercado de Geotecnologias.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Benefits Column */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold mb-6 font-primary uppercase tracking-wide text-[var(--color-brand-dark)]">
              O que está incluso na sua matrícula:
            </h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center border border-[var(--color-brand-primary)]/30">
                    <Check className="w-3 h-3 text-[var(--color-brand-primary)]" />
                  </div>
                  <span className="text-[var(--color-brand-dark)]/80 text-base font-secondary">{benefit}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Pricing Card Column */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="shape-leaf bg-white border border-slate-200/80 p-8 md:p-10 flex flex-col justify-between h-full relative overflow-hidden shadow-xl group hover:border-[var(--color-brand-primary)]/40 transition-all">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gradient opacity-[0.05] rounded-full blur-[50px] pointer-events-none"></div>
              
              <div>
                <span className="inline-block px-3 py-1 bg-brand-gradient text-[var(--color-brand-dark)] font-bold text-xs uppercase tracking-wider rounded-full mb-6 font-primary">
                  {isWaitingList ? 'Lista de Espera' : 'Acesso Completo'}
                </span>
                
                <h4 className="text-lg font-medium text-[var(--color-brand-dark)]/60 font-secondary uppercase tracking-widest mb-2">
                  Condições Especiais
                </h4>
                
                <div className="mb-6">
                  <span className="text-lg md:text-xl font-bold font-primary text-[var(--color-brand-dark)]/80 block mb-1">
                    12x de
                  </span>
                  <span className="text-5xl md:text-6xl font-black font-impact tracking-wider text-brand-gradient">
                    R$ 797,00
                  </span>
                  <span className="text-[var(--color-brand-dark)]/60 text-sm block mt-2 font-secondary">
                    ou R$ 7.970,00 à vista
                  </span>
                </div>

                <div className="border-t border-slate-200/80 pt-6 mb-8">
                  <p className="text-[var(--color-brand-dark)]/80 font-secondary text-sm leading-relaxed">
                    {isWaitingList 
                      ? 'Entre na lista de espera para garantir sua vaga e ser avisado assim que as matrículas para a nova turma abrirem com condições promocionais.' 
                      : 'Aproveite as condições facilitadas para garantir sua vaga na pós-graduação e iniciar imediatamente.'}
                  </p>
                </div>
              </div>

              <div>
                <button
                  onClick={onOpenModal}
                  className="shape-leaf w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-gradient text-[var(--color-brand-dark)] font-bold text-base transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(59,162,217,0.3)] cursor-pointer group"
                >
                  <span className="flex items-center gap-2 uppercase tracking-wider font-primary">
                    {isWaitingList ? 'Entrar na Lista de Espera' : 'Matricule-se agora'}
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
