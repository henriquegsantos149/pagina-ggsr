import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#1a1d2e]/90 backdrop-blur-md border-b border-white/10 py-1">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center gap-4">
        {/* Logo */}
        <div className="flex justify-start flex-1">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
            aria-label="Voltar para o topo"
          >
            <img 
              src={`${import.meta.env.BASE_URL}logo.png`} 
              alt="Pós GGSR Logo" 
              className="h-14 md:h-20 w-auto object-contain py-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
            />
          </button>
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex justify-end flex-1">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[var(--color-brand-light)] p-2">
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center justify-center gap-8 overflow-x-auto no-scrollbar py-2">
          <a href="#problema" className="text-xs font-medium hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-widest whitespace-nowrap">Objetivo</a>
          <a href="#curriculo" className="text-xs font-medium hover:text-[var(--color-brand-secondary)] transition-colors uppercase tracking-widest whitespace-nowrap">Currículo</a>
          <a href="#professores" className="text-xs font-medium hover:text-[var(--color-brand-accent)] transition-colors uppercase tracking-widest whitespace-nowrap">Professores</a>
          <a href="#faq" className="text-xs font-medium hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-widest whitespace-nowrap">FAQ</a>
        </nav>

        {/* Right Spacer for Desktop Centering */}
        <div className="hidden md:block flex-1"></div>
      </div>

      {/* Navigation - Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1d2e] border-b border-white/10 flex flex-col p-4 shadow-lg shadow-black/50">
          <a href="#problema" onClick={() => setIsOpen(false)} className="py-3 px-4 text-xs font-medium hover:bg-white/5 hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-widest border-b border-white/5">Objetivo</a>
          <a href="#curriculo" onClick={() => setIsOpen(false)} className="py-3 px-4 text-xs font-medium hover:bg-white/5 hover:text-[var(--color-brand-secondary)] transition-colors uppercase tracking-widest border-b border-white/5">Currículo</a>
          <a href="#professores" onClick={() => setIsOpen(false)} className="py-3 px-4 text-xs font-medium hover:bg-white/5 hover:text-[var(--color-brand-accent)] transition-colors uppercase tracking-widest border-b border-white/5">Professores</a>
          <a href="#faq" onClick={() => setIsOpen(false)} className="py-3 px-4 text-xs font-medium hover:bg-white/5 hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-widest">FAQ</a>
        </div>
      )}
    </header>
  );
}
