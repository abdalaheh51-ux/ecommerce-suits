'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './product-card'
import type { Product } from '@/lib/types'

export function ProductCarousel({
  title,
  subtitle,
  products,
  badge,
}: {
  title: string
  subtitle?: string
  products: Product[]
  badge?: string
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = () => {
    const el = scrollRef.current
    if (!el) return
    // RTL: scrollLeft is negative or handled differently. Use scrollWidth vs clientWidth.
    const maxScroll = el.scrollWidth - el.clientWidth
    // In RTL, scrollLeft starts at 0 (rightmost) and goes negative when scrolling right-to-left visually
    const current = Math.abs(el.scrollLeft)
    setCanLeft(current > 5)
    setCanRight(current < maxScroll - 5)
  }

  useEffect(() => {
    updateArrows()
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
    }
  }, [products])

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    // RTL: "next" (visually left) is negative direction
    el.scrollBy({ left: dir === 'right' ? -amount : amount, behavior: 'smooth' })
  }

  if (products.length === 0) return null

  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            {badge && (
              <div className="flex items-center gap-2 mb-2">
                <span className="h-px w-8 bg-gold" />
                <span className="text-xs tracking-luxe text-gold font-medium uppercase">{badge}</span>
              </div>
            )}
            <h2 className="font-display text-2xl lg:text-4xl font-bold text-foreground">{title}</h2>
            {subtitle && <p className="mt-2 text-foreground/60">{subtitle}</p>}
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll('right')}
              disabled={!canRight}
              className="size-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/60 transition-all"
              aria-label="التالي"
            >
              <ChevronRight className="size-5" />
            </button>
            <button
              onClick={() => scroll('left')}
              disabled={!canLeft}
              className="size-10 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-foreground/60 transition-all"
              aria-label="السابق"
            >
              <ChevronLeft className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 lg:gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 -mx-4 px-4"
        >
          {products.map((p, i) => (
            <div key={p.id} className="snap-start shrink-0 w-[70%] sm:w-[45%] lg:w-[23%] xl:w-[22%]">
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
