import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  Hourglass, 
  Clock, 
  CheckSquare, 
  Check, 
  Award, 
  CheckCircle2, 
  ArrowRightCircle,
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Send, 
  Loader2, 
  X,
  ExternalLink
} from 'lucide-react';
import { trackMeta } from '../lib/meta';

// Mentors data
const mentors = [
  {
    name: 'Henrique Gonzalez',
    role: 'Engenheiro Ambiental',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr.png',
    bio: 'Engenheiro Ambiental formado pela UFRJ, com estudos na University of Technology em Sydney, na Austrália e vivência em consultoria com análise espacial de dados e monetização a partir da produção de mapas.'
  },
  {
    name: 'Vitor do Sacramento',
    role: 'Geólogo & Cientista de Dados',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-2.png',
    bio: 'Geólogo (UNB) com MBA em Administração de Bancos de Dados, Cientista de Dados Geoespaciais e líder em Inteligência de Dados com ampla experiência de mercado no setor ambiental e do agronegócio nas áreas de consultoria ambiental, monitoramento do desmatamento, mudanças climáticas e programação aplicada ao geoprocessamento.'
  },
  {
    name: 'Luís Antônio Soares',
    role: 'Eng. Agrimensor e Cartógrafo',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-5.png',
    bio: 'Engenheiro Agrimensor e Cartógrafo (UFU), mestre em Ciências Geodésicas (UFPR), com especialização em Geomarketing (Unyleya).'
  },
  {
    name: 'Ana Beatriz Ulhoa',
    role: 'Engenheira Ambiental & Mestre',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-6.png',
    bio: 'Engenheira Ambiental (Universidade Católica de Brasília), Pós-Graduação em Gestão de Políticas Públicas (Universidade de Brasília/FIOCRUZ), Mestre em Meio Ambiente e Planejamento Regional (Uniderp) e Mestre em Engenharia Bioambiental e da Paisagem (UPV).'
  },
  {
    name: 'Charlie Hudson',
    role: 'Eng. de Produção & Mestre',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-7.png',
    bio: 'Engenheiro de Produção (UNIVERSO), MBA em Projetos (UFJF), Mestre em Administração (UFJF).'
  },
  {
    name: 'Rodolfo Finatti',
    role: 'Geógrafo & PhD',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-4.png',
    bio: 'Geógrafo (UNESP), com especialização em Geoprocessamento (Centro Universitário Senac), Mestre em Geografia, Planejamento Territorial e Mercado Imobiliário, e PhD em Geografia, Planejamento Territorial e Organização Industrial (USP).'
  },
  {
    name: 'Raquel Carnivalle',
    role: 'Doutora em Ambiente e Sociedade',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-3.png',
    bio: 'Doutora em Ambiente e Sociedade (UNICAMP), Mestre em Gestão Integrada em Saúde do Trabalho e Meio Ambiente (SENAC), Bacharel em Ciências Biológicas e licenciada em Ciências (UPM), Coordenadora de MBA em ESG em Sustentabilidade e Economia Circular (CUPAJ).'
  },
  {
    name: 'Bismarck Feuchard',
    role: 'Engenheiro Civil',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/ggsr-8.png',
    bio: 'Engenheiro Civil, atuo principalmente nos ramos da topografia e geodésia, através da certificação de imóveis rurais junto ao Sistema de Gestão Fundiária - INCRA e regularização de imóveis urbanos e rurais.'
  }
];

