'use client'

import { Star, Quote } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/animations/motion-primitives'

const testimonials = [
  {
    name: 'أحمد سمير',
    role: 'رجل أعمال',
    rating: 5,
    text: 'بدلة الجملي تفوق التوقعات. القصّة مظبوطة والصوف ناعم فخم. لبستها في مؤتمر وأنا حاسس إنني بفرض احترامي. فيلورا بصراحة وجهتي الوحيدة للبدل.',
  },
  {
    name: 'عمر الزيات',
    role: 'محامٍ',
    rating: 5,
    text: 'البدلة الثلاثية الفحمية تحفة فنية. الخامة صوف سوبر 120 واضح إنها فاخرة. التعديل المجاني خلّاها تجلس عليّ بإتقان تام. تجربة تستحق كل نجمة.',
  },
  {
    name: 'كريم وليد',
    role: 'مدير تنفيذي',
    rating: 5,
    text: 'السموكن الأسود خلاني نجم الحفلة. الـ satin لامع فخم والتفاصيل دقيقة. كمان القميص الأبيض والكرفات البورجوني من عندهم، تكملة مثالية.',
  },
]

export function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs tracking-luxe text-gold font-medium uppercase">آراء عملائنا</span>
            <span className="h-px w-8 bg-gold" />
          </div>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground">
            ثقةٌ تُبنى على الجودة
          </h2>
          <div className="flex items-center justify-center gap-2 mt-5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-5 fill-gold text-gold" />
              ))}
            </div>
            <span className="font-display font-bold text-foreground">4.9/5</span>
            <span className="text-foreground/50 text-sm">من أكثر من 12,000 تقييم</span>
          </div>
        </div>

        <StaggerGroup className="grid md:grid-cols-3 gap-6" stagger={0.12}>
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="bg-background border border-border rounded-sm p-7 relative hover:shadow-luxe hover:border-gold/30 transition-all duration-500 h-full group">
                <Quote className="size-8 text-gold/30 absolute top-5 left-5 group-hover:text-gold/50 transition-colors" />
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="size-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-foreground/70 leading-relaxed text-sm relative z-10">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-5 pt-5 border-t border-border flex items-center gap-3">
                  <div className="size-11 rounded-full bg-accent flex items-center justify-center font-display font-bold text-gold group-hover:bg-gold group-hover:text-primary-foreground transition-colors duration-300">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-foreground/50">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
