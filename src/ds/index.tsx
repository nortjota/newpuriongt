// TypeScript port of the PURION GT design system primitives (_ds_bundle.js).
import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';

/* ---------- Icon ---------- */
// Lucide glyphs, self-hosted in /public/icons, rendered as a currentColor mask.
export type IconProps = HTMLAttributes<HTMLSpanElement> & { name?: string; size?: number; color?: string };

export function Icon({ name = 'arrow-up-right', size = 18, color = 'currentColor', style, ...rest }: IconProps) {
  const url = `url(icons/${name}.svg)`;
  return (
    <span
      aria-hidden="true"
      {...rest}
      style={{
        display: 'inline-block',
        flex: 'none',
        width: size,
        height: size,
        background: color,
        WebkitMask: `${url} center/contain no-repeat`,
        mask: `${url} center/contain no-repeat`,
        ...style,
      }}
    />
  );
}

/* ---------- ArrowLink ---------- */
type ArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { tone?: 'dark' | 'light' | 'accent'; size?: 'sm' | 'md' | 'lg' };

export function ArrowLink({ children, href = '#', tone = 'dark', size = 'md', style, ...rest }: ArrowLinkProps) {
  const [h, setH] = useState(false);
  const c = tone === 'accent' ? 'var(--signal-400)' : tone === 'light' ? 'var(--paper-0)' : 'var(--ink-950)';
  const fs = size === 'lg' ? 28 : size === 'sm' ? 13 : 16;
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      {...rest}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: fs * 0.6,
        color: c,
        textDecoration: 'none',
        fontFamily: 'var(--font-display)',
        fontVariationSettings: "'wdth' 88",
        fontWeight: 600,
        fontSize: fs,
        letterSpacing: '-.03em',
        textTransform: 'uppercase',
        paddingBottom: 6,
        ...style,
      }}
    >
      <span>{children}</span>
      <span style={{ display: 'inline-flex', transform: h ? 'translate(3px,-3px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}>
        <Icon name="arrow-up-right" size={fs * 1.1} />
      </span>
      <span
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 1.5,
          background: c,
          transformOrigin: h ? 'left' : 'right',
          transform: h ? 'scaleX(.35)' : 'scaleX(1)',
          transition: 'transform var(--dur-slow) var(--ease-out)',
        }}
      />
    </a>
  );
}

/* ---------- Button ---------- */
const BTN_SIZES = {
  sm: { h: 'var(--control-h-sm)', px: 14, fs: 13 },
  md: { h: 'var(--control-h-md)', px: 22, fs: 14 },
  lg: { h: 'var(--control-h-lg)', px: 30, fs: 15 },
};
const BTN_VARIANTS = {
  primary: { bg: 'var(--action-primary)', bgH: 'var(--action-primary-hover)', fg: 'var(--action-on-primary)', bd: 'transparent' },
  accent: { bg: 'var(--action-accent)', bgH: 'var(--action-accent-hover)', fg: 'var(--action-on-accent)', bd: 'transparent' },
  secondary: { bg: 'transparent', bgH: 'rgba(11,12,14,.05)', fg: 'var(--text-primary)', bd: 'var(--border-strong)' },
  glass: { bg: 'var(--surface-glass)', bgH: 'rgba(255,255,255,.24)', fg: 'var(--text-inverse)', bd: 'var(--border-glass)' },
  inverse: { bg: 'var(--paper-0)', bgH: 'var(--paper-100)', fg: 'var(--ink-950)', bd: 'transparent' },
};
export type ButtonVariant = keyof typeof BTN_VARIANTS;
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: keyof typeof BTN_SIZES;
  iconLeft?: string;
  iconRight?: string;
  full?: boolean;
};

