'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CreditCard, Truck, CheckCircle2, Loader2, ShieldCheck, ArrowLeft, ArrowRight, Minus, Plus } from 'lucide-react'
import { useUIStore, useCartStore, cartSubtotal, cartCount } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'

const governorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية',
  'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد',
  'الإسماعيلية', 'السويس', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
  'المنيا', 'بني سويف', 'الفيوم', 'مطروح', 'البحر الأحمر', 'الوادي الجديد',
  'شمال سيناء', 'جنوب سيناء',
]

export function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen } = useUIStore()
  const { items, clear, update, remove } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [payment, setPayment] = useState('cod')
  const [step, setStep] = useState<'cart' | 'form'>('cart')
  const [form, setForm] = useState({
    customerName: '', email: '', phone: '', address: '', city: '',
    governorate: '', postalCode: '', notes: '',
  })

  const subtotal = cartSubtotal(items)
  const count = cartCount(items)
  const shipping = subtotal >= 3000 ? 0 : 70
  const total = subtotal + shipping

  const updateField = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customerName || !form.email || !form.phone || !form.address || !form.city || !form.governorate) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('بريد إلكتروني غير صالح')
      return
    }
    if (!/^01[0-2,5]\d{8}$/.test(form.phone.replace(/\s/g, ''))) {
      toast.error('رقم هاتف غير صالح (مثال: 01012345678)')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, paymentMethod: payment }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'فشل إنشاء الطلب')
      } else {
        setDone(data.order.orderNumber)
        await clear()
        toast.success('تم إنشاء طلبك بنجاح!')
      }
    } catch {
      toast.error('حدث خطأ، حاول مرة أخرى')
    } finally {
      setSubmitting(false)
    }
  }

  const close = () => {
    setCheckoutOpen(false)
    setTimeout(() => {
      setDone(null)
      setStep('cart')
      setForm({ customerName: '', email: '', phone: '', address: '', city: '', governorate: '', postalCode: '', notes: '' })
    }, 300)
  }

  return (
    <Dialog open={checkoutOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent showCloseButton={false} className="!max-w-sm !w-[calc(100%-2rem)] sm:!max-w-sm p-0 gap-0 overflow-hidden bg-background shadow-luxe rounded-sm">
        <DialogTitle className="sr-only">إتمام الطلب</DialogTitle>
        {done ? (
          <div className="p-6 text-center">
            <div className="size-14 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="size-7 text-gold" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-lg font-bold text-foreground">تم استلام طلبك!</h2>
            <p className="mt-1.5 text-xs text-foreground/60">شكراً لك. سنتواصل معك قريباً لتأكيد الطلب.</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-sm">
              <span className="text-[11px] text-foreground/60">رقم الطلب:</span>
              <span className="font-display text-sm font-bold text-gold tracking-wide-luxe">{done}</span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-foreground/60">
              <Truck className="size-3.5 text-gold" />
              التوصيل المتوقع خلال 2-4 أيام عمل
            </div>
            <Button onClick={close} className="mt-5 bg-primary text-primary-foreground rounded-none px-6 text-xs tracking-wide-luxe w-full h-10">
              متابعة التسوّق
            </Button>
          </div>
        ) : step === 'cart' ? (
          /* Cart Summary - Same look as product card */
          <div className="flex flex-col h-full">
            {/* Image area - aspect-[3/4] like product card */}
            <div className="relative overflow-hidden bg-muted aspect-[3/4] rounded-sm">
              {/* Show first product image as background */}
              {items.length > 0 && (
                <img
                  src={items[0].product?.images?.[0] || '/images/cat-suits.jpg'}
                  alt={items[0].product?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }}
                />
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              {/* Cart badge */}
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide-luxe rounded-sm bg-foreground text-background backdrop-blur-sm">
                  سلة التسوق ({count})
                </span>
              </div>

              {/* Total price */}
              <div className="absolute bottom-0 inset-x-0 p-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[10px] text-white/60 uppercase tracking-wider mb-0.5">الإجمالي</p>
                    <p className="font-display text-xl font-bold text-white">{formatPrice(total)}</p>
                  </div>
                  <p className="text-[10px] text-white/60">
                    {shipping === 0 ? 'شحن مجاني' : `+ ${formatPrice(shipping)} شحن`}
                  </p>
                </div>
              </div>
            </div>

            {/* Info section - like product card info */}
            <div className="pt-3 pb-3 px-3 flex flex-col flex-1">
              {/* Items list - compact */}
              <ScrollArea className="flex-1 max-h-[120px] mb-3">
                <div className="space-y-2.5">
                  {items.map((item) => {
                    const imgs: string[] = item.product?.images || []
                    return (
                      <div key={item.id} className="flex gap-2.5 items-start">
                        <div className="relative size-14 shrink-0 rounded-sm overflow-hidden bg-muted">
                          <img 
                            src={imgs[0] || '/images/cat-suits.jpg'} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-semibold text-foreground line-clamp-1">
                            {item.product?.name}
                          </p>
                          <p className="text-[9px] text-foreground/50 mt-0.5 flex items-center gap-1">
                            {item.size && <span>{item.size}</span>}
                            {item.size && item.color && <span className="size-0.5 rounded-full bg-border" />}
                            {item.color && <span>{item.color}</span>}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[11px] font-display font-bold text-foreground">
                              {formatPrice((item.product?.price ?? 0) * item.quantity)}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => update(item.id, item.quantity - 1)}
                                className="size-5 flex items-center justify-center bg-secondary rounded-sm hover:bg-accent transition-colors"
                              >
                                <Minus className="size-2.5" />
                              </button>
                              <span className="w-5 text-center text-[10px] font-medium">{item.quantity}</span>
                              <button
                                onClick={() => update(item.id, item.quantity + 1)}
                                className="size-5 flex items-center justify-center bg-secondary rounded-sm hover:bg-accent transition-colors"
                              >
                                <Plus className="size-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>

              {/* CTA Button */}
              <Button
                onClick={() => setStep('form')}
                disabled={items.length === 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 text-xs tracking-wide-luxe font-medium"
              >
                إتمام الطلب <ArrowLeft className="size-3.5" />
              </Button>
              <p className="text-[10px] text-center text-foreground/50 flex items-center justify-center gap-1 mt-2">
                <ShieldCheck className="size-3" /> معاملتك آمنة ومشفّرة
              </p>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="flex flex-col h-full">
            {/* Header - compact */}
            <div className="px-3 pt-3 pb-2 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-1.5">
                <ArrowRight className="size-4 text-gold" />
                <h2 className="font-display text-sm font-bold text-foreground">بيانات الشحن</h2>
              </div>
              <button onClick={() => setStep('cart')} className="text-[11px] text-foreground/60 hover:text-foreground flex items-center gap-1">
                <ArrowRight className="size-3" />
                رجوع
              </button>
            </div>

            <ScrollArea className="flex-1">
              <form onSubmit={submit} className="p-3 space-y-3">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-[10px]">الاسم الكامل <span className="text-destructive">*</span></Label>
                    <Input id="name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required className="rounded-sm h-8 text-[11px]" placeholder="أحمد محمد" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="phone" className="text-[10px]">الهاتف <span className="text-destructive">*</span></Label>
                    <Input id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required className="rounded-sm h-8 text-[11px]" placeholder="01012345678" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email" className="text-[10px]">البريد الإلكتروني <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required className="rounded-sm h-8 text-[11px]" placeholder="you@example.com" dir="ltr" />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="address" className="text-[10px]">العنوان <span className="text-destructive">*</span></Label>
                  <Input id="address" value={form.address} onChange={(e) => updateField('address', e.target.value)} required className="rounded-sm h-8 text-[11px]" placeholder="الشارع، المبنى، الشقة" />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <Label htmlFor="city" className="text-[10px]">المدينة <span className="text-destructive">*</span></Label>
                    <Input id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)} required className="rounded-sm h-8 text-[11px]" placeholder="المدينة" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="gov" className="text-[10px]">المحافظة <span className="text-destructive">*</span></Label>
                    <Select value={form.governorate} onValueChange={(v) => updateField('governorate', v)}>
                      <SelectTrigger id="gov" className="rounded-sm h-8 text-[11px]"><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent>
                        {governorates.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postal" className="text-[10px]">الكود البريدي</Label>
                    <Input id="postal" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="rounded-sm h-8 text-[11px]" placeholder="اختياري" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notes" className="text-[10px]">ملاحظات</Label>
                  <Textarea id="notes" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} className="rounded-sm min-h-14 text-[11px]" placeholder="تعليمات خاصة بالتوصيل" />
                </div>

                {/* Payment method */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-[10px]">طريقة الدفع</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPayment('cod')}
                      className={cn('flex items-center gap-2 p-2 border rounded-sm text-right transition-all',
                        payment === 'cod' ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground/30')}
                    >
                      <Truck className={cn('size-3.5', payment === 'cod' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                      <span className="text-[10px] font-medium">عند الاستلام</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment('card')}
                      className={cn('flex items-center gap-2 p-2 border rounded-sm text-right transition-all',
                        payment === 'card' ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground/30')}
                    >
                      <CreditCard className={cn('size-3.5', payment === 'card' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                      <span className="text-[10px] font-medium">بطاقة ائتمان</span>
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-foreground/60">الإجمالي</span>
                    <span className="font-display text-sm font-bold text-gold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-foreground/50">
                    <Truck className="size-3 text-gold" />
                    {shipping === 0 ? 'شحن مجاني' : formatPrice(shipping)}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-10 text-xs tracking-wide-luxe font-medium mt-1"
                >
                  {submitting ? (
                    <><Loader2 className="size-3.5 animate-spin" /> جارٍ المعالجة...</>
                  ) : (
                    <>تأكيد الطلب <ArrowLeft className="size-3.5" /></>
                  )}
                </Button>
                <p className="text-[10px] text-center text-foreground/50 flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3" /> معاملتك آمنة ومشفّرة
                </p>
              </form>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
