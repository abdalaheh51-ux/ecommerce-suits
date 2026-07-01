import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'بريد إلكتروني غير صالح' }, { status: 400 })
    }

    const existing = await db.newsletter.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ ok: true, message: 'أنت مشترك بالفعل' })
    }

    await db.newsletter.create({ data: { email } })
    return NextResponse.json({ ok: true, message: 'تم الاشتراك بنجاح' })
  } catch (e: any) {
    console.error('POST /api/newsletter error', e)
    return NextResponse.json({ error: 'فشل الاشتراك' }, { status: 500 })
  }
}
