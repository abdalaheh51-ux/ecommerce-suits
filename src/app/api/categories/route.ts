import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({ categories })
  } catch (e: any) {
    console.error('GET /api/categories error', e)
    return NextResponse.json({ error: 'فشل تحميل الفئات' }, { status: 500 })
  }
}
