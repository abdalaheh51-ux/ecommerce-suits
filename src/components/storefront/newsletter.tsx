'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Send, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { BlurOrbs, NoiseTexture } from '@/components/effects/background-decor'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'فشل الاشتراك')
      } else {
        setDone(true)
        toast.success('تم اشتراكك بنجاح!', { description: 'ستصلك آخر التشكيلات والعروض' })
        setEmail('')
      }
    } catch {
      toast.error('حدث خطأ، حاول مرة أخرى')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 lg:py-28 bg-foreground text-background relative overflow-hidden">
      {/* Decorative orbs + noise */}
      <BlurOrbs variant="warm" className="opacity-50" />
      <NoiseTexture opacity={0.06} />
      {/* Decorative grain */}
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center size-14 rounded-full bg-gold/15 mb-6"
          >
            <Mail className="size-6 text-gold" strokeWidth={1.5} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl lg:text-4xl font-bold"
          >
            انضم إلى نخبة فيلورا
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-background/60 leading-relaxed"
          >
            اشترك في نشرتنا واحصل على <span className="text-gold font-medium">خصم 10%</span> على بدلتك الأولى، بالإضافة إلى آخر التشكيلات ونصائح الأناقة الرجالية.
          </motion.p>

          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="بريدك الإلكتروني"
                required
                disabled={loading || done}
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40 rounded-none h-12 focus-visible:ring-gold/50"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || done}
              className="bg-gold text-primary-foreground hover:bg-gold/90 rounded-none h-12 px-6 tracking-wide-luxe font-medium"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : done ? (
                <><CheckCircle2 className="size-4" /> تم الاشتراك</>
              ) : (
                <>اشترك <Send className="size-4" /></>
              )}
            </Button>
          </motion.form>
          <p className="text-xs text-background/40 mt-4">
            نحترم خصوصيتك — يمكنك إلغاء الاشتراك في أي وقت.
          </p>
        </div>
      </div>
    </section>
  )
}
