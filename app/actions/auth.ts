'use server'

import { redirect } from 'next/navigation'
import { createSession, destroySession } from '@/lib/session'
import { groupConfig } from '@/config/group'

// Each member's password comes from an environment variable named
// PASSWORD_<NAME>, e.g. PASSWORD_ALEX for the member 'ALEX'.
// See .env.example for the full list your config requires.
function getPassword(name: string): string | undefined {
  return process.env[`PASSWORD_${name}`]
}

export async function loginAction(formData: FormData): Promise<{ error: string } | never> {
  const name = (formData.get('name') as string | null)?.toUpperCase()
  const password = formData.get('password') as string | null

  if (!name || !groupConfig.members.includes(name) || !getPassword(name)) {
    return { error: 'Pick your name' }
  }
  if (!password || getPassword(name) !== password) {
    return { error: 'Wrong password, try again' }
  }

  await createSession(name)
  redirect('/')
}

export async function logoutAction(): Promise<never> {
  await destroySession()
  redirect('/login')
}
