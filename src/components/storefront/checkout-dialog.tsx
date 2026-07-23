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
      <DialogContent showCloseButton={false} className="!max-w-lg !w-[calc(100%-2rem)] sm:!max-w-lg p-0 gap-0 overflow-hidden bg-background shadow-luxe rounded-sm">
        <DialogTitle className="sr-only">إتمام الطلب</DialogTitle>
        {done ? (
          <div className="p-8 text-center">
            <div className="size-16 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="size-8 text-gold" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">تم استلام طلبك!</h2>
            <p className="mt-2 text-sm text-foreground/60">شكراً لك. سنتواصل معك قريباً لتأكيد الطلب.</p>
            <div className="mt-5 inline-flex items-center gap-2 bg-secondary px-5 py-2.5 rounded-sm">
              <span className="text-sm text-foreground/60">رقم الطلب:</span>
              <span className="font-display text-base font-bold text-gold tracking-wide-luxe">{done}</span>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-foreground/60">
              <Truck className="size-4 text-gold" />
              التوصيل المتوقع خلال 2-4 أيام عمل
            </div>
            <Button onClick={close} className="mt-6 bg-primary text-primary-foreground rounded-none px-8 text-sm tracking-wide-luxe w-full h-11">
              متابعة التسوّق
            </Button>
          </div>
        ) : step === 'cart' ? (
          /* Cart Summary - Same look as product card but larger */
          <div className="flex flex-col h-full">
            {/* Image area - aspect-[3/4] like product card */}
            <div className="relative overflow-hidden bg-muted aspect-[3/4] rounded-sm">
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
                <span className="px-2.5 py-1 text-xs font-bold tracking-wide-luxe rounded-sm bg-foreground text-background backdrop-blur-sm">
                  سلة التسوق ({count})
                </span>
              </div>

              {/* Total price */}
              <div className="absolute bottom-0 inset-x-0 p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-white/60 uppercase tracking-wider mb-0.5">الإجمالي</p>
                    <p className="font-display text-2xl font-bold text-white">{formatPrice(total)}</p>
                  </div>
                  <p className="text-xs text-white/60">
                    {shipping === 0 ? 'شحن مجاني' : `+ ${formatPrice(shipping)} شحن`}
                  </p>
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="pt-4 pb-4 px-4 flex flex-col flex-1">
              {/* Items list */}
              <ScrollArea className="flex-1 max-h-[160px] mb-4">
                <div className="space-y-3">
                  {items.map((item) => {
                    const imgs: string[] = item.product?.images || []
                    return (
                      <div key={item.id} className="flex gap-3 items-start">
                        <div className="relative size-16 shrink-0 rounded-sm overflow-hidden bg-muted">
                          <img 
                            src={imgs[0] || '/images/cat-suits.jpg'} 
                            alt={item.product?.name} 
                            className="w-full h-full object-cover" 
                            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground line-clamp-1">
                            {item.product?.name}
                          </p>
                          <p className="text-[11px] text-foreground/50 mt-0.5 flex items-center gap-1">
                            {item.size && <span>{item.size}</span>}
                            {item.size && item.color && <span className="size-0.5 rounded-full bg-border" />}
                            {item.color && <span>{item.color}</span>}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-sm font-display font-bold text-foreground">
                              {formatPrice((item.product?.price ?? 0) * item.quantity)}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => update(item.id, item.quantity - 1)}
                                className="size-6 flex items-center justify-center bg-secondary rounded-sm hover:bg-accent transition-colors"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                              <button
                                onClick={() => update(item.id, item.quantity + 1)}
                                className="size-6 flex items-center justify-center bg-secondary rounded-sm hover:bg-accent transition-colors"
                              >
                                <Plus className="size-3" />
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
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 text-sm tracking-wide-luxe font-medium"
              >
                إتمام الطلب <ArrowLeft className="size-4" />
              </Button>
              <p className="text-xs text-center text-foreground/50 flex items-center justify-center gap-1 mt-3">
                <ShieldCheck className="size-3.5" /> معاملتك آمنة ومشفّرة
              </p>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <ArrowRight className="size-5 text-gold" />
                <h2 className="font-display text-lg font-bold text-foreground">بيانات الشحن</h2>
              </div>
              <button onClick={() => setStep('cart')} className="text-xs text-foreground/60 hover:text-foreground flex items-center gap-1">
                <ArrowRight className="size-3.5" />
                رجوع
              </button>
            </div>

            <ScrollArea className="flex-1">
              <form onSubmit={submit} className="p-5 space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">الاسم الكامل <span className="text-destructive">*</span></Label>
                    <Input id="name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required className="rounded-sm h-9 text-xs" placeholder="أحمد محمد" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs">الهاتف <span className="text-destructive">*</span></Label>
                    <Input id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required className="rounded-sm h-9 text-xs" placeholder="01012345678" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">البريد الإلكتروني <span className="text-destructive">*</span></Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required className="rounded-sm h-9 text-xs" placeholder="you@example.com" dir="ltr" />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs">العنوان <span className="text-destructive">*</span></Label>
                  <Input id="address" value={form.address} onChange={(e) => updateField('address', e.target.value)} required className="rounded-sm h-9 text-xs" placeholder="الشارع، المبنى، الشقة" />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs">المدينة <span className="text-destructive">*</span></Label>
                    <Input id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)} required className="rounded-sm h-9 text-xs" placeholder="المدينة" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="gov" className="text-xs">المحافظة <span className="text-destructive">*</span></Label>
                    <Select value={form.governorate} onValueChange={(v) => updateField('governorate', v)}>
                      <SelectTrigger id="gov" className="rounded-sm h-9 text-xs"><SelectValue placeholder="اختر" /></SelectTrigger>
                      <SelectContent>
                        {governorates.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="postal" className="text-xs">الكود البريدي</Label>
                    <Input id="postal" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="rounded-sm h-9 text-xs" placeholder="اختياري" dir="ltr" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="notes" className="text-xs">ملاحظات</Label>
                  <Textarea id="notes" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} className="rounded-sm min-h-16 text-xs" placeholder="تعليمات خاصة بالتوصيل" />
                </div>

                {/* Payment method */}
                <div className="space-y-2 pt-1">
                  <Label className="text-xs">طريقة الدفع</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPayment('cod')}
                      className={cn('flex items-center gap-2.5 p-3 border rounded-sm text-right transition-all',
                        payment === 'cod' ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground/30')}
                    >
                      <Truck className={cn('size-4', payment === 'cod' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                      <span className="text-xs font-medium">عند الاستلام</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment('card')}
                      className={cn('flex items-center gap-2.5 p-3 border rounded-sm text-right transition-all',
                        payment === 'card' ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground/30')}
                    >
                      <CreditCard className={cn('size-4', payment === 'card' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                      <span className="text-xs font-medium">بطاقة ائتمان</span>
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="flex justify-between items-center pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-foreground/60">الإجمالي</span>
                    <span className="font-display text-base font-bold text-gold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50">
                    <Truck className="size-3.5 text-gold" />
                    {shipping === 0 ? 'شحن مجاني' : formatPrice(shipping)}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-11 text-sm tracking-wide-luxe font-medium mt-2"
                >
                  {submitting ? (
                    <><Loader2 className="size-4 animate-spin" /> جارٍ المعالجة...</>
                  ) : (
                    <>تأكيد الطلب <ArrowLeft className="size-4" /></>
                  )}
                </Button>
                <p className="text-xs text-center text-foreground/50 flex items-center justify-center gap-1">
                  <ShieldCheck className="size-3.5" /> معاملتك آمنة ومشفّرة
                </p>
              </form>
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
