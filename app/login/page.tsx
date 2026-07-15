'use client'

import { useActionState, useState } from 'react'
import { Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { loginAction } from '@/app/actions/auth'
import { getCurrentCycleInfo, ROTATION_ORDER } from '@/lib/data'
import { groupConfig, displayName } from '@/config/group'

const cycleInfo = getCurrentCycleInfo()
const currentOrganiser = ROTATION_ORDER[cycleInfo.currentOrganiserIndex]

export default function LoginPage() {
  const [selectedName, setSelectedName] = useState('')
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error: string } | null, formData: FormData) => {
      formData.set('name', selectedName)
      return loginAction(formData)
    },
    null,
  )

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden">
      {/* Optional looping background video */}
      {groupConfig.media.loginVideo && (
        <>
          <video
            className="bg-video"
            src={groupConfig.media.loginVideo}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/70" />
        </>
      )}
      <div className="relative z-10 glass-card rounded-2xl p-8 max-w-sm w-full text-center space-y-6 animate-slide-up">
        <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-gold">
          <Crown className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Attention</p>
          <h1 className="text-3xl font-bold text-gold-gradient">
            {"IT'S"} {currentOrganiser}{"'S"} TURN
          </h1>
        </div>

        <form action={formAction} className="space-y-3 text-left">
          <Select value={selectedName} onValueChange={setSelectedName} name="name">
            <SelectTrigger className="bg-muted/30 border-border">
              <SelectValue placeholder="Who are you?" />
            </SelectTrigger>
            <SelectContent>
              {ROTATION_ORDER.map((name) => (
                <SelectItem key={name} value={name}>
                  {displayName(name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-muted/30 border-border"
          />

          <p className="text-xs text-muted-foreground/60">Ask your group admin for the password</p>

          {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending || !selectedName}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base glow-gold"
            >
              {isPending ? 'Checking...' : 'Acknowledge Responsibility'}
            </Button>
          </div>
        </form>

        <div className="text-left border border-border/40 rounded-xl p-4 bg-muted/10 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">How it works</p>
          {groupConfig.howItWorks.map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-primary font-bold text-xs mt-0.5 shrink-0">{i + 1}.</span>
              <p className="text-xs text-muted-foreground/80 leading-snug">{step}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/60">
          {groupConfig.loginFooter}
        </p>
      </div>
    </div>
  )
}
