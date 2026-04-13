import Hero from './components/Hero'
import CourseInfo from './components/CourseInfo'
import Faculty from './components/Faculty'
import Curriculum from './components/Curriculum'
import Differentials from './components/Differentials'
import CallToAction from './components/CallToAction'

function App() {
  return (
    <main className="w-full min-h-screen bg-[var(--color-brand-dark)] text-[var(--color-brand-light)] font-secondary selection:bg-[var(--color-brand-green1)] selection:text-[var(--color-brand-dark)]">
      <Hero />
      <CourseInfo />
      <Faculty />
      <Curriculum />
      <Differentials />
      <CallToAction />
      
      <footer className="bg-black/60 border-t border-white/5 py-10 text-center text-[var(--color-brand-light)]/40 text-sm">
        <p className="font-secondary tracking-widest uppercase">© {new Date().getFullYear()} Pós-Graduação em GGSR. Todos os direitos reservados.</p>
      </footer>
    </main>
  )
}

export default App
