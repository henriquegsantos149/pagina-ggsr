import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const base = import.meta.env.BASE_URL;

const testimonials = [
  { img: `${base}testimonials/testi1.jpg`, alt: "Depoimento Luciana Souza" },
  { img: `${base}testimonials/testi2.jpg`, alt: "Depoimento Thiago Martins" },
  { img: `${base}testimonials/testi3.png`, alt: "Depoimento Aluno" },
  { img: `${base}testimonials/testi4.png`, alt: "Depoimento Rafael" },
  { img: `${base}testimonials/testi5.png`, alt: "Depoimento Aluna GGSR" },
  { img: `${base}testimonials/testi6.png`, alt: "Depoimento Defesa Civil" },
  { img: `${base}testimonials/testi7.jpg`, alt: "Depoimento Suporte" },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getPosition = (index: number) => {
    const total = testimonials.length;
    const diff = (index - currentIndex + total) % total;
    
    if (diff === 0) return 'center';
    if (diff === 1 || diff === total - total + 1) return 'right';
    if (diff === total - 1) return 'left';
    return 'hidden';
  };

  return (
    <section className="py-24 bg-[var(--color-brand-dark)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
            O que dizem nossos <span className="text-brand-gradient">Especialistas</span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto">Prova real do impacto da nossa formação na carreira de quem faz.</p>
        </div>

        <div className="relative h-[400px] md:h-[600px] flex items-center justify-center">
          {/* Navigation Arrows */}
          <button 
            onClick={prevSlide}
            className="absolute left-0 md:left-4 z-40 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-md"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={nextSlide}
            className="absolute right-0 md:right-4 z-40 p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors backdrop-blur-md"
            aria-label="Próximo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Track */}
          <div className="relative w-full h-full flex items-center justify-center">
            {testimonials.map((testi, index) => {
              const position = getPosition(index);
              
              if (position === 'hidden') return null;

              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    x: position === 'center' ? 0 : position === 'left' ? (window.innerWidth < 768 ? -200 : -350) : (window.innerWidth < 768 ? 200 : 350),
                    scale: position === 'center' ? 1 : 0.8,
                    opacity: position === 'center' ? 1 : 0.3,
                    filter: position === 'center' ? 'blur(0px)' : 'blur(8px)',
                    zIndex: position === 'center' ? 20 : 10,
                  }}
                  transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                  className="absolute w-[280px] md:w-[450px] pointer-events-none md:pointer-events-auto"
                >
                  <div className="shape-leaf bg-white/5 border border-white/10 p-2 md:p-4 backdrop-blur-sm shadow-2xl">
                    <img 
                      src={testi.img} 
                      alt={testi.alt} 
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? 'bg-[var(--color-brand-primary)] w-8' : 'bg-white/20'
              }`}
            aria-label={`Ir para slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
