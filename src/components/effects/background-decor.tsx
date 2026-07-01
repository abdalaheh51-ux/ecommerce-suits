'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ===== BlurOrbs: soft colored floating orbs in the background =====
export function BlurOrbs({ className, variant = 'default' }: { className?: string; variant?: 'default' | 'warm' | 'minimal' }) {
  const orbs = variant === 'warm'
    ? [
        { c: 'var(--gold)', s: 420, x: '5%', y: '10%', d: 18, delay: 0 },
        { c: 'var(--accent)', s: 360, x: '85%', y: '20%', d: 22, delay: 2 },
        { c: 'var(--gold-soft)', s: 300, x: '70%', y: '75%', d: 20, delay: 1 },
      ]
    : variant === 'minimal'
    ? [
        { c: 'var(--gold)', s: 320, x: '90%', y: '15%', d: 24, delay: 0 },
        { c: 'var(--gold-soft)', s: 260, x: '5%', y: '70%', d: 28, delay: 1.5 },
      ]
    : [
        { c: 'var(--gold)', s: 380, x: '8%', y: '12%', d: 20, delay: 0 },
        { c: 'var(--accent)', s: 340, x: '82%', y: '25%', d: 26, delay: 2 },
        { c: 'var(--gold-soft)', s: 280, x: '60%', y: '80%', d: 22, delay: 1 },
      ]
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.s,
            height: o.s,
            left: o.x,
            top: o.y,
            background: o.c,
            filter: 'blur(80px)',
            opacity: 0.18,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 15, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: o.d, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ===== FloatingShapes: subtle geometric shapes drifting =====
export function FloatingShapes({ className }: { className?: string }) {
  const shapes = [
    { type: 'circle', s: 14, x: '12%', y: '30%', d: 16, delay: 0, r: 0 },
    { type: 'square', s: 10, x: '88%', y: '60%', d: 20, delay: 1.5, r: 45 },
    { type: 'circle', s: 8, x: '45%', y: '85%', d: 18, delay: 0.8, r: 0 },
    { type: 'square', s: 12, x: '70%', y: '15%', d: 22, delay: 2.2, r: 20 },
    { type: 'ring', s: 18, x: '25%', y: '70%', d: 24, delay: 1, r: 0 },
  ]
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      {shapes.map((sh, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: sh.x, top: sh.y, width: sh.s, height: sh.s, rotate: `${sh.r}deg` }}
          animate={{ y: [0, -18, 0], opacity: [0.12, 0.25, 0.12] }}
          transition={{ duration: sh.d, delay: sh.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          {sh.type === 'circle' && <div className="w-full h-full rounded-full border border-gold/40" />}
          {sh.type === 'square' && <div className="w-full h-full border border-gold/40" />}
          {sh.type === 'ring' && <div className="w-full h-full rounded-full border-2 border-gold/30" />}
        </motion.div>
      ))}
    </div>
  )
}

// ===== NoiseTexture: subtle grain overlay for depth =====
export function NoiseTexture({ className, opacity = 0.04 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 mix-blend-overlay', className)}
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

// ===== AnimatedGradient: slowly shifting mesh gradient background =====
export function AnimatedGradient({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <motion.div
        className="absolute -inset-[30%]"
        style={{
          background:
            'radial-gradient(at 20% 30%, var(--gold-soft) 0px, transparent 50%), radial-gradient(at 80% 20%, var(--accent) 0px, transparent 50%), radial-gradient(at 50% 80%, var(--gold-soft) 0px, transparent 50%)',
          opacity: 0.25,
        }}
        animate={{ rotate: [0, 8, -4, 0], scale: [1, 1.1, 1.05, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ===== GeometricPattern: subtle SVG line pattern =====
export function GeometricPattern({ className, opacity = 0.04 }: { className?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        opacity,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23000' stroke-width='0.5'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/svg%3E\")",
      }}
    />
  )
}

// ===== ScrollProgress: thin gold progress bar at top of page =====
export function ScrollProgress() {
  return (
    <motion.div
      className="fixed top-0 right-0 left-0 h-0.5 origin-right z-[60] bg-gold"
      style={{ scaleX: 0 }}
      whileInView={undefined}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0 }}
    >
      <motion.div
        className="h-full bg-gold origin-right"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
      />
    </motion.div>
  )
}
