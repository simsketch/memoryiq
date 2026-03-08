import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'
import { brains, brain_members } from '../../../../../drizzle/schema'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  const svix_id = req.headers.get('svix-id')
  const svix_timestamp = req.headers.get('svix-timestamp')
  const svix_signature = req.headers.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const body = await req.text()
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: { type: string; data: { id: string } }
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as typeof evt
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (evt.type === 'user.created') {
    const userId = evt.data.id
    const mcp_key = randomUUID()

    const [brain] = await db.insert(brains).values({
      name: 'My Brain',
      type: 'personal',
      owner_id: userId,
      mcp_key,
    }).returning()

    await db.insert(brain_members).values({
      brain_id: brain.id,
      user_id: userId,
      role: 'owner',
    })
  }

  return NextResponse.json({ received: true })
}