// Testimonials Ambiental Pro
const testimonialsAmbientalPro = [
  {
    name: 'Emanuela Alves',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/Design-sem-nome-54-1024x1024.png',
    text: '"Cursos de alta qualidade na área de geoprocessamento. Programas completos, plataforma acessível e de fácil manuseio, ótimo atendimento e muitos benefícios para alunos Pro. Investimento que vale a pena!"'
  },
  {
    name: 'Pedro Saft',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/image1009-1024x1024.png',
    text: '"Aprendi praticamente tudo que sei sobre mapas com a Ambiental Pro. Sou muito grato por ter feito esse curso, e recomendo para qualquer um que queira aprender a fazer mapas e trabalhar com isso!"'
  },
  {
    name: 'Halex Engenheiro',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-2-1024x1024.png',
    text: '"Uma excelente instituição de ensino! Os cursos são altamente relevantes, com uma didática clara e envolvente. O suporte oferecido é impecável — sempre atenciosos e prontos para ajudar. Recomendo fortemente!"'
  },
  {
    name: 'Camila Coelho Welerson',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-4-1024x1024.png',
    text: '"Fiz dois cursos na AmbientalPro, o Python e o R GeoDev. E ambos me surpreenderam positivamente! Eu amei a didática, mesmo se você não tiver um contato prévio com as ferramentas, você consegue acompanhar tranquilamente. E o conteúdo superou minha expectativa, material muito completo. A assistência deles também é sensacional! Indico super!"'
  },
  {
    name: 'Tatiane Azevedo',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-5-1024x1024.png',
    text: '"Muito bom o curso. Didática e materiais utilizados de boa qualidade, plataforma instrutiva. Conteúdo atualizado e coerente com a proposta oferecida. Gostei muito. Melhor de tudo que agora é Pós. Super indico."'
  },
  {
    name: 'Amanda Ellen',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-9-1024x1024.png',
    text: '"Ótima instituição de ensino! Aprendi muito ao longo do meu curso e sempre recebi muita atenção, tanto dos professores quanto do setor de atendimento, que são impecáveis. Para quem ainda tem dúvidas sobre se matricular, eu super recomendo!"'
  },
  {
    name: 'Gabriela Diniz',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-3-1024x1024.png',
    text: '"Faço pós-graduação em sensoriamento remoto, mas conheci a instituição para aprender r e digo com convicção que não possuo arrependimentos. O atendimento é rápido e eficiente e as aulas são ensinadas de modo simples, o que é bom pra quem está iniciando e vai progredindo conforme o curso. Os conteúdos possuem uma ótima curva de aprendizagem, visto que vão do básico ao mais avançado."'
  },
  {
    name: 'Fabricio Kauan',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-10-1024x1024.png',
    text: '"Curso do Ambiental Pro foi excelente! Conteúdo atualizado, linguagem acessível e professores com ótima didática. Aprendi muito e me senti realmente mais preparado para atuar na área. Recomendo para todos que querem se aprofundar com qualidade."'
  },
  {
    name: 'Pedro Amaral',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/pedro-1024x1024.png',
    text: '"Equipe muito competente, cursos muito bons e completos. No meu caso, o PAP me ajudou demais em trabalhos da faculdade, participação em artigos científicos como colaborador, venda de mapas e serviços de geoprocessamento, além da inserção no mercado de trabalho com mais competência e segurança!"'
  },
  {
    name: 'Matheus Saraiva',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-7-1024x1024.png',
    text: '"AmbientalPro fornece de cursos do mais alto nível de qualidade no mundo do SIG. Eu fiz os cursos de ArcGIS PRO, Qgis e Geodev. E consegui me destacar por causa deles. Os professores têm uma didática muito boa e são bem competentes na hora de tirar dúvidas."'
  },
  {
    name: 'Karina dos Santos',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-6-1024x1024.png',
    text: '"Sou aluna desde quando lançaram a assinatura vitalícia da plataforma e foi o melhor investimento que fiz! Quem é da área ambiental, com toda certeza irá suprir muito mais do que vocês precisam. Plataforma atualizada, com teoria e prática, excelente didática e ainda vários outros cursos bônus e lives adicionadas na plataforma, com profissionais renomados na área que faz todo um diferencial, sempre atualizado as demandas do mercado!"'
  },
  {
    name: 'Tiago Grespan',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/tiago-1024x1024.png',
    text: '"O curso da Ambiental Pro possui um denso conteúdo de informações, apresentadas de forma clara e aplicável nas diversas esferas da área ambiental. Em termos profissionais, o curso foi um divisor de águas em minha carreira como Engenheiro Florestal, possibilitando apresentar as informações de projetos de forma muito mais clara, robusta e de qualidade estética superior. O curso atende as demandas de mercado e vai além! Possui uma equipe de suporte muito competente e prestativa, a qual auxilia em tempo integral nas diversas dificuldades que o aluno possa ter ao longo do curso. Recomendo!!!"'
  }
];

// Testimonials Pós GGSR
const testimonialsGGSR = [
  {
    name: 'Luan D Olivêira',
    role: 'Engenheiro Agrícola',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/28-1024x1024.png',
    text: '“Excelente pós-graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto! Professores qualificados, disciplinas bem estruturadas e ainda um grupo exclusivo de alunos para networking e oportunidades. Recomendo demais! 🚀 Padrão Ambiental Pro de excelência!”'
  },
  {
    name: 'Robson Matos',
    role: 'Engenheiro Químico',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-20-1024x1024.png',
    text: '“Sou Eng. Químico, e na Defesa Civil Amazonas atuo no Departamento de Prevenção e Engenharia - DPEN. Como agente de Defesa Civil, acompanhando alguns cenários de desastres, percebi que o mapeamento das áreas de forma a refinar os pareceres era necessário. Instalei o notebook e procurei aprender sobre o QGIS, foi quando recebi de uma funcionária da Prefeitura a indicação da Ambiental Pro. Decidi encarar o desafio, e mesmo com o tempo limitado, me inscrevi em dezembro de 2024. Está fazendo muita diferença. Produzi alguns mapas mais simples no início, e hoje junto com o geólogo, sugerimos aos nossos superiores a elaboração de mapeamento das áreas de risco nos 62 municípios amazonenses utilizando pranchas.”'
  },
  {
    name: 'Lucas Guerra',
    role: 'Engenheiro Ambiental',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/30-1024x1024.png',
    text: '“É com satisfação que comunico a conclusão da Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto, pela Universidade Anhanguera - Graduação e Pós Graduação em parceria com Ambiental Pro. Esse título consolida ainda mais minha trajetória na área ambiental, ampliando minhas competências técnicas e reforçando minha atuação como especialista em geoprocessamento e sensoriamento remoto. Com essa nova formação, expando minha atuação também para o campo do georreferenciamento e da regularização fundiária em todo o Brasil, fortalecendo minha capacidade de oferecer soluções completas e integradas para diferentes demandas ambientais e territoriais.”'
  },
  {
    name: 'Bruno Carvalho',
    role: 'Engenheiro Florestal',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/MBA-Depoimentos-Participantes-21-1024x1024.png',
    text: '“Concluí mais uma etapa importante da minha trajetória profissional! Finalizei a Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto pela Anhanguera Educacional (Ambiental Pro). Esse aprendizado amplia minha capacidade de integrar análises ambientais, florestais e geoespaciais, fortalecendo minha atuação em projetos de manejo sustentável, conservação e monitoramento territorial. Sigo motivado pelo aprendizado contínuo e pela aplicação prática desse conhecimento em soluções técnicas que contribuam para o uso responsável dos recursos naturais. 🌱🌍 Obrigado Ambiental Pro pela oportunidade!”'
  },
  {
    name: 'Lucas Oliveira',
    role: 'Analista de Geoprocessamento',
    image: 'https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/29-1024x1024.png',
    text: '“Com satisfação, compartilho a finalização da minha Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto, realizada pelo Centro Universitário Anhanguera Pitágoras Unopar de Niterói, totalizando 440 horas de aprendizado intensivo da Ambiental Pro. Durante essa jornada, aprofundei meus conhecimentos em áreas como cartografia, sensoriamento remoto, perícia ambiental e programação aplicada, adquirindo habilidades técnicas e ampliando minha visão estratégica no campo das geotecnologias. Sou grato aos professores e colegas que contribuíram para essa experiência enriquecedora. Agora, sigo motivado e preparado para aplicar esse conhecimento em projetos que promovam soluções sustentáveis e inovadoras na área ambiental.”'
  }
];

