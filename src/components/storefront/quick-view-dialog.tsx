'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Heart, ShoppingBag, Check, Star, Truck, RotateCcw, ShieldCheck, Minus, Plus } from 'lucide-react'
import { useUIStore, useCartStore, useWishlistStore } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'

const colorMap: Record<string, string> = {
  'أسود': '#1a1a1a', 'أبيض': '#f8f6f1', 'بيج': '#d4c4a8', 'بيج صحراوي': '#c2a878',
  'كحلي': '#2a3142', 'كحلي داكن': '#1f2433', 'جملي': '#c19a6b', 'فحمي': '#3a3a3c',
  'زيتي': '#6b6b3a', 'بني': '#6b4226', 'بني داكن': '#4a2e1a', 'رمادي': '#8a8a8a',
  'كريمي': '#f3ead8', 'أوف وايت': '#f5f1e8', 'أزرق فاتح': '#a8c0d8',
  'أزرق سماوي': '#bcd4e6', 'بورجوندي': '#6d1f2f', 'أخضر داكن': '#2e4d3a',
  'تيراكوتا': '#c66b3d', 'بني سلحفاتي': '#8a5a3b', 'فضي': '#c0c0c8', 'ذهبي': '#d4af37',
}

export function QuickViewDialog() {
  const { quickViewProduct, setQuickView, setCartOpen } = useUIStore()
  const add = useCartStore((s) => s.add)
  const toggleWishlist = useWishlistStore((s) => s.toggle)
  const wishlistHas = useWishlistStore((s) => s.has)
  const [size, setSize] = useState<string>('')
  const [color, setColor] = useState<string>('')
  const [qty, setQty] = useState(1)
  const [imgIdx, setImgIdx] = useState(0)
  const [adding, setAdding] = useState(false)

  const product: Product | null = quickViewProduct

  useEffect(() => {
    if (product) {
      setSize(product.sizes[0] || '')
      setColor(product.colors[0] || '')
      setQty(1)
      setImgIdx(0)
    }
  }, [product])

  if (!product) return null

  const isWished = wishlistHas(product.id)
  const hasDiscount = product.comparePrice && product.comparePrice > product.price
  const imgs: string[] = product.images || []

  const handleAdd = async () => {
    if (product.sizes.length > 0 && !size) {
      toast.error('يرجى اختيار المقاس')
      return
    }
    if (product.colors.length > 0 && !color) {
      toast.error('يرجى اختيار اللون')
      return
    }
    setAdding(true)
    try {
      await add(product.id, qty, size, color)
      toast.success('تمت الإضافة إلى السلة', {
        description: `${product.name} × ${qty}`,
        action: { label: 'عرض السلة', onClick: () => setCartOpen(true) },
      })
      setQuickView(null)
    } finally {
      setAdding(false)
    }
  }

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && setQuickView(null)}>
      <DialogContent className="!max-w-6xl !w-[96vw] sm:!max-w-6xl h-[92vh] p-0 gap-0 overflow-hidden bg-background rounded-lg">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <div className="grid md:grid-cols-2 h-full overflow-hidden">
          {/* Images — full height, no scroll */}
          <div className="bg-muted relative h-full">
            <div className="absolute inset-0">
              <img
                src={imgs[imgIdx] || '/images/cat-suits.jpg'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }}
              />
              {product.badge && (
                <span className="absolute top-4 right-4 px-3 py-1.5 text-xs font-bold tracking-wide-luxe bg-foreground text-background rounded-sm">
                  {product.badge}
                </span>
              )}
            </div>
            {imgs.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {imgs.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={cn(
                      'size-14 rounded-sm overflow-hidden border-2 transition-all',
                      imgIdx === i ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details — compact, fits without scroll */}
          <div className="p-7 lg:p-9 flex flex-col h-full overflow-hidden">
            <p className="text-xs tracking-wide-luxe text-foreground/50 uppercase mb-2">{product.category?.name}</p>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-tight">{product.name}</h2>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn('size-4', i < Math.floor(product.rating) ? 'fill-gold text-gold' : 'text-foreground/20')}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground/60">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-foreground/40">({product.reviewCount} تقييم)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mt-3">
              <span className="font-display text-3xl font-bold text-foreground">{formatPrice(product.price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-foreground/40 line-through">{formatPrice(product.comparePrice!)}</span>
                  <span className="px-2 py-0.5 text-xs font-bold bg-destructive/10 text-destructive rounded-sm">
                    وفّر {formatPrice(product.comparePrice! - product.price)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-3 text-sm text-foreground/60 leading-relaxed line-clamp-2">{product.description}</p>

            {/* Colors */}
            {product.colors.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">اللون: <span className="text-foreground/60">{color}</span></p>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={cn(
                        'size-9 rounded-full border-2 flex items-center justify-center transition-all',
                        color === c ? 'border-gold scale-110' : 'border-border'
                      )}
                      style={{ background: colorMap[c] || '#ccc' }}
                      aria-label={c}
                    >
                      {color === c && <Check className="size-4 text-white drop-shadow" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-foreground">المقاس: <span className="text-foreground/60">{size}</span></p>
                  <button className="text-xs text-gold hover:underline">دليل المقاسات</button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        'min-w-11 h-10 px-3 text-sm font-medium rounded-sm border transition-all',
                        size === s
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-background hover:border-foreground/40'
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add */}
            <div className="flex items-center gap-3 mt-5">
              <div className="flex items-center border border-border rounded-sm">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="size-11 flex items-center justify-center hover:bg-secondary" aria-label="إنقاص">
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center font-medium">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="size-11 flex items-center justify-center hover:bg-secondary" aria-label="زيادة">
                  <Plus className="size-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={adding || product.stock === 0}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 tracking-wide-luxe font-medium"
              >
                {adding ? 'جارٍ الإضافة...' : product.stock === 0 ? 'نفذت الكمية' : (
                  <><ShoppingBag className="size-4" /> أضف للسلة</>
                )}
              </Button>
              <Button
                onClick={() => toggleWishlist(product.id)}
                variant="outline"
                size="icon"
                className={cn('size-11 rounded-none shrink-0', isWished && 'border-gold text-gold')}
                aria-label="المفضلة"
              >
                <Heart className={cn('size-5', isWished && 'fill-current')} strokeWidth={1.5} />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-5 pt-4 border-t border-border grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1">
                <Truck className="size-5 text-gold" strokeWidth={1.5} />
                <span className="text-[11px] text-foreground/60">شحن سريع</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="size-5 text-gold" strokeWidth={1.5} />
                <span className="text-[11px] text-foreground/60">إرجاع 14 يوم</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="size-5 text-gold" strokeWidth={1.5} />
                <span className="text-[11px] text-foreground/60">دفع آمن</span>
              </div>
            </div>

            {/* Material / Care */}
            {(product.material || product.care) && (
              <div className="mt-4 space-y-1 text-xs text-foreground/60">
                {product.material && <p><span className="font-medium text-foreground/80">الخامة:</span> {product.material}</p>}
                {product.care && <p><span className="font-medium text-foreground/80">العناية:</span> {product.care}</p>}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
