import { useEffect, useRef, useState } from 'react';
import './black-friday.css';

// Datas da campanha no horário de Brasília (UTC−03:00).
const BLACK_FRIDAY_START = Date.parse('2026-10-23T08:00:00-03:00');
const GGSR_START = Date.parse('2026-11-11T00:00:00-03:00');
const PAP_START = Date.parse('2026-11-18T00:00:00-03:00');
const POPUP_END = Date.parse('2026-11-24T23:59:00-03:00');

function getBlackFridayCampaign(now = Date.now()) {
  if (now >= PAP_START) return {
    href: 'https://www.ambientalpro.com.br/pap/black',
    description: 'Sua evolução profissional não precisa ter prazo de validade. Conheça o PAP 5.0 Vitalício e aproveite as condições da Black Friday da Ambiental Pro.',
    button: 'Quero conhecer o PAP Vitalício',
    banner: 'Conheça o PAP 5.0 Vitalício.',
  };
  if (now >= GGSR_START) return {
    href: 'https://aulamagna.ambientalpro.com.br/ggsr',
    description: 'Dê o próximo passo na sua carreira ambiental. Participe da Aula Magna de Georreferenciamento, Geoprocessamento e Sensoriamento Remoto e conheça as condições da nossa Black Friday.',
    button: 'Quero participar da Aula Magna',
    banner: 'Participe da Aula Magna GGSR.',
  };
  return {
    href: 'https://aulamagna.ambientalpro.com.br/iama',
    description: 'Dê o próximo passo na sua carreira ambiental. Participe da Aula Magna de Inteligência Artificial aplicada ao Meio Ambiente e conheça as condições da nossa Black Friday.',
    button: 'Quero participar da Aula Magna',
    banner: 'Participe da Aula Magna IAMA.',
  };
}

export default function BlackFridayNotice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const campaignActive = currentTime >= BLACK_FRIDAY_START;
  const popupActive = campaignActive && currentTime < POPUP_END;
  const campaign = getBlackFridayCampaign(currentTime);

  useEffect(() => {
    let timer = 0;
    const refreshCampaign = () => {
      window.clearTimeout(timer);
      const now = Date.now();
      setCurrentTime(now);
      const nextChange = [BLACK_FRIDAY_START, GGSR_START, PAP_START, POPUP_END]
        .find((date) => date > now);
      if (nextChange !== undefined) {
        timer = window.setTimeout(refreshCampaign, Math.min(nextChange - now, 2147483647));
      }
    };
    refreshCampaign();
    window.addEventListener('focus', refreshCampaign);
    document.addEventListener('visibilitychange', refreshCampaign);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('focus', refreshCampaign);
      document.removeEventListener('visibilitychange', refreshCampaign);
    };
  }, []);


  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dismissed || !popupActive) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [dismissed, popupActive]);

  if (!campaignActive) return null;

  return (
    <>

    <aside className="bf-bottom-banner" aria-label="Aviso de Black Friday">
      <span className="bf-bottom-badge"><span>BLACK</span> FRIDAY</span>
      <p><strong>A Black Friday já começou!</strong><span>{campaign.banner}</span></p>
    </aside>
    {popupActive && !dismissed && <dialog ref={dialogRef} className="bf-notice" aria-labelledby="bf-notice-title" aria-describedby="bf-notice-description"
      onClose={() => setDismissed(true)} onClick={(event) => {
        if (event.target === event.currentTarget) {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
        }
      }}>
      <div className="bf-notice-content">
        <button type="button" className="bf-notice-close" aria-label="Fechar aviso de Black Friday" onClick={() => dialogRef.current?.close()}>×</button>
        <p className="bf-notice-eyebrow">AMBIENTAL PRO</p>
        <div className="bf-notice-campaign" aria-hidden="true"><span>BLACK</span> FRIDAY</div>
        <h2 id="bf-notice-title">A Black Friday da Ambiental Pro já começou!</h2>
        <p id="bf-notice-description">{campaign.description}</p>
        <a className="bf-notice-confirm" href={campaign.href}>{campaign.button}</a>
      </div>
    </dialog>}
    </>
  );
}
