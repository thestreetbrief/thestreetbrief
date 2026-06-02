// Tweaks panel for TheStreetBrief
// - Secondary accent color (curated swatches)
// - Hero layout variant
// - Density
// Cross-page persistence via localStorage so tweaks stick when navigating.

const TWEAKS_KEY = 'tsb-tweaks-v1';

const TSB_DEFAULTS = {
  accent: '#B8923E',   // gold (default)
  density: 'regular',
};

const ACCENT_OPTIONS = [
  '#B8923E', // brushed gold (default)
  '#1A2C4E', // institutional navy
  '#B83A2E', // ticker red
  '#C46A1F', // burnt orange
  '#7A5C8A', // muted plum
];

function loadTweaks() {
  try {
    const raw = localStorage.getItem(TWEAKS_KEY);
    if (!raw) return { ...TSB_DEFAULTS };
    return { ...TSB_DEFAULTS, ...JSON.parse(raw) };
  } catch (e) { return { ...TSB_DEFAULTS }; }
}

function applyTweaks(t) {
  const root = document.documentElement;
  // Update --gold and --gold-soft to reflect secondary accent
  root.style.setProperty('--gold', t.accent);
  root.style.setProperty('--gold-soft', lighten(t.accent, 0.18));
  root.setAttribute('data-density', t.density);
}

function lighten(hex, amt) {
  // crude lighten: mix with paper #F5EFE2
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  const mix = (a, b, t) => Math.round(a * (1 - t) + b * t);
  const R = mix(r, 245, amt), G = mix(g, 239, amt), B = mix(b, 226, amt);
  return '#' + [R,G,B].map(v => v.toString(16).padStart(2,'0')).join('');
}

function TheStreetBriefTweaks() {
  const [t, setT] = React.useState(loadTweaks);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { applyTweaks(t); }, [t]);
  React.useEffect(() => {
    applyTweaks(t);
    setMounted(true);
  }, []);

  const update = (k, v) => {
    setT(prev => {
      const next = { ...prev, [k]: v };
      try { localStorage.setItem(TWEAKS_KEY, JSON.stringify(next)); } catch(e) {}
      return next;
    });
  };

  // (hero variant tweak removed — homepage now uses a single clean layout)

  if (!mounted) return null;

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Secondary accent" />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={ACCENT_OPTIONS}
        onChange={v => update('accent', v)}
      />
      <div style={{
        fontFamily: '"Geist Mono", monospace',
        fontSize: 10,
        letterSpacing: 0.6,
        textTransform: 'uppercase',
        color: '#6B6258',
        marginTop: -4, marginBottom: 4,
        paddingLeft: 2,
      }}>
        {t.accent === '#B8923E' && 'Brushed gold — luxury / default'}
        {t.accent === '#1A2C4E' && 'Institutional navy'}
        {t.accent === '#B83A2E' && 'Ticker red — alert'}
        {t.accent === '#C46A1F' && 'Burnt orange — editorial'}
        {t.accent === '#7A5C8A' && 'Muted plum — quiet'}
      </div>

      <TweakSection label="Density" />
      <TweakRadio
        label="Section padding"
        value={t.density}
        options={['compact', 'regular', 'airy']}
        onChange={v => update('density', v)}
      />
    </TweaksPanel>
  );
}

// Mount
(function mount() {
  const root = document.getElementById('tweaks-root');
  if (!root) return;
  ReactDOM.createRoot(root).render(<TheStreetBriefTweaks />);
})();
