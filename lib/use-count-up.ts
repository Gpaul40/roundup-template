'use client'

import { useEffect, useRef, useState } from 'react'
import { usePreferences } from './preferences'

// Animates a number from its previous value to `target` over `durationMs`.
// Respects the reduce-motion preference (snaps instantly when on).
export function useCountUp(target: number, durationMs = 800): number {
  const { reduceMotion } = usePreferences()
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    if (reduceMotion) {
      setValue(target)
      fromRef.current = target
      return
    }
    const from = fromRef.current
    if (from === target) return
    const start = performance.now()

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        fromRef.current = target
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, durationMs, reduceMotion])

  return value
}
