import { motion } from 'framer-motion';
import { Verified, FileSignature, University, TrendingUp, Users, Briefcase } from 'lucide-react';

const differencials = [
  {
    title: "Certificação CREA / CONFEA",
    description: "Elaborada com base na Decisão Normativa 116. Atende 100% os requisitos da câmara.",
    icon: FileSignature
  },
  {
    title: "Diploma Reconhecido Mec",
    description: "Pós-graduação certificada e regulamentada, gerando um diploma de peso com validade nacional.",
    icon: Verified
  },
  {
    title: "Força da Marcar Anhanguera",
    description: "A tradição de mais de 25 anos em ensino superior chancelando sua educação.",
    icon: University
  },
  {
    title: "Metodologia 100% Prática",
    description: "Casos reais do mercado e a vivência que apenas profissionais atuantes sabem ensinar.",
    icon: TrendingUp
  },
  {
    title: "Corpo Docente de Elite",
    description: "Professores que unem alta qualificação acadêmica e imensa bagagem no mercado.",
    icon: Users
  },
  {
    title: "Extensão de Atribuição",
    description: "Possibilidade de solicitação de extensão de atribuição de serviços de georreferenciamento no CREA.",
    icon: Briefcase
  }
];

export default function Differentials() {
  return (
    <section className="py-24 bg-black/40 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
            Por que escolher <span className="text-brand-gradient">esta Pós?</span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto">Diferenciais que garantem que seu investimento se transforme em autoridade no mercado.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {differencials.map((diff, index) => {
            const Icon = diff.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="shape-leaf bg-white/5 p-8 border border-white/10 hover:border-[var(--color-brand-green2)]/30 transition-all flex flex-col items-start gap-5 group relative overflow-hidden"
              >
                {/* corner gradient touch */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-gradient opacity-10 rounded-full blur-[30px] group-hover:opacity-30 transition-opacity"></div>
                
                <div className="w-16 h-16 shape-leaf bg-white/5 border border-white/10 flex items-center justify-center text-[var(--color-brand-green1)] group-hover:scale-110 group-hover:bg-brand-gradient group-hover:text-[var(--color-brand-dark)] transition-all duration-500">
                  <Icon className="w-8 h-8" />
                </div>
                <div className="relative z-10 mt-2">
                  <h3 className="text-2xl font-bold text-[var(--color-brand-light)] mb-3 font-primary uppercase tracking-wide">{diff.title}</h3>
                  <p className="text-[var(--color-brand-light)]/60 leading-relaxed font-secondary">{diff.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
