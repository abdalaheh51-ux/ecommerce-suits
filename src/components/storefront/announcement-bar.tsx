'use client'

import { Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react'

const items = [
  { icon: Sparkles, text: 'حرفة تفصيل إيطالية أصيلة' },
  { icon: RotateCcw, text: 'تعديل مجاني على البدل خلال 14 يوم' },
  { icon: Truck, text: 'شحن مجاني للطلبات فوق 3000 ج.م' },
  { icon: ShieldCheck, text: 'دفع آمن عند الاستلام' },
]

export function AnnouncementBar() {
  const loop = [...items, ...items, ...items, ...items]
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden border-b border-primary-foreground/10">
      <div className="flex w-max animate-marquee">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-2 px-8 py-2.5 text-xs tracking-wide-luxe whitespace-nowrap">
            <item.icon className="size-3.5 text-gold" strokeWidth={1.5} />
            <span className="font-medium">{item.text}</span>
            <span className="text-gold mx-4">◆</span>
          </div>
        ))}
      </div>
    </div>
  )
}
