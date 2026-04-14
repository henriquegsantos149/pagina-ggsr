import { motion } from 'framer-motion';

const facultyMembers = [
  {
    name: "Henrique Gonzalez",
    title: "Engenheiro Ambiental (UFRJ)",
    image: "./faculty/henrique.png",
    resume: "Experiência sólida na área ambiental, focado em geoprocessamento e soluções tecnológicas."
  },
  {
    name: "Raquel Carnivalle Melillo",
    title: "Doutora em Ambiente e Sociedade (UNICAMP)",
    image: "./faculty/raquel.png",
    resume: "Pesquisadora com vasta contribuição para estudos de impacto ambiental e sustentabilidade."
  },
  {
    name: "Rodolfo Finatti",
    title: "Geógrafo (UNESP), PhD em Geografia (USP)",
    image: "./faculty/rodolfo.png",
    resume: "Especialista com profunda bagagem acadêmica e prática na formulação de mapas."
  },
  {
    name: "Vitor do Sacramento",
    title: "Geólogo (UNB) com MBA",
    image: "./faculty/vitor.png",
    resume: "Combina conhecimento profundo do solo com gestão estratégica em geotecnologias."
  },
  {
    name: "Luís Antônio Soares",
    title: "Engenheiro Agrimensor (UFU)",
    image: "./faculty/luis.png",
    resume: "Experiência de campo em demarcações e georreferenciamento de imóveis rurais."
  },
  {
    name: "Ana Beatriz Ulhoa",
    title: "Engenheira Ambiental",
    image: "./faculty/ana.png",
    resume: "Focada em análises geoespaciais voltadas para a sustentabilidade e impacto urbano."
  },
  {
    name: "Charlie Turette Lopes",
    title: "Engenheiro de Produção",
    image: "./faculty/charlie.png",
    resume: "Especialista em otimização de processos usando tecnologias de sensoriamento remoto."
  },
  {
    name: "Bismarck Feuchard",
    title: "Eng. Civil (INCRA)",
    image: "./faculty/bismarck.png",
    resume: "Expertise de ponta na legislação e requisitos técnicos do INCRA."
  }
];

export default function Faculty() {
  return (
    <section className="py-24 bg-[var(--color-brand-dark)]">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
            Corpo <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-3 py-1 mt-2 mb-1 shape-leaf transform -skew-x-6"><span className="inline-block transform skew-x-6">Docente</span></span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto">Aprenda com especialistas de mercado e acadêmicos renomados nas melhores instituições do país.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {facultyMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="shape-leaf bg-white/5 border border-white/10 overflow-hidden hover:border-[var(--color-brand-blue)]/50 transition-all group hover:shadow-[0_0_25px_rgba(49,168,168,0.15)] flex flex-col"
            >
              {/* Image container must also follow the shape or part of it */}
              <div className="h-64 overflow-hidden relative shrink-0">
                <div className="absolute inset-0 bg-brand-gradient mix-blend-overlay z-10 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                <img 
                  src={member.image} 
                  alt={`${member.name} – Professor da Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto`} 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-[var(--color-brand-light)] mb-1 font-primary group-hover:text-[var(--color-brand-green1)] transition-colors">{member.name}</h3>
                    <p className="text-sm text-[var(--color-brand-green2)] mb-4 font-semibold uppercase tracking-wider">{member.title}</p>
                </div>
                <p className="text-sm text-[var(--color-brand-light)]/60 leading-relaxed border-t border-white/10 pt-4">{member.resume}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
