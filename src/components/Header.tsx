export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#31364a]/80 backdrop-blur-md border-b border-white/10 py-1">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-3 items-center gap-4">
        {/* Logo - Left column */}
        <div className="flex justify-start">
          <img 
            src={`${import.meta.env.BASE_URL}logo.png`} 
            alt="Pós GGSR Logo" 
            className="h-14 md:h-20 w-auto object-contain py-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          />
        </div>
        
        {/* Navigation - Center column (Desktop) / End column (Mobile) */}
        <nav className="flex items-center justify-center gap-4 md:gap-8 overflow-x-auto no-scrollbar py-2 md:col-start-2">
          <a href="#problema" className="text-[10px] md:text-xs font-medium hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-widest whitespace-nowrap">Objetivo</a>
          <a href="#curriculo" className="text-[10px] md:text-xs font-medium hover:text-[var(--color-brand-secondary)] transition-colors uppercase tracking-widest whitespace-nowrap">Currículo</a>
          <a href="#professores" className="text-[10px] md:text-xs font-medium hover:text-[var(--color-brand-accent)] transition-colors uppercase tracking-widest whitespace-nowrap">Professores</a>
          <a href="#faq" className="text-[10px] md:text-xs font-medium hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-widest whitespace-nowrap">FAQ</a>
        </nav>

        {/* Empty Spacer - Right column (Desktop only) */}
        <div className="hidden md:block"></div>
      </div>
    </header>
  );
}
