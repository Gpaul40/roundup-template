import { Member, CycleInfo, MemberStatus } from './types'
import { groupConfig } from '@/config/group'

// Rotation order comes straight from the config — first member starts.
export const ROTATION_ORDER = groupConfig.members

const ROTATION_START = new Date(`${groupConfig.rotationStartDate}T00:00:00`)
const CYCLE_DAYS = groupConfig.cycleDays

// Calculate which cycle we're in and who's the organiser
export function getCurrentCycleInfo(): {
  currentOrganiserIndex: number
  cycleNumber: number
  cycleStartDate: Date
  cycleEndDate: Date
  daysRemaining: number
} {
  const now = new Date()
  const msPerDay = 24 * 60 * 60 * 1000
  const daysSinceStart = Math.floor((now.getTime() - ROTATION_START.getTime()) / msPerDay)

  // If before start date, show first organiser
  if (daysSinceStart < 0) {
    return {
      currentOrganiserIndex: 0,
      cycleNumber: 1,
      cycleStartDate: ROTATION_START,
      cycleEndDate: new Date(ROTATION_START.getTime() + (CYCLE_DAYS - 1) * msPerDay),
      daysRemaining: CYCLE_DAYS + daysSinceStart,
    }
  }

  const cycleNumber = Math.floor(daysSinceStart / CYCLE_DAYS) + 1
  const currentOrganiserIndex = (cycleNumber - 1) % ROTATION_ORDER.length
  const cycleStartDate = new Date(ROTATION_START.getTime() + (cycleNumber - 1) * CYCLE_DAYS * msPerDay)
  const cycleEndDate = new Date(cycleStartDate.getTime() + (CYCLE_DAYS - 1) * msPerDay)
  const daysIntoCycle = daysSinceStart % CYCLE_DAYS
  const daysRemaining = CYCLE_DAYS - daysIntoCycle

  return {
    currentOrganiserIndex,
    cycleNumber,
    cycleStartDate,
    cycleEndDate,
    daysRemaining,
  }
}

export function getCurrentOrganiser(): string {
  const { currentOrganiserIndex } = getCurrentCycleInfo()
  return ROTATION_ORDER[currentOrganiserIndex]
}

export function getNextOrganiser(): string {
  const { currentOrganiserIndex } = getCurrentCycleInfo()
  const nextIndex = (currentOrganiserIndex + 1) % ROTATION_ORDER.length
  return ROTATION_ORDER[nextIndex]
}

export const members: Member[] = ROTATION_ORDER.map((name, i) => ({
  id: String(i + 1),
  name,
  avatar: name[0],
  status: 'Compliant',
  eventsOrganised: 0,
  fines: 0,
  totalFineAmount: 0,
}))

const cycleInfo = getCurrentCycleInfo()
const currentOrganiserName = getCurrentOrganiser()
const nextOrganiserName = getNextOrganiser()
const currentMember = members.find(m => m.name === currentOrganiserName)
const nextMember = members.find(m => m.name === nextOrganiserName)

export const currentCycle: CycleInfo = {
  currentOrganiserId: currentMember?.id || '1',
  cycleStartDate: cycleInfo.cycleStartDate.toISOString().split('T')[0],
  cycleEndDate: cycleInfo.cycleEndDate.toISOString().split('T')[0],
  nextOrganiserId: nextMember?.id || '2',
}

export function getStatusColor(status: MemberStatus): string {
  switch (status) {
    case 'Compliant':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    case 'Under Investigation':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'Dog Act':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }
}

export function getStatusIcon(status: MemberStatus): string {
  switch (status) {
    case 'Compliant':
      return '✓'
    case 'Under Investigation':
      return '⚠'
    case 'Dog Act':
      return '🚫'
    default:
      return '•'
  }
}

// ── Rank System ─────────────────────────────────────────────────────────────
// Rank names are configured in config/group.ts

export type RankTier = 'top' | 'good' | 'suspicious' | 'bad' | 'shame'

export interface MemberRank {
  name: string
  tier: RankTier
  color: string
  glowStyle: string
}

function nameHash(name: string): number {
  return name.split('').reduce((acc, c) => ((acc * 31) + c.charCodeAt(0)) & 0xffff, 0)
}

/**
 * Returns the rank for a member based on their events organised and fines.
 * Score = eventsOrganised * 10 - fines * 5
 *   ≥ 30  → TOP TIER
 *   ≥  0  → GOOD STATUS  (starting tier)
 *   ≥ -15 → SUSPICIOUS
 *   ≥ -30 → BAD
 *   < -30 → HALL OF SHAME
 */
export function getMemberRank(eventsOrganised: number, fines: number, memberName: string): MemberRank {
  const score = eventsOrganised * 10 - fines * 5
  const h = nameHash(memberName)
  const ranks = groupConfig.ranks

  if (score >= 30) {
    return {
      name: ranks.top[h % ranks.top.length],
      tier: 'top',
      color: 'text-amber-300',
      glowStyle: '0 0 8px rgba(252,211,77,0.95), 0 0 20px rgba(252,211,77,0.5)',
    }
  }
  if (score >= 0) {
    return {
      name: ranks.good[h % ranks.good.length],
      tier: 'good',
      color: 'text-emerald-400',
      glowStyle: '0 0 8px rgba(52,211,153,0.95), 0 0 20px rgba(52,211,153,0.5)',
    }
  }
  if (score >= -15) {
    return {
      name: ranks.suspicious[h % ranks.suspicious.length],
      tier: 'suspicious',
      color: 'text-amber-400',
      glowStyle: '0 0 8px rgba(251,191,36,0.95), 0 0 20px rgba(251,191,36,0.5)',
    }
  }
  if (score >= -30) {
    return {
      name: ranks.bad[h % ranks.bad.length],
      tier: 'bad',
      color: 'text-red-400',
      glowStyle: '0 0 8px rgba(248,113,113,0.95), 0 0 20px rgba(248,113,113,0.5)',
    }
  }
  return {
    name: ranks.shame[h % ranks.shame.length],
    tier: 'shame',
    color: 'text-purple-400',
    glowStyle: '0 0 8px rgba(192,132,252,0.95), 0 0 20px rgba(192,132,252,0.5)',
  }
}
