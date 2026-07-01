'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Search, Heart, ShoppingBag, User, ChevronLeft } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import type { Category } from '@/lib/types'

export function MobileMenu({ categories }: { categories: Category[] }) {
  const { mobileMenuOpen, setMobileMenuOpen, setSearchOpen, setWishlistOpen, setCartOpen, setActiveCategory } = useUIStore()

  const go = (slug: string) => {
    setActiveCategory(slug)
    setMobileMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById('shop')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 200)
  }

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetContent side="right" className="w-full sm:max-w-sm p-0 flex flex-col bg-background">
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle className="flex flex-col items-start">
            <span className="font-display text-2xl font-extrabold tracking-luxe">VELORA</span>
            <span className="text-[10px] tracking-luxe text-gold font-medium">فيلورا</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-xs tracking-luxe text-foreground/50 uppercase mb-3">القائمة</p>
          <nav className="space-y-1">
            <button
              onClick={() => go('all')}
              className="w-full flex items-center justify-between py-3.5 px-3 rounded-sm hover:bg-secondary text-right group"
            >
              <span className="font-display text-base font-medium">كل المنتجات</span>
              <ChevronLeft className="size-4 text-foreground/30 group-hover:text-gold transition-colors" />
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => go(c.slug)}
                className="w-full flex items-center justify-between py-3.5 px-3 rounded-sm hover:bg-secondary text-right group"
              >
                <span className="font-display text-base font-medium">{c.name}</span>
                <ChevronLeft className="size-4 text-foreground/30 group-hover:text-gold transition-colors" />
              </button>
            ))}
            <button
              onClick={() => { setMobileMenuOpen(false); setTimeout(() => { const el = document.getElementById('about'); if (el) el.scrollIntoView({ behavior: 'smooth' }) }, 200) }}
              className="w-full flex items-center justify-between py-3.5 px-3 rounded-sm hover:bg-secondary text-right group"
            >
              <span className="font-display text-base font-medium">عن فيلورا</span>
              <ChevronLeft className="size-4 text-foreground/30 group-hover:text-gold transition-colors" />
            </button>
          </nav>

          <div className="mt-8 pt-6 border-t border-border space-y-1">
            <button
              onClick={() => { setMobileMenuOpen(false); setSearchOpen(true) }}
              className="w-full flex items-center gap-3 py-3 px-3 rounded-sm hover:bg-secondary text-right"
            >
              <Search className="size-5 text-foreground/60" strokeWidth={1.5} />
              <span className="text-sm">بحث</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setWishlistOpen(true) }}
              className="w-full flex items-center gap-3 py-3 px-3 rounded-sm hover:bg-secondary text-right"
            >
              <Heart className="size-5 text-foreground/60" strokeWidth={1.5} />
              <span className="text-sm">المفضلة</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setCartOpen(true) }}
              className="w-full flex items-center gap-3 py-3 px-3 rounded-sm hover:bg-secondary text-right"
            >
              <ShoppingBag className="size-5 text-foreground/60" strokeWidth={1.5} />
              <span className="text-sm">سلة التسوق</span>
            </button>
            <button className="w-full flex items-center gap-3 py-3 px-3 rounded-sm hover:bg-secondary text-right">
              <User className="size-5 text-foreground/60" strokeWidth={1.5} />
              <span className="text-sm">حسابي</span>
            </button>
          </div>
        </div>

        <div className="p-5 border-t border-border">
          <Button
            onClick={() => { setMobileMenuOpen(false); setCartOpen(true) }}
            className="w-full bg-primary text-primary-foreground rounded-none h-11 tracking-wide-luxe"
          >
            <ShoppingBag className="size-4" /> عرض السلة
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
