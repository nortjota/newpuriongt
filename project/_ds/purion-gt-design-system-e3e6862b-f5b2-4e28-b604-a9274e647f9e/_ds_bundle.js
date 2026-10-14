/* @ds-bundle: {"format":4,"namespace":"PURIONGTDesignSystem_e3e686","components":[{"name":"ArrowLink","sourcePath":"components/actions/ArrowLink.jsx"},{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Icon","sourcePath":"components/actions/Icon.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"GlassStat","sourcePath":"components/display/GlassStat.jsx"},{"name":"Marquee","sourcePath":"components/display/Marquee.jsx"},{"name":"RevealText","sourcePath":"components/display/RevealText.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Stepper","sourcePath":"components/forms/Stepper.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/ArrowLink.jsx":"07be58ad2b6e","components/actions/Button.jsx":"9d5b4c6b74f8","components/actions/Icon.jsx":"aa44a164fbb9","components/actions/IconButton.jsx":"1d6bcf4a7314","components/display/Badge.jsx":"6e2a10dfe562","components/display/Card.jsx":"86f56f641967","components/display/GlassStat.jsx":"6964b757424d","components/display/Marquee.jsx":"73a6028b373c","components/display/RevealText.jsx":"e09bf27e47fd","components/display/Tag.jsx":"5400e73523fe","components/feedback/Dialog.jsx":"c598e9473ecf","components/feedback/Toast.jsx":"c264b90bd34e","components/feedback/Tooltip.jsx":"227681007bdd","components/forms/Checkbox.jsx":"4c73554a2285","components/forms/Input.jsx":"d48f806417df","components/forms/Radio.jsx":"c36e3786d648","components/forms/Select.jsx":"181d4f540dba","components/forms/Stepper.jsx":"7310596a7cbd","components/forms/Switch.jsx":"40c2702eff2a","components/navigation/Tabs.jsx":"63099c1cad3d","ui_kits/store/Cart.jsx":"50ebf72fc229","ui_kits/store/Header.jsx":"da80747919b8","ui_kits/store/Home.jsx":"bd8b334dddd2","ui_kits/store/Product.jsx":"cbfa0306d053"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.PURIONGTDesignSystem_e3e686 = window.PURIONGTDesignSystem_e3e686 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = 'https://unpkg.com/lucide-static@0.460.0/icons/';
function Icon({
  name = 'arrow-up-right',
  size = 18,
  color = 'currentColor',
  style,
  ...rest
}) {
  const url = 'url(' + CDN + name + '.svg)';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true"
  }, rest, {
    style: {
      display: 'inline-block',
      flex: 'none',
      width: size,
      height: size,
      background: color,
      WebkitMask: url + ' center/contain no-repeat',
      mask: url + ' center/contain no-repeat',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/ArrowLink.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ArrowLink({
  children,
  href = '#',
  tone = 'dark',
  size = 'md',
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const c = tone === 'accent' ? 'var(--signal-400)' : tone === 'light' ? 'var(--paper-0)' : 'var(--ink-950)';
  const fs = size === 'lg' ? 28 : size === 'sm' ? 13 : 16;
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest, {
    style: {
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: fs * .6,
      color: c,
      textDecoration: 'none',
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontWeight: 600,
      fontSize: fs,
      letterSpacing: '-.03em',
      textTransform: 'uppercase',
      paddingBottom: 6,
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      transform: h ? 'translate(3px,-3px) rotate(0deg)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "arrow-up-right",
    size: fs * 1.1
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 1.5,
      background: c,
      transformOrigin: h ? 'left' : 'right',
      transform: h ? 'scaleX(.35)' : 'scaleX(1)',
      transition: 'transform var(--dur-slow) var(--ease-out)'
    }
  }));
}
Object.assign(__ds_scope, { ArrowLink });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/ArrowLink.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    h: 'var(--control-h-sm)',
    px: 14,
    fs: 13
  },
  md: {
    h: 'var(--control-h-md)',
    px: 22,
    fs: 14
  },
  lg: {
    h: 'var(--control-h-lg)',
    px: 30,
    fs: 15
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--action-primary)',
    bgH: 'var(--action-primary-hover)',
    fg: 'var(--action-on-primary)',
    bd: 'transparent'
  },
  accent: {
    bg: 'var(--action-accent)',
    bgH: 'var(--action-accent-hover)',
    fg: 'var(--action-on-accent)',
    bd: 'transparent'
  },
  secondary: {
    bg: 'transparent',
    bgH: 'rgba(11,12,14,.05)',
    fg: 'var(--text-primary)',
    bd: 'var(--border-strong)'
  },
  glass: {
    bg: 'var(--surface-glass)',
    bgH: 'rgba(255,255,255,.24)',
    fg: 'var(--text-inverse)',
    bd: 'var(--border-glass)'
  },
  inverse: {
    bg: 'var(--paper-0)',
    bgH: 'var(--paper-100)',
    fg: 'var(--ink-950)',
    bd: 'transparent'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  iconRight,
  iconLeft,
  full,
  disabled,
  children,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false)
  }, rest, {
    style: {
      display: full ? 'flex' : 'inline-flex',
      width: full ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: s.h,
      padding: '0 ' + s.px + 'px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + v.bd,
      background: h && !disabled ? v.bgH : v.bg,
      color: v.fg,
      fontFamily: 'var(--font-text)',
      fontSize: s.fs,
      fontWeight: 500,
      letterSpacing: '-.01em',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      transform: p && !disabled ? 'scale(.97)' : 'none',
      transition: 'background var(--dur-fast) var(--ease-out),transform var(--dur-fast) var(--ease-out)',
      backdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
      WebkitBackdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
      whiteSpace: 'nowrap',
      ...style
    }
  }), iconLeft && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconLeft,
    size: s.fs + 3
  }), /*#__PURE__*/React.createElement("span", null, children), iconRight && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      transform: h && !disabled ? 'translate(2px,-2px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.fs + 3
  })));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const V = {
  solid: ['var(--ink-950)', 'var(--paper-0)', 'transparent'],
  outline: ['transparent', 'var(--text-primary)', 'var(--border-strong)'],
  glass: ['var(--surface-glass)', 'var(--paper-0)', 'var(--border-glass)'],
  light: ['var(--paper-0)', 'var(--ink-950)', 'transparent'],
  accent: ['var(--signal-400)', 'var(--ink-950)', 'transparent']
};
function IconButton({
  icon = 'arrow-right',
  variant = 'solid',
  size = 44,
  label,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [bg, fg, bd] = V[variant] || V.solid;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest, {
    style: {
      width: size,
      height: size,
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      border: '1px solid ' + bd,
      background: bg,
      color: fg,
      cursor: 'pointer',
      transform: h ? 'scale(1.06)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)',
      backdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
      WebkitBackdropFilter: variant === 'glass' ? 'var(--glass-blur)' : undefined,
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * .42)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
const T = {
  ink: ['var(--ink-950)', 'var(--paper-0)'],
  signal: ['var(--signal-400)', 'var(--ink-950)'],
  ice: ['var(--ice-200)', 'var(--ice-800)'],
  sun: ['var(--sun-200)', 'var(--sun-600)'],
  glass: ['var(--surface-glass)', 'var(--paper-0)'],
  success: ['rgba(62,155,107,.14)', 'var(--success-500)'],
  danger: ['rgba(210,70,58,.12)', 'var(--danger-500)']
};
function Badge({
  tone = 'ink',
  dot,
  children,
  style
}) {
  const [bg, fg] = T[tone] || T.ink;
  return /*#__PURE__*/React.createElement("span", {
    style: {
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
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  image,
  eyebrow,
  title,
  body,
  footer,
  variant = 'media',
  height = 420,
  onClick,
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  if (variant === 'plain') return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      padding: 28,
      border: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...style
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontSize: 32,
      fontWeight: 500,
      letterSpacing: '-.04em'
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17,
      fontWeight: 500,
      letterSpacing: '-.01em'
    }
  }, title), body && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--text-secondary)',
      lineHeight: 1.5,
      textWrap: 'pretty'
    }
  }, body), children, footer);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      height,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--ink-900)',
      color: 'var(--paper-0)',
      cursor: onClick ? 'pointer' : 'default',
      isolation: 'isolate',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'center/cover url(' + image + ')',
      transform: h ? 'scale(1.06)' : 'scale(1)',
      transition: 'transform var(--dur-reveal) var(--ease-out)',
      zIndex: -2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'var(--scrim-bottom)',
      zIndex: -1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      opacity: .8
    }
  }, eyebrow), title && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontSize: 34,
      fontWeight: 500,
      letterSpacing: '-.045em',
      lineHeight: .95
    }
  }, title), body && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      opacity: .8,
      maxWidth: 320
    }
  }, body), children, footer));
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/GlassStat.jsx
try { (() => {
function GlassStat({
  value,
  label,
  image,
  tone = 'glass',
  children,
  style
}) {
  const dark = tone === 'glass';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'stretch',
      padding: 12,
      borderRadius: 'var(--radius-md)',
      background: dark ? 'var(--surface-glass)' : 'var(--surface-card)',
      border: '1px solid ' + (dark ? 'var(--border-glass)' : 'var(--border-subtle)'),
      boxShadow: dark ? 'var(--inset-glass)' : 'var(--shadow-md)',
      backdropFilter: dark ? 'var(--glass-blur)' : undefined,
      WebkitBackdropFilter: dark ? 'var(--glass-blur)' : undefined,
      color: dark ? 'var(--paper-0)' : 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 12,
      padding: '4px 6px',
      minWidth: 96
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontSize: 40,
      fontWeight: 500,
      letterSpacing: '-.05em',
      lineHeight: .9
    }
  }, value), children, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      lineHeight: 1.3,
      opacity: dark ? .8 : .7
    }
  }, label)), image && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 88,
      borderRadius: 'var(--radius-sm)',
      background: 'center/cover url(' + image + ')',
      flex: 'none'
    }
  }));
}
Object.assign(__ds_scope, { GlassStat });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/GlassStat.jsx", error: String((e && e.message) || e) }); }

