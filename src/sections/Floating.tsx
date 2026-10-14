import { useEffect, useRef, useState } from 'react';
import { Button, Dialog, Icon, Input, Toast } from '../ds';
import { WHATSAPP_URL } from '../lib/content';
import { scrollToId, useShop } from '../lib/store';
import { caps, display } from '../lib/styles';

export function ToastLayer() {
  const { toast } = useShop();
  return (
    <div style={{ position: 'fixed', left: '50%', bottom: 24, transform: 'translateX(-50%)', zIndex: 90, pointerEvents: 'none' }}>
      {toast && (
        <div style={{ pointerEvents: 'auto', animation: 'pg-fade-up .6s var(--ease-out) both' }}>
          <Toast message={toast} icon="check" action="Ver" onAction={() => scrollToId('comprar')} />
        </div>
      )}
    </div>
  );
}

/** Vertical "Quiz · 30s" tab pinned to the left edge. */
export function QuizTab() {
  return (
    <a
      href="#quiz"
      className="h-quiztab"
      style={{
        position: 'fixed',
        left: 0,
        top: '50%',
        zIndex: 60,
        transform: 'translateY(-50%) rotate(180deg)',
        writingMode: 'vertical-rl',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '18px 10px',
        borderRadius: '14px 0 0 14px',
        background: 'var(--ink-950)',
        color: 'var(--paper-0)',
        fontSize: 11,
        letterSpacing: 'var(--ls-caps)',
        textTransform: 'uppercase',
        fontWeight: 500,
        transition: 'padding .4s var(--ease-out)',
      }}
    >
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--signal-400)' }} />
      Quiz · 30s
    </a>
  );
}

export function WhatsAppBubble() {
  const [tip, setTip] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setTip(true), 5000);
    return () => window.clearTimeout(t);
  }, []);
  return (
    <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 80, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
      {tip && (
        <div
          style={{ position: 'relative', background: 'var(--paper-0)', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)', borderRadius: '18px 18px 4px 18px', padding: '14px 38px 14px 16px', maxWidth: 240, display: 'flex', flexDirection: 'column', gap: 4, animation: 'pg-fade-up .7s var(--ease-out) both' }}
        >
          <span style={{ fontWeight: 500, fontSize: 14 }}>Dúvidas sobre o Purion GT?</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Fale com a gente no WhatsApp.</span>
          <button
            type="button"
            onClick={() => setTip(false)}
            aria-label="Fechar"
            style={{ position: 'absolute', right: 8, top: 8, width: 24, height: 24, border: 0, borderRadius: '50%', background: 'var(--paper-100)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-950)' }}
          >
            <Icon name="x" size={12} />
          </button>
        </div>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener"
        aria-label="WhatsApp"
        className="h-wa"
        style={{ position: 'relative', width: 60, height: 60, borderRadius: '50%', background: 'var(--ink-950)', color: 'var(--paper-0)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-lg)', transition: 'transform .4s var(--ease-out)', flex: 'none' }}
      >
        <Icon name="message-circle" size={24} />
        <span style={{ position: 'absolute', right: 2, top: 2, width: 14, height: 14, borderRadius: '50%', background: 'var(--signal-400)', border: '2px solid var(--ink-950)', animation: 'pg-pulse 2s ease-in-out infinite', boxSizing: 'border-box' }} />
      </a>
    </div>
  );
}

const EMAIL_SEEN_KEY = 'purion_email_v1';

/** E-mail capture: opens after 15s or on exit intent, once per visitor. */
export function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const shown = useRef(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = !!localStorage.getItem(EMAIL_SEEN_KEY);
    } catch {
      /* storage unavailable */
    }
    if (seen) return;
    const show = () => {
      if (shown.current) return;
      shown.current = true;
      try {
        localStorage.setItem(EMAIL_SEEN_KEY, '1');
      } catch {
        /* storage unavailable */
      }
      setOpen(true);
    };
    const t = window.setTimeout(show, 15000);
    const onExit = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) show();
    };
    document.addEventListener('mouseout', onExit);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('mouseout', onExit);
    };
  }, []);

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErr('Digite um e-mail válido.');
      return;
    }
    // TODO: send `email` to the newsletter provider. The design only confirms on screen.
    setDone(true);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} width={500}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ height: 180, margin: '-4px 0 4px', borderRadius: 'var(--radius-md)', background: 'center 45%/cover url(/assets/hero-banner.png)' }} />
        {!done ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={caps()}>Lista Purion</span>
            <h3 style={{ margin: 0, color: 'var(--ink-950)', ...display(40, '-.045em', 0.92) }}>Chegue antes de todo mundo.</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>Lançamentos, kits e condições exclusivas direto no seu e-mail.</p>
            <Input
              type="email"
              placeholder="seu@email.com"
              aria-label="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErr('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              error={err || undefined}
              size="lg"
            />
            <Button variant="accent" size="lg" full iconRight="arrow-up-right" onClick={submit}>
              Quero receber
            </Button>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>Sem spam. Saia quando quiser.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, animation: 'pg-fade-up .6s var(--ease-out) both' }}>
            <h3 style={{ margin: 0, color: 'var(--ink-950)', ...display(40, '-.045em', 0.92) }}>Pronto. Você está na lista.</h3>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-secondary)' }}>Fique de olho na caixa de entrada.</p>
            <div>
              <Button variant="primary" onClick={() => setOpen(false)}>
                Continuar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}
