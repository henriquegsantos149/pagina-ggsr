import { motion } from 'framer-motion';
import { Clock, BookOpen, MonitorPlay, GraduationCap, Award } from 'lucide-react';

export default function CourseInfo() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative py-16 md:py-24 bg-black/40 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-primary uppercase tracking-wide">
            Sobre o <span className="text-brand-gradient">Curso</span>
          </h2>
          <p className="text-[var(--color-brand-light)]/70 max-w-2xl mx-auto">Tudo que você precisa saber sobre a estrutura técnica e operacional da Pós-Graduação.</p>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {/* Card 1 */}
          <motion.div variants={item} className="shape-leaf bg-[var(--color-brand-dark)] border border-white/10 p-8 hover:border-[var(--color-brand-primary)]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gradient opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity"></div>
            <div className="w-14 h-14 shape-leaf bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--color-brand-primary)]/50 transition-colors">
              <Clock className="w-7 h-7 text-[var(--color-brand-primary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-brand-light)] mb-2 font-primary uppercase">Duração</h3>
            <p className="text-4xl font-impact tracking-wider text-brand-gradient">12 meses</p>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={item} className="shape-leaf bg-[var(--color-brand-dark)] border border-white/10 p-8 hover:border-[var(--color-brand-secondary)]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gradient opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity"></div>
            <div className="w-14 h-14 shape-leaf bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--color-brand-secondary)]/50 transition-colors">
              <BookOpen className="w-7 h-7 text-[var(--color-brand-secondary)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-brand-light)] mb-2 font-primary uppercase">Carga Horária</h3>
            <p className="text-4xl font-impact tracking-wider text-brand-gradient">440h</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={item} className="shape-leaf bg-[var(--color-brand-dark)] border border-white/10 p-8 hover:border-[var(--color-brand-accent)]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gradient opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity"></div>
            <div className="w-14 h-14 shape-leaf bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:border-[var(--color-brand-accent)]/50 transition-colors">
              <MonitorPlay className="w-7 h-7 text-[var(--color-brand-accent)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-brand-light)] mb-2 font-primary uppercase">Modalidade</h3>
            <p className="text-2xl font-impact tracking-wider text-brand-gradient leading-tight">100% EAD<br/><span className="text-sm font-secondary tracking-normal text-[var(--color-brand-light)]/60 uppercase">Aulas Gravadas</span></p>
          </motion.div>

          {/* Card 4 */}
          <motion.a 
            href="https://emec.mec.gov.br/emec/consulta-cadastro/detalhamento/d96957f455f6405d14c6542552b0f6eb/NTE1/93916316abe23148507bd4c260e4b878/Mjc0OTUy"
            target="_blank"
            rel="noopener noreferrer"
            variants={item} 
            className="shape-leaf bg-[var(--color-brand-dark)] border border-white/10 p-8 hover:border-[var(--color-brand-primary)]/50 transition-colors group relative overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gradient opacity-10 rounded-full blur-[40px] group-hover:opacity-30 transition-opacity"></div>
            <img 
              src={`${import.meta.env.BASE_URL}mec-badge.png`} 
              alt="Selo MEC" 
              className="h-20 w-auto object-contain mb-3 group-hover:scale-105 transition-transform"
            />
            <h3 className="text-lg font-bold text-[var(--color-brand-primary)] uppercase tracking-wider">Nota 5 no MEC</h3>
          </motion.a>
        </motion.div>

        {/* Footer info area: Chancela and Parceiros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Selo Anhanguera */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="md:col-span-2 shape-leaf bg-white/5 border border-white/10 p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
          >
            {/* subtle glow */}
            <div className="absolute top-1/2 left-10 -translate-y-1/2 w-32 h-32 bg-brand-gradient opacity-[0.08] blur-[50px] pointer-events-none"></div>

            <div className="flex-shrink-0 w-20 h-20 shape-leaf bg-white/5 border border-white/20 flex items-center justify-center relative z-10">
              <Award className="w-10 h-10 text-[var(--color-brand-secondary)]" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2 text-[var(--color-brand-light)] font-primary uppercase tracking-wide">Chancela Anhanguera</h3>
              <p className="text-[var(--color-brand-light)]/70 text-lg">Mais de 25 anos de tradição em ensino superior, com mais de 360 cursos com conceito positivo no MEC. Um diploma de peso para sua carreira.</p>
            </div>
          </motion.div>

          {/* Parceiros do curso */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-1 shape-leaf flex flex-col justify-center items-center bg-white/5 border border-white/10 p-8 relative overflow-hidden gap-6"
          >
            <h3 className="text-xl font-bold text-[var(--color-brand-light)] font-primary uppercase tracking-wide text-center">Nossos parceiros</h3>
            <div className="flex items-center justify-center gap-6">
              {/* CREA */}
              <div className="flex flex-col items-center gap-2">
                <img 
                  src={`${import.meta.env.BASE_URL}logo-crea.png`} 
                  alt="Logo CREA" 
                  className="h-12 md:h-14 lg:h-16 w-auto object-contain"
                />
                <span className="text-[10px] sm:text-xs text-[var(--color-brand-light)]/60 uppercase tracking-wider">CREA/CONFEA</span>
              </div>
              <div className="w-px h-16 bg-white/10" />
              {/* Anhanguera */}
              <div className="flex flex-col items-center gap-2">
                <img 
                  src={`${import.meta.env.BASE_URL}logo-anhanguera.png`} 
                  alt="Logo Anhanguera" 
                  className="h-16 md:h-20 lg:h-24 w-auto object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