// components/display/Marquee.jsx
try { (() => {
function Marquee({
  items = ['PURION GT'],
  tone = 'light',
  size = 28,
  separator = '·',
  speed,
  style
}) {
  const row = [...items, ...items, ...items, ...items];
  const c = tone === 'light' ? 'rgba(11,12,14,.22)' : tone === 'accent' ? 'var(--signal-400)' : 'rgba(255,255,255,.32)';
  const one = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flex: 'none',
      gap: size * 1.4,
      paddingRight: size * 1.4
    }
  }, row.map((t, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", null, t), /*#__PURE__*/React.createElement("span", null, separator))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      color: c,
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontSize: size,
      fontWeight: 400,
      letterSpacing: '-.03em',
      textTransform: 'uppercase',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      width: 'max-content',
      animation: 'pg-marquee ' + (speed || 'var(--dur-marquee)') + ' linear infinite'
    }
  }, one, one));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Marquee.jsx", error: String((e && e.message) || e) }); }

// components/display/RevealText.jsx
try { (() => {
function RevealText({
  text,
  as = 'h2',
  delay = 0,
  stagger = 70,
  trigger = 'view',
  style,
  lineStyle
}) {
  const ref = React.useRef(null);
  const [on, setOn] = React.useState(trigger === 'mount');
  React.useEffect(() => {
    if (trigger !== 'view' || !ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setOn(true);
        io.disconnect();
      }
    }, {
      threshold: .2
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [trigger]);
  const lines = String(text).split('\n');
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, {
    ref: ref,
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontWeight: 500,
      letterSpacing: 'var(--ls-display)',
      lineHeight: 'var(--lh-display)',
      ...style
    }
  }, lines.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'block',
      overflow: 'hidden',
      paddingBottom: '.06em',
      marginBottom: '-.06em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      transform: on ? 'translate3d(0,0,0)' : 'translate3d(0,105%,0)',
      transition: 'transform var(--dur-reveal) var(--ease-out) ' + (delay + i * stagger) + 'ms',
      ...lineStyle
    }
  }, l))));
}
Object.assign(__ds_scope, { RevealText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/RevealText.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
function Tag({
  children,
  selected,
  onClick,
  onRemove,
  icon,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 34,
      padding: '0 14px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (selected ? 'var(--ink-950)' : 'var(--border-strong)'),
      background: selected ? 'var(--ink-950)' : h && onClick ? 'rgba(11,12,14,.04)' : 'transparent',
      color: selected ? 'var(--paper-0)' : 'var(--text-primary)',
      fontFamily: 'var(--font-text)',
      fontSize: 13,
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--dur-fast)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'inline-flex',
      cursor: 'pointer',
      opacity: .6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 12
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  onClose,
  title,
  children,
  footer,
  placement = 'center',
  width = 480,
  style
}) {
  const [mounted, setM] = React.useState(open);
  const [show, setS] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      setM(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setS(true)));
    } else {
      setS(false);
      const t = setTimeout(() => setM(false), 400);
      return () => clearTimeout(t);
    }
  }, [open]);
  if (!mounted) return null;
  const drawer = placement === 'right';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: drawer ? 'stretch' : 'center',
      justifyContent: drawer ? 'flex-end' : 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'rgba(11,12,14,.45)',
      backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      opacity: show ? 1 : 0,
      transition: 'opacity var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    style: {
      position: 'relative',
      width: drawer ? Math.max(width, 420) : width,
      maxWidth: 'calc(100vw - 24px)',
      margin: drawer ? 12 : 0,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      maxHeight: drawer ? 'none' : '86vh',
      transform: show ? 'none' : drawer ? 'translateX(40px)' : 'translateY(24px) scale(.98)',
      opacity: show ? 1 : 0,
      transition: 'transform var(--dur-slow) var(--ease-out),opacity var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '22px 22px 0 28px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontVariationSettings: "'wdth' 88",
      fontSize: 28,
      fontWeight: 500,
      letterSpacing: '-.04em'
    }
  }, title), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    variant: "outline",
    size: 40,
    label: "Fechar",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 28px',
      overflow: 'auto',
      flex: 1,
      fontSize: 15,
      color: 'var(--text-secondary)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 28px 28px',
      display: 'flex',
      gap: 12,
      justifyContent: 'flex-end'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  open = true,
  message,
  icon = 'check',
  action,
  onAction,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
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
      transform: open ? 'none' : 'translateY(20px)',
      opacity: open ? 1 : 0,
      transition: 'transform var(--dur-slow) var(--ease-out),opacity var(--dur-base)',
      pointerEvents: open ? 'auto' : 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: '50%',
      background: 'var(--signal-400)',
      color: 'var(--ink-950)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      paddingRight: action ? 0 : 10
    }
  }, message), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      height: 36,
      padding: '0 14px',
      borderRadius: 'var(--radius-pill)',
      border: 0,
      background: 'rgba(255,255,255,.1)',
      color: 'var(--paper-0)',
      fontFamily: 'inherit',
      fontSize: 13,
      cursor: 'pointer'
    }
  }, action));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children,
  placement = 'top',
  style
}) {
  const [o, setO] = React.useState(false);
  const top = placement === 'top';
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setO(true),
    onMouseLeave: () => setO(false),
    onFocus: () => setO(true),
    onBlur: () => setO(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      [top ? 'bottom' : 'top']: 'calc(100% + 8px)',
      transform: 'translateX(-50%) translateY(' + (o ? 0 : top ? 4 : -4) + 'px)',
      opacity: o ? 1 : 0,
      pointerEvents: 'none',
      whiteSpace: 'nowrap',
      padding: '6px 10px',
      borderRadius: 8,
      background: 'var(--ink-950)',
      color: 'var(--paper-0)',
      fontFamily: 'var(--font-text)',
      fontSize: 12,
      transition: 'opacity var(--dur-fast),transform var(--dur-base) var(--ease-out)',
      zIndex: 20
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  defaultChecked,
  onChange,
  label,
  disabled,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : c;
  const toggle = () => {
    if (disabled) return;
    setC(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: toggle,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .4 : 1,
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 6,
      border: '1px solid ' + (on ? 'var(--ink-950)' : 'var(--border-strong)'),
      background: on ? 'var(--ink-950)' : 'var(--surface-card)',
      color: 'var(--paper-0)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast)'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  label,
  hint,
  error,
  size = 'md',
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const h = size === 'lg' ? 'var(--control-h-lg)' : 'var(--control-h-md)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: () => setF(true),
    onBlur: () => setF(false)
  }, rest, {
    style: {
      height: h,
      padding: '0 18px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (error ? 'var(--danger-500)' : f ? 'var(--ink-950)' : 'var(--border-strong)'),
      background: 'var(--surface-card)',
      outline: 'none',
      boxShadow: f ? '0 0 0 4px rgba(159,196,209,.35)' : 'none',
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)',
      transition: 'border-color var(--dur-fast),box-shadow var(--dur-fast)'
    }
  })), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: error ? 'var(--danger-500)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function Radio({
  options = [],
  value,
  defaultValue,
  onChange,
  name,
  variant = 'dot',
  style
}) {
  const [v, setV] = React.useState(defaultValue);
  const cur = value !== undefined ? value : v;
  const pick = o => {
    setV(o);
    onChange && onChange(o);
  };
  if (variant === 'segment') return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-sunken)',
      ...style
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    role: "radio",
    "aria-checked": cur === o,
    onClick: () => pick(o),
    style: {
      height: 36,
      padding: '0 18px',
      borderRadius: 'var(--radius-pill)',
      border: 0,
      cursor: 'pointer',
      background: cur === o ? 'var(--ink-950)' : 'transparent',
      color: cur === o ? 'var(--paper-0)' : 'var(--text-secondary)',
      fontFamily: 'var(--font-text)',
      fontSize: 14,
      fontWeight: 500,
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, o)));
  return /*#__PURE__*/React.createElement("div", {
    role: "radiogroup",
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      ...style
    }
  }, options.map(o => /*#__PURE__*/React.createElement("label", {
    key: o,
    onClick: () => pick(o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: 'pointer',
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      border: '1px solid ' + (cur === o ? 'var(--ink-950)' : 'var(--border-strong)'),
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--surface-card)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--ink-950)',
      transform: cur === o ? 'scale(1)' : 'scale(0)',
      transition: 'transform var(--dur-base) var(--ease-out)'
    }
  })), o)));
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Select({
  label,
  options = [],
  value,
  onChange,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: 'var(--text-secondary)',
      fontWeight: 500
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    value: value,
    onChange: onChange
  }, rest, {
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      height: 'var(--control-h-md)',
      padding: '0 44px 0 18px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-strong)',
      background: 'var(--surface-card)',
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)',
      cursor: 'pointer',
      outline: 'none'
    }
  }), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o,
    value: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      position: 'absolute',
      right: 18,
      top: '50%',
      marginTop: -8,
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Stepper.jsx
try { (() => {
function Stepper({
  value,
  defaultValue = 1,
  min = 1,
  max = 10,
  onChange,
  style
}) {
  const [v, setV] = React.useState(defaultValue);
  const cur = value !== undefined ? value : v;
  const set = n => {
    n = Math.max(min, Math.min(max, n));
    setV(n);
    onChange && onChange(n);
  };
  const b = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 0,
    background: 'transparent',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'var(--ink-950)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      height: 'var(--control-h-md)',
      padding: '0 4px',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid var(--border-strong)',
      background: 'var(--surface-card)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Diminuir",
    style: {
      ...b,
      opacity: cur <= min ? .3 : 1
    },
    onClick: () => set(cur - 1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "minus",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 24,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 14
    }
  }, cur), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Aumentar",
    style: {
      ...b,
      opacity: cur >= max ? .3 : 1
    },
    onClick: () => set(cur + 1)
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "plus",
    size: 16
  })));
}
Object.assign(__ds_scope, { Stepper });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Stepper.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  style
}) {
  const [c, setC] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : c;
  return /*#__PURE__*/React.createElement("label", {
    onClick: () => {
      setC(!on);
      onChange && onChange(!on);
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'var(--font-text)',
      fontSize: 15,
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 26,
      borderRadius: 'var(--radius-pill)',
      background: on ? 'var(--ink-950)' : 'var(--steel-300)',
      position: 'relative',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: 3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: on ? 'var(--signal-400)' : 'var(--paper-0)',
      transform: on ? 'translateX(18px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out),background var(--dur-base)'
    }
  })), label && /*#__PURE__*/React.createElement("span", null, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  tabs = [],
  value,
  defaultValue,
  onChange,
  tone = 'light',
  style
}) {
  const [v, setV] = React.useState(defaultValue || tabs[0]);
  const cur = value !== undefined ? value : v;
  const dark = tone === 'dark';
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 28,
      borderBottom: '1px solid ' + (dark ? 'var(--border-inverse)' : 'var(--border-subtle)'),
      ...style
    }
  }, tabs.map(t => {
    const on = t === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: t,
      role: "tab",
      "aria-selected": on,
      onClick: () => {
        setV(t);
        onChange && onChange(t);
      },
      style: {
        position: 'relative',
        padding: '0 0 14px',
        border: 0,
        background: 'transparent',
        cursor: 'pointer',
        fontFamily: 'var(--font-text)',
        fontSize: 14,
        fontWeight: 500,
        color: on ? dark ? 'var(--paper-0)' : 'var(--ink-950)' : dark ? 'var(--text-inverse-muted)' : 'var(--text-muted)',
        transition: 'color var(--dur-fast)'
      }
    }, t, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: -1,
        height: 2,
        background: dark ? 'var(--signal-400)' : 'var(--ink-950)',
        transform: on ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform var(--dur-slow) var(--ease-out)'
      }
    }));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/store/Cart.jsx
