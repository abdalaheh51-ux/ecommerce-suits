import { Storefront } from '@/components/storefront/storefront'
import type { Category, Product } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getData() {
  try {
    const { db } = await import('@/lib/db')
    const { serializeProduct } = await import('@/lib/types')

    const [categories, allProducts, bestsellers, newArrivals] = await Promise.all([
      db.category.findMany({ orderBy: { order: 'asc' } }),
      db.product.findMany({
        where: { isActive: true },
        orderBy: [{ featured: 'desc' }, { rating: 'desc' }],
        include: { category: true },
      }),
      db.product.findMany({
        where: { isActive: true, badge: 'الأكثر مبيعاً' },
        orderBy: { rating: 'desc' },
        include: { category: true },
        take: 8,
      }),
      db.product.findMany({
        where: { isActive: true, badge: 'جديد' },
        orderBy: { createdAt: 'desc' },
        include: { category: true },
        take: 8,
      }),
    ])

    return {
      categories,
      allProducts: allProducts.map(serializeProduct),
      bestsellers: bestsellers.map(serializeProduct),
      newArrivals: newArrivals.map(serializeProduct),
    }
  } catch (error) {
    console.error('[v0] Database error:', error)
    const emptyData: { categories: Category[]; allProducts: Product[]; bestsellers: Product[]; newArrivals: Product[] } = {
      categories: [],
      allProducts: [],
      bestsellers: [],
      newArrivals: [],
    }
    return emptyData
  }
}

export default async function Home() {
  const data = await getData()
  return <Storefront {...data} />
}
