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
import { useState, useEffect } from 'react'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWaitingList, setIsWaitingList] = useState(false);
  const checkoutUrl = "https://pay.voompcreators.com.br/12211";

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isWaiting = window.location.pathname.includes('/lista-de-espera');
      setIsWaitingList(isWaiting);
      if (isWaiting) {
        document.title = "Lista de Espera | Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto";
      }
    }
  }, []);

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
      {!isWaitingList && <Pricing onOpenModal={openModal} isWaitingList={isWaitingList} />}
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
        <p className="font-secondary tracking-widest uppercase">© {new Date().getFullYear()} Pós-Graduação em GGSR. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}

export default App
