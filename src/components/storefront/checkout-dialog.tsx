'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CreditCard, Truck, CheckCircle2, Loader2, ShieldCheck, Minus, Plus } from 'lucide-react'
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
  const { items, clear, update } = useCartStore()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<string | null>(null)
  const [payment, setPayment] = useState('cod')
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
      setForm({ customerName: '', email: '', phone: '', address: '', city: '', governorate: '', postalCode: '', notes: '' })
    }, 300)
  }

  return (
    <Dialog open={checkoutOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="!max-w-6xl !w-[96vw] sm:!max-w-6xl h-[92vh] p-0 gap-0 overflow-hidden bg-background rounded-lg">
        <DialogTitle className="sr-only">إتمام الطلب</DialogTitle>
        {done ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-7 lg:p-9">
            <div className="size-16 rounded-full bg-gold/15 flex items-center justify-center mb-5">
              <CheckCircle2 className="size-8 text-gold" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">تم استلام طلبك!</h2>
            <p className="mt-2 text-sm text-foreground/60 text-center">شكراً لك. سنتواصل معك قريباً لتأكيد الطلب.</p>
            <div className="mt-5 inline-flex items-center gap-2 bg-secondary px-5 py-2.5 rounded-sm">
              <span className="text-sm text-foreground/60">رقم الطلب:</span>
              <span className="font-display text-base font-bold text-gold tracking-wide-luxe">{done}</span>
            </div>
            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-foreground/60">
              <Truck className="size-4 text-gold" />
              التوصيل المتوقع خلال 2-4 أيام عمل
            </div>
            <Button onClick={close} className="mt-6 bg-primary text-primary-foreground rounded-none px-8 text-sm tracking-wide-luxe w-full max-w-xs h-11">
              متابعة التسوّق
            </Button>
          </div>
        ) : (
          <ScrollArea className="h-full w-full">
            <div className="p-7 lg:p-9 max-w-4xl mx-auto flex flex-col h-full">
              <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-tight text-center mb-8">إتمام الطلب</h2>

              {/* Cart items summary */}
              <div className="space-y-4 mb-8">
                <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider border-b pb-2">ملخص المنتجات ({count})</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {items.map((item) => {
                    const imgs: string[] = item.product?.images || []
                    return (
                      <div key={item.id} className="flex gap-4 items-start p-3 bg-secondary/30 rounded-sm">
                        <div className="relative size-20 shrink-0 rounded-sm overflow-hidden bg-muted border border-border">
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
                            {item.size && <span>المقاس: {item.size}</span>}
                            {item.size && item.color && <span className="size-0.5 rounded-full bg-border" />}
                            {item.color && <span>اللون: {item.color}</span>}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-display font-bold text-foreground">
                              {formatPrice((item.product?.price ?? 0) * item.quantity)}
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => update(item.id, item.quantity - 1)}
                                className="size-7 flex items-center justify-center bg-background border border-border rounded-sm hover:bg-accent transition-colors"
                              >
                                <Minus className="size-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => update(item.id, item.quantity + 1)}
                                className="size-7 flex items-center justify-center bg-background border border-border rounded-sm hover:bg-accent transition-colors"
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
              </div>

              {/* Total Summary Card */}
              <div className="bg-secondary/50 p-6 rounded-sm mb-8 border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-foreground/60">الإجمالي الفرعي</span>
                  <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-foreground/60">تكلفة الشحن</span>
                  <span className="text-sm font-medium text-gold">
                    {shipping === 0 ? 'شحن مجاني' : formatPrice(shipping)}
                  </span>
                </div>
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="text-base font-bold">الإجمالي الكلي</span>
                  <span className="font-display text-2xl font-bold text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="space-y-6 pb-12">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider border-b pb-2">بيانات الشحن</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-xs">الاسم الكامل <span className="text-destructive">*</span></Label>
                      <Input id="name" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required className="rounded-sm h-11 text-sm" placeholder="أحمد محمد" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs">الهاتف <span className="text-destructive">*</span></Label>
                      <Input id="phone" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required className="rounded-sm h-11 text-sm" placeholder="01012345678" dir="ltr" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs">البريد الإلكتروني <span className="text-destructive">*</span></Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required className="rounded-sm h-11 text-sm" placeholder="you@example.com" dir="ltr" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-xs">العنوان بالتفصيل <span className="text-destructive">*</span></Label>
                    <Input id="address" value={form.address} onChange={(e) => updateField('address', e.target.value)} required className="rounded-sm h-11 text-sm" placeholder="الشارع، المبنى، رقم الشقة" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-xs">المدينة <span className="text-destructive">*</span></Label>
                      <Input id="city" value={form.city} onChange={(e) => updateField('city', e.target.value)} required className="rounded-sm h-11 text-sm" placeholder="المدينة" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gov" className="text-xs">المحافظة <span className="text-destructive">*</span></Label>
                      <Select value={form.governorate} onValueChange={(v) => updateField('governorate', v)}>
                        <SelectTrigger id="gov" className="rounded-sm h-11 text-sm"><SelectValue placeholder="اختر المحافظة" /></SelectTrigger>
                        <SelectContent>
                          {governorates.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal" className="text-xs">الكود البريدي</Label>
                      <Input id="postal" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="rounded-sm h-11 text-sm" placeholder="اختياري" dir="ltr" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-xs">ملاحظات إضافية</Label>
                    <Textarea id="notes" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} className="rounded-sm text-sm resize-none h-24" placeholder="أي تعليمات خاصة بالتوصيل..." />
                  </div>
                </div>

                {/* Payment method */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-foreground/80 uppercase tracking-wider border-b pb-2">طريقة الدفع</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPayment('cod')}
                      className={cn('flex items-center gap-4 p-4 border rounded-sm text-right transition-all',
                        payment === 'cod' ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-border hover:border-foreground/30')}
                    >
                      <div className={cn('size-10 rounded-full flex items-center justify-center', payment === 'cod' ? 'bg-gold/20' : 'bg-secondary')}>
                        <Truck className={cn('size-5', payment === 'cod' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">عند الاستلام</p>
                        <p className="text-[11px] text-foreground/50">ادفع نقداً عند وصول الطلب</p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayment('card')}
                      className={cn('flex items-center gap-4 p-4 border rounded-sm text-right transition-all',
                        payment === 'card' ? 'border-gold bg-gold/5 ring-1 ring-gold' : 'border-border hover:border-foreground/30')}
                    >
                      <div className={cn('size-10 rounded-full flex items-center justify-center', payment === 'card' ? 'bg-gold/20' : 'bg-secondary')}>
                        <CreditCard className={cn('size-5', payment === 'card' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">بطاقة ائتمان</p>
                        <p className="text-[11px] text-foreground/50">دفع آمن عبر الإنترنت</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={submitting || items.length === 0}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 text-base tracking-wide-luxe font-bold shadow-lg"
                  >
                    {submitting ? (
                      <><Loader2 className="size-5 animate-spin ml-2" /> جارٍ معالجة طلبك...</>
                    ) : (
                      <>تأكيد الطلب الآن</>
                    )}
                  </Button>
                  <p className="text-xs text-center text-foreground/50 flex items-center justify-center gap-2 mt-4">
                    <ShieldCheck className="size-4 text-green-600" /> 
                    جميع بياناتك مشفّرة وآمنة تماماً وفقاً للمعايير العالمية
                  </p>
                </div>
              </form>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
