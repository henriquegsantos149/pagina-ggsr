import { useEffect, useRef, useState } from 'react';
import './black-friday.css';

// 23/10/2026, às 08h no horário de Brasília (UTC−03:00).
const BLACK_FRIDAY_START = Date.parse('2026-10-23T08:00:00-03:00');

export default function BlackFridayNotice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);
  const [campaignActive, setCampaignActive] = useState(false);

  useEffect(() => {
    // Também reativa em abas que permaneceram abertas durante a pausa.
    const activateWhenReady = () => {
      if (Date.now() >= BLACK_FRIDAY_START) setCampaignActive(true);
    };
    activateWhenReady();
    const timer = window.setTimeout(activateWhenReady,
      Math.min(Math.max(0, BLACK_FRIDAY_START - Date.now()), 2147483647));
    window.addEventListener('focus', activateWhenReady);
    document.addEventListener('visibilitychange', activateWhenReady);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('focus', activateWhenReady);
      document.removeEventListener('visibilitychange', activateWhenReady);
    };
  }, []);


  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dismissed || !campaignActive) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [dismissed, campaignActive]);

  if (!campaignActive) return null;

  return (
    <>

    <aside className="bf-bottom-banner" aria-label="Aviso de Black Friday">
      <span className="bf-bottom-badge"><span>BLACK</span> FRIDAY</span>
      <p><strong>Nossa Black Friday está se aproximando!</strong><span>Mais informações em breve.</span></p>
    </aside>
    {!dismissed && <dialog ref={dialogRef} className="bf-notice" aria-labelledby="bf-notice-title" aria-describedby="bf-notice-description"
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
        <h2 id="bf-notice-title">Nossa Black Friday está chegando!</h2>
        <p id="bf-notice-description">Mais informações em breve.</p>
        <button type="button" className="bf-notice-confirm" onClick={() => dialogRef.current?.close()}>Entendi</button>
      </div>
    </dialog>}
    </>
  );
}
