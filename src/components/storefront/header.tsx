'use client'

import { useEffect, useState } from 'react'
import { Search, Heart, ShoppingBag, Menu, User } from 'lucide-react'
import { useUIStore, useCartStore, useWishlistStore, cartCount } from '@/lib/store'
import { cn } from '@/lib/utils'
import type { Category } from '@/lib/types'

export function Header({ categories }: { categories: Category[] }) {
  const [scrolled, setScrolled] = useState(false)
  const { setCartOpen, setWishlistOpen, setSearchOpen, setMobileMenuOpen, setActiveCategory } = useUIStore()
  const cartItems = useCartStore((s) => s.items)
  const wishlistItems = useWishlistStore((s) => s.items)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const count = cartCount(cartItems)

  const scrollToProducts = (cat: string) => {
    setActiveCategory(cat)
    const el = document.getElementById('shop')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-background/85 backdrop-blur-xl border-b border-border shadow-soft'
          : 'bg-background/0 border-b border-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3-column grid: nav | logo | actions — each has reserved space, no overlap */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 lg:h-20 gap-4">
          {/* Left (RTL: right) — Mobile menu + Desktop nav */}
          <div className="flex items-center gap-2 justify-self-start">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ms-2 text-foreground hover:text-gold transition-colors"
              aria-label="القائمة"
            >
              <Menu className="size-5" />
            </button>
            <nav className="hidden lg:flex items-center gap-7">
              <button
                onClick={() => scrollToProducts('all')}
                className="text-sm font-medium tracking-wide-luxe text-foreground/80 hover:text-gold transition-colors relative group py-1"
              >
                كل المنتجات
                <span className="absolute bottom-0 right-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
              {categories.filter((c) => c.featured).map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollToProducts(c.slug)}
                  className="text-sm font-medium tracking-wide-luxe text-foreground/80 hover:text-gold transition-colors relative group py-1 whitespace-nowrap"
                >
                  {c.name}
                  <span className="absolute bottom-0 right-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
              <button
                onClick={() => {
                  const el = document.getElementById('about')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-sm font-medium tracking-wide-luxe text-foreground/80 hover:text-gold transition-colors relative group py-1 whitespace-nowrap"
              >
                عن فيلورا
                <span className="absolute bottom-0 right-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </button>
            </nav>
          </div>

          {/* Center — Logo (reserved space, never overlaps) */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center group justify-self-center px-2"
            aria-label="فيلورا"
          >
            <span className={cn(
              'font-display font-extrabold tracking-luxe leading-none transition-all duration-300 whitespace-nowrap',
              scrolled ? 'text-xl lg:text-2xl' : 'text-2xl lg:text-3xl'
            )}>
              VELORA
            </span>
            <span className="text-[10px] tracking-luxe text-gold mt-0.5 font-medium whitespace-nowrap">فيلورا</span>
          </button>

          {/* Right (RTL: left) — Actions */}
          <div className="flex items-center gap-1 sm:gap-2 justify-self-end">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 text-foreground hover:text-gold transition-colors hover:bg-accent/60 rounded-full"
              aria-label="بحث"
            >
              <Search className="size-5" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-2.5 text-foreground hover:text-gold transition-colors hover:bg-accent/60 rounded-full"
              aria-label="المفضلة"
            >
              <Heart className="size-5" strokeWidth={1.5} />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-0.5 -left-0.5 size-4 rounded-full bg-gold text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 text-foreground hover:text-gold transition-colors hover:bg-accent/60 rounded-full"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="size-5" strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -left-0.5 size-4 rounded-full bg-gold text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>
            <button
              className="hidden sm:block p-2.5 text-foreground hover:text-gold transition-colors hover:bg-accent/60 rounded-full"
              aria-label="حسابي"
            >
              <User className="size-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
