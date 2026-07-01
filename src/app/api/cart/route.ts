import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSessionId } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sessionId = await getSessionId()
    const items = await db.cartItem.findMany({
      where: { sessionId },
      include: { product: { include: { category: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ items })
  } catch (e: any) {
    console.error('GET /api/cart error', e)
    return NextResponse.json({ error: 'فشل تحميل السلة' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const body = await req.json()
    const { productId, quantity = 1, size, color } = body

    if (!productId) {
      return NextResponse.json({ error: 'المنتج مطلوب' }, { status: 400 })
    }

    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    const existing = await db.cartItem.findFirst({
      where: { sessionId, productId, size: size ?? null, color: color ?? null },
    })

    let item
    if (existing) {
      item = await db.cartItem.update({
        where: { id: existing.id },
        data: { quantity: { increment: quantity } },
        include: { product: { include: { category: true } } },
      })
    } else {
      item = await db.cartItem.create({
        data: { sessionId, productId, quantity, size: size ?? null, color: color ?? null },
        include: { product: { include: { category: true } } },
      })
    }

    return NextResponse.json({ item })
  } catch (e: any) {
    console.error('POST /api/cart error', e)
    return NextResponse.json({ error: 'فشل إضافة المنتج للسلة' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const body = await req.json()
    const { id, quantity } = body

    if (quantity <= 0) {
      await db.cartItem.deleteMany({ where: { id, sessionId } })
      return NextResponse.json({ ok: true, removed: true })
    }

    await db.cartItem.updateMany({
      where: { id, sessionId },
      data: { quantity },
    })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('PUT /api/cart error', e)
    return NextResponse.json({ error: 'فشل تحديث السلة' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = await getSessionId()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      await db.cartItem.deleteMany({ where: { id, sessionId } })
    } else {
      await db.cartItem.deleteMany({ where: { sessionId } })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('DELETE /api/cart error', e)
    return NextResponse.json({ error: 'فشل حذف المنتج من السلة' }, { status: 500 })
  }
}
