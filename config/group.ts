// ═══════════════════════════════════════════════════════════════════════════
//  GROUP CONFIG — this is the ONLY file you need to edit to set up the app
//  for your own friend group.
//
//  After editing, remember to also set the environment variables listed in
//  .env.example (one PASSWORD_<NAME> per member below).
// ═══════════════════════════════════════════════════════════════════════════

import type { ThemeConfig } from './theme'

export const groupConfig = {
  // ── Branding ──────────────────────────────────────────────────────────────
  appName: 'The Roundup',
  appDescription:
    'The official tribunal for managing your friend group events. Justice will be served.',

  // ── Members ───────────────────────────────────────────────────────────────
  // Short UPPERCASE names, listed in ROTATION ORDER.
  // The first member organises the first cycle, then it rotates down the list.
  // Any number of members works — 3, 6, 10, whatever your group is.
  members: ['ALEX', 'BLAKE', 'CASEY', 'DYLAN', 'EDEN'],

  // Members who can verify fine payments, edit attendance, delete events and
  // override the current organiser. Usually just one person.
  admins: ['ALEX'],

  // ── Rotation ──────────────────────────────────────────────────────────────
  // The date your first cycle starts (YYYY-MM-DD). Pick a date in the near
  // future so everyone gets a heads-up before the first timer starts.
  rotationStartDate: '2026-08-01',

  // How long each organiser gets to run their event, in days.
  //   7  = one week per person
  //   14 = two weeks per person
  //   30 = roughly a month per person
  // Any number of days works.
  cycleDays: 14,

  // ── Fines ─────────────────────────────────────────────────────────────────
  // What a failed / detonated cycle costs the organiser.
  fineAmount: 50,
  currency: '$',

  // ── The Fine Fund card ────────────────────────────────────────────────────
  // What happens to the fine money. Make up your own house rules!
  fineFund: {
    title: 'The Fine Fund',
    emoji: '🎰',
    // Optional banner image. Put a file in /public and reference it here
    // (e.g. '/roulette.png'), or leave as-is. Admins can also upload a banner
    // directly in the app, which overrides this.
    image: '/roulette.png',
    // Shown under the fine amount on the card. Add / remove / reword freely.
    rules: [
      {
        icon: '🎡',
        text: 'The fine pot goes towards the next group outing. No exceptions.',
      },
      {
        icon: '💸',
        text: 'Anything left over is split equally among all members — excluding the organiser who failed.',
      },
    ],
  },

  // ── Images ────────────────────────────────────────────────────────────────
  // Optional group photo shown behind the Current Organiser card.
  // Put a photo in /public (e.g. '/group.png') and set the path here,
  // or leave as null for a clean gradient background.
  groupPhoto: null as string | null,

  // ── Locale ────────────────────────────────────────────────────────────────
  // Used for date formatting, e.g. 'en-AU', 'en-GB', 'en-US'.
  dateLocale: 'en-AU',

  // ── Theme ─────────────────────────────────────────────────────────────────
  // Recolour the whole app with one line. Built-in presets:
  //   'gold' (default) · 'neon' · 'ocean' · 'crimson' · 'grape' · 'mono'
  // Or set preset: 'custom' and provide your own colours (see config/theme.ts
  // for the shape — primary/secondary are CSS oklch(), brandRgb is "r,g,b").
  theme: {
    preset: 'gold',
    // Example custom theme:
    // preset: 'custom',
    // primary: 'oklch(0.8 0.15 200)',
    // secondary: 'oklch(0.6 0.2 300)',
    // brandRgb: '56,199,236',
    // accentRgb: '147,51,234',
    // gradient: ['#38c7ec', '#7ee8ff'],
    // confetti: ['#38c7ec', '#ffffff', '#4e6ef2'],
  } as ThemeConfig,

  // ── Media (optional videos) ────────────────────────────────────────────────
  // Drop video files in /public/videos and reference them here. Every field is
  // optional — leave as null to fall back to images / plain backgrounds.
  // Videos autoplay muted + looped, so use short, light clips (a few MB).
  media: {
    // Looping background behind the login screen.
    loginVideo: null as string | null,
    // Looping background behind the Current Organiser card
    // (overrides groupPhoto above when set).
    heroVideo: null as string | null,
    // Plays once in the "It's ON!" modal when an event is confirmed.
    celebrationVideo: null as string | null,
    // Plays once in the detonate confirmation modal.
    detonateVideo: null as string | null,
  },

  // ── Sound effects (optional) ───────────────────────────────────────────────
  // Drop short .mp3 files in /public/sounds and reference them here. Users can
  // mute in-app (🔊 button in the header). All optional and fail silently.
  sounds: {
    enabled: true,
    volume: 0.6,
    files: {
      confirm: null as string | null,   // event confirmed
      detonate: null as string | null,  // detonate switch fired
      fine: null as string | null,      // fine verified / paid
    },
  },

  // ── Rank system ───────────────────────────────────────────────────────────
  // Members earn a rank based on events organised vs fines collected.
  // Rename these to whatever inside jokes your group runs on.
  ranks: {
    top: ['SUPREME LEGEND', 'GRAND ORGANISER', 'EVENT OVERLORD', 'PRIME MOVER'],
    good: ['Certified Organiser', 'Reliable Unit', 'Solid Operator', 'Gold Standard'],
    suspicious: ['Under Review', 'Semi-Reliable', 'Borderline', 'On Thin Ice'],
    bad: ['Public Liability', 'Repeat Offender', 'Walking Fine', 'Chaos Agent'],
    shame: ['Ghost', 'No-Show Merchant', 'Certified Flop', 'Missing In Action'],
  },

  // ── Login page ────────────────────────────────────────────────────────────
  howItWorks: [
    'Each cycle one member is on organiser duty — they must plan the event.',
    'Vote on dates using the availability grid so everyone can attend.',
    'Once a date is locked, the event is confirmed and the next person is up.',
    'Miss your cycle and face the tribunal. No excuses.',
  ],
  loginFooter: 'Failure to comply will result in tribunal action',
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers (no need to edit below this line)
// ─────────────────────────────────────────────────────────────────────────────

export function isAdmin(name: string): boolean {
  return groupConfig.admins.includes(name)
}

/** 'ALEX' -> 'Alex' for display */
export function displayName(name: string): string {
  return name[0] + name.slice(1).toLowerCase()
}
