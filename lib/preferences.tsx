'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

// Per-user UX preferences, persisted in localStorage:
//   - reduceMotion: dial down heavy animations (also auto-on if the OS asks)
//   - muted: silence sound effects

interface Preferences {
  reduceMotion: boolean
  muted: boolean
  toggleReduceMotion: () => void
  toggleMuted: () => void
}

const PreferencesContext = createContext<Preferences | null>(null)

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [reduceMotion, setReduceMotion] = useState(false)
  const [muted, setMuted] = useState(false)

  // Load persisted prefs; default reduceMotion to the OS setting if unset.
  useEffect(() => {
    const storedMotion = localStorage.getItem('pref-reduce-motion')
    const osReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduceMotion(storedMotion === null ? osReduced : storedMotion === '1')
    setMuted(localStorage.getItem('pref-muted') === '1')
  }, [])

  // Reflect reduce-motion on <html> so CSS can react globally.
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion)
  }, [reduceMotion])

  const toggleReduceMotion = useCallback(() => {
    setReduceMotion((v) => {
      const next = !v
      localStorage.setItem('pref-reduce-motion', next ? '1' : '0')
      return next
    })
  }, [])

  const toggleMuted = useCallback(() => {
    setMuted((v) => {
      const next = !v
      localStorage.setItem('pref-muted', next ? '1' : '0')
      return next
    })
  }, [])

  return (
    <PreferencesContext.Provider value={{ reduceMotion, muted, toggleReduceMotion, toggleMuted }}>
      {children}
    </PreferencesContext.Provider>
  )
}

export function usePreferences(): Preferences {
  const ctx = useContext(PreferencesContext)
  if (!ctx) {
    // Safe fallback if used outside the provider (e.g. login page).
    return {
      reduceMotion: false,
      muted: false,
      toggleReduceMotion: () => {},
      toggleMuted: () => {},
    }
  }
  return ctx
}
