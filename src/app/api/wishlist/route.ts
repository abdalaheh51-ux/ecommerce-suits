import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionId } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sessionId = await getSessionId()
    const items = await db.wishlistItem.findMany({
      where: { sessionId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ items })
  } catch (e: any) {
    console.error('GET /api/wishlist error', e)
    return NextResponse.json({ error: 'فشل تحميل المفضلة' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const { productId } = await req.json()
    if (!productId) {
      return NextResponse.json({ error: 'المنتج مطلوب' }, { status: 400 })
    }

    const existing = await db.wishlistItem.findUnique({
      where: { sessionId_productId: { sessionId, productId } },
    })
    if (existing) {
      await db.wishlistItem.delete({ where: { id: existing.id } })
      return NextResponse.json({ ok: true, action: 'removed' })
    }

    const item = await db.wishlistItem.create({
      data: { sessionId, productId },
      include: { product: { include: { category: true } } },
    })
    return NextResponse.json({ ok: true, action: 'added', item })
  } catch (e: any) {
    console.error('POST /api/wishlist error', e)
    return NextResponse.json({ error: 'فشل تحديث المفضلة' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      await db.wishlistItem.deleteMany({ where: { id, sessionId } })
    } else {
      await db.wishlistItem.deleteMany({ where: { sessionId } })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('DELETE /api/wishlist error', e)
    return NextResponse.json({ error: 'فشل الحذف من المفضلة' }, { status: 500 })
  }
}
