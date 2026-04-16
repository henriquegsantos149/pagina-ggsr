import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const modules = [
  {
    title: "Geotecnologias aplicadas à área ambiental",
    objective: "Apresentar os fundamentos das geotecnologias e seu papel estratégico na área ambiental, explorando o uso de Sistemas de Informação Geográfica (SIG) e outras ferramentas digitais.",
    practicalFocus: "Aplicação de softwares de geoprocessamento para a criação de mapas temáticos e análise espacial, fornecendo suporte à tomada de decisões em estudos ambientais."
  },
  {
    title: "Sensoriamento Remoto e Processamento Digital de Imagens",
    objective: "Ensinar os conceitos e técnicas de aquisição e análise de dados orbitais e aéreos, com foco em interpretação e processamento digital.",
    practicalFocus: "Uso de imagens de satélite e drones para mapeamento de uso e cobertura do solo, monitoramento de áreas e geração de produtos cartográficos."
  },
  {
    title: "Cartografia: Fundamentos, Técnicas e Ferramentas",
    objective: "Desenvolver conhecimentos sólidos em cartografia para a correta representação do espaço geográfico, abordando escalas, simbologia e normas técnicas.",
    practicalFocus: "Produção de cartas e mapas técnicos de acordo com padrões cartográficos, assegurando precisão e clareza em projetos ambientais."
  },
  {
    title: "Referência Espacial e Geodésia",
    objective: "Apresentar os conceitos de sistemas de referência espacial e geodésica, fundamentais para a localização e medição da superfície terrestre.",
    practicalFocus: "Aplicação de sistemas de coordenadas e projeções cartográficas em levantamentos e georreferenciamento de imóveis rurais e urbanos."
  },
  {
    title: "Topografia aplicada ao georreferenciamento",
    objective: "Ensinar técnicas topográficas aplicadas a levantamentos para fins de georreferenciamento, com ênfase em precisão e normativas legais.",
    practicalFocus: "Realização de medições em campo com uso de equipamentos como GNSS e estação total, integrando dados a sistemas cartográficos."
  },
  {
    title: "Agrimensura legal",
    objective: "Estudar a legislação e as normas que regulamentam o georreferenciamento de imóveis no Brasil, especialmente as diretrizes do INCRA e do Confea/Crea.",
    practicalFocus: "Elaboração de memoriais descritivos e documentação técnica exigida para certificação de imóveis no Sistema de Gestão Fundiária (SIGEF)."
  },
  {
    title: "Perícia Ambiental",
    objective: "Capacitar o aluno a compreender as etapas e responsabilidades de uma perícia ambiental no contexto judicial e extrajudicial.",
    practicalFocus: "Produção de laudos e pareceres técnicos com base em metodologias reconhecidas, apoiando processos de avaliação e tomada de decisão."
  },
  {
    title: "Fundamentos de Programação para Ciência de Dados Ambientais",
    objective: "Introduzir a lógica e os conceitos de programação aplicados à organização e análise de dados ambientais.",
    practicalFocus: "Desenvolvimento de scripts básicos para manipulação e tratamento de informações ambientais, facilitando processos analíticos."
  },
  {
    title: "Gerenciamento de Bancos de Dados e Big Data aplicado à Área Ambiental",
    objective: "Ensinar princípios de armazenamento, organização e gerenciamento de dados ambientais, incluindo abordagens de big data.",
    practicalFocus: "Estruturação de bases de dados e utilização de ferramentas para análise de grandes volumes de dados ambientais."
  },
  {
    title: "WebMaps e Dashboards: Visualização Interativa de Dados",
    objective: "Capacitar os alunos a desenvolver visualizações digitais dinâmicas que comuniquem informações espaciais de forma clara e acessível.",
    practicalFocus: "Criação de mapas interativos e dashboards voltados à gestão ambiental e à comunicação de resultados técnicos."
  },
  {
    title: "Gerenciamento Estratégico de Projetos",
    objective: "Apresentar metodologias de gestão de projetos aplicadas a iniciativas ambientais, integrando planejamento, execução e acompanhamento.",
    practicalFocus: "Uso de práticas de gerenciamento para coordenar prazos, recursos e resultados em projetos técnicos."
  }
];

export default function Curriculum() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="curriculo" className="py-16 md:py-24 bg-[var(--color-brand-dark)] relative overflow-hidden">
      {/* background grid again for continuity */}
      <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
            Conteúdo <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-3 py-1 mt-2 mb-1 shape-leaf transform -skew-x-6"><span className="inline-block transform skew-x-6">Programático</span></span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto font-secondary">11 módulos desenhados para conectar a teoria à prática, com foco absoluto no que o mercado exige.</p>
        </div>

        <div className="space-y-4">
          {modules.map((mod, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`shape-leaf bg-black/40 border transition-all duration-300 ${isOpen ? 'border-[var(--color-brand-secondary)]/40 shadow-[0_0_20px_rgba(41,167,217,0.1)]' : 'border-white/5 hover:border-[var(--color-brand-accent)]/30'}`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-12 h-12 shape-leaf flex items-center justify-center font-bold font-impact text-xl transition-all duration-300 ${isOpen ? 'bg-brand-gradient text-[var(--color-brand-dark)] shadow-[0_0_15px_rgba(88,174,105,0.4)]' : 'bg-white/5 text-[var(--color-brand-light)]/40 group-hover:bg-white/10'}`}>
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                    <h3 className={`text-xl font-bold font-primary uppercase tracking-wide transition-colors duration-300 ${isOpen ? 'text-[var(--color-brand-secondary)]' : 'text-[var(--color-brand-light)]'}`}>
                      {mod.title}
                    </h3>
                  </div>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--color-brand-secondary)]' : 'text-[var(--color-brand-light)]/40'}`} />
                </button>
                
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 pb-8 pt-0 md:pl-26 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] mt-2.5 shrink-0" />
                      <p className="text-[var(--color-brand-light)]/80 text-base md:text-lg font-secondary">
                        <strong className="text-[var(--color-brand-primary)] uppercase text-xs tracking-widest block mb-1">Objetivo</strong>
                        {mod.objective}
                      </p>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-accent)] mt-2.5 shrink-0" />
                      <p className="text-[var(--color-brand-light)]/80 text-base md:text-lg font-secondary">
                        <strong className="text-[var(--color-brand-accent)] uppercase text-xs tracking-widest block mb-1">Foco Prático</strong>
                        {mod.practicalFocus}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
