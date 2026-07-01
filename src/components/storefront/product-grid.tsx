'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Loader2, PackageOpen } from 'lucide-react'
import { ProductCard } from './product-card'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Category, Product } from '@/lib/types'

const sortOptions = [
  { value: 'featured', label: 'المميزة' },
  { value: 'newest', label: 'الأحدث' },
  { value: 'price-asc', label: 'السعر: الأقل أولاً' },
  { value: 'price-desc', label: 'السعر: الأعلى أولاً' },
  { value: 'rating', label: 'الأعلى تقييماً' },
]

export function ProductGrid({ categories, initialProducts }: { categories: Category[]; initialProducts: Product[] }) {
  const { activeCategory, setActiveCategory, activeSort, setActiveSort } = useUIStore()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory && activeCategory !== 'all') params.set('category', activeCategory)
      params.set('sort', activeSort)
      const res = await fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setProducts(data.products)
      }
    } catch {
      // keep existing
    } finally {
      setLoading(false)
    }
  }, [activeCategory, activeSort])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Listen for category selection events from other components
  useEffect(() => {
    const handler = (e: Event) => {
      const slug = (e as CustomEvent).detail as string
      setActiveCategory(slug)
    }
    window.addEventListener('select-category', handler)
    return () => window.removeEventListener('select-category', handler)
  }, [setActiveCategory])

  const tabs = [{ slug: 'all', name: 'الكل' }, ...categories.map((c) => ({ slug: c.slug, name: c.name }))]

  return (
    <section id="shop" className="py-20 lg:py-28 bg-background scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs tracking-luxe text-gold font-medium uppercase">تشكيلتنا الكاملة</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground">
            اكتشف تشكيلتنا الرسمية
          </h2>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 sticky top-16 lg:top-20 z-20 bg-background/90 backdrop-blur-md py-4 -mx-4 px-4 rounded-lg">
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1">
            {tabs.map((t) => (
              <button
                key={t.slug}
                onClick={() => setActiveCategory(t.slug)}
                className={cn(
                  'px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-all',
                  activeCategory === t.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground/70 hover:bg-accent hover:text-foreground'
                )}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <SlidersHorizontal className="size-4 text-foreground/50" />
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value)}
              className="bg-secondary border-0 rounded-full px-4 py-2 text-sm font-medium text-foreground/80 focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-gold" />
            <span className="ms-3 text-foreground/60">جارٍ التحميل...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PackageOpen className="size-12 text-foreground/30 mb-4" strokeWidth={1} />
            <p className="text-foreground/60 font-medium">لا توجد منتجات في هذه الفئة حالياً</p>
            <Button
              variant="outline"
              className="mt-4 rounded-none"
              onClick={() => setActiveCategory('all')}
            >
              عرض كل المنتجات
            </Button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14"
          >
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </motion.div>
        )}

        <p className="text-center text-sm text-foreground/50 mt-12">
          عرض {products.length} منتج
        </p>
      </div>
    </section>
  )
}
