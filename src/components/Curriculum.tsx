import { motion } from 'framer-motion';
import { ChevronDown, MapPin } from 'lucide-react';
import { useState } from 'react';

const modules = [
  {
    title: "Geotecnologias aplicadas à área ambiental",
    description: "SIG, mapas temáticos, análise espacial e integração de dados."
  },
  {
    title: "Sensoriamento Remoto e PDI",
    description: "Processamento Digital de Imagens, Satélites, drones, escaneamento a laser e mapeamento."
  },
  {
    title: "Cartografia: Fundamentos, Técnicas e Ferramentas",
    description: "Escalas, simbologia, normas técnicas e representação do relevo."
  },
  {
    title: "Referência Espacial e Geodésia",
    description: "Sistemas de coordenadas, projeções cartográficas e operações."
  },
  {
    title: "Topografia aplicada ao georreferenciamento",
    description: "GNSS, estação total, medições de campo, poligonais e nivelamento."
  },
  {
    title: "Agrimensura legal",
    description: "Legislação INCRA, exigências CONFEA/CREA, certificação e SIGEF."
  },
  {
    title: "Perícia Ambiental",
    description: "Laudos técnicos, metodologias periciais, pareceres técnicos e resoluções."
  },
  {
    title: "Fundamentos de Programação para Dados Ambientais",
    description: "Scripts, manipulação de dados espaciais e automação de mapas."
  },
  {
    title: "Gerenciamento de Bancos de Dados e Big Data",
    description: "Modelagem, armazenamento e consulta de grandes volumes de dados (Big Data Ambiental)."
  },
  {
    title: "WebMaps e Dashboards",
    description: "Visualizações interativas online, mapas digitais e tomada de decisão."
  },
  {
    title: "Gerenciamento Estratégico de Projetos",
    description: "Planejamento, execução, coordenação técnica e avaliação de custos."
  }
];

export default function Curriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[var(--color-brand-dark)] relative overflow-hidden">
      {/* background grid again for continuity */}
      <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
            Conteúdo <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-3 py-1 mt-2 mb-1 shape-leaf transform -skew-x-6"><span className="inline-block transform skew-x-6">Programático</span></span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto font-secondary">11 módulos desenhados para conectar a teoria à prática, com foco absoluto no que o mercado exige.</p>
        </div>

        <div className="space-y-4">
          {modules.map((mod, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                key={index}
                className={`shape-leaf bg-black/40 border transition-all duration-300 ${isOpen ? 'border-[var(--color-brand-green2)]/40 shadow-[0_0_20px_rgba(88,174,105,0.1)]' : 'border-white/5 hover:border-[var(--color-brand-blue)]/30'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 shape-leaf flex items-center justify-center font-bold font-impact text-xl transition-all duration-300 ${isOpen ? 'bg-brand-gradient text-[var(--color-brand-dark)] shadow-[0_0_15px_rgba(88,174,105,0.4)]' : 'bg-white/5 text-[var(--color-brand-light)]/40 group-hover:bg-white/10'}`}>
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <h3 className={`text-xl font-bold font-primary uppercase tracking-wide transition-colors duration-300 ${isOpen ? 'text-[var(--color-brand-green2)]' : 'text-[var(--color-brand-light)]'}`}>
                      {mod.title}
                    </h3>
                  </div>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-brand-green2)]' : 'text-[var(--color-brand-light)]/40'}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8 pt-0 pl-26 flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-[var(--color-brand-blue)] shrink-0 mt-1" />
                    <p className="text-[var(--color-brand-light)]/70 text-lg font-secondary">{mod.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
