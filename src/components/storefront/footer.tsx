'use client'

import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useUIStore } from '@/lib/store'
import type { Category } from '@/lib/types'

export function Footer({ categories }: { categories: Category[] }) {
  const { setActiveCategory } = useUIStore()

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const selectCat = (slug: string) => {
    setActiveCategory(slug)
    scrollTo('shop')
  }

  return (
    <footer className="bg-background border-t border-border mt-auto">
      {/* Top: brand + columns */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4">
            <div className="flex flex-col">
              <span className="font-display text-2xl font-extrabold tracking-luxe text-foreground">VELORA</span>
              <span className="text-[10px] tracking-luxe text-gold font-medium mt-0.5">فيلورا</span>
            </div>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed max-w-xs">
              وجهتك الأولى للأزياء الرجالية الرسمية الفاخرة. بدلٌ مفصّلة بحرفة إيطالية وخامات صوف استثنائية تمنحك حضوراً يليق بمقامك.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Instagram, label: 'إنستغرام' },
                { icon: Facebook, label: 'فيسبوك' },
                { icon: Twitter, label: 'تويتر' },
                { icon: Youtube, label: 'يوتيوب' },
              ].map((s, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="size-9 rounded-full border border-border flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <s.icon className="size-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold text-foreground mb-4 tracking-wide-luxe">تسوّق</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => selectCat('all')} className="text-sm text-foreground/60 hover:text-gold transition-colors text-right">كل المنتجات</button></li>
              {categories.map((c) => (
                <li key={c.id}>
                  <button onClick={() => selectCat(c.slug)} className="text-sm text-foreground/60 hover:text-gold transition-colors text-right">
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div className="lg:col-span-2">
            <h4 className="font-display text-sm font-bold text-foreground mb-4 tracking-wide-luxe">المساعدة</h4>
            <ul className="space-y-2.5">
              {['الأسئلة الشائعة', 'سياسة الشحن', 'التعديل والإرجاع', 'دليل مقاسات البدل', 'تتبع الطلب', 'تواصل معنا'].map((x) => (
                <li key={x}>
                  <a href="#" onClick={(e) => e.preventDefault()} className="text-sm text-foreground/60 hover:text-gold transition-colors">{x}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-4">
            <h4 className="font-display text-sm font-bold text-foreground mb-4 tracking-wide-luxe">تواصل معنا</h4>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-sm text-foreground/60">شارع التحرير، وسط البلد، القاهرة، مصر</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-gold shrink-0" strokeWidth={1.5} />
                <a href="tel:+20221234567" className="text-sm text-foreground/60 hover:text-gold transition-colors" dir="ltr">+20 22 123 4567</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-gold shrink-0" strokeWidth={1.5} />
                <a href="mailto:hello@velora.com" className="text-sm text-foreground/60 hover:text-gold transition-colors">hello@velora.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="size-4 text-gold shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-sm text-foreground/60">السبت - الخميس: 10 ص - 10 م</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Payment + copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground/50">
            © 2025 فيلورا. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2">
            {['VISA', 'MC', 'MEEZA', 'COD'].map((p) => (
              <span key={p} className="px-2.5 py-1 text-[10px] font-bold tracking-wider bg-secondary text-foreground/60 rounded-sm border border-border">
                {p}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-foreground/50">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold transition-colors">سياسة الخصوصية</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-gold transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
