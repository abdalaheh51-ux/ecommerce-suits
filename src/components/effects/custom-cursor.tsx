'use client'

import { useSyncExternalStore, useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Detect fine pointer (mouse) support without setState-in-effect
function subscribeFinePointer(cb: () => void) {
  const mq = window.matchMedia('(pointer: fine)')
  mq.addEventListener('change', cb)
  return () => mq.removeEventListener('change', cb)
}
function getFinePointer() {
  return window.matchMedia('(pointer: fine)').matches
}
function getFinePointerSSR() {
  return false
}

// Custom cursor with a dot + outer ring that grows on interactive elements
// Only enabled on devices with a fine pointer (desktop)
export function CustomCursor() {
  const enabled = useSyncExternalStore(subscribeFinePointer, getFinePointer, getFinePointerSSR)
  const [hovering, setHovering] = useState(false)
  const [down, setDown] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 })
  const ringY = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 })

  useEffect(() => {
    if (!enabled) return

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as HTMLElement
      const interactive = t.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')
      setHovering(!!interactive)
    }
    const downH = () => setDown(true)
    const upH = () => setDown(false)
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mousedown', downH)
    window.addEventListener('mouseup', upH)
    document.documentElement.style.cursor = 'none'
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', downH)
      window.removeEventListener('mouseup', upH)
      document.documentElement.style.cursor = ''
    }
  }, [enabled, x, y])

  if (!enabled) return null

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9999] hidden md:block"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: hovering ? 56 : 36,
            height: hovering ? 56 : 36,
            opacity: down ? 0.4 : 0.6,
            borderColor: hovering ? 'var(--gold)' : 'rgba(0,0,0,0.4)',
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
          className="rounded-full border"
        />
      </motion.div>
      {/* Inner dot */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed z-[9999] hidden md:block"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: hovering ? 0 : 1,
            backgroundColor: 'var(--gold)',
          }}
          className="size-1.5 rounded-full"
        />
      </motion.div>
    </>
  )
}
