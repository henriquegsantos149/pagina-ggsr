import { useEffect, useRef, useState } from 'react';
import './black-friday.css';

export default function BlackFridayNotice() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dismissed) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [dismissed]);

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
