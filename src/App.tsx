import Header from './components/Header'
import Hero from './components/Hero'
import ProblemObjective from './components/ProblemObjective'
import Curriculum from './components/Curriculum'
import SkillsResults from './components/SkillsResults'
import PracticalApplications from './components/PracticalApplications'
import TargetAudience from './components/TargetAudience'
import Faculty from './components/Faculty'
import CourseInfo from './components/CourseInfo'
import Pricing from './components/Pricing'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import CallToAction from './components/CallToAction'
import StickyCTA from './components/StickyCTA'
import LeadCaptureModal from './components/LeadCaptureModal'
import ListaDeEsperaLp2 from './pages/ListaDeEsperaLp2'
import { useState, useEffect, useRef } from 'react'
import { trackMeta } from './lib/meta'

function App() {
  const isLp2 =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('lista-de-esperalp2');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const isWaitingList =
    typeof window !== 'undefined' &&
    window.location.pathname.includes('lista-de-espera');
  const viewContentSent = useRef(false);
  const checkoutUrl = "https://pay.voompcreators.com.br/12211";

  useEffect(() => {
    if (isWaitingList || isLp2) {
      document.title = "Lista de Espera | Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto";
    }
  }, [isWaitingList, isLp2]);

  if (isLp2) {
    return <ListaDeEsperaLp2 />;
  }

  useEffect(() => {
    if (!isWaitingList) return;
    if (viewContentSent.current) return;
    viewContentSent.current = true;
    trackMeta('ViewContent', {
      customData: {
        content_name: 'Pós GGSR',
        content_category: isLp2 ? 'lista-de-esperalp2' : 'lista-de-espera',
      },
    });
  }, [isWaitingList, isLp2]);

  const openModal = () => setIsModalOpen(true);

  return (
    <main className="w-full min-h-screen bg-[var(--color-brand-dark)] text-[var(--color-brand-light)] font-secondary selection:bg-[var(--color-brand-primary)] selection:text-[var(--color-brand-dark)]">
      <Header />
      <Hero onOpenModal={openModal} isWaitingList={isWaitingList} />
      <ProblemObjective />
      <Curriculum />
      <SkillsResults />
      <PracticalApplications />
      <TargetAudience />
      <Faculty />
      <CourseInfo />
      <Pricing onOpenModal={openModal} isWaitingList={isWaitingList} />
      <Testimonials />
      <FAQ />
      <CallToAction onOpenModal={openModal} isWaitingList={isWaitingList} />
      
      <StickyCTA onOpenModal={openModal} isWaitingList={isWaitingList} />

      <LeadCaptureModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        checkoutUrl={checkoutUrl}
        isWaitingList={isWaitingList}
      />
      
      <footer className="bg-black/60 border-t border-white/5 py-10 text-center text-[var(--color-brand-light)]/40 text-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo-ambientalpro.webp" alt="Ambiental Pro" className="h-10 w-auto opacity-50 hover:opacity-100 transition-opacity" />
        </div>
        <p className="font-secondary tracking-widest uppercase">© {new Date().getFullYear()} Pós-Graduação em GGSR. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}

export default App
