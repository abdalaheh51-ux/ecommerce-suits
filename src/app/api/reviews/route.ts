import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productId, authorName, rating, title, comment } = body

    if (!productId || !authorName || !comment || !rating) {
      return NextResponse.json({ error: 'يرجى تعبئة جميع الحقول المطلوبة' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'التقييم يجب أن يكون بين 1 و 5' }, { status: 400 })
    }

    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    const review = await db.review.create({
      data: {
        productId,
        authorName,
        rating: Number(rating),
        title: title || null,
        comment,
        verified: false,
      },
    })

    // Recalculate product rating
    const reviews = await db.review.findMany({ where: { productId } })
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    await db.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avg * 10) / 10,
        reviewCount: reviews.length,
      },
    })

    return NextResponse.json({ ok: true, review })
  } catch (e: any) {
    console.error('POST /api/reviews error', e)
    return NextResponse.json({ error: 'فشل إضافة المراجعة' }, { status: 500 })
  }
}
