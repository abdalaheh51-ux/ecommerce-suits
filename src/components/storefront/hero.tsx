'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowLeft, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Magnetic } from '@/components/animations/motion-primitives'
import { CounterUp } from '@/components/animations/motion-primitives'
import { AnimatedText } from '@/components/animations/motion-primitives'
import { FloatingShapes } from '@/components/effects/background-decor'

export function Hero() {
  const { scrollYProgress } = useScroll()
  // Parallax: background moves slower than content
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const scrollToShop = () => {
    const el = document.getElementById('shop')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[90vh] lg:min-h-[94vh] flex items-center overflow-hidden bg-[#3b2a1a]">
      {/* Background video with parallax — higher opacity for the video to show through */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-[120%] object-cover -translate-y-[8%]"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='9'%3E%3Crect width='16' height='9' fill='%233b2a1a'/%3E%3C/svg%3E"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        {/* Brown tint base layer so any transparent area reads as brown */}
        <div className="absolute inset-0 bg-[#3b2a1a]/40" />
        {/* Overlays for text readability — lighter so video shows more */}
        {/* Left-side darkening (text is on the left in RTL) */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#3b2a1a]/20 via-[#3b2a1a]/45 to-[#3b2a1a]/85" />
        {/* Top/bottom darkening */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#3b2a1a]/70 via-transparent to-[#3b2a1a]/25" />
        {/* Soft white spotlight from the top onto the suit (right side in RTL) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 72% 18%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.10) 35%, rgba(255,255,255,0) 70%)',
          }}
        />
        {/* Subtle top light wash to lift the suit area */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/8 to-transparent" />
      </motion.div>

      {/* Decorative floating shapes */}
      <FloatingShapes className="opacity-60" />

      {/* Content */}
      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        style={{ y: contentY, opacity: overlayOpacity }}
      >
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="h-px w-10 bg-gold" />
            <span className="text-xs tracking-luxe text-gold font-medium uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">أزياء رجالية رسمية · خريف 2025</span>
          </motion.div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] text-[#f7f1e6] [text-shadow:0_2px_24px_rgba(0,0,0,0.6),0_1px_3px_rgba(0,0,0,0.5)]">
            <AnimatedText text="حضورٌ" delay={0.1} />{' '}
            <span style={{ color: 'oklch(0.72 0.12 70)' }}>
              <AnimatedText text="رجلٍ" delay={0.3} />
            </span>
            <br />
            <AnimatedText text="يُقاس بتفاصيلِ" delay={0.5} />
            <br />
            <AnimatedText text="بدلته" delay={0.8} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease: 'easeOut' }}
            className="mt-6 text-base lg:text-lg text-[#f7f1e6]/90 leading-relaxed max-w-lg [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]"
          >
            بدلٌ مفصّلة بإتقانٍ يدويٍّ وخاماتٍ استثنائية، تمنحك حضوراً سلطوياً في كل مناسبة رسمية. حيث تلتقي الحرفة الإيطالية بالذوق الراقي.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2, ease: 'easeOut' }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <Magnetic strength={0.25}>
              <Button
                size="lg"
                onClick={scrollToShop}
                className="group bg-[#f7f1e6] text-[#3b2a1a] hover:bg-white rounded-none px-8 h-13 py-6 text-sm tracking-wide-luxe font-medium shadow-lg"
              >
                اكتشف التشكيلة
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </Button>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  const el = document.getElementById('categories')
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-white/10 backdrop-blur border-white/30 text-[#f7f1e6] hover:bg-white/20 hover:text-white hover:border-white/50 rounded-none px-8 h-13 py-6 text-sm tracking-wide-luxe font-medium"
              >
                تصفّح الفئات
              </Button>
            </Magnetic>
          </motion.div>

          {/* Trust stats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.4, ease: 'easeOut' }}
            className="mt-12 flex items-center gap-8"
          >
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5 + i * 0.08, type: 'spring', stiffness: 200 }}
                  >
                    <Star className="size-3.5 fill-gold text-gold [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]" />
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-[#f7f1e6]/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">
                <CounterUp value={8000} suffix="+" /> رجل أنيق
              </p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="font-display text-2xl font-bold text-[#f7f1e6] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">حرفة</p>
              <p className="text-xs text-[#f7f1e6]/70">إيطالية أصيلة</p>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <p className="font-display text-2xl font-bold text-[#f7f1e6] [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                <CounterUp value={14} /> يوم
              </p>
              <p className="text-xs text-[#f7f1e6]/70">تعديل مجاني</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2 text-[#f7f1e6]/60"
      >
        <span className="text-[10px] tracking-luxe uppercase">اكتشف المزيد</span>
        <div className="w-px h-10 bg-white/30 overflow-hidden">
          <motion.div
            className="w-full h-1/2 bg-gold"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>
    </section>
  )
}
