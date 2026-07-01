import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: true,
        reviews: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!product || !product.isActive) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    const related = await db.product.findMany({
      where: {
        categoryId: product.categoryId,
        slug: { not: product.slug },
        isActive: true,
      },
      take: 4,
      include: { category: true },
    })

    return NextResponse.json({
      product: serializeProduct(product),
      related: related.map(serializeProduct),
    })
  } catch (e: any) {
    console.error('GET /api/products/[slug] error', e)
    return NextResponse.json({ error: 'فشل تحميل المنتج' }, { status: 500 })
  }
}
