# 👑 The Roundup — friend group event rotation app

A mobile-first web app that forces your friend group to actually hang out.

One member at a time is **on organiser duty**. A countdown bomb 💣 ticks down over
their cycle. They propose an event with date options, everyone votes on the
availability grid, the best date gets locked in, and the next person is up.
Miss your turn? You get **fined**, and the fine fund follows your group's house
rules.

Built with Next.js + Supabase. Free to run (Vercel free tier + Supabase free tier).

## ✨ Features

- 🔁 **Automatic rotation** — configurable order and cycle length (a week, two weeks, a month… any number of days)
- 💣 **Countdown timer** with escalating threats as the deadline approaches
- 🗳️ **Availability voting grid** — organiser proposes up to 5 dates, everyone taps the ones they can make
- 🎉 **Event confirmation** with confetti and a countdown to the big day
- 💸 **Fine tracker** with admin-verified payments and a customisable "fine fund" rules card
- 🏆 **Leaderboard** with scores, fun ranks, and per-event attendance tracking
- 📸 **Photo galleries** for every event + member avatars
- 💥 **Detonate switch** — blow up a slacking organiser's turn early (fine included)
- 🔐 Simple password login per member (no signup flow to babysit)
- 🎨 **Theme presets** — recolour the whole app with one line (`gold`, `neon`, `ocean`, `crimson`, `grape`, `mono`, or fully custom)
- 🎬 **Optional videos** — looping backgrounds on login/hero and hype clips on confirm/detonate
- 🔊 **Optional sound effects** with a per-user mute toggle
- ♿ **Reduced-motion support** — respects the OS setting and has an in-app toggle
- ✨ Animated countdown flips, breathing cards, count-up leaderboard, staggered entrances

## 🚀 Set it up for your group (~15 minutes)

### 1. Get the code

Click **"Use this template"** (top right on GitHub) → **"Create a new repository"**.
That gives you your own copy of this app.

### 2. Configure your group

Edit **`config/group.ts`** — it's the only file you need to touch:

- `appName` — what your group calls itself
- `members` — everyone's name, in rotation order (any number of people)
- `admins` — who can verify fines, fix attendance, override the rotation
- `rotationStartDate` — when the first cycle starts
- `cycleDays` — how long each person gets: `7` (weekly), `14` (fortnightly), `30` (monthly)… your call
- `fineAmount` / `currency` — the price of failure
- `fineFund` — your house rules for what happens with the money
- `theme` — pick a colour preset (`gold`, `neon`, `ocean`, `crimson`, `grape`, `mono`) or go `custom`
- `media` — optional video paths (login/hero backgrounds, confirm/detonate clips)
- `sounds` — optional sound-effect paths + volume
- `ranks`, `howItWorks`, etc. — flavour text to make it yours

**Theme:** change `theme.preset` and the entire app recolours — glows, gradients,
buttons, confetti, everything. For a bespoke palette set `preset: 'custom'` and
supply your own colours (the shape is documented in `config/theme.ts`).

**Videos (optional):** drop short `.mp4` files in `public/videos/` and point to
them from `media` in the config. Background videos autoplay muted + looped;
keep them small (a few MB). Leave any field `null` to fall back to images.

**Sounds (optional):** drop short `.mp3` files in `public/sounds/` and reference
them from `sounds.files`. Members can mute with the 🔊 button in the header.
See the READMEs in `public/videos/` and `public/sounds/` for exact filenames.

### 3. Create the database (Supabase, free)

1. Go to [supabase.com](https://supabase.com), create a free project.
2. In your project, open **SQL Editor**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
   This creates all tables and the photo storage bucket.
3. Go to **Settings → API** and copy three values:
   - Project URL
   - `anon` public key
   - `service_role` key (keep this secret!)

### 4. Set the environment variables

Copy `.env.example` to `.env.local` and fill it in:

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase `service_role` key (secret) |
| `SESSION_SECRET` | Any long random string (`openssl rand -hex 32`) |
| `PASSWORD_<NAME>` | One per member in your config, e.g. `PASSWORD_ALEX` |

> ⚠️ The `PASSWORD_<NAME>` variables must match the member names in
> `config/group.ts`, uppercased. If you add a member, add their password too.

### 5. Run it locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), pick your name, log in
with the password you set. Done.

### 6. Deploy it (Vercel, free)

1. Push your repo to GitHub (if you used "Use this template", it's already there).
2. Go to [vercel.com/new](https://vercel.com/new), import your repository.
3. Add all the environment variables from step 4 when prompted.
4. Deploy. Share the URL with your group. 🎉

Any time you edit `config/group.ts` and push, Vercel redeploys automatically.

## 🛠 Customisation tips

- **Group photo**: drop a photo in `public/` (e.g. `public/group.png`) and set
  `groupPhoto: '/group.png'` in the config — it appears behind the Current
  Organiser card.
- **Fine fund banner**: same idea with `fineFund.image`, or admins can upload
  one directly in the app.
- **Adding/removing members**: edit `members` in the config and add/remove the
  matching `PASSWORD_<NAME>` env var. Note this shifts the rotation, so it's
  cleanest to do between cycles.
- **Changing cycle length mid-run**: changing `cycleDays` recalculates the
  whole rotation from `rotationStartDate`. To avoid confusing jumps, also set
  `rotationStartDate` to the start of the current (or next) cycle when you
  change it.
- **App icon / colours**: replace the icons in `public/`, tweak the theme in
  `app/globals.css`.

## 🧩 How it works under the hood

- **Next.js App Router** (React 19, Tailwind 4, shadcn/ui components)
- **Supabase** for data (events, fines, proposals, votes) and photo storage
- **Reads** happen in the browser with the public anon key (tables are
  read-only to the public via RLS)
- **Writes** go through Next.js server actions using the service-role key,
  with a signed HTTP-only session cookie identifying the member
- **Rotation math** is pure date arithmetic from `rotationStartDate` +
  `cycleDays` — no cron jobs needed

## 📄 License

MIT — do whatever you want with it. Have fun, organise things, fine your
friends responsibly.
