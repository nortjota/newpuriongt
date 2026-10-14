import type { CSSProperties } from 'react';

/** Condensed Archivo display type used for every large heading and number. */
export const display = (fontSize: CSSProperties['fontSize'], letterSpacing = '-.045em', lineHeight: CSSProperties['lineHeight'] = 0.9): CSSProperties => ({
  fontFamily: 'var(--font-display)',
  fontVariationSettings: "'wdth' 88",
  fontWeight: 500,
  fontSize,
  letterSpacing,
  lineHeight,
});

/** Small uppercase eyebrow label. */
export const caps = (color = 'var(--text-muted)'): CSSProperties => ({
  fontSize: 11,
  letterSpacing: 'var(--ls-caps)',
  textTransform: 'uppercase',
  color,
});

export const mono = (fontSize: number, color?: string): CSSProperties => ({ fontFamily: 'var(--font-mono)', fontSize, color });

export const ghostDark: CSSProperties = { color: 'var(--steel-300)' };
export const ghostInk: CSSProperties = { color: 'var(--ink-600)' };
export const ghostLight: CSSProperties = { color: 'rgba(255,255,255,.62)' };

export const sectionWrap: CSSProperties = { maxWidth: 'var(--content-max)', margin: '0 auto' };
