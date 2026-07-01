import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/types'
import { Storefront } from '@/components/storefront/storefront'

export const dynamic = 'force-dynamic'

async function getData() {
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
}

export default async function Home() {
  const data = await getData()
  return <Storefront {...data} />
}
