'use client'

import { useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ShoppingBag, ArrowLeft, Star } from 'lucide-react'
import { useWishlistStore, useCartStore, useUIStore } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen, setQuickView } = useUIStore()
  const { items, remove, refresh } = useWishlistStore()
  const add = useCartStore((s) => s.add)
  const setCartOpen = useUIStore((s) => s.setCartOpen)

  useEffect(() => {
    if (wishlistOpen) refresh()
  }, [wishlistOpen, refresh])

  const moveToCart = async (productId: string, id: string, sizes: string[], colors: string[]) => {
    await add(productId, 1, sizes[0], colors[0])
    await remove(id)
    toast.success('تم نقل المنتج إلى السلة')
  }

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col bg-background">
        <SheetHeader className="px-5 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <Heart className="size-5 text-gold fill-gold" strokeWidth={1.5} />
            المفضلة
            {items.length > 0 && <span className="text-sm text-foreground/50">({items.length})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="size-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Heart className="size-8 text-foreground/30" strokeWidth={1} />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">قائمة المفضلة فارغة</h3>
            <p className="text-sm text-foreground/50 mt-1 mb-6">احفظ القطع التي تحبها هنا</p>
            <Button
              onClick={() => setWishlistOpen(false)}
              className="bg-primary text-primary-foreground rounded-none px-6 tracking-wide-luxe"
            >
              اكتشف المنتجات
            </Button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 max-h-[70vh]">
            {items.map((item) => {
              const p = item.product
              if (!p) return null
              const imgs: string[] = p.images || []
              const hasDiscount = p.comparePrice && p.comparePrice > p.price
              const discountPct = hasDiscount
                ? Math.round(((p.comparePrice! - p.price) / p.comparePrice!) * 100)
                : 0

              return (
                <div key={item.id} className="flex gap-3 p-3 rounded-sm bg-secondary/30 hover:bg-secondary/50 transition-colors group">
                  {/* صورة المنتج */}
                  <button
                    onClick={() => {
                      setWishlistOpen(false)
                      setQuickView(p)
                    }}
                    className="relative size-28 shrink-0 rounded-sm overflow-hidden bg-muted border border-border"
                  >
                    <img
                      src={imgs[0] || '/images/cat-suits.jpg'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }}
                    />
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-destructive text-white rounded-sm">
                        -{discountPct}%
                      </span>
                    )}
                  </button>

                  {/* معلومات المنتج */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    {/* الاسم والحذف */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
                          {p.name}
                        </h4>
                        <p className="text-xs text-foreground/50 mt-0.5">{p.category?.name}</p>
                      </div>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-foreground/30 hover:text-destructive transition-colors shrink-0 mt-0.5"
                        aria-label="حذف"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    {/* التقييم والسعر */}
                    <div className="space-y-2">
                      {p.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn('size-3', i < Math.floor(p.rating) ? 'fill-gold text-gold' : 'text-foreground/20')}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-foreground/60">{p.rating.toFixed(1)}</span>
                        </div>
                      )}

                      {/* السعر */}
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-foreground">
                          {formatPrice(p.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-foreground/40 line-through">
                            {formatPrice(p.comparePrice!)}
                          </span>
                        )}
                      </div>

                      {/* زر الإضافة للسلة */}
                      <Button
                        size="sm"
                        onClick={() => moveToCart(p.id, item.id, p.sizes, p.colors)}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-8 text-xs tracking-wide-luxe font-medium"
                      >
                        <ShoppingBag className="size-3.5" />
                        أضف للسلة
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* زر عرض السلة */}
            <Button
              onClick={() => { setWishlistOpen(false); setCartOpen(true) }}
              variant="outline"
              className="w-full rounded-none mt-4 border-border"
            >
              عرض السلة
              <ArrowLeft className="size-4 ms-2" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
