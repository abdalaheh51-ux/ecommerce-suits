'use client'

import { motion, useInView, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ===== Reveal: fade + slide up when element enters viewport =====
export function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  className,
  once = true,
  duration = 0.7,
}: {
  children: ReactNode
  delay?: number
  y?: number
  x?: number
  className?: string
  once?: boolean
  duration?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, x, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, x: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ===== Stagger container + item =====
export function StaggerGroup({
  children,
  className,
  delay = 0.1,
  stagger = 0.08,
}: {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
  y = 24,
}: {
  children: ReactNode
  className?: string
  y?: number
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ===== Parallax: translate element on scroll =====
export function Parallax({
  children,
  className,
  speed = 0.3,
  axis = 'y',
}: {
  children: ReactNode
  className?: string
  speed?: number
  axis?: 'x' | 'y'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const range = useTransform(scrollYProgress, [0, 1], [speed * 120, -speed * 120])
  const smooth = useSpring(range, { stiffness: 80, damping: 20, mass: 0.3 })
  const style = axis === 'y' ? { y: smooth } : { x: smooth }
  return (
    <motion.div ref={ref} style={style} className={className}>
      {children}
    </motion.div>
  )
}

// ===== Magnetic: element attracts toward cursor on hover =====
export function Magnetic({
  children,
  className,
  strength = 0.35,
}: {
  children: ReactNode
  className?: string
  strength?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15 })
  const sy = useSpring(y, { stiffness: 200, damping: 15 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    x.set(mx * strength)
    y.set(my * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cn('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}

// ===== AnimatedText: word-by-word fade/slide for headings =====
export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.08,
  once = true,
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  once?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once, margin: '-40px' })
  const words = text.split(' ')
  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={cn('inline', className)}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: '0.6em', filter: 'blur(6px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
          }}
          className="inline-block"
          style={{ marginLeft: '0.25em' }}
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  )
}

// ===== CounterUp: animate number from 0 to value when in view =====
export function CounterUp({
  value,
  suffix = '',
  prefix = '',
  className,
  duration = 1.8,
}: {
  value: number
  suffix?: string
  prefix?: string
  className?: string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / (duration * 1000))
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * value))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])
  return (
    <span ref={ref} className={className}>
      {prefix}{display.toLocaleString('ar-EG')}{suffix}
    </span>
  )
}

// ===== SmoothScroll: smooth scroll behavior with easing =====
export function useSmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"], button[data-scroll-to]') as HTMLElement | null
      if (!anchor) return
      const sel = anchor.getAttribute('href') || anchor.getAttribute('data-scroll-to')
      if (!sel || sel === '#') return
      const el = document.querySelector(sel)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

// ===== PageTransition wrapper =====
export function PageTransition({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
