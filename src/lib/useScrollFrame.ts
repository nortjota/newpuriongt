import { useEffect, useRef } from 'react';

/** Calls `fn` once per animation frame while the page scrolls or resizes, and once on mount. */
export function useScrollFrame(fn: () => void) {
  const cb = useRef(fn);
  cb.current = fn;
  useEffect(() => {
    let raf = 0;
    const on = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        cb.current();
      });
    };
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    cb.current();
    return () => {
      window.removeEventListener('scroll', on);
      window.removeEventListener('resize', on);
      cancelAnimationFrame(raf);
    };
  }, []);
}
