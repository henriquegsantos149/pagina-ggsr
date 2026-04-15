import { motion } from 'framer-motion';
import { Briefcase, Building2, Landmark, Tractor, HardHat, TreePine } from 'lucide-react';

const apps = [
  {
    icon: Tractor,
    title: "Agronegócio",
    desc: "Monitoramento de safras, gestão de limites rurais e agricultura de precisão."
  },
  {
    icon: TreePine,
    title: "Meio Ambiente",
    desc: "Análise de impacto ambiental, recuperação de áreas degradadas e monitoramento florestal."
  },
  {
    icon: Landmark,
    title: "Gestão Pública",
    desc: "Plano diretor, cadastro técnico multifinalitário e regularização fundiária."
  },
  {
    icon: HardHat,
    title: "Construção Civil",
    desc: "Levantamentos topográficos de precisão e acompanhamento de grandes obras de infraestrutura."
  },
  {
    icon: Building2,
    title: "Mercado Imobiliário",
    desc: "Avaliação de áreas para empreendimentos e perícias judiciais de demarcação."
  },
  {
    icon: Briefcase,
    title: "Consultoria Autônoma",
    desc: "Liberdade para gerir seus próprios projetos e emitir laudos certificados pelo CREA."
  }
];

export default function PracticalApplications() {
  return (
    <section className="py-24 bg-[var(--color-brand-dark)] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
              Aplicações <span className="text-brand-gradient">Práticas</span>
            </h2>
            <p className="text-[var(--color-brand-light)]/70">Onde e como você poderá aplicar seu conhecimento no dia a dia profissional.</p>
          </div>
          <div className="h-px flex-1 bg-white/10 mb-4 hidden md:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {apps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-16 group"
            >
              <div className="absolute left-0 top-0 w-12 h-12 shape-leaf bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-gradient group-hover:text-white transition-all">
                <app.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-primary uppercase tracking-wide group-hover:text-[var(--color-brand-secondary)] transition-colors">
                {app.title}
              </h3>
              <p className="text-[var(--color-brand-light)]/60 font-secondary text-sm leading-relaxed">
                {app.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
