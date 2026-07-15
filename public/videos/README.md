# Videos

Drop short, light (a few MB) video clips here and point to them from
`config/group.ts` → `media`:

- `loginVideo`       — looping background on the login screen
- `heroVideo`        — looping background behind the Current Organiser card
- `celebrationVideo` — plays once when an event is confirmed
- `detonateVideo`    — plays once in the detonate modal

Example: put `hype.mp4` here, then set `media.celebrationVideo: '/videos/hype.mp4'`.

Background videos autoplay muted + looped, so keep them short and small.
MP4 (H.264) is the safest format for all browsers.