// Disciplines
const disciplines = [
  'Geotecnologias aplicadas à área ambiental',
  'Sensoriamento Remoto e Processamento Digital de Imagens',
  'Cartografia: Fundamentos, Técnicas e Ferramentas',
  'Referência Espacial e Geodésia',
  'Topografia aplicada ao georreferenciamento',
  'Agrimensura legal',
  'Perícia Ambiental',
  'Fundamentos de Programação para Ciência de Dados Ambientais',
  'Gerenciamento de Bancos de Dados e Big Data aplicado à Área Ambiental',
  'WebMaps e Dashboards: Visualização Interativa de Dados',
  'Gerenciamento de Processos'
];

// Key Info Highlights
const keyInfos = [
  { icon: Laptop, text: 'Aulas e avaliações 100% online' },
  { icon: Hourglass, text: 'Duração estimada de 12 meses' },
  { icon: Clock, text: '440h de carga horária' },
  { icon: CheckSquare, text: 'Provas objetivas com 3 tentativas por disciplina' },
  { icon: Check, text: 'Título de Especialista em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto' },
  { icon: Award, text: 'Diploma certificado pelo Ministério da Educação (MEC)' },
  { icon: CheckCircle2, text: 'Registrada formalmente no Sistema CONFEA/CREA' }
];