try { (() => {
(() => {
  const {
    Dialog,
    Button,
    Stepper,
    IconButton
  } = window.DS;
  function Cart({
    open,
    onClose,
    cart,
    setCart,
    go
  }) {
    const total = cart.reduce((a, b) => a + b.qty * b.price, 0);
    const setQ = (i, q) => setCart(c => c.map((x, j) => j === i ? {
      ...x,
      qty: q
    } : x));
    const rm = i => setCart(c => c.filter((_, j) => j !== i));
    return /*#__PURE__*/React.createElement(Dialog, {
      open: open,
      onClose: onClose,
      placement: "right",
      width: 440,
      title: 'Sacola (' + cart.reduce((a, b) => a + b.qty, 0) + ')',
      footer: cart.length ? /*#__PURE__*/React.createElement("div", {
        style: {
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 14,
          color: 'var(--text-secondary)'
        }
      }, /*#__PURE__*/React.createElement("span", null, "Frete"), /*#__PURE__*/React.createElement("span", null, total >= 199 ? 'Grátis' : 'Calculado no checkout')), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          color: 'var(--ink-950)'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 14
        }
      }, "Total"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'var(--font-mono)',
          fontSize: 24
        }
      }, "R$ ", total, ",00")), /*#__PURE__*/React.createElement(Button, {
        full: true,
        size: "lg",
        iconRight: "arrow-up-right"
      }, "Finalizar compra")) : null
    }, cart.length === 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        alignItems: 'flex-start',
        paddingTop: 12
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0
      }
    }, "Sua sacola est\xE1 vazia."), /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => {
        onClose();
        go('product');
      }
    }, "Ver PURION GT")) : /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column'
      }
    }, cart.map((it, i) => /*#__PURE__*/React.createElement("div", {
      key: it.size,
      style: {
        display: 'grid',
        gridTemplateColumns: '84px 1fr auto',
        gap: 16,
        alignItems: 'center',
        padding: '16px 0',
        borderBottom: '1px solid var(--border-subtle)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 84,
        height: 96,
        borderRadius: 12,
        background: 'var(--ice-200) center/auto 84% no-repeat url(../../assets/product-bottle.png)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        color: 'var(--ink-950)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500
      }
    }, "PURION GT"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)'
      }
    }, it.size, " \xB7 R$ ", it.price, ",00"), /*#__PURE__*/React.createElement(Stepper, {
      value: it.qty,
      onChange: q => setQ(i, q),
      style: {
        alignSelf: 'flex-start',
        height: 36
      }
    })), /*#__PURE__*/React.createElement(IconButton, {
      icon: "trash-2",
      variant: "outline",
      size: 36,
      label: "Remover",
      onClick: () => rm(i)
    })))));
  }
  Object.assign(window, {
    Cart
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/store/Cart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/store/Header.jsx
try { (() => {
(() => {
  const {
    Icon,
    IconButton,
    Badge
  } = window.DS;
  function Header({
    page,
    go,
    count,
    openCart,
    dark
  }) {
    const [scrolled, setS] = React.useState(false);
    React.useEffect(() => {
      const f = () => setS(window.scrollY > 40);
      f();
      window.addEventListener('scroll', f);
      return () => window.removeEventListener('scroll', f);
    }, []);
    const light = dark && !scrolled;
    const fg = light ? 'var(--paper-0)' : 'var(--ink-950)';
    const link = {
      background: 'none',
      border: 0,
      color: fg,
      font: '500 13px var(--font-text)',
      cursor: 'pointer',
      padding: 0,
      letterSpacing: '-.01em'
    };
    return /*#__PURE__*/React.createElement("header", {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: '14px var(--gutter)',
        transition: 'background var(--dur-base),backdrop-filter var(--dur-base)',
        background: scrolled ? 'rgba(247,246,242,.78)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        maxWidth: 'var(--content-max)',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("nav", {
      style: {
        display: 'flex',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: link,
      onClick: () => go('product')
    }, "Fragr\xE2ncia"), /*#__PURE__*/React.createElement("button", {
      style: link,
      onClick: () => go('home')
    }, "Ritual"), /*#__PURE__*/React.createElement("button", {
      style: link,
      onClick: () => go('home')
    }, "Notas")), /*#__PURE__*/React.createElement("button", {
      onClick: () => go('home'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: 'none',
        border: 0,
        cursor: 'pointer',
        color: fg
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo-mark.png",
      alt: "",
      style: {
        height: 16,
        filter: light ? 'none' : 'brightness(0)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-display)',
        fontVariationSettings: "'wdth' 125",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: '.08em'
      }
    }, "PURION GT")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...link,
        cursor: 'default',
        opacity: .8
      }
    }, "16.06.2026"), /*#__PURE__*/React.createElement("button", {
      onClick: openCart,
      style: {
        ...link,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        textDecoration: 'underline',
        textUnderlineOffset: 4
      }
    }, "Sacola (", count, ")"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "menu",
      size: 38,
      variant: light ? 'glass' : 'solid',
      label: "Menu"
    }))));
  }
  function Footer() {
    return /*#__PURE__*/React.createElement("footer", {
      style: {
        background: 'var(--ink-950)',
        color: 'var(--paper-0)',
        padding: '80px var(--gutter) 28px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--content-max)',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 'var(--gutter)',
        paddingBottom: 64,
        borderBottom: '1px solid var(--border-inverse)'
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontVariationSettings: "'wdth' 88",
        fontSize: 40,
        fontWeight: 500,
        letterSpacing: '-.04em',
        lineHeight: 1,
        maxWidth: 420
      }
    }, "Cheiro de chegada, ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--steel-500)'
      }
    }, "todos os dias.")), [['Loja', ['PURION GT 100 ml', 'PURION GT 50 ml', 'Refil']], ['Marca', ['Ritual', 'Notas', 'Imprensa']], ['Ajuda', ['Entrega', 'Trocas', 'Contato']]].map(([t, l]) => /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        fontSize: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: 'var(--ls-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-inverse-muted)'
      }
    }, t), l.map(x => /*#__PURE__*/React.createElement("a", {
      key: x,
      href: "#",
      style: {
        color: 'var(--paper-0)',
        textDecoration: 'none'
      }
    }, x))))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        paddingTop: 24,
        fontSize: 12,
        color: 'var(--text-inverse-muted)'
      }
    }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 PURION GT"), /*#__PURE__*/React.createElement("span", null, "@purionbrasil"))));
  }
  Object.assign(window, {
    Header,
    Footer
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/store/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/store/Home.jsx
try { (() => {
(() => {
  const {
    Button,
    ArrowLink,
    GlassStat,
    Card,
    Marquee,
    RevealText,
    Tabs,
    Tag,
    IconButton,
    Badge
  } = window.DS;
  const homeDisp = {
    fontFamily: 'var(--font-display)',
    fontVariationSettings: "'wdth' 88",
    fontWeight: 500
  };
  function Hero({
    go
  }) {
    const [y, setY] = React.useState(0);
    React.useEffect(() => {
      const f = () => setY(window.scrollY);
      window.addEventListener('scroll', f);
      return () => window.removeEventListener('scroll', f);
    }, []);
    return /*#__PURE__*/React.createElement("section", {
      style: {
        position: 'relative',
        height: '100vh',
        minHeight: 720,
        overflow: 'hidden',
        color: 'var(--paper-0)',
        background: 'var(--ink-900)',
        margin: 10,
        borderRadius: 'var(--radius-lg)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: '-6% 0 0',
        background: 'center 55%/cover url(../../assets/hero-street.png)',
        transform: 'translateY(' + y * 0.25 + 'px) scale(1.04)',
        animation: 'pg-scale-in 1.8s var(--ease-out)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg,rgba(11,12,14,.45) 0%,rgba(11,12,14,0) 30%,rgba(11,12,14,0) 60%,rgba(11,12,14,.6) 100%)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement(RevealText, {
      as: "h1",
      trigger: "mount",
      delay: 200,
      text: "PURION GT",
      style: {
        fontSize: 'var(--fs-mega)',
        letterSpacing: 'var(--ls-mega)',
        lineHeight: 'var(--lh-mega)',
        whiteSpace: 'nowrap'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 'var(--gutter)',
        right: 'var(--gutter)',
        top: 'calc(90px + var(--fs-mega)*.9)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 12,
        lineHeight: 1.3,
        opacity: .85
      }
    }, /*#__PURE__*/React.createElement("span", null, "Perfume", /*#__PURE__*/React.createElement("br", null), "automotivo"), /*#__PURE__*/React.createElement("span", null, "Edi\xE7\xE3o", /*#__PURE__*/React.createElement("br", null), "01"), /*#__PURE__*/React.createElement("span", null, "Feito no", /*#__PURE__*/React.createElement("br", null), "Brasil")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 'var(--gutter)',
        bottom: 'var(--gutter)',
        display: 'flex',
        flexDirection: 'column',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement(RevealText, {
      as: "p",
      trigger: "mount",
      delay: 600,
      text: 'Cheiro\nde chegada.',
      style: {
        fontSize: 'var(--fs-display-l)',
        color: 'rgba(255,255,255,.62)'
      }
    }), /*#__PURE__*/React.createElement(ArrowLink, {
      tone: "light",
      size: "lg",
      href: "#",
      onClick: e => {
        e.preventDefault();
        go('product');
      }
    }, "Comprar agora")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 'var(--gutter)',
        bottom: 'var(--gutter)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'flex-end',
        animation: 'pg-fade-up 1s var(--ease-out) .9s both'
      }
    }, /*#__PURE__*/React.createElement(GlassStat, {
      value: "30d",
      label: /*#__PURE__*/React.createElement(React.Fragment, null, "de difus\xE3o", /*#__PURE__*/React.createElement("br", null), "cont\xEDnua"),
      image: "../../assets/product-bottle.png",
      style: {
        width: 250
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 8px 8px 16px',
        borderRadius: 'var(--radius-pill)',
        background: 'var(--surface-glass)',
        border: '1px solid var(--border-glass)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        fontSize: 13
      }
    }, "Lan\xE7amento 16.06 ", /*#__PURE__*/React.createElement(Badge, {
      tone: "signal",
      dot: true
    }, "Lista aberta"))));
  }
  function Trust() {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        position: 'relative',
        padding: 'var(--section-y) var(--gutter)',
        maxWidth: 'var(--content-max)',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 24,
        marginBottom: 40
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'var(--paper-0)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 24
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...homeDisp,
        fontSize: 40,
        letterSpacing: '-.05em'
      }
    }, "0%"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--text-secondary)'
      }
    }, "\xE1lcool que mancha o painel")), /*#__PURE__*/React.createElement(Card, {
      variant: "plain",
      eyebrow: "#01",
      title: "Fixa\xE7\xE3o que acompanha",
      body: "Difus\xE3o lenta, sem picos. O habit\xE1culo cheira a chegada \u2014 n\xE3o a aromatizante.",
      style: {
        maxWidth: 420
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        textAlign: 'center',
        isolation: 'isolate'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 'min(200px,18vw)',
        aspectRatio: '200/260',
        transform: 'translate(-50%,-50%) rotate(-6deg)',
        borderRadius: 32,
        background: 'var(--ice-200) center/auto 86% no-repeat url(../../assets/product-bottle.png)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: -1
      }
    }), /*#__PURE__*/React.createElement(RevealText, {
      as: "h2",
      text: 'Discreto na entrada,',
      style: {
        fontSize: 'var(--fs-display-l)',
        color: 'var(--steel-400)'
      }
    }), /*#__PURE__*/React.createElement(RevealText, {
      as: "h2",
      delay: 140,
      text: "presente na mem\xF3ria.",
      style: {
        fontSize: 'var(--fs-display-l)'
      }
    })));
  }
  const NOTES = {
    'Saída': ['Bergamota', 'Pimenta rosa', 'Ar frio'],
    'Coração': ['Cedro', 'Vetiver', 'Pedra molhada'],
    'Fundo': ['Couro claro', 'Âmbar seco', 'Almíscar']
  };
  function Notes() {
    const [t, setT] = React.useState('Coração');
    return /*#__PURE__*/React.createElement("section", {
      style: {
        background: 'var(--ink-950)',
        color: 'var(--paper-0)',
        padding: 'var(--section-y) var(--gutter)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--gutter)',
        alignItems: 'end'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: 'var(--ls-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-inverse-muted)'
      }
    }, "Pir\xE2mide olfativa"), /*#__PURE__*/React.createElement(RevealText, {
      as: "h2",
      text: 'Construído\nem três tempos.',
      style: {
        fontSize: 'var(--fs-display-l)',
        marginTop: 16
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      tone: "dark",
      tabs: Object.keys(NOTES),
      value: t,
      onChange: setT
    }), /*#__PURE__*/React.createElement("div", {
      key: t,
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }
    }, NOTES[t].map((n, i) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        padding: '14px 0',
        borderBottom: '1px solid var(--border-inverse)',
        animation: 'pg-fade-up .8s var(--ease-out) ' + i * 70 + 'ms both'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        ...homeDisp,
        fontSize: 36,
        letterSpacing: '-.04em'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-inverse-muted)'
      }
    }, "0", i + 1)))))));
  }
  function Ritual({
    go
  }) {
    const ref = React.useRef(null);
    const items = [{
      e: '07:40',
      t: 'Saída de garagem',
      b: 'O primeiro minuto do dia, já no tom certo.',
      img: '../../assets/hero-street.png'
    }, {
      e: 'Produto',
      t: '100 ml · Edição 01',
      b: 'Vidro espesso, tampa em aço escovado.',
      img: '../../assets/product-bottle.png',
      ice: true
    }, {
      e: '19:10',
      t: 'Volta para casa',
      b: 'O mesmo cheiro, oito horas depois.',
      img: '../../assets/hero-street.png'
    }];
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: 'var(--section-y) 0 var(--section-y) var(--gutter)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        paddingRight: 'var(--gutter)',
        marginBottom: 32
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        ...homeDisp,
        margin: 0,
        fontSize: 28,
        letterSpacing: '-.03em',
        textTransform: 'uppercase'
      }
    }, "O ritual"), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 1,
        background: 'var(--border-strong)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14
      }
    }, "Arraste para ver"), /*#__PURE__*/React.createElement(IconButton, {
      icon: "arrow-right",
      variant: "accent",
      size: 40,
      label: "Pr\xF3ximo",
      onClick: () => ref.current && ref.current.scrollBy({
        left: 480,
        behavior: 'smooth'
      })
    })), /*#__PURE__*/React.createElement("div", {
      ref: ref,
      style: {
        display: 'grid',
        gridAutoFlow: 'column',
        gridAutoColumns: 'min(560px,82vw)',
        gap: 14,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        paddingRight: 'var(--gutter)'
      }
    }, items.map((it, i) => it.ice ? /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => go('product'),
      style: {
        height: 520,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--ice-200) center/auto 80% no-repeat url(' + it.img + ')',
        position: 'relative',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 20,
        bottom: 20,
        right: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 'var(--ls-caps)',
        textTransform: 'uppercase',
        color: 'var(--ice-800)'
      }
    }, it.e), /*#__PURE__*/React.createElement("div", {
      style: {
        ...homeDisp,
        fontSize: 34,
        letterSpacing: '-.045em'
      }
    }, it.t)), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      iconRight: "arrow-up-right"
    }, "Ver"))) : /*#__PURE__*/React.createElement(Card, {
      key: i,
      image: it.img,
      height: 520,
      eyebrow: it.e,
      title: it.t,
      body: it.b,
      style: {
        backgroundPosition: i === 2 ? 'right' : 'left'
      }
    }))));
  }
  function FinalCTA({
    go
  }) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        margin: 10,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        position: 'relative',
        color: 'var(--paper-0)',
        background: 'var(--ink-900)',
        padding: '140px var(--gutter)',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'center 70%/cover url(../../assets/hero-street.png)',
        opacity: .4,
        filter: 'blur(2px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 28
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "../../assets/logo-mark.png",
      alt: "",
      style: {
        height: 28
      }
    }), /*#__PURE__*/React.createElement(RevealText, {
      as: "h2",
      text: 'Entre na lista.\nChegue primeiro.',
      style: {
        fontSize: 'var(--fs-display-l)'
      }
    }), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        maxWidth: 440,
        color: 'var(--text-inverse-muted)'
      }
    }, "Primeiro lote em 16 de junho. Quem est\xE1 na lista recebe o link antes."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "accent",
      size: "lg",
      iconRight: "arrow-up-right",
      onClick: () => go('product')
    }, "Garantir o meu"), /*#__PURE__*/React.createElement(Button, {
      variant: "glass",
      size: "lg"
    }, "Ver o ritual"))));
  }
  function Home({
    go
  }) {
    return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
      go: go
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '28px 0'
      }
    }, /*#__PURE__*/React.createElement(Marquee, {
      items: ['PURION GT', 'Perfume automotivo', 'Edição 01'],
      size: 34
    })), /*#__PURE__*/React.createElement(Trust, null), /*#__PURE__*/React.createElement(Notes, null), /*#__PURE__*/React.createElement(Ritual, {
      go: go
    }), /*#__PURE__*/React.createElement(FinalCTA, {
      go: go
    }));
  }
  Object.assign(window, {
    Home
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/store/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/store/Product.jsx
try { (() => {
(() => {
  const {
    Button,
    Badge,
    Radio,
    Stepper,
    Tabs,
    Tag,
    Checkbox,
    Tooltip,
    IconButton,
    Icon
  } = window.DS;
  const prodDisp = {
    fontFamily: 'var(--font-display)',
    fontVariationSettings: "'wdth' 88",
    fontWeight: 500
  };
  function Product({
    add
  }) {
    const [size, setSize] = React.useState('100 ml');
    const [qty, setQty] = React.useState(1);
    const [tab, setTab] = React.useState('Notas');
    const [img, setImg] = React.useState(0);
    const price = size === '50 ml' ? 119 : 189;
    const info = {
      'Notas': 'Saída de bergamota e pimenta rosa. Coração de cedro e vetiver. Fundo de couro claro e âmbar seco.',
      'Uso': 'Duas borrifadas no tecido do banco ou no carpete. Evite painel e telas. Reaplique quando sentir falta, não antes.',
      'Composição': 'Base sem álcool etílico. Fixador vegetal. Frasco de vidro 100 ml, tampa em aço escovado.'
    };
    const imgs = [{
      bg: 'var(--ice-200)',
      src: '../../assets/product-bottle.png',
      fit: 'auto 82%'
    }, {
      bg: 'var(--ink-900)',
      src: '../../assets/hero-street.png',
      fit: 'cover'
    }];
    return /*#__PURE__*/React.createElement("main", {
      style: {
        padding: '96px var(--gutter) var(--section-y)',
        maxWidth: 'var(--content-max)',
        margin: '0 auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: 'calc(var(--gutter)*2)',
        alignItems: 'start'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 84
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: 'calc(100vh - 120px)',
        minHeight: 560,
        borderRadius: 'var(--radius-lg)',
        background: imgs[img].bg + ' center/' + imgs[img].fit + ' no-repeat url(' + imgs[img].src + ')',
        position: 'relative',
        transition: 'background-color var(--dur-slow)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 16,
        bottom: 16,
        display: 'flex',
        gap: 8
      }
    }, imgs.map((m, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => setImg(i),
      style: {
        width: 64,
        height: 64,
        borderRadius: 12,
        border: i === img ? '2px solid var(--ink-950)' : '1px solid var(--border-glass)',
        background: m.bg + ' center/' + (i === 0 ? 'auto 80%' : 'cover') + ' no-repeat url(' + m.src + ')',
        cursor: 'pointer'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        right: 20,
        top: 20,
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: img ? '#fff' : 'var(--ink-800)'
      }
    }, "0", img + 1, " / 02"))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
        paddingTop: 24
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement(Badge, {
      tone: "signal",
      dot: true
    }, "Lan\xE7amento 16.06"), /*#__PURE__*/React.createElement(Badge, {
      tone: "ice"
    }, "Edi\xE7\xE3o 01")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
      style: {
        ...prodDisp,
        margin: 0,
        fontSize: 'var(--fs-display-l)',
        letterSpacing: 'var(--ls-display)',
        lineHeight: .9
      }
    }, "PURION GT"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '16px 0 0',
        fontSize: 18,
        lineHeight: 1.45,
        color: 'var(--text-secondary)',
        maxWidth: 440,
        textWrap: 'pretty'
      }
    }, "Perfume automotivo. C\xEDtrico na entrada, amadeirado no caminho, couro claro na chegada.")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 30,
        letterSpacing: '-.03em'
      }
    }, "R$ ", price, ",00"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: 'var(--text-muted)'
      }
    }, "ou 3\xD7 R$ ", (price / 3).toFixed(2).replace('.', ','), " sem juros")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: 'var(--ls-caps)',
        textTransform: 'uppercase',
        color: 'var(--text-secondary)'
      }
    }, "Tamanho"), /*#__PURE__*/React.createElement(Radio, {
      variant: "segment",
      options: ['50 ml', '100 ml'],
      value: size,
      onChange: setSize
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement(Stepper, {
      value: qty,
      onChange: setQty,
      max: 6
    }), /*#__PURE__*/React.createElement(Button, {
      size: "md",
      full: true,
      iconRight: "arrow-up-right",
      onClick: () => add(size, qty)
    }, "Adicionar \xE0 sacola")), /*#__PURE__*/React.createElement(Checkbox, {
      label: "Embalagem para presente (gr\xE1tis)"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 20,
        fontSize: 13,
        color: 'var(--text-secondary)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "truck",
      size: 16
    }), "Frete gr\xE1tis acima de R$ 199"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "rotate-ccw",
      size: 16
    }), "7 dias para trocar")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement(Tabs, {
      tabs: Object.keys(info),
      value: tab,
      onChange: setTab
    }), /*#__PURE__*/React.createElement("p", {
      key: tab,
      style: {
        margin: 0,
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        animation: 'pg-fade-up .6s var(--ease-out) both'
      }
    }, info[tab]), tab === 'Notas' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, ['Bergamota', 'Pimenta rosa', 'Cedro', 'Vetiver', 'Couro claro', 'Âmbar'].map(n => /*#__PURE__*/React.createElement(Tag, {
      key: n
    }, n)))))));
  }
  Object.assign(window, {
    Product
  });
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/store/Product.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ArrowLink = __ds_scope.ArrowLink;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.GlassStat = __ds_scope.GlassStat;

__ds_ns.Marquee = __ds_scope.Marquee;

__ds_ns.RevealText = __ds_scope.RevealText;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Stepper = __ds_scope.Stepper;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
