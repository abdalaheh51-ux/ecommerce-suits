'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, CreditCard, Truck, CheckCircle2, Loader2, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react'
import { useUIStore, useCartStore, cartSubtotal, cartCount } from '@/lib/store'
import { formatPrice } from '@/lib/types'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const governorates = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'الشرقية',
  'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد',
  'الإسماعيلية', 'السويس', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
  'المنيا', 'بني سويف', 'الفيوم', 'مطروح', 'البحر الأحمر', 'الوادي الجديد',
  'شمال سيناء', 'جنوب سيناء',
]

export function CheckoutDialog() {
  const { checkoutOpen, setCheckoutOpen } = useUIStore()
  const { items, clear } = useCartStore()
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

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }))

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
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-background max-h-[92vh]">
        <DialogTitle className="sr-only">إتمام الطلب</DialogTitle>
        {done ? (
          <div className="p-10 text-center">
            <div className="size-20 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="size-10 text-gold" strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">تم استلام طلبك!</h2>
            <p className="mt-2 text-foreground/60">شكراً لك. سنتواصل معك قريباً لتأكيد الطلب.</p>
            <div className="mt-5 inline-flex items-center gap-2 bg-secondary px-5 py-3 rounded-sm">
              <span className="text-sm text-foreground/60">رقم الطلب:</span>
              <span className="font-display font-bold text-gold tracking-wide-luxe">{done}</span>
            </div>
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-foreground/60">
              <Truck className="size-4 text-gold" />
              التوصيل المتوقع خلال 2-4 أيام عمل
            </div>
            <Button onClick={close} className="mt-6 bg-primary text-primary-foreground rounded-none px-8 tracking-wide-luxe">
              متابعة التسوّق
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-5 max-h-[92vh] overflow-y-auto">
            {/* Form */}
            <form onSubmit={submit} className="md:col-span-3 p-6 lg:p-8 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight className="size-5 text-gold" />
                <h2 className="font-display text-xl font-bold text-foreground">بيانات الشحن</h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="name">الاسم الكامل <span className="text-destructive">*</span></Label>
                  <Input id="name" value={form.customerName} onChange={(e) => update('customerName', e.target.value)} required className="rounded-sm h-10" placeholder="مثال: أحمد محمد" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">رقم الهاتف <span className="text-destructive">*</span></Label>
                  <Input id="phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} required className="rounded-sm h-10" placeholder="01012345678" dir="ltr" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">البريد الإلكتروني <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="rounded-sm h-10" placeholder="you@example.com" dir="ltr" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address">العنوان بالتفصيل <span className="text-destructive">*</span></Label>
                <Input id="address" value={form.address} onChange={(e) => update('address', e.target.value)} required className="rounded-sm h-10" placeholder="الشارع، المبنى، الشقة" />
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city">المدينة <span className="text-destructive">*</span></Label>
                  <Input id="city" value={form.city} onChange={(e) => update('city', e.target.value)} required className="rounded-sm h-10" placeholder="المدينة" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gov">المحافظة <span className="text-destructive">*</span></Label>
                  <Select value={form.governorate} onValueChange={(v) => update('governorate', v)}>
                    <SelectTrigger id="gov" className="rounded-sm h-10"><SelectValue placeholder="اختر" /></SelectTrigger>
                    <SelectContent>
                      {governorates.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postal">الكود البريدي</Label>
                  <Input id="postal" value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} className="rounded-sm h-10" placeholder="اختياري" dir="ltr" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="notes">ملاحظات إضافية</Label>
                <Textarea id="notes" value={form.notes} onChange={(e) => update('notes', e.target.value)} className="rounded-sm min-h-20" placeholder="أي تعليمات خاصة بالتوصيل" />
              </div>

              {/* Payment method */}
              <div className="space-y-2 pt-2">
                <Label>طريقة الدفع</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPayment('cod')}
                    className={cn('flex items-center gap-3 p-3 border rounded-sm text-right transition-all',
                      payment === 'cod' ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground/30')}
                  >
                    <Truck className={cn('size-5', payment === 'cod' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium">دفع عند الاستلام</p>
                      <p className="text-[11px] text-foreground/50">ادفع نقداً عند وصول طلبك</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayment('card')}
                    className={cn('flex items-center gap-3 p-3 border rounded-sm text-right transition-all',
                      payment === 'card' ? 'border-gold bg-gold/5' : 'border-border hover:border-foreground/30')}
                  >
                    <CreditCard className={cn('size-5', payment === 'card' ? 'text-gold' : 'text-foreground/50')} strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-medium">بطاقة ائتمان</p>
                      <p className="text-[11px] text-foreground/50">دفع آمن عبر الإنترنت</p>
                    </div>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting || items.length === 0}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 tracking-wide-luxe font-medium mt-2"
              >
                {submitting ? (
                  <><Loader2 className="size-4 animate-spin" /> جارٍ المعالجة...</>
                ) : (
                  <>تأكيد الطلب · {formatPrice(total)} <ArrowLeft className="size-4" /></>
                )}
              </Button>
              <p className="text-xs text-center text-foreground/50 flex items-center justify-center gap-1.5">
                <ShieldCheck className="size-3.5" /> معاملتك آمنة ومشفّرة
              </p>
            </form>

            {/* Summary */}
            <div className="md:col-span-2 bg-secondary/40 p-6 lg:p-8 border-s border-border">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">ملخّص الطلب ({count})</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {items.map((item) => {
                  const imgs: string[] = item.product?.images || []
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative size-16 shrink-0 rounded-sm overflow-hidden bg-muted">
                        <img src={imgs[0] || '/images/cat-women.jpg'} alt={item.product?.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-women.jpg' }} />
                        <span className="absolute -top-1 -left-1 size-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">{item.quantity}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-1">{item.product?.name}</p>
                        <p className="text-[11px] text-foreground/50">{item.size} · {item.color}</p>
                        <p className="text-xs font-bold text-foreground mt-0.5">{formatPrice((item.product?.price ?? 0) * item.quantity)}</p>
                      </div>
                    </div>
                  )
                })}
                {items.length === 0 && (
                  <p className="text-sm text-foreground/50 text-center py-4">السلة فارغة</p>
                )}
              </div>
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">المجموع الفرعي</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/60">الشحن</span>
                  <span className="font-medium">{shipping === 0 ? <span className="text-gold">مجاني</span> : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-display font-bold">الإجمالي</span>
                  <span className="font-display font-bold text-lg text-gold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
