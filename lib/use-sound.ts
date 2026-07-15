'use client'

import { useCallback, useRef } from 'react'
import { usePreferences } from './preferences'
import { groupConfig } from '@/config/group'

// Plays short sound effects configured in config/group.ts (sounds section).
// Files live in /public (e.g. /sounds/detonate.mp3). Everything is optional and
// fails silently — a missing file or a blocked autoplay never throws.

type SoundKey = keyof typeof groupConfig.sounds.files

export function useSound() {
  const { muted } = usePreferences()
  const cache = useRef<Record<string, HTMLAudioElement>>({})

  return useCallback(
    (key: SoundKey) => {
      if (muted || !groupConfig.sounds.enabled) return
      const src = groupConfig.sounds.files[key]
      if (!src) return
      try {
        let audio = cache.current[src]
        if (!audio) {
          audio = new Audio(src)
          audio.volume = groupConfig.sounds.volume ?? 0.6
          cache.current[src] = audio
        }
        audio.currentTime = 0
        void audio.play().catch(() => {})
      } catch {
        /* ignore — sound is a nice-to-have */
      }
    },
    [muted],
  )
}
