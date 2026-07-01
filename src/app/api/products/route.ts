import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') // slug
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'featured' // featured, price-asc, price-desc, rating, newest
    const badge = searchParams.get('badge')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')
    const exclude = searchParams.get('exclude') // slug to exclude

    const where: any = { isActive: true }
    if (category && category !== 'all') {
      where.category = { slug: category }
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }
    if (badge) {
      where.badge = badge
    }
    if (featured === 'true') {
      where.featured = true
    }
    if (exclude) {
      where.slug = { not: exclude }
    }

    let orderBy: any
    switch (sort) {
      case 'price-asc': orderBy = { price: 'asc' }; break
      case 'price-desc': orderBy = { price: 'desc' }; break
      case 'rating': orderBy = { rating: 'desc' }; break
      case 'newest': orderBy = { createdAt: 'desc' }; break
      default: orderBy = [{ featured: 'desc' }, { rating: 'desc' }]
    }

    let products = await db.product.findMany({
      where,
      orderBy,
      include: { category: true },
      ...(limit ? { take: parseInt(limit) } : {}),
    })

    return NextResponse.json({
      products: products.map(serializeProduct),
      count: products.length,
    })
  } catch (e: any) {
    console.error('GET /api/products error', e)
    return NextResponse.json({ error: 'فشل تحميل المنتجات' }, { status: 500 })
  }
}
