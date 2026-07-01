'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

// Thin gold progress bar at top of page indicating scroll position
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 25, mass: 0.3 })
  return (
    <motion.div
      aria-hidden
      className="fixed top-0 right-0 left-0 h-[3px] origin-right z-[60] bg-gradient-to-l from-gold via-gold to-gold/60"
      style={{ scaleX }}
    />
  )
}
