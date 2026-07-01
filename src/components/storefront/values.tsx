'use client'

import { Truck, RotateCcw, ShieldCheck, Gem } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem, CounterUp } from '@/components/animations/motion-primitives'
import { BlurOrbs, GeometricPattern } from '@/components/effects/background-decor'

const values = [
  {
    icon: Gem,
    title: 'حرفة تفصيل إيطالية',
    desc: 'بدلٌ تُفصَّل بحرفة يدوية إيطالية أصيلة وخامات صوف فاخرة تدوم لسنوات.',
  },
  {
    icon: RotateCcw,
    title: 'تعديل مجاني',
    desc: 'نُعدّل بدلتك مجاناً خلال 14 يوماً لتجلس عليك بإتقان تام.',
  },
  {
    icon: Truck,
    title: 'شحن سريع وآمن',
    desc: 'توصيل لباب منزلك خلال 2-4 أيام عمل في جميع المحافظات.',
  },
  {
    icon: ShieldCheck,
    title: 'دفع آمن',
    desc: 'ادفع نقداً عند الاستلام أو بطاقة ائتمان بأمان تام.',
  },
]

export function Values() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-secondary/40 scroll-mt-20 relative overflow-hidden">
      {/* Decorative background */}
      <GeometricPattern opacity={0.025} />
      <BlurOrbs variant="minimal" className="opacity-40" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: heading */}
          <Reveal>
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-gold" />
              <span className="text-xs tracking-luxe text-gold font-medium uppercase">لماذا فيلورا</span>
            </div>
            <h2 className="font-display text-3xl lg:text-5xl font-bold text-foreground leading-tight">
              أناقة الرجل
              <br />
              تبدأ من <span style={{ color: 'oklch(0.55 0.1 65)' }}>البدلة</span>
            </h2>
            <p className="mt-6 text-foreground/60 leading-relaxed max-w-md">
              في فيلورا نؤمن أن بدلة الرجل ليست مجرد ملابس، بل هي بيان حضور. كل بدلة في تشكيلتنا تُفصَّل بحرفة إيطالية أصيلة وخامات صوف فاخرة، لتمنحك ثقة الرجل الذي يدرك قيمة التفاصيل.
            </p>
            <div className="mt-8 flex items-center gap-8">
              <div>
                <p className="font-display text-3xl font-bold text-gold">
                  <CounterUp value={12} suffix="+" />
                </p>
                <p className="text-xs text-foreground/50 mt-1">عاماً من الخبرة</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="font-display text-3xl font-bold text-gold">
                  <CounterUp value={8000} suffix="+" />
                </p>
                <p className="text-xs text-foreground/50 mt-1">رجل أنيق</p>
              </div>
              <div className="h-12 w-px bg-border" />
              <div>
                <p className="font-display text-3xl font-bold text-gold">
                  <CounterUp value={100} suffix="%" />
                </p>
                <p className="text-xs text-foreground/50 mt-1">صوف إيطالي</p>
              </div>
            </div>
          </Reveal>

          {/* Right: values grid */}
          <StaggerGroup className="grid sm:grid-cols-2 gap-5" stagger={0.1}>
            {values.map((v) => (
              <StaggerItem key={v.title}>
                <div className="group bg-background border border-border rounded-sm p-6 hover:border-gold/40 hover:shadow-luxe transition-all duration-500 h-full relative overflow-hidden">
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-transparent transition-all duration-500" />
                  <div className="relative">
                    <div className="size-12 rounded-full bg-accent flex items-center justify-center mb-4 group-hover:bg-gold transition-colors duration-300 group-hover:scale-110">
                      <v.icon className="size-5 text-gold group-hover:text-primary-foreground transition-colors" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-lg font-bold text-foreground mb-2">{v.title}</h3>
                    <p className="text-sm text-foreground/60 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  )
}
