'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function EditorialBanner() {
  const scrollToShop = () => {
    const el = document.getElementById('shop')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative py-0 overflow-hidden bg-foreground text-background">
      <div className="grid lg:grid-cols-2 min-h-[60vh]">
        {/* Image side */}
        <div className="relative order-1 lg:order-2 min-h-[300px] lg:min-h-[60vh]">
          <img
            src="/images/promo-formal.jpg"
            alt="مجموعة فيلورا الرسمية"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.4' }}
          />
        </div>

        {/* Content side */}
        <div className="order-2 lg:order-1 flex items-center justify-center p-8 sm:p-12 lg:p-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <span className="text-xs tracking-luxe text-gold font-medium uppercase">عرض الموسم الرسمي</span>
            <h2 className="mt-4 font-display text-3xl lg:text-5xl font-bold leading-tight">
              خصم يصل إلى <span className="text-gold">25%</span>
              <br />
              على تشكيلة البدل
            </h2>
            <p className="mt-5 text-background/70 leading-relaxed">
              خصومات حصرية على أرقى البدل والمعاطف من مجموعتنا. خامة صوف إيطالية فاخرة وقصّة خالدة بأسعار استثنائية لفترة محدودة.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                onClick={scrollToShop}
                className="group bg-gold text-primary-foreground hover:bg-gold/90 rounded-none px-7 h-12 text-sm tracking-wide-luxe font-medium"
              >
                تسوّق العرض
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </Button>
              <div className="flex items-center gap-3">
                <CountdownPill label="يوم" value="07" />
                <span className="text-gold text-2xl font-bold">:</span>
                <CountdownPill label="ساعة" value="18" />
                <span className="text-gold text-2xl font-bold">:</span>
                <CountdownPill label="دقيقة" value="42" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CountdownPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-background/10 backdrop-blur border border-background/15 rounded-sm w-12 h-12 flex items-center justify-center">
        <span className="font-display text-lg font-bold text-background">{value}</span>
      </div>
      <span className="text-[10px] text-background/50 mt-1 tracking-wide-luxe">{label}</span>
    </div>
  )
}
