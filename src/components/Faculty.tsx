import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const base = import.meta.env.BASE_URL;

const facultyMembers = [
  {
    name: "Henrique Gonzalez",
    title: "Engenheiro Ambiental (UFRJ)",
    image: `${base}faculty/henrique.png`,
    resume: "Experiência sólida na área ambiental, focado em geoprocessamento e soluções tecnológicas."
  },
  {
    name: "Raquel Carnivalle Melillo",
    title: "Doutora em Ambiente e Sociedade (UNICAMP)",
    image: `${base}faculty/raquel.png`,
    resume: "Pesquisadora com vasta contribuição para estudos de impacto ambiental e sustentabilidade."
  },
  {
    name: "Rodolfo Finatti",
    title: "Geógrafo (UNESP), PhD em Geografia (USP)",
    image: `${base}faculty/rodolfo.png`,
    resume: "Especialista com profunda bagagem acadêmica e prática na formulação de mapas."
  },
  {
    name: "Vitor do Sacramento",
    title: "Geólogo (UNB) com MBA",
    image: `${base}faculty/vitor.png`,
    resume: "Combina conhecimento profundo do solo com gestão estratégica em geotecnologias."
  },
  {
    name: "Luís Antônio Soares",
    title: "Engenheiro Agrimensor (UFU)",
    image: `${base}faculty/luis.png`,
    resume: "Experiência de campo em demarcações e georreferenciamento de imóveis rurais."
  },
  {
    name: "Ana Beatriz Ulhoa",
    title: "Engenheira Ambiental",
    image: `${base}faculty/ana.png`,
    resume: "Focada em análises geoespaciais voltadas para a sustentabilidade e impacto urbano."
  },
  {
    name: "Charlie Turette Lopes",
    title: "Engenheiro de Produção",
    image: `${base}faculty/charlie.png`,
    resume: "Especialista em otimização de processos usando tecnologias de sensoriamento remoto."
  },
  {
    name: "Bismarck Feuchard",
    title: "Eng. Civil (INCRA)",
    image: `${base}faculty/bismarck.png`,
    resume: "Expertise de ponta na legislação e requisitos técnicos do INCRA."
  }
];

const extendedMembers = [
  ...facultyMembers.slice(-4),
  ...facultyMembers,
  ...facultyMembers.slice(0, 4)
];

export default function Faculty() {
  const [currentIndex, setCurrentIndex] = useState(4);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isMoving, setIsMoving] = useState(false);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      scroll('right');
    } else if (isRightSwipe) {
      scroll('left');
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (isMoving) return;
    setIsMoving(true);
    setIsTransitioning(true);
    setCurrentIndex(prev => direction === 'left' ? prev - 1 : prev + 1);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget) return;
    setIsMoving(false);
    
    if (currentIndex >= 4 + facultyMembers.length) {
      setIsTransitioning(false);
      setCurrentIndex(4);
    } else if (currentIndex <= 3) {
      setIsTransitioning(false);
      setCurrentIndex(3 + facultyMembers.length);
    }
  };

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  return (
    <section id="professores" className="py-16 md:py-24 bg-[var(--color-brand-dark)] relative overflow-hidden border-t border-white/5">
      {/* Decorative subtle gradient glow */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-brand-gradient opacity-[0.03] blur-[80px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide leading-tight">
            Conheça alguns de{" "}
            <span className="inline-block bg-brand-gradient text-[var(--color-brand-dark)] px-4 py-1.5 mt-2 mb-1 shape-leaf transform -skew-x-6 font-extrabold shadow-md">
              <span className="inline-block transform skew-x-6 tracking-wider">Nossos Professores</span>
            </span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto font-secondary mt-6 text-base md:text-lg">
            Aprenda com especialistas de mercado e acadêmicos renomados nas melhores instituições do país.
          </p>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative w-full carousel-container group/carousel">
          {/* Clipping mask */}
          <div className="overflow-hidden w-full py-4 px-2">
            {/* Scrollable Viewport */}
            <div 
              className="flex gap-6"
              style={{
                transform: `translate3d(calc(-${currentIndex} * var(--slide-step)), 0, 0)`,
                transition: isTransitioning ? 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
              }}
              onTransitionEnd={handleTransitionEnd}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {extendedMembers.map((member, index) => (
                <div
                  key={index}
                  className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] shape-leaf bg-white/[0.03] border border-white/10 overflow-hidden hover:border-[var(--color-brand-primary)]/50 hover:shadow-[0_0_30px_rgba(59,162,217,0.15)] transition-all duration-300 group flex flex-col shadow-lg shadow-black/40"
                >
                  {/* Grayscale hover Image Container */}
                  <div className="h-64 overflow-hidden relative shrink-0">
                    <img
                      src={member.image}
                      alt={`${member.name} – Professor da Pós-Graduação`}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
                    />
                  </div>

                  {/* Text details */}
                  <div className="p-6 flex-1 flex flex-col justify-start">
                    <div className="min-h-[105px] sm:min-h-[110px] md:min-h-[120px] lg:min-h-[135px] xl:min-h-[125px] flex flex-col justify-start">
                      <h3 className="text-lg md:text-xl xl:text-2xl font-bold text-[var(--color-brand-light)] mb-1 font-primary tracking-wide leading-tight group-hover:text-[var(--color-brand-primary)] transition-colors duration-300">
                        {member.name}
                      </h3>
                      <p className="text-xs md:text-[13px] text-[var(--color-brand-secondary)] font-bold uppercase tracking-wider leading-relaxed font-primary mt-1">
                        {member.title}
                      </p>
                    </div>
                    
                    <div className="border-t border-white/10 pt-4 mt-2">
                      <p className="text-sm text-[var(--color-brand-light)]/70 leading-relaxed font-secondary">
                        {member.resume}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Controls (Floating) */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-brand-gradient text-[var(--color-brand-dark)] p-3 rounded-full shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20 cursor-pointer hidden md:flex items-center justify-center hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(59,162,217,0.3)]"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-brand-gradient text-[var(--color-brand-dark)] p-3 rounded-full shadow-xl opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 z-20 cursor-pointer hidden md:flex items-center justify-center hover:scale-110 active:scale-95 shadow-[0_0_20px_rgba(59,162,217,0.3)]"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Mobile Controls */}
          <div className="flex justify-center gap-4 mt-6 md:hidden">
            <button
              onClick={() => scroll('left')}
              className="bg-white/5 border border-white/10 text-white p-3 rounded-full cursor-pointer flex items-center justify-center transition-all active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="bg-white/5 border border-white/10 text-white p-3 rounded-full cursor-pointer flex items-center justify-center transition-all active:scale-95"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
