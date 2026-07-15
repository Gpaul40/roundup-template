// ═══════════════════════════════════════════════════════════════════════════
//  THEME PRESETS
//
//  You normally don't need to edit this file — just pick a `theme.preset` in
//  config/group.ts (or set `theme.preset: 'custom'` there and provide your own
//  colours). Add your own preset here if you want a brand-new palette.
// ═══════════════════════════════════════════════════════════════════════════

export interface ThemePreset {
  /** Main brand colour (replaces "gold") — CSS oklch() value */
  primary: string
  /** Accent colour (replaces "purple") — CSS oklch() value */
  secondary: string
  /** Brand colour as "r,g,b" — drives glows, gradients, breathing card */
  brandRgb: string
  /** Accent colour as "r,g,b" */
  accentRgb: string
  /** Two hex stops for the big animated title gradient */
  gradient: [string, string]
  /** Confetti burst colours (hex) used on celebration */
  confetti: string[]
}

export const themePresets: Record<string, ThemePreset> = {
  // The original luxury look — black, gold, purple.
  gold: {
    primary: 'oklch(0.78 0.15 85)',
    secondary: 'oklch(0.55 0.2 300)',
    brandRgb: '212,175,55',
    accentRgb: '147,51,234',
    gradient: ['#d4af37', '#f4d03f'],
    confetti: ['#d4af37', '#ffffff', '#ff4444', '#22c55e'],
  },
  // Cyberpunk green + magenta.
  neon: {
    primary: 'oklch(0.85 0.2 145)',
    secondary: 'oklch(0.7 0.28 330)',
    brandRgb: '57,255,136',
    accentRgb: '255,64,200',
    gradient: ['#39ff88', '#7CFFB2'],
    confetti: ['#39ff88', '#ff40c8', '#ffffff', '#00e5ff'],
  },
  // Cool cyan + deep blue.
  ocean: {
    primary: 'oklch(0.8 0.13 210)',
    secondary: 'oklch(0.6 0.18 260)',
    brandRgb: '56,199,236',
    accentRgb: '78,110,242',
    gradient: ['#38c7ec', '#7ee8ff'],
    confetti: ['#38c7ec', '#4e6ef2', '#ffffff', '#00ffd5'],
  },
  // Bold crimson + gold trim.
  crimson: {
    primary: 'oklch(0.62 0.22 25)',
    secondary: 'oklch(0.78 0.15 85)',
    brandRgb: '229,57,53',
    accentRgb: '212,175,55',
    gradient: ['#e53935', '#ff7043'],
    confetti: ['#e53935', '#d4af37', '#ffffff', '#ff7043'],
  },
  // Vibrant grape + hot pink.
  grape: {
    primary: 'oklch(0.6 0.24 300)',
    secondary: 'oklch(0.7 0.22 350)',
    brandRgb: '168,85,247',
    accentRgb: '244,114,182',
    gradient: ['#a855f7', '#d8b4fe'],
    confetti: ['#a855f7', '#f472b6', '#ffffff', '#38bdf8'],
  },
  // Clean silver monochrome.
  mono: {
    primary: 'oklch(0.85 0 0)',
    secondary: 'oklch(0.65 0.02 260)',
    brandRgb: '212,212,216',
    accentRgb: '148,163,184',
    gradient: ['#e4e4e7', '#a1a1aa'],
    confetti: ['#e4e4e7', '#a1a1aa', '#ffffff', '#71717a'],
  },
}

export type ThemeConfig = {
  preset: keyof typeof themePresets | 'custom'
  // Only used when preset === 'custom':
  primary?: string
  secondary?: string
  brandRgb?: string
  accentRgb?: string
  gradient?: [string, string]
  confetti?: string[]
}

/** Resolve the active theme from a group's theme config. */
export function resolveTheme(theme: ThemeConfig | undefined): ThemePreset {
  const base = themePresets[theme?.preset as string] ?? themePresets.gold
  if (theme?.preset === 'custom') {
    return {
      primary: theme.primary ?? base.primary,
      secondary: theme.secondary ?? base.secondary,
      brandRgb: theme.brandRgb ?? base.brandRgb,
      accentRgb: theme.accentRgb ?? base.accentRgb,
      gradient: theme.gradient ?? base.gradient,
      confetti: theme.confetti ?? base.confetti,
    }
  }
  return base
}

/** Build the CSS that overrides the root theme variables. Injected in layout. */
export function themeToCss(theme: ThemeConfig | undefined): string {
  const t = resolveTheme(theme)
  return `:root, .dark {
  --primary: ${t.primary};
  --secondary: ${t.secondary};
  --accent: ${t.secondary};
  --ring: ${t.primary};
  --gold: ${t.primary};
  --purple: ${t.secondary};
  --brand-rgb: ${t.brandRgb};
  --accent-rgb: ${t.accentRgb};
  --brand-gradient-from: ${t.gradient[0]};
  --brand-gradient-to: ${t.gradient[1]};
}`
}
