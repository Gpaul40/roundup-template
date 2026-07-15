# Sound effects

Drop short `.mp3` files here and point to them from `config/group.ts` → `sounds.files`:

- `confirm`  — plays when an event is confirmed
- `detonate` — plays when the detonate switch fires
- `fine`     — plays when a fine is verified/paid

Example: put `boom.mp3` here, then set `sounds.files.detonate: '/sounds/boom.mp3'`.

Users can mute all sounds with the 🔊 button in the app header.
