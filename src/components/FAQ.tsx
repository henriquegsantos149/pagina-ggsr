import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: "A Pós-Graduação é reconhecida pelo MEC?",
    a: "Sim. O curso é 100% regulamentado e o diploma é emitido pela Anhanguera, instituição de alta credibilidade."
  },
  {
    q: "O curso dá direito ao registro no CREA e extensões de atribuição?",
    a: "Sim. O conteúdo foi elaborado com base na Decisão Normativa 116 do CONFEA, permitindo que profissionais habilitados solicitem a extensão de atribuição para georreferenciamento de imóveis rurais."
  },
  {
    q: "Como funcionam as aulas e o acesso à plataforma?",
    a: "O curso é 100% EAD. As aulas são gravadas e ficam disponíveis 24h por dia para você assistir no seu ritmo. Você terá acesso portal do aluno com material de apoio completo."
  },
  {
    q: "Qual a duração mínima e máxima do curso?",
    a: "A duração padrão é de 12 meses, permitindo uma absorção completa do conteúdo técnico e prático."
  },
  {
    q: "Preciso de algum software específico para as aulas?",
    a: "Utilizaremos softwares líderes de mercado como QGIS e ArcGIS. Instruiremos sobre como obter as versões de estudante ou de código aberto para sua prática."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 bg-black/40 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 shape-leaf bg-brand-gradient flex items-center justify-center text-[var(--color-brand-dark)]">
              <HelpCircle className="w-6 h-6" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4 font-primary uppercase tracking-wide">
            Perguntas <span className="text-brand-gradient">Frequentes</span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70">Tire suas dúvidas sobre a metodologia, certificação e acesso.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="shape-leaf bg-white/5 border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/20">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between gap-4 text-left"
                >
                  <span className={`font-bold font-primary uppercase tracking-wide transition-colors ${isOpen ? 'text-[var(--color-brand-primary)]' : 'text-[var(--color-brand-light)]'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-brand-primary)]' : 'text-[var(--color-brand-light)]/40'}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-[var(--color-brand-light)]/70 font-secondary leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
