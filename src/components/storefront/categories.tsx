'use client'

import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/animations/motion-primitives'
import type { Category } from '@/lib/types'

export function Categories({ categories }: { categories: Category[] }) {
  const selectCategory = (slug: string) => {
    const event = new CustomEvent('select-category', { detail: slug })
    window.dispatchEvent(event)
    const el = document.getElementById('shop')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const featured = categories.filter((c) => c.featured)

  return (
    <section id="categories" className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="h-px w-8 bg-gold" />
            <span className="text-xs tracking-luxe text-gold font-medium uppercase">تسوّق حسب الفئة</span>
            <span className="h-px w-8 bg-gold" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-5xl font-bold text-foreground"
          >
            خزانة الرجل الأنيق
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-foreground/60 leading-relaxed"
          >
            تشكيلات مُنتقاة بعناية لإطلالة رسمية متكاملة تليق بكل مناسبة
          </motion.p>
        </div>

        <StaggerGroup className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" stagger={0.12}>
          {featured.slice(0, 4).map((cat) => (
            <StaggerItem key={cat.id}>
              <button
                onClick={() => selectCategory(cat.slug)}
                className="group relative overflow-hidden rounded-sm aspect-[3/4] bg-muted text-right w-full block"
              >
                <img
                  src={cat.image || '/images/cat-suits.jpg'}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-110"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/cat-suits.jpg' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                {/* Gold frame on hover */}
                <div className="absolute inset-3 border border-gold/0 group-hover:border-gold/40 rounded-sm transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-white mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-1 mb-3">{cat.description}</p>
                  <span className="inline-flex items-center gap-2 text-xs text-gold tracking-wide-luxe font-medium opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                    تسوّق الآن
                    <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
                  </span>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  )
}
