import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1]

export function Kicker({ children }) {
  return <span className="kicker mono">{children}</span>
}

/* fade + rise once the element scrolls into view */
export function Reveal({ children, delay = 0, y = 26, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/* per-line masked title reveal (each line slides up from behind a clip mask).
   the observer watches the unclipped parent — a span hidden inside an
   overflow-hidden mask never intersects, so it can't watch itself */
export function Lines({ lines, delay = 0 }) {
  return (
    <motion.span className="lines" initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {lines.map((line, i) => (
        <span className="line-mask" key={i}>
          <motion.span
            className="line"
            variants={{
              hidden: { y: '112%' },
              visible: { y: '0%', transition: { duration: 0.9, delay: delay + i * 0.11, ease: EASE } },
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

/* element gently follows the cursor while hovered */
export function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 })
  const reduce = useReducedMotion()

  const onMove = (e) => {
    if (reduce || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }}
      onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </motion.div>
  )
}

export function Icon({ path, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  )
}

export function ChevronDown({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
