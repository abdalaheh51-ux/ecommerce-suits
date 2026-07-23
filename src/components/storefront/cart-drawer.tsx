'use client'

import { useEffect } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowLeft } from 'lucide-react'
import { useCartStore, useUIStore, cartSubtotal, cartCount } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { cartOpen, setCartOpen, setCheckoutOpen } = useUIStore()
  const { items, update, remove, refresh } = useCartStore()

  useEffect(() => {
    if (cartOpen) refresh()
  }, [cartOpen, refresh])

  const subtotal = cartSubtotal(items)
  const count = cartCount(items)
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 70
  const total = subtotal + shipping
  const freeShipRemaining = Math.max(0, 3000 - subtotal)
  const freeShipPct = Math.min(100, (subtotal / 3000) * 100)

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent side="left" className="w-full sm:max-w-md p-0 flex flex-col bg-background">
        <SheetHeader className="px-5 py-4 border-b border-border flex-row items-center justify-between space-y-0">
          <SheetTitle className="flex items-center gap-2 font-display text-lg">
            <ShoppingBag className="size-5 text-gold" strokeWidth={1.5} />
            سلة التسوق
            {count > 0 && <span className="text-sm text-foreground/50">({count})</span>}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="size-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <ShoppingBag className="size-8 text-foreground/30" strokeWidth={1} />
            </div>
            <h3 className="font-display text-lg font-bold text-foreground">سلتك فارغة</h3>
            <p className="text-sm text-foreground/50 mt-1 mb-6">ابدأ التسوّق واكتشف تشكيلتنا الفاخرة</p>
            <Button
              onClick={() => setCartOpen(false)}
              className="bg-primary text-primary-foreground rounded-none px-6 tracking-wide-luxe"
            >
              متابعة التسوّق
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-5 py-3 bg-secondary/50 border-b border-border">
              {freeShipRemaining > 0 ? (
                <p className="text-xs text-foreground/70 mb-2">
                  أضف <span className="font-bold text-gold">{formatPrice(freeShipRemaining)}</span> للحصول على شحن مجاني!
                </p>
              ) : (
                <p className="text-xs text-gold font-medium mb-2 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-gold" /> رائع! حصلت على شحن مجاني
                </p>
              )}
              <div className="h-1.5 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${freeShipPct}%` }} />
              </div>
            </div>

	            {/* Items */}
	            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 max-h-[60vh] custom-scrollbar">
	              {items.map((item) => (
	                <div key={item.id} className="flex gap-4 group">
	                  <div className="size-24 shrink-0 rounded-sm overflow-hidden bg-muted shadow-soft">
	                    <img
	                      src={item.product?.images?.[0] || '/images/cat-suits.jpg'}
	                      alt={item.product?.name}
	                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
	                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }}
	                    />
	                  </div>
	                  <div className="flex-1 min-w-0 py-0.5">
	                    <div className="flex items-start justify-between gap-2">
	                      <h4 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-gold transition-colors">{item.product?.name}</h4>
	                      <button
	                        onClick={() => remove(item.id)}
	                        className="text-foreground/30 hover:text-destructive transition-colors shrink-0"
	                        aria-label="حذف"
	                      >
	                        <Trash2 className="size-4" />
	                      </button>
	                    </div>
	                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-foreground/50">
	                      {item.size && <span>{item.size}</span>}
	                      {item.size && item.color && <span className="size-0.5 rounded-full bg-border" />}
	                      {item.color && <span>{item.color}</span>}
	                    </div>
	                    <div className="flex items-center justify-between mt-4">
	                      <div className="flex items-center border border-border rounded-none bg-background">
	                        <button
	                          onClick={() => update(item.id, item.quantity - 1)}
	                          className="size-7 flex items-center justify-center hover:bg-secondary transition-colors"
	                          aria-label="إنقاص"
	                        >
	                          <Minus className="size-3" />
	                        </button>
	                        <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
	                        <button
	                          onClick={() => update(item.id, item.quantity + 1)}
	                          className="size-7 flex items-center justify-center hover:bg-secondary transition-colors"
	                          aria-label="زيادة"
	                        >
	                          <Plus className="size-3" />
	                        </button>
	                      </div>
	                      <span className="font-display font-bold text-sm text-foreground">
	                        {formatPrice((item.product?.price ?? 0) * item.quantity)}
	                      </span>
	                    </div>
	                  </div>
	                </div>
	              ))}
	            </div>

            {/* Summary */}
            <div className="border-t border-border px-5 py-4 space-y-3 bg-background">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60">المجموع الفرعي</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/60">الشحن</span>
                <span className="font-medium">{shipping === 0 ? <span className="text-gold">مجاني</span> : formatPrice(shipping)}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between">
                <span className="font-display font-bold">الإجمالي</span>
                <span className="font-display font-bold text-lg text-gold">{formatPrice(total)}</span>
              </div>
              <Button
                onClick={() => {
                  setCartOpen(false)
                  setCheckoutOpen(true)
                }}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 tracking-wide-luxe font-medium group"
              >
                إتمام الطلب
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </Button>
              <button
                onClick={() => setCartOpen(false)}
                className="w-full text-center text-sm text-foreground/60 hover:text-foreground transition-colors py-1"
              >
                متابعة التسوّق
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
