'use client'

import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Heart, ShoppingBag, Eye, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore, useWishlistStore, useUIStore } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

const badgeStyles: Record<string, string> = {
  'جديد': 'bg-foreground text-background',
  'الأكثر مبيعاً': 'bg-gold text-primary-foreground',
  'تخفيض': 'bg-destructive text-white',
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [added, setAdded] = useState(false)
  const add = useCartStore((s) => s.add)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistHas = useWishlistStore((s) => s.has)
  const setCartOpen = useUIStore((s) => s.setCartOpen)
  const setQuickView = useUIStore((s) => s.setQuickView)

  // 3D tilt on hover
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { mx.set(0.5); my.set(0.5); setImgIndex(0) }

  const isWished = wishlistHas(product.id)
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const discountPct = hasDiscount
    ? Math.round(((product.comparePrice! - product.price) / product.comparePrice!) * 100)
    : 0

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const size = product.sizes[0]
    const color = product.colors[0]
    await add(product.id, 1, size, color)
    setAdded(true)
    toast.success('تمت الإضافة إلى السلة', {
      description: product.name,
      action: { label: 'عرض السلة', onClick: () => setCartOpen(true) },
    })
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const action = await toggleWishlist(product.id)
    if (action === 'added') toast.success('أُضيف إلى المفضلة', { description: product.name })
    else toast('أُزيل من المفضلة')
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    setQuickView(product)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className="group cursor-pointer [perspective:1000px]"
      onClick={() => setQuickView(product)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative"
      >
      <div className="relative overflow-hidden bg-muted aspect-[3/4] rounded-sm shadow-soft group-hover:shadow-luxe transition-shadow duration-500">
        {/* Image(s) */}
        <img
          src={product.images[imgIndex] || '/images/cat-suits.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
          // onMouseEnter={() => product.images[1] && setImgIndex(1)}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }}
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {product.badge && (
            <motion.span
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + index * 0.04 }}
              className={cn(
                'px-2.5 py-1 text-[10px] font-bold tracking-wide-luxe rounded-sm backdrop-blur-sm',
                badgeStyles[product.badge] || 'bg-foreground/90 text-background'
              )}
            >
              {product.badge}
            </motion.span>
          )}
          {hasDiscount && (
            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide-luxe rounded-sm bg-white/90 text-destructive backdrop-blur-sm">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <motion.button
          onClick={handleWishlist}
          whileTap={{ scale: 0.85 }}
          className={cn(
            'absolute top-3 left-3 size-9 rounded-full flex items-center justify-center transition-all backdrop-blur-sm',
            isWished ? 'bg-gold text-primary-foreground' : 'bg-background/80 text-foreground hover:bg-background'
          )}
          aria-label="أضف للمفضلة"
        >
          <motion.span
            animate={isWished ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Heart className={cn('size-4', isWished && 'fill-current')} strokeWidth={1.5} />
          </motion.span>
        </motion.button>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="flex gap-2">
            <Button
              onClick={handleAdd}
              className="flex-1 bg-primary/95 backdrop-blur text-primary-foreground hover:bg-primary rounded-none h-10 text-xs tracking-wide-luxe font-medium"
              disabled={added}
            >
              {added ? (
                <><Check className="size-4" /> تمت الإضافة</>
              ) : (
                <><ShoppingBag className="size-4" /> أضف للسلة</>
              )}
            </Button>
            <Button
              onClick={handleQuickView}
              size="icon"
              variant="secondary"
              className="size-10 rounded-none bg-background/95 hover:bg-background shadow-soft"
              aria-label="عرض سريع"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        </div>

        {/* Stock out overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="bg-foreground text-background px-4 py-2 text-xs tracking-luxe">نفذت الكمية</span>
          </div>
        )}
      </div>
      </motion.div>

      {/* Info */}
      <div className="pt-4 pb-2 px-1">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <p className="text-[11px] tracking-wide-luxe text-foreground/50 uppercase">
            {product.category?.name}
          </p>
          {product.rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-gold text-gold" />
              <span className="text-[11px] text-foreground/60 font-medium">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-foreground/40">({product.reviewCount})</span>
            </div>
          )}
        </div>
        <h3 className="font-display text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-gold transition-colors duration-300 min-h-[2.5rem]">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-display text-base font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-foreground/40 line-through">
              {formatPrice(product.comparePrice!)}
            </span>
          )}
        </div>

        {/* Colors preview */}
        {product.colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c}
                title={c}
                className="size-3 rounded-full border border-border transition-transform hover:scale-125"
                style={{ background: colorToHex(c) }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] text-foreground/40">+{product.colors.length - 4}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

const colorMap: Record<string, string> = {
  'أسود': '#1a1a1a', 'أبيض': '#f8f6f1', 'بيج': '#d4c4a8', 'بيج صحراوي': '#c2a878',
  'كحلي': '#2a3142', 'كحلي داكن': '#1f2433', 'جملي': '#c19a6b', 'فحمي': '#3a3a3c',
  'زيتي': '#6b6b3a', 'بني': '#6b4226', 'بني داكن': '#4a2e1a', 'رمادي': '#8a8a8a',
  'كريمي': '#f3ead8', 'أوف وايت': '#f5f1e8', 'أزرق فاتح': '#a8c0d8',
  'أزرق سماوي': '#bcd4e6', 'بورجوندي': '#6d1f2f', 'أخضر داكن': '#2e4d3a',
  'تيراكوتا': '#c66b3d', 'بني سلحفاتي': '#8a5a3b', 'فضي': '#c0c0c8', 'ذهبي': '#d4af37',
}

function colorToHex(name: string): string {
  return colorMap[name] || '#cccccc'
}
