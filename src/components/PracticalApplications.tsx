import { motion } from 'framer-motion';
import { Briefcase, Building2, Landmark, Tractor, HardHat, TreePine } from 'lucide-react';

const apps = [
  {
    image: "app-agronegocio.png",
    title: "Agronegócio",
    desc: "Monitoramento de safras, gestão de limites rurais e agricultura de precisão."
  },
  {
    image: "app-meio-ambiente.png",
    title: "Meio Ambiente",
    desc: "Análise de impacto ambiental, recuperação de áreas degradadas e monitoramento florestal."
  },
  {
    image: "app-gestao-publica.png",
    title: "Gestão Pública",
    desc: "Plano diretor, cadastro técnico multifinalitário e regularização fundiária."
  },
  {
    image: "app-construcao-civil.png",
    title: "Construção Civil",
    desc: "Levantamentos topográficos de precisão e acompanhamento de grandes obras de infraestrutura."
  },
  {
    image: "app-mercado-imobiliario.png",
    title: "Mercado Imobiliário",
    desc: "Avaliação de áreas para empreendimentos e perícias judiciais de demarcação."
  },
  {
    image: "app-consultoria.png",
    title: "Consultoria Autônoma",
    desc: "Liberdade para gerir seus próprios projetos e emitir laudos certificados pelo CREA."
  }
];

export default function PracticalApplications() {
  return (
    <section className="py-16 md:py-24 bg-[var(--color-brand-dark)] border-t border-white/5">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {apps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex flex-col bg-white/5 border border-white/10 shape-leaf overflow-hidden hover:border-[var(--color-brand-secondary)]/50 transition-colors"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={`${import.meta.env.BASE_URL}practical-apps/${app.image}`} 
                  alt={app.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold mb-3 font-primary uppercase tracking-wider group-hover:text-[var(--color-brand-secondary)] transition-colors">
                  {app.title}
                </h3>
                <p className="text-[var(--color-brand-light)]/60 font-secondary text-sm leading-relaxed">
                  {app.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
