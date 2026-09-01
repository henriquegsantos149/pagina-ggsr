import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { trackMeta } from '../lib/meta';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutUrl: string;
  isWaitingList?: boolean;
}

export default function LeadCaptureModal({ isOpen, onClose, checkoutUrl, isWaitingList = false }: LeadCaptureModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    formacao: '',
    area: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Por favor, insira um e-mail válido.');
      return;
    }

    setIsSubmitting(true);

    const urlParams = new URLSearchParams(window.location.search);
    
    // Função helper para buscar UTM (padrão ou variação que contenha a palavra)
    const getUtmParam = (base: string) => {
      if (urlParams.has(base)) return urlParams.get(base);
      
      for (const [key, value] of urlParams.entries()) {
        if (key.toLowerCase().includes(base)) {
          return value;
        }
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
      if (!isWaitingList) {
        // Google Apps Script Webhook URL
        const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbyn6jedHtgyEzRVq1l1AjqB6wBAG8pVh6niLEyOd8ttRSLrCj7vcH0idK8LI6Zbgh5Arg/exec';
        
        // We use no-cors because Apps Script doesn't support CORS POSTs properly from browsers without a redirect dance, 
        // but 'no-cors' allows the request to be sent even if we can't read the response.
        fetch(WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          keepalive: true,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            course: 'pós-ggsr'
          }),
        });
      }

      if (isWaitingList) {
        const isLp2 = typeof window !== 'undefined' && window.location.pathname.includes('lista-de-esperalp2');
        const metaOptions = {
          customData: {
            content_name: 'Pós GGSR',
            content_category: isLp2 ? 'lista-de-esperalp2' : 'lista-de-espera',
          },
          userData: {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
          },
        };

        // Lead para todo submit — antes disso, quem respondia "não" na
        // formação não gerava evento nenhum.
        trackMeta('Lead', metaOptions);

        if (formData.formacao.toLowerCase() === 'sim') {
          window.dataLayer?.push({ event: 'lead_qualificado' });
          trackMeta('lead_qualificado', metaOptions);
        }

        // Enviar para a API do ActiveCampaign na Vercel (apenas na lista de espera, sem bloquear o fluxo)
        // Usamos import.meta.env.BASE_URL para respeitar o subdiretório (ex: /posggsr/)
        const apiUrl = import.meta.env.BASE_URL + 'api/subscribe';
        
        fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            ...utmParams
          }),
        }).catch(err => console.error('Erro silencioso API ActiveCampaign:', err));

        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        // Redirect almost immediately to feel faster (perceived performance)
        setTimeout(() => {
          window.location.href = checkoutUrl;
        }, 50);
      }

    } catch (error) {
      console.error('Error submitting form:', error);
      if (isWaitingList) {
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        // Even on error, redirect to checkout so the user doesn't get stuck
        window.location.href = checkoutUrl;
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[var(--color-brand-dark)] border border-white/10 p-8 md:p-10 shadow-2xl shape-leaf overflow-hidden"
          >
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-brand-gradient"></div>
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--color-brand-primary)]/10 blur-[80px] rounded-full"></div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {isSubmitted ? (
              <div className="relative z-10 text-center space-y-6 pt-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center border border-[var(--color-brand-primary)]/30">
                  <Check className="w-8 h-8 text-[var(--color-brand-primary)]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-primary">
                  Inscrição Confirmada!
                </h3>
                <p className="text-[var(--color-brand-light)]/70 font-secondary max-w-sm mx-auto leading-relaxed">
                  Ficamos muito felizes pelo seu interesse em se especializar conosco! Nossa equipe entrará em contato com você em breve.
                </p>

                <button
                  onClick={onClose}
                  className="shape-leaf w-full bg-brand-gradient text-[var(--color-brand-dark)] font-bold py-4 rounded-xl uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-primary mt-4"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <div className="relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold mb-2 font-primary text-white uppercase tracking-tight">
                  {isWaitingList ? 'Lista de Espera' : 'Falta pouco!'}
                </h3>
                {isWaitingList ? (
                  <div className="bg-[var(--color-brand-primary)]/10 border border-[var(--color-brand-primary)]/30 rounded-lg p-4 mb-8 shadow-inner">
                    <p className="text-white font-primary font-bold text-sm md:text-base leading-relaxed text-left">
                      Preencha os dados abaixo para entrar na lista de espera da Pós GGSR e garantir um <span className="text-[var(--color-brand-primary)]">desconto exclusivo</span>.
                    </p>
                  </div>
                ) : (
                  <p className="text-[var(--color-brand-light)]/60 mb-8 font-secondary text-sm md:text-base">
                    Preencha os dados abaixo para continuar sua inscrição na Pós GGSR.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="nome" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-2 font-primary">
                      Nome Completo
                    </label>
                    <input
                      required
                      type="text"
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors font-secondary"
                      placeholder="Seu nome aqui"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-2 font-primary">
                        E-mail
                      </label>
                      <input
                        required
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors font-secondary"
                        placeholder="email@exemplo.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="telefone" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-2 font-primary">
                        Telefone / WhatsApp
                      </label>
                      <input
                        required
                        type="tel"
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors font-secondary"
                        placeholder="11999999999"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="formacao" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-2 font-primary">
                      Possui Formação?
                    </label>
                    <div className="relative">
                      <select
                        id="formacao"
                        required
                        value={formData.formacao}
                        onChange={(e) => setFormData({ ...formData, formacao: e.target.value, area: e.target.value === 'não' ? '' : formData.area })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors font-secondary appearance-none pr-10 cursor-pointer"
                      >
                        <option value="" disabled className="bg-[var(--color-brand-dark)] text-white/50">Selecione...</option>
                        <option value="sim" className="bg-[var(--color-brand-dark)] text-white">Sim</option>
                        <option value="não" className="bg-[var(--color-brand-dark)] text-white">Não</option>
                      </select>
                      <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                    
                    {formData.formacao === 'sim' && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <label htmlFor="area" className="block text-xs font-bold uppercase tracking-widest text-[var(--color-brand-primary)] mb-2 font-primary">
                          Área de Formação
                        </label>
                        <input
                          required
                          type="text"
                          id="area"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-primary)] transition-colors font-secondary"
                          placeholder="Ex: Engenharia"
                        />
                      </motion.div>
                    )}

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-brand-gradient text-[var(--color-brand-dark)] font-black uppercase tracking-wider py-5 px-6 text-base md:text-lg rounded-xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 font-primary mt-6 cursor-pointer shadow-lg shadow-[var(--color-brand-primary)]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Processando...</span>
                      </>
                    ) : (
                      <>
                        <span>{isWaitingList ? 'Entrar na Lista de Espera' : 'Continuar para Inscrição'}</span>
                        <Send className="w-6 h-6" />
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
  );
}