export function Button({ variant = 'primary', size = 'md', iconRight, iconLeft, full, disabled, children, style, ...rest }: ButtonProps) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const v = BTN_VARIANTS[variant];
  const s = BTN_SIZES[size];
  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => {
        setH(false);
        setP(false);
      }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      {...rest}
      style={{
        display: full ? 'flex' : 'inline-flex',
        width: full ? '100%' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        height: s.h,
        padding: `0 ${s.px}px`,
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${v.bd}`,
        background: h && !disabled ? v.bgH : v.bg,
        color: v.fg,
        fontFamily: 'var(--font-text)',
        fontSize: s.fs,
        fontWeight: 500,
        letterSpacing: '-.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transform: p && !disabled ? 'scale(.97)' : 'none',
        transition: 'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',
        backdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
        WebkitBackdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {iconLeft && <Icon name={iconLeft} size={s.fs + 3} />}
      <span>{children}</span>
      {iconRight && (
        <span style={{ display: 'inline-flex', transform: h && !disabled ? 'translate(2px,-2px)' : 'none', transition: 'transform var(--dur-base) var(--ease-out)' }}>
          <Icon name={iconRight} size={s.fs + 3} />
        </span>
      )}
    </button>
  );
}

/* ---------- IconButton ---------- */
const IB_VARIANTS = {
  solid: ['var(--ink-950)', 'var(--paper-0)', 'transparent'],
  outline: ['transparent', 'var(--text-primary)', 'var(--border-strong)'],
  glass: ['var(--surface-glass)', 'var(--paper-0)', 'var(--border-glass)'],
  light: ['var(--paper-0)', 'var(--ink-950)', 'transparent'],
  accent: ['var(--signal-400)', 'var(--ink-950)', 'transparent'],
} as const;
type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { icon?: string; variant?: keyof typeof IB_VARIANTS; size?: number; label?: string };

export function IconButton({ icon = 'arrow-right', variant = 'solid', size = 44, label, style, ...rest }: IconButtonProps) {
  const [h, setH] = useState(false);
  const [bg, fg, bd] = IB_VARIANTS[variant];
  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      {...rest}
      style={{
        width: size,
        height: size,
        flex: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        border: `1px solid ${bd}`,
        background: bg,
        color: fg,
        cursor: 'pointer',
        transform: h ? 'scale(1.06)' : 'none',
        transition: 'transform var(--dur-base) var(--ease-out)',
        backdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
        WebkitBackdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
        ...style,
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.42)} />
    </button>
  );
}

/* ---------- Badge ---------- */
const BADGE_TONES = {
  ink: ['var(--ink-950)', 'var(--paper-0)'],
  signal: ['var(--signal-400)', 'var(--ink-950)'],
  ice: ['var(--ice-200)', 'var(--ice-800)'],
  sun: ['var(--sun-200)', 'var(--sun-600)'],
  glass: ['var(--surface-glass)', 'var(--paper-0)'],
  success: ['rgba(62,155,107,.14)', 'var(--success-500)'],
  danger: ['rgba(210,70,58,.12)', 'var(--danger-500)'],
} as const;
export type BadgeTone = keyof typeof BADGE_TONES;

export function Badge({ tone = 'ink', dot, children, style }: { tone?: BadgeTone; dot?: boolean; children?: ReactNode; style?: CSSProperties }) {
  const [bg, fg] = BADGE_TONES[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 24,
        padding: '0 10px',
        borderRadius: 'var(--radius-pill)',
        background: bg,
        color: fg,
        fontFamily: 'var(--font-text)',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        backdropFilter: tone === 'glass' ? 'var(--glass-blur)' : undefined,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
      {children}
    </span>
  );
}

/* ---------- Tag ---------- */
export function Tag({ children, selected, onClick, icon, style }: { children?: ReactNode; selected?: boolean; onClick?: () => void; icon?: string; style?: CSSProperties }) {
  const [h, setH] = useState(false);
  const Comp = onClick ? 'button' : 'span';
  return createElement(
    Comp,
    {
      type: onClick ? 'button' : undefined,
      onClick,
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 34,
        padding: '0 14px',
        borderRadius: 'var(--radius-pill)',
        border: `1px solid ${selected ? 'var(--ink-950)' : 'var(--border-strong)'}`,
        background: selected ? 'var(--ink-950)' : h && onClick ? 'rgba(11,12,14,.04)' : 'transparent',
        color: selected ? 'var(--paper-0)' : 'var(--text-primary)',
        fontFamily: 'var(--font-text)',
        fontSize: 13,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background var(--dur-fast)',
        ...style,
      },
    },
    icon && <Icon name={icon} size={14} />,
    children,
  );
}

/* ---------- Marquee ---------- */
export function Marquee({ items = ['PURION GT'], tone = 'light', size = 28, separator = '·', speed, style }: { items?: string[]; tone?: 'light' | 'dark' | 'accent'; size?: number; separator?: string; speed?: string; style?: CSSProperties }) {
  const row = [...items, ...items, ...items, ...items];
  const c = tone === 'light' ? 'rgba(11,12,14,.22)' : tone === 'accent' ? 'var(--signal-400)' : 'rgba(255,255,255,.32)';
  const one = (k: string) => (
    <div key={k} aria-hidden={k === 'b' || undefined} style={{ display: 'flex', flex: 'none', gap: size * 1.4, paddingRight: size * 1.4 }}>
      {row.map((t, i) => (
        <Fragment key={i}>
          <span>{t}</span>
          <span>{separator}</span>
        </Fragment>
      ))}
    </div>
  );
  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        color: c,
        fontFamily: 'var(--font-display)',
        fontVariationSettings: "'wdth' 88",
        fontSize: size,
        fontWeight: 400,
        letterSpacing: '-.03em',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      <div style={{ display: 'flex', width: 'max-content', animation: `pg-marquee ${speed || 'var(--dur-marquee)'} linear infinite` }}>
        {one('a')}
        {one('b')}
      </div>
    </div>
  );
}

/* ---------- RevealText ---------- */
// Lines rise from an overflow mask when scrolled into view.
export function RevealText({ text, as = 'h2', delay = 0, stagger = 70, style, lineStyle }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'div' | 'span'; delay?: number; stagger?: number; style?: CSSProperties; lineStyle?: CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setOn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(
    as,
    {
      ref,
      style: { margin: 0, fontFamily: 'var(--font-display)', fontVariationSettings: "'wdth' 88", fontWeight: 500, letterSpacing: 'var(--ls-display)', lineHeight: 'var(--lh-display)', ...style },
    },
    text.split('\n').map((l, i) => (
      <span key={i} style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em', marginBottom: '-.06em' }}>
        <span
          style={{
            display: 'block',
            transform: on ? 'translate3d(0,0,0)' : 'translate3d(0,105%,0)',
            transition: `transform var(--dur-reveal) var(--ease-out) ${delay + i * stagger}ms`,
            ...lineStyle,
          }}
        >
          {l}
        </span>
      </span>
    )),
  );
}

/* ---------- Tabs ---------- */
export function Tabs({ tabs, value, onChange, tone = 'light', style }: { tabs: string[]; value: string; onChange: (t: string) => void; tone?: 'light' | 'dark'; style?: CSSProperties }) {
  const dark = tone === 'dark';
  return (
    <div role="tablist" style={{ display: 'flex', gap: 28, borderBottom: `1px solid ${dark ? 'var(--border-inverse)' : 'var(--border-subtle)'}`, ...style }}>
      {tabs.map((t) => {
        const on = t === value;
        return (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={on}
            onClick={() => onChange(t)}
            style={{
              position: 'relative',
              padding: '0 0 14px',
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-text)',
              fontSize: 14,
              fontWeight: 500,
              color: on ? (dark ? 'var(--paper-0)' : 'var(--ink-950)') : dark ? 'var(--text-inverse-muted)' : 'var(--text-muted)',
              transition: 'color var(--dur-fast)',
            }}
          >
            {t}
            <span
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: -1,
                height: 2,
                background: dark ? 'var(--signal-400)' : 'var(--ink-950)',
                transform: on ? 'scaleX(1)' : 'scaleX(0)',
                transformOrigin: 'left',
                transition: 'transform var(--dur-slow) var(--ease-out)',
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Segmented radio ---------- */
export function Segment({ options, value, onChange, style }: { options: string[]; value: string; onChange: (o: string) => void; style?: CSSProperties }) {
  return (
    <div role="radiogroup" style={{ display: 'inline-flex', gap: 4, padding: 4, borderRadius: 'var(--radius-pill)', background: 'var(--surface-sunken)', ...style }}>
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={value === o}
          onClick={() => onChange(o)}
          style={{
            height: 36,
            padding: '0 18px',
            borderRadius: 'var(--radius-pill)',
            border: 0,
            cursor: 'pointer',
            background: value === o ? 'var(--ink-950)' : 'transparent',
            color: value === o ? 'var(--paper-0)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-text)',
            fontSize: 14,
            fontWeight: 500,
            transition: 'background var(--dur-base) var(--ease-out)',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

/* ---------- Stepper ---------- */
export function Stepper({ value, min = 1, max = 10, onChange, style }: { value: number; min?: number; max?: number; onChange: (n: number) => void; style?: CSSProperties }) {
  const set = (n: number) => onChange(Math.max(min, Math.min(max, n)));
  const b: CSSProperties = { width: 36, height: 36, borderRadius: '50%', border: 0, background: 'transparent', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-950)' };
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 'var(--control-h-md)', padding: '0 4px', borderRadius: 'var(--radius-pill)', border: '1px solid var(--border-strong)', background: 'var(--surface-card)', ...style }}>
      <button type="button" aria-label="Diminuir" style={{ ...b, opacity: value <= min ? 0.3 : 1 }} onClick={() => set(value - 1)}>
        <Icon name="minus" size={16} />
      </button>
      <span aria-live="polite" style={{ minWidth: 24, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 14 }}>
        {value}
      </span>
      <button type="button" aria-label="Aumentar" style={{ ...b, opacity: value >= max ? 0.3 : 1 }} onClick={() => set(value + 1)}>
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}

/* ---------- Input ---------- */
type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & { label?: string; hint?: string; error?: string; size?: 'md' | 'lg' };

export function Input({ label, hint, error, size = 'md', style, ...rest }: InputProps) {
  const [f, setF] = useState(false);
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-text)', fontSize: 15, color: 'var(--text-primary)', ...style }}>
      {label && <span style={{ fontSize: 11, letterSpacing: 'var(--ls-caps)', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>}
      <input
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        aria-invalid={!!error || undefined}
        {...rest}
        style={{
          height: size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)',
          padding: '0 18px',
          borderRadius: 'var(--radius-pill)',
          border: `1px solid ${error ? 'var(--danger-500)' : f ? 'var(--ink-950)' : 'var(--border-strong)'}`,
          background: 'var(--surface-card)',
          outline: 'none',
          boxShadow: f ? '0 0 0 4px rgba(159,196,209,.35)' : 'none',
          fontFamily: 'var(--font-text)',
          fontSize: 15,
          color: 'var(--text-primary)',
          transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)',
        }}
      />
      {(error || hint) && <span style={{ fontSize: 12, color: error ? 'var(--danger-500)' : 'var(--text-muted)' }}>{error || hint}</span>}
    </label>
  );
}

/* ---------- Dialog ---------- */
export function Dialog({ open, onClose, title, children, width = 480 }: { open: boolean; onClose: () => void; title?: string; children?: ReactNode; width?: number }) {
  const [mounted, setMounted] = useState(open);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
      let r2 = 0;
      const r1 = requestAnimationFrame(() => (r2 = requestAnimationFrame(() => setShow(true))));
      return () => {
        cancelAnimationFrame(r1);
        cancelAnimationFrame(r2);
      };
    }
    setShow(false);
    const t = setTimeout(() => setMounted(false), 400);
    return () => clearTimeout(t);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!mounted) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(11,12,14,.45)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', opacity: show ? 1 : 0, transition: 'opacity var(--dur-slow) var(--ease-out)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{
          position: 'relative',
          width,
          maxWidth: 'calc(100vw - 24px)',
          background: 'var(--surface-card)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '86vh',
          transform: show ? 'none' : 'translateY(24px) scale(.98)',
          opacity: show ? 1 : 0,
          transition: 'transform var(--dur-slow) var(--ease-out),opacity var(--dur-base) var(--ease-out)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 22px 0 28px' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontVariationSettings: "'wdth' 88", fontSize: 28, fontWeight: 500, letterSpacing: '-.04em' }}>{title}</span>
          <IconButton icon="x" variant="outline" size={40} label="Fechar" onClick={onClose} />
        </div>
        <div style={{ padding: '20px 28px', overflow: 'auto', flex: 1, fontSize: 15, color: 'var(--text-secondary)' }}>{children}</div>
      </div>
    </div>
  );
}

/* ---------- Toast ---------- */
export function Toast({ message, icon = 'check', action, onAction }: { message: string; icon?: string; action?: string; onAction?: () => void }) {
  return (
    <div
      role="status"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        height: 52,
        padding: '0 8px 0 18px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--ink-950)',
        color: 'var(--paper-0)',
        boxShadow: 'var(--shadow-lg)',
        fontFamily: 'var(--font-text)',
        fontSize: 14,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--signal-400)', color: 'var(--ink-950)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={14} />
      </span>
      <span style={{ paddingRight: action ? 0 : 10 }}>{message}</span>
      {action && (
        <button type="button" onClick={onAction} style={{ height: 36, padding: '0 14px', borderRadius: 'var(--radius-pill)', border: 0, background: 'rgba(255,255,255,.1)', color: 'var(--paper-0)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer' }}>
          {action}
        </button>
      )}
    </div>
  );
}
