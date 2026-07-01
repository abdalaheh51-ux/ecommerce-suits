'use client'

import { Header } from './header'
import { Hero } from './hero'
import { Categories } from './categories'
import { ProductCarousel } from './product-carousel'
import { EditorialBanner } from './editorial-banner'
import { ProductGrid } from './product-grid'
import { Values } from './values'
import { Testimonials } from './testimonials'
import { Newsletter } from './newsletter'
import { Footer } from './footer'
import { CartDrawer } from './cart-drawer'
import { WishlistDrawer } from './wishlist-drawer'
import { QuickViewDialog } from './quick-view-dialog'
import { CheckoutDialog } from './checkout-dialog'
import { SearchDialog } from './search-dialog'
import { MobileMenu } from './mobile-menu'
import { useStoreInit } from '@/hooks/use-store-init'
import { useSmoothScroll, PageTransition } from '@/components/animations/motion-primitives'
import { ScrollProgress } from '@/components/effects/scroll-progress'
import type { Category, Product } from '@/lib/types'

export function Storefront({
  categories,
  allProducts,
  bestsellers,
  newArrivals,
}: {
  categories: Category[]
  allProducts: Product[]
  bestsellers: Product[]
  newArrivals: Product[]
}) {
  useStoreInit()
  useSmoothScroll()

  return (
    <PageTransition className="min-h-screen flex flex-col bg-background">
      {/* Global effects */}
      <ScrollProgress />

      <Header categories={categories} />
      <main className="flex-1">
        <Hero />
        <Categories categories={categories} />
        <ProductCarousel
          title="الأكثر مبيعاً"
          subtitle="بدلٌ يعشقها رجالنا"
          badge="اختيارات النخبة"
          products={bestsellers}
        />
        <EditorialBanner />
        <ProductCarousel
          title="وصل حديثاً"
          subtitle="أحدث ما أضفناه لتشكيلتنا الرسمية"
          badge="جديدنا"
          products={newArrivals}
        />
        <ProductGrid categories={categories} initialProducts={allProducts} />
        <Values />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer categories={categories} />

      {/* Overlays */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewDialog />
      <CheckoutDialog />
      <SearchDialog />
      <MobileMenu categories={categories} />
    </PageTransition>
  )
}
