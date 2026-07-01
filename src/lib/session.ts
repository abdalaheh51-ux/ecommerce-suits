import { cookies } from 'next/headers'
import { randomUUID } from 'crypto'

export const SESSION_COOKIE = 'velora_session'

export async function getSessionId(): Promise<string> {
  const store = await cookies()
  let sid = store.get(SESSION_COOKIE)?.value
  if (!sid) {
    sid = randomUUID()
    store.set(SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }
  return sid
}

export async function getExistingSessionId(): Promise<string | null> {
  const store = await cookies()
  return store.get(SESSION_COOKIE)?.value ?? null
}
