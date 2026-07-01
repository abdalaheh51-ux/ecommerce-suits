'use client'

import { useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { useWishlistStore, useCartStore, useUIStore } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { toast } from 'sonner'

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
            <Heart className="size-5 text-gold" strokeWidth={1.5} />
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
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 max-h-[70vh]">
            {items.map((item) => {
              const p = item.product
              if (!p) return null
              const imgs: string[] = p.images || []
              return (
                <div key={item.id} className="flex gap-3 group">
                  <button
                    onClick={() => {
                      setWishlistOpen(false)
                      setQuickView(p)
                    }}
                    className="size-24 shrink-0 rounded-sm overflow-hidden bg-muted"
                  >
                    <img
                      src={imgs[0] || '/images/cat-women.jpg'}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-women.jpg' }}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-sm text-foreground line-clamp-1">{p.name}</h4>
                      <button
                        onClick={() => remove(item.id)}
                        className="text-foreground/30 hover:text-destructive transition-colors shrink-0"
                        aria-label="حذف"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    <p className="text-xs text-foreground/50 mt-0.5">{p.category?.name}</p>
                    <span className="font-display font-bold text-sm text-foreground mt-1 block">
                      {formatPrice(p.price)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => moveToCart(p.id, item.id, p.sizes, p.colors)}
                      className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-8 text-xs tracking-wide-luxe"
                    >
                      <ShoppingBag className="size-3.5" />
                      أضف للسلة
                    </Button>
                  </div>
                </div>
              )
            })}
            <Button
              onClick={() => { setWishlistOpen(false); setCartOpen(true) }}
              variant="outline"
              className="w-full rounded-none mt-2"
            >
              عرض السلة
              <ArrowLeft className="size-4" />
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