export default function ListaDeEsperaLp2() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mentorIndex, setMentorIndex] = useState(0);
  const [testiAPIndex, setTestiAPIndex] = useState(0);

  const [mentorTouchStart, setMentorTouchStart] = useState<number | null>(null);
  const [mentorTouchEnd, setMentorTouchEnd] = useState<number | null>(null);

  const [testiGGSRIndex, setTestiGGSRIndex] = useState(0);
  const [ggsrTouchStart, setGgsrTouchStart] = useState<number | null>(null);
  const [ggsrTouchEnd, setGgsrTouchEnd] = useState<number | null>(null);

  const nextMentor = () => {
    setMentorIndex((prev) => (prev < mentors.length - 1 ? prev + 1 : 0));
  };

  const prevMentor = () => {
    setMentorIndex((prev) => (prev > 0 ? prev - 1 : mentors.length - 1));
  };

  const handleMentorTouchStart = (e: React.TouchEvent) => {
    setMentorTouchEnd(null);
    setMentorTouchStart(e.targetTouches[0].clientX);
  };

  const handleMentorTouchMove = (e: React.TouchEvent) => {
    setMentorTouchEnd(e.targetTouches[0].clientX);
  };

  const handleMentorTouchEnd = () => {
    if (!mentorTouchStart || !mentorTouchEnd) return;
    const distance = mentorTouchStart - mentorTouchEnd;
    if (distance > 50) {
      nextMentor();
    } else if (distance < -50) {
      prevMentor();
    }
  };

  const nextGGSR = () => {
    setTestiGGSRIndex((prev) => (prev < testimonialsGGSR.length - 1 ? prev + 1 : 0));
  };

  const prevGGSR = () => {
    setTestiGGSRIndex((prev) => (prev > 0 ? prev - 1 : testimonialsGGSR.length - 1));
  };

  const handleGGSRTouchStart = (e: React.TouchEvent) => {
    setGgsrTouchEnd(null);
    setGgsrTouchStart(e.targetTouches[0].clientX);
  };

  const handleGGSRTouchMove = (e: React.TouchEvent) => {
    setGgsrTouchEnd(e.targetTouches[0].clientX);
  };

  const handleGGSRTouchEnd = () => {
    if (!ggsrTouchStart || !ggsrTouchEnd) return;
    const distance = ggsrTouchStart - ggsrTouchEnd;
    if (distance > 50) {
      nextGGSR();
    } else if (distance < -50) {
      prevGGSR();
    }
  };
  
  // Modal Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    graduacao: 'Sim',
    area: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Send ViewContent on load
  const viewContentSent = useRef(false);
  useEffect(() => {
    document.title = "Lista de Espera | Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto";
    if (viewContentSent.current) return;
    viewContentSent.current = true;
    trackMeta('ViewContent', {
      customData: {
        content_name: 'Pós GGSR',
        content_category: 'lista-de-esperalp2',
      },
    });
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanTel = formData.telefone.replace(/\D/g, '');
    if (cleanTel.length < 10 || cleanTel.length > 11) {
      alert('Por favor, insira um número de telefone com DDD válido (ex: 21999999999).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);

    const urlParams = new URLSearchParams(window.location.search);
    const getUtmParam = (base: string) => {
      if (urlParams.has(base)) return urlParams.get(base);
      for (const [key, value] of urlParams.entries()) {
        if (key.toLowerCase().includes(base)) return value;
      }
      return '';
    };

    const utmParams = {
      utm_source: getUtmParam('utm_source'),
      utm_medium: getUtmParam('utm_medium'),
      utm_campaign: getUtmParam('utm_campaign'),
      utm_term: getUtmParam('utm_term'),
      utm_content: getUtmParam('utm_content'),
    };

    try {
      const metaOptions = {
        customData: {
          content_name: 'Pós GGSR',
          content_category: 'lista-de-esperalp2',
        },
        userData: {
          nome: formData.nome,
          email: formData.email,
          telefone: cleanTel,
        },
      };

      trackMeta('Lead', metaOptions);

      if (formData.graduacao.toLowerCase() === 'sim') {
        window.dataLayer?.push({ event: 'lead_qualificado' });
        trackMeta('lead_qualificado', metaOptions);
      }

      const apiUrl = import.meta.env.BASE_URL + 'api/subscribe';
      fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: formData.nome,
          email: formData.email,
          telefone: cleanTel,
          formacao: formData.graduacao,
          area: formData.area,
          ...utmParams
        }),
      }).catch(err => console.error('Erro silencioso API ActiveCampaign:', err));

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-[#F2F2F2] font-sans antialiased selection:bg-[#3BA2D9] selection:text-[#0A0D1A] overflow-x-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 md:px-8 flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/5">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60"
          style={{
            backgroundImage: `url('https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/12/FUNDO-1-scaled.png')`,
          }}
        />
        
        {/* Overlays for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#07090e]/70 to-[#07090e] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#24b8bc]/15 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* GGSR 3D Logo / Artwork */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-[320px] md:max-w-[420px] mb-6"
          >
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/12/GGSR.png" 
              alt="Pós-Graduação em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto"
              className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,159,206,0.35)]"
            />
          </motion.div>



          {/* Pulse CTA Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
            className="w-full max-w-md py-5 px-8 rounded-xl font-black text-base md:text-lg uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_45px_rgba(250,204,21,0.8)] transition-all cursor-pointer flex items-center justify-center animate-pulse text-balance"
          >
            <span>QUERO GARANTIR A MELHOR&nbsp;OFERTA</span>
          </motion.button>
        </div>
      </section>

      {/* 2. INFORMAÇÕES SOBRE A PÓS-GRADUAÇÃO GGSR */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl p-4 md:p-8 bg-gradient-to-r from-[#24b8bc]/20 via-[#009fce]/20 to-[#005a92]/20 border border-[#24b8bc]/30 mb-10 text-center shadow-lg">
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white text-balance">
            Veja as informações sobre a Pós-Graduação&nbsp;GGSR
          </h2>
        </div>

        <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl space-y-5">
          {keyInfos.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors"
              >
                <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 text-black shrink-0 mt-0.5 shadow-md">
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-base md:text-lg font-medium text-white/90 pt-1 leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. DISCIPLINAS */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="rounded-2xl p-4 md:p-8 bg-gradient-to-r from-[#24b8bc]/20 via-[#009fce]/20 to-[#005a92]/20 border border-[#24b8bc]/30 mb-10 text-center shadow-lg">
          <h2 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white">
            Disciplinas
          </h2>
        </div>

        <div className="bg-[#0e131f]/90 border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {disciplines.map((disc, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-colors"
              >
                <ArrowRightCircle className="w-6 h-6 text-yellow-400 shrink-0" />
                <span className="text-sm md:text-base font-semibold text-white/95 leading-snug">
                  {disc}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
            className="w-full max-w-md py-5 px-8 rounded-xl font-black text-base md:text-lg uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_45px_rgba(250,204,21,0.8)] transition-all cursor-pointer text-balance"
          >
            <span>REALIZAR MATRÍCULA&nbsp;AGORA</span>
          </motion.button>
        </div>
      </section>

      {/* 4. INFINITE MARQUEE TICKER 1 */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#24b8bc] via-[#009fce] to-[#005a92] py-4 md:py-6 shadow-inner my-10 whitespace-nowrap">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-14 mx-4 md:mx-6 text-black font-extrabold text-xl md:text-3xl tracking-widest uppercase whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap">GEORREFERENCIAMENTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GEOPROCESSAMENTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">SENSORIAMENTO&nbsp;REMOTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CONHEÇA OS SEUS MENTORES */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white mb-4 text-balance">
            Conheça os seus mentores
          </h2>
          <p className="text-[#F2F2F2]/60 text-base md:text-lg max-w-2xl mx-auto text-pretty">
            Aprenda diretamente com especialistas renomados, com vasta vivência de mercado e rigor acadêmico.
          </p>
        </div>

        {/* Carousel for Mentors */}
        <div className="relative w-full carousel-container group/mentor-carousel">
          {/* Desktop Floating Arrows */}
          <button
            onClick={prevMentor}
            className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/mentor-carousel:opacity-100"
            aria-label="Professor Anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </button>

          <button
            onClick={nextMentor}
            className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/mentor-carousel:opacity-100"
            aria-label="Próximo Professor"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </button>

          {/* Viewport Mask */}
          <div className="overflow-hidden w-full py-4 px-1">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(calc(-${mentorIndex} * var(--slide-step)), 0, 0)`,
              }}
              onTouchStart={handleMentorTouchStart}
              onTouchMove={handleMentorTouchMove}
              onTouchEnd={handleMentorTouchEnd}
            >
              {mentors.map((mentor, idx) => (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] xl:w-[calc(25%-18px)] bg-[#0e131f] border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col hover:border-[#24b8bc]/50 transition-all group"
                >
                  <div className="relative aspect-square w-full bg-slate-900 overflow-hidden">
                    <img 
                      src={mentor.image} 
                      alt={mentor.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f] via-transparent to-transparent opacity-80" />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#24b8bc] transition-colors text-balance">
                        {mentor.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#3BA2D9] uppercase tracking-wider mb-4">
                        {mentor.role}
                      </p>
                      <p className="text-sm text-[#F2F2F2]/70 leading-relaxed text-pretty">
                        {mentor.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls & Pagination Dots */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevMentor}
              className="p-3 rounded-full bg-white/10 hover:bg-[#24b8bc] hover:text-black transition-all cursor-pointer sm:hidden"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {mentors.map((_, dot) => (
                <button
                  key={dot}
                  onClick={() => setMentorIndex(dot)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    mentorIndex === dot ? 'bg-[#24b8bc] w-7' : 'bg-white/20 w-2.5'
                  }`}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextMentor}
              className="p-3 rounded-full bg-white/10 hover:bg-[#24b8bc] hover:text-black transition-all cursor-pointer sm:hidden"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. DEPOIMENTOS AMBIENTAL PRO */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-3 text-balance">
            O QUE OS ALUNOS ESTÃO FALANDO DA AMBIENTAL&nbsp;PRO
          </h3>
          <p className="text-[#F2F2F2]/60 text-sm md:text-base text-pretty">
            Milhares de profissionais formados e transformados pela nossa metodologia.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialsAmbientalPro.slice(testiAPIndex * 3, testiAPIndex * 3 + 3).map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-[#0e131f] border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col justify-between relative hover:border-[#24b8bc]/40 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#24b8bc]"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="font-bold text-white text-base md:text-lg text-balance">{item.name}</h4>
                      <div className="flex text-amber-400 text-xs">★★★★★</div>
                    </div>
                  </div>
                  <p className="text-sm text-[#F2F2F2]/80 leading-relaxed italic text-pretty">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setTestiAPIndex((prev) => (prev > 0 ? prev - 1 : 3))}
              className="p-3 rounded-full bg-white/10 hover:bg-[#24b8bc] hover:text-black transition-all cursor-pointer"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((dot) => (
                <button
                  key={dot}
                  onClick={() => setTestiAPIndex(dot)}
                  className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                    testiAPIndex === dot ? 'bg-[#24b8bc] w-6' : 'bg-white/20'
                  }`}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => setTestiAPIndex((prev) => (prev < 3 ? prev + 1 : 0))}
              className="p-3 rounded-full bg-white/10 hover:bg-[#24b8bc] hover:text-black transition-all cursor-pointer"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* 7. DEPOIMENTOS ESPECÍFICOS DA PÓS GGSR */}
      <section className="py-16 px-4 md:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-4xl font-extrabold uppercase tracking-tight text-white mb-3 text-balance">
            O QUE OS ALUNOS ESTÃO FALANDO DA PÓS&nbsp;GGSR
          </h3>
          <p className="text-[#F2F2F2]/60 text-sm md:text-base text-pretty">
            Depoimentos reais de quem já conquistou o título de Especialista&nbsp;GGSR.
          </p>
        </div>

        {/* Carousel for Pós GGSR Testimonials */}
        <div className="relative w-full carousel-container group/ggsr-carousel mb-12">
          {/* Desktop Floating Arrows */}
          <button
            onClick={prevGGSR}
            className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/ggsr-carousel:opacity-100"
            aria-label="Depoimento Anterior"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </button>

          <button
            onClick={nextGGSR}
            className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-20 p-3 md:p-3.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 active:scale-95 transition-all cursor-pointer hidden sm:flex items-center justify-center opacity-0 group-hover/ggsr-carousel:opacity-100"
            aria-label="Próximo Depoimento"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-black" />
          </button>

          {/* Viewport Mask */}
          <div className="overflow-hidden w-full py-4 px-1">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(calc(-${testiGGSRIndex} * var(--slide-step)), 0, 0)`,
              }}
              onTouchStart={handleGGSRTouchStart}
              onTouchMove={handleGGSRTouchMove}
              onTouchEnd={handleGGSRTouchEnd}
            >
              {testimonialsGGSR.map((item, idx) => (
                <div
                  key={idx}
                  className="snap-start shrink-0 w-full sm:w-[calc(50%-12px)] bg-[#0e131f] border border-white/10 rounded-2xl p-6 md:p-8 shadow-xl flex flex-col justify-between hover:border-[#24b8bc]/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
                        loading="lazy"
                      />
                      <div>
                        <h4 className="font-bold text-white text-lg text-balance">{item.name}</h4>
                        <p className="text-xs font-semibold text-[#3BA2D9] uppercase tracking-wider">{item.role}</p>
                        <div className="flex text-amber-400 text-xs mt-1">★★★★★</div>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-[#F2F2F2]/85 leading-relaxed text-pretty">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls & Pagination Dots */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevGGSR}
              className="p-3 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black transition-all cursor-pointer sm:hidden"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonialsGGSR.map((_, dot) => (
                <button
                  key={dot}
                  onClick={() => setTestiGGSRIndex(dot)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    testiGGSRIndex === dot ? 'bg-yellow-400 w-7' : 'bg-white/20 w-2.5'
                  }`}
                  aria-label={`Slide ${dot + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextGGSR}
              className="p-3 rounded-full bg-white/10 hover:bg-yellow-400 hover:text-black transition-all cursor-pointer sm:hidden"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
            className="w-full max-w-md py-5 px-8 rounded-xl font-black text-base md:text-lg uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] hover:shadow-[0_0_45px_rgba(250,204,21,0.8)] transition-all cursor-pointer text-balance"
          >
            <span>QUERO REALIZAR MINHA MATRÍCULA</span>
          </motion.button>
        </div>
      </section>

      {/* 8. INFINITE MARQUEE TICKER 2 */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#24b8bc] via-[#009fce] to-[#005a92] py-4 md:py-6 shadow-inner my-10 whitespace-nowrap">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-14 mx-4 md:mx-6 text-black font-extrabold text-xl md:text-3xl tracking-widest uppercase whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap">GEORREFERENCIAMENTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GEOPROCESSAMENTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">SENSORIAMENTO&nbsp;REMOTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 9. DIPLOMA CERTIFICADO PELO MEC */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-[#0e131f] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/mockup_certificado_-_ggsr-1024x879.png" 
              alt="Diploma Certificado MEC Pós GGSR"
              className="w-full max-w-[420px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight text-balance">
              Diploma certificado pelo&nbsp;MEC
            </h2>
            <p className="text-[#F2F2F2]/80 text-base md:text-lg leading-relaxed text-pretty">
              Ao concluir a Pós-Graduação, você receberá o diploma de <strong>Especialista em Georreferenciamento, Geoprocessamento e Sensoriamento Remoto</strong>, reconhecido oficialmente pelo Ministério da Educação&nbsp;(MEC).
            </p>
            <div className="pt-2 flex justify-center md:justify-start">
              <img 
                src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/tamanhos-variados-LOGOS-ATUALIZADAS-23.png" 
                alt="MEC Logo" 
                className="h-14 w-auto opacity-90"
                loading="lazy"
              />
            </div>
            <p className="text-sm text-[#F2F2F2]/60 text-pretty">
              Para consultar o status de certificação da nossa Pós-Graduação no e-MEC, acesse o portal do e-MEC e utilize o código <strong>274952</strong>.
            </p>
            <div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={openModal}
                className="w-full md:w-auto py-4 px-8 rounded-xl font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-lg cursor-pointer text-balance"
              >
                <span>QUERO REALIZAR MINHA MATRÍCULA</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* 10. REGISTRO OFICIAL NO CREA */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-[#0e131f] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 space-y-5 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight text-balance">
              Registro Oficial no&nbsp;CREA
            </h2>
            <div className="text-[#F2F2F2]/80 text-sm md:text-base leading-relaxed space-y-3 text-pretty">
              <p>Você sabia que a nossa Pós em GGSR é devidamente registrada no CREA-RJ?</p>
              <p>A estrutura da PÓS GGSR segue a <strong>Decisão Normativa 116 do Confea</strong>, que rege os conteúdos necessários para você solicitar a extensão à atribuição profissional para serviços de Georreferenciamento.</p>
              <p>Mas isso basta? Não. Para a extensão ser solicitada, o curso precisa, obrigatoriamente, <strong>estar registrado formalmente no Sistema CONFEA/CREA</strong>.</p>
              <p>Ao concluir o curso, você envia seu diploma ao CREA do seu estado e solicita a extensão de atribuição para atuar com respaldo legal.</p>
            </div>
            
            <div className="pt-2 flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start">
              <img 
                src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/10/tamanhos-variados-LOGOS-ATUALIZADAS-2025-10-10T183608.421.png" 
                alt="CREA RJ" 
                className="h-12 w-auto opacity-90"
                loading="lazy"
              />
              <a 
                href="https://creaonline.crea-rj.org.br/creaOnLine/home/gerenciarAtendimento.do?funcao=relacaoEscolasCursosTela1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs md:text-sm text-[#24b8bc] hover:underline font-semibold"
              >
                <span>Consultar registro no CREA/RJ</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={openModal}
                className="w-full md:w-auto py-4 px-8 rounded-xl font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-lg cursor-pointer text-balance"
              >
                <span>QUERO REALIZAR MINHA MATRÍCULA</span>
              </motion.button>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/10/29.09.25-STORY-CREA-1024x865.png" 
              alt="Story CREA Pós GGSR"
              className="w-full max-w-[420px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] rounded-2xl"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 11. DIPLOMA DE PESO NO SEU CURRÍCULO (ANHANGUERA NOTA 5) */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="bg-[#0e131f] border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/10/tamanhos-variados-LOGOS-ATUALIZADAS-2025-10-10T192742.394-1024x1024.png" 
              alt="Anhanguera Nota 5 MEC"
              className="w-full max-w-[340px] h-auto drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase text-white tracking-tight text-balance">
              Tenha um diploma de peso no seu currículo
            </h2>
            <p className="text-[#F2F2F2]/80 text-base md:text-lg leading-relaxed text-pretty">
              Esta pós-graduação é certificada pela <strong>Anhanguera</strong>, instituição com <strong>conceito máximo (nota 5) no MEC</strong>, assegurando excelência acadêmica e reconhecimento em todo o território nacional.
            </p>
            <div>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={openModal}
                className="w-full md:w-auto py-4 px-8 rounded-xl font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-lg cursor-pointer text-balance"
              >
                <span>QUERO REALIZAR MINHA MATRÍCULA</span>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. INFINITE MARQUEE TICKER 3 */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#24b8bc] via-[#009fce] to-[#005a92] py-4 md:py-6 shadow-inner my-10 whitespace-nowrap">
        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] w-max">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 md:gap-14 mx-4 md:mx-6 text-black font-extrabold text-xl md:text-3xl tracking-widest uppercase whitespace-nowrap shrink-0">
              <span className="whitespace-nowrap">GEORREFERENCIAMENTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GEOPROCESSAMENTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">SENSORIAMENTO&nbsp;REMOTO</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
              <span className="whitespace-nowrap">GGSR</span>
              <span className="opacity-40 whitespace-nowrap">•</span>
            </div>
          ))}
        </div>
      </div>

      {/* 13. INSTITUIÇÕES DE ENSINO (AMBIENTAL PRO & ANHANGUERA) */}
      <section className="py-16 px-4 md:px-8 max-w-5xl mx-auto space-y-10">
        {/* Ambiental Pro */}
        <div className="bg-[#0e131f] border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/27.png" 
              alt="Ambiental Pro" 
              className="max-h-24 w-auto"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left space-y-3">
            <h3 className="text-2xl font-bold text-white uppercase text-balance">Instituição de Ensino Ambiental Pro</h3>
            <p className="text-sm text-[#F2F2F2]/75 leading-relaxed text-pretty">
              Fundada em 2019, a Ambiental Pro é uma instituição de ensino especializada na capacitação tecnológica de profissionais da área ambiental. Nossa missão é preparar os profissionais para os desafios do setor ambiental, proporcionando segurança, confiança e habilidades técnicas de ponta. Através de nossos cursos, focamos no uso das Geotecnologias, análise de dados e programação, capacitando os alunos para aplicarem essas ferramentas de maneira estratégica e inovadora.
            </p>
          </div>
        </div>

        {/* Anhanguera */}
        <div className="bg-[#0e131f] border border-white/10 rounded-3xl p-8 md:p-10 shadow-xl flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/3 flex justify-center">
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/09/logo-anhanguera-contraste_1.png" 
              alt="Anhanguera" 
              className="max-h-24 w-auto"
              loading="lazy"
            />
          </div>
          <div className="w-full md:w-2/3 text-center md:text-left space-y-3">
            <h3 className="text-2xl font-bold text-white uppercase text-balance">Instituição de Ensino Anhanguera</h3>
            <p className="text-sm text-[#F2F2F2]/75 leading-relaxed text-pretty">
              Com mais de 50 anos de história, a Anhanguera é uma das maiores instituições de ensino superior do Brasil, oferecendo cursos de graduação, pós-graduação e extensão em diversas áreas do conhecimento. Com mais de 15 mil profissionais, entre especialistas, mestres e doutores, a instituição se destaca pelo seu compromisso com a educação de qualidade, impactando positivamente a formação de milhares de alunos em todo o país.
            </p>
          </div>
        </div>

        <div className="text-center pt-4">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={openModal}
            className="w-full max-w-md py-5 px-8 rounded-xl font-black text-base md:text-lg uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 shadow-[0_0_30px_rgba(250,204,21,0.5)] cursor-pointer text-balance"
          >
            <span>REALIZAR MATRÍCULA</span>
          </motion.button>
        </div>
      </section>

      {/* 14. SOCIAL & FOOTER */}
      <footer className="bg-black/80 border-t border-white/10 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Social Links */}
          <div className="flex items-center justify-center gap-4">
            <a 
              href="https://youtube.com/@ambientalpro?si=iUV2PSan5GyEqoqZ" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 hover:bg-red-600/80 text-white transition-all shadow-md"
              aria-label="YouTube"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a 
              href="https://www.linkedin.com/company/37822748/admin/dashboard/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 hover:bg-[#0077B5] text-white transition-all shadow-md"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/ambientalpro/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/5 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 text-white transition-all shadow-md"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>

          {/* Partner and Institutional Banner */}
          <div className="flex justify-center">
            <img 
              src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/10/tamanhos-variados-LOGOS-ATUALIZADAS-2025-10-06T180003.813-1024x576.png" 
              alt="Logos de Parcerias e Certificações" 
              className="max-h-28 md:max-h-36 w-auto opacity-80 hover:opacity-100 transition-opacity"
              loading="lazy"
            />
          </div>

          <p className="text-xs text-white/40 tracking-widest uppercase">
            © {new Date().getFullYear()} Pós-Graduação em GGSR • Ambiental Pro. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* 15. POPUP / LEAD CAPTURE MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-[#0e131f] border border-amber-400/40 p-8 md:p-10 rounded-2xl shadow-[0_0_50px_rgba(250,204,21,0.25)] overflow-hidden z-10"
            >
              {/* Header stripe glow */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500" />
              
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
                aria-label="Fechar modal"
              >
                <X className="w-6 h-6" />
              </button>

              {isSubmitted ? (
                <div className="text-center space-y-6 pt-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-yellow-400/20 flex items-center justify-center border border-yellow-400/40">
                    <Check className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-primary">
                    Inscrição Confirmada!
                  </h3>
                  <p className="text-[#F2F2F2]/75 text-sm md:text-base max-w-sm mx-auto leading-relaxed">
                    Ficamos muito felizes pelo seu interesse na Pós GGSR! Nossa equipe entrará em contato com você via WhatsApp com a melhor oferta.
                  </p>
                  <button
                    onClick={closeModal}
                    className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer mt-4"
                  >
                    Fechar
                  </button>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-6">
                    <img 
                      src="https://www.lp.ambientalpro.com.br/wp-content/uploads/2025/07/26.png" 
                      alt="Logo Pós GGSR" 
                      className="h-10 mx-auto mb-3 opacity-90"
                      loading="lazy"
                    />
                    <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight">
                      Preencha suas informações
                    </h3>
                    <p className="text-xs md:text-sm text-yellow-400 mt-1 font-medium">
                      Garanta desconto exclusivo para a próxima turma
                    </p>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="modal-nome" className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5">
                        Nome Completo
                      </label>
                      <input
                        required
                        type="text"
                        id="modal-nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="modal-email" className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5">
                          E-mail
                        </label>
                        <input
                          required
                          type="email"
                          id="modal-email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <label htmlFor="modal-tel" className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5">
                          Telefone (com DDD)
                        </label>
                        <input
                          required
                          type="tel"
                          id="modal-tel"
                          value={formData.telefone}
                          onChange={(e) => setFormData({ ...formData, telefone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                          placeholder="21999999999"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="modal-grad" className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5">
                        Você possui graduação completa?
                      </label>
                      <div className="relative">
                        <select
                          id="modal-grad"
                          required
                          value={formData.graduacao}
                          onChange={(e) => setFormData({ 
                            ...formData, 
                            graduacao: e.target.value,
                            area: e.target.value === 'Não' ? '' : formData.area 
                          })}
                          className="w-full bg-[#0e131f] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer appearance-none pr-10"
                        >
                          <option value="Sim" className="bg-[#0e131f] text-white">Sim</option>
                          <option value="Não" className="bg-[#0e131f] text-white">Não</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {formData.graduacao === 'Sim' && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <label htmlFor="modal-area" className="block text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1.5">
                          Qual é a sua área de formação?
                        </label>
                        <input
                          required
                          type="text"
                          id="modal-area"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-yellow-400 transition-colors"
                          placeholder="Ex: Engenharia Ambiental, Biologia, Agronomia..."
                        />
                      </motion.div>
                    )}

                    <button
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full mt-6 py-5 px-6 rounded-xl font-black text-base md:text-lg uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:via-yellow-300 hover:to-amber-400 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(250,204,21,0.55)] hover:shadow-[0_0_35px_rgba(250,204,21,0.8)]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin text-black" />
                          <span>Processando...</span>
                        </>
                      ) : (
                        <>
                          <span>ENTRAR NA LISTA</span>
                          <Send className="w-6 h-6 text-black" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
