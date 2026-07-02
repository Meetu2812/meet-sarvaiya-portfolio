import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  motion, AnimatePresence, MotionConfig,
  useScroll, useSpring, useTransform, useMotionValueEvent,
} from 'framer-motion'
import Scene from './Scene.jsx'
import { SCREENS, SKILLS, SERVICES, CLIENTS, STATS, EMAIL, SOCIALS } from './data.jsx'
import { Kicker, Reveal, Lines, Magnetic, Icon, ChevronDown, EASE } from './ui.jsx'

const N = SCREENS.length
const pad2 = (n) => String(n).padStart(2, '0')

/* ---------- film leader intro ---------- */
function Intro() {
  const tcRef = useRef(null)
  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (now) => {
      const s = (now - start) / 1000
      if (tcRef.current) {
        tcRef.current.textContent = `00:00:${pad2(Math.floor(s) % 60)}:${pad2(Math.floor(s * 24) % 24)}`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <motion.div className="intro" exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: EASE }}>
      <span ref={tcRef} className="intro-tc mono">00:00:00:00</span>
      <div className="intro-center">
        <motion.span className="kicker mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}>
          Film &amp; video editor — Reel 2026
        </motion.span>
        <h1 className="intro-name display">
          <span className="line-mask">
            <motion.span className="line" initial={{ y: '112%' }} animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.3, ease: EASE }}>MEET</motion.span>
          </span>
          <span className="line-mask">
            <motion.span className="line accent-stroke" initial={{ y: '112%' }} animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.42, ease: EASE }}>SARVAIYA</motion.span>
          </span>
        </h1>
      </div>
      <motion.div className="intro-bar" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 2.1, ease: 'linear' }} />
      <span className="intro-note mono">PICTURE START</span>
    </motion.div>
  )
}

function Portrait() {
  const [ok, setOk] = useState(true)
  return (
    <div className="portrait">
      {ok
        ? <img src="/me.jpg" alt="Meet Sarvaiya" onError={() => setOk(false)} />
        : <span className="mono">MS</span>}
    </div>
  )
}

export default function App() {
  const [introDone, setIntroDone] = useState(false)
  const [focused, setFocused] = useState(0)
  const [inWork, setInWork] = useState(false)
  const workRef = useRef(null)
  const outroRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 2500)
    return () => clearTimeout(t)
  }, [])

  /* scroll progress: whole page (HUD), work corridor (dolly), outro (crane up) */
  const { scrollYProgress: page } = useScroll()
  const { scrollYProgress: work } = useScroll({ target: workRef, offset: ['start start', 'end end'] })
  const { scrollYProgress: outro } = useScroll({ target: outroRef, offset: ['start end', 'start start'] })

  /* running timecode of a 95-second reel at 24fps */
  const tc = useTransform(page, (v) => {
    const f = Math.floor(v * 24 * 95)
    return `00:${pad2(Math.floor(f / (24 * 60)) % 60)}:${pad2(Math.floor(f / 24) % 60)}:${pad2(f % 24)}`
  })
  const playhead = useSpring(page, { stiffness: 90, damping: 24, mass: 0.4 })

  useMotionValueEvent(work, 'change', (v) => {
    setFocused(Math.max(0, Math.min(N - 1, Math.round(v * (N - 1)))))
    setInWork(v > 0.003 && v < 0.997)
  })

  const jumpTo = useCallback((i) => {
    const el = workRef.current
    if (!el) return
    const scrollable = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: el.offsetTop + (i / (N - 1)) * scrollable, behavior: 'smooth' })
  }, [])

  /* arrow keys step between screens */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      const q = work.get()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      if (dir < 0 && q <= 0) return
      if (dir > 0 && q >= 1) return
      const cur = q <= 0 ? -1 : Math.round(q * (N - 1))
      jumpTo(Math.max(0, Math.min(N - 1, cur + dir)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [work, jumpTo])

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!introDone && <Intro key="intro" />}</AnimatePresence>

      {/* cinematic letterbox — widens while the reel plays */}
      <motion.div className="bar top" animate={{ height: inWork ? 54 : 22 }} transition={{ duration: 0.6, ease: EASE }} />
      <motion.div className="bar bottom" animate={{ height: inWork ? 54 : 22 }} transition={{ duration: 0.6, ease: EASE }}>
        <motion.span className="tc mono">{tc}</motion.span>
        <div className="track"><motion.div className="playhead" style={{ scaleX: playhead }} /></div>
        <span className="fps mono">24 FPS</span>
      </motion.div>

      <motion.header className="topbar"
        animate={{ y: inWork ? -90 : 0, opacity: inWork ? 0 : 1 }}
        transition={{ duration: 0.5, ease: EASE }}>
        <a className="logo" href="#top">MS<i>.</i></a>
        <nav className="nav">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#contact">Contact</a>
        </nav>
        <span className="rec mono"><i className="dot" /> REEL 2026</span>
      </motion.header>

      {/* the set — fixed behind everything */}
      <div className="canvas-wrap" aria-hidden="true">
        <Canvas camera={{ position: [0, 1.7, 6.8], fov: 42 }} dpr={[1, 1.75]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}>
          <Suspense fallback={null}>
            <Scene work={work} outro={outro} onJump={jumpTo} />
          </Suspense>
        </Canvas>
      </div>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-inner">
            <Reveal delay={0.1}><Kicker>Documentary &amp; Gaming Editor — India</Kicker></Reveal>
            <h1 className="display hero-title">
              <Lines delay={0.2} lines={[
                'I CUT',
                <span key="mid" className="accent-stroke">EPIC EDITS.</span>,
                'TELL STORIES.',
              ]} />
            </h1>
            <Reveal delay={0.55}>
              <p className="sub">
                I'm <b>Meet Sarvaiya</b> — turning raw footage into stories that hit
                different, cut in Premiere Pro &amp; After Effects.
              </p>
            </Reveal>
            <Reveal delay={0.7} className="hero-cta">
              <Magnetic><a className="btn primary" href="#work"><Icon path="M8 5v14l11-7z" /> Watch the reel</a></Magnetic>
              <Magnetic><a className="btn ghost" href="#contact">Start a project</a></Magnetic>
            </Reveal>
          </div>
          <motion.div className="scroll-cue mono"
            animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}>
            <ChevronDown /> scroll — camera rolling
          </motion.div>
        </section>

        {/* WORK — sticky viewport, the scroll drives the 3D dolly shot */}
        <section ref={workRef} id="work" className="work" style={{ height: `${N * 90}vh` }}>
          <div className="work-sticky">
            <AnimatePresence mode="wait">
              {inWork && (
                <motion.div key={focused} className="caption"
                  initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.32, ease: EASE }}>
                  <span className="cap-count mono">{pad2(focused + 1)} / {pad2(N)}</span>
                  <h2 className="cap-title">{SCREENS[focused].title}</h2>
                  <span className="cap-meta mono">{SCREENS[focused].tag} · click the screen to watch</span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {inWork && (
                <motion.div className="dots"
                  initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.4, ease: EASE }}>
                  {SCREENS.map((s, i) => (
                    <button key={i} className={`dot-btn ${i === focused ? 'on' : ''}`}
                      aria-label={`Go to ${s.title}`} onClick={() => jumpTo(i)} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* the camera cranes up while these panels take over */}
        <div ref={outroRef}>
          {/* ABOUT */}
          <section id="about" className="sec">
            <div className="panel">
              <Reveal>
                <div className="who">
                  <Portrait />
                  <div className="who-meta">
                    <Kicker>Meet the editor</Kicker>
                    <p className="who-name">Meet Sarvaiya</p>
                    <span className="avail mono"><i className="dot" /> Open to freelance</span>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.08}>
                <p className="about-line">I turn raw footage into stories that <span className="hl">hit different.</span></p>
              </Reveal>
              <Reveal delay={0.14}>
                <p className="body-copy">
                  For 2+ years I've cut documentary storytelling and high-octane gaming
                  content for creators across YouTube — shaping pacing, sound, colour and
                  motion so every frame earns its place and viewers stay locked in.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <div className="details">
                  <div className="det"><span className="mono">Based in</span><b>India · Available worldwide</b></div>
                  <div className="det"><span className="mono">Focus</span><b>Documentary · Gaming · Motion</b></div>
                  <div className="det"><span className="mono">Tools</span><b>Premiere Pro · After Effects</b></div>
                  <div className="det"><span className="mono">Services</span><b>Editing · Color · VFX · Sound</b></div>
                </div>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="skills">
                  <Kicker>The arsenal</Kicker>
                  {SKILLS.map((s) => (
                    <div className="sk" key={s.name}>
                      <div className="sk-top"><span className="sk-name">{s.name}</span><span className="sk-pct mono">{s.pct}%</span></div>
                      <p className="sk-desc">{s.desc}</p>
                      <div className="sk-bar">
                        <motion.div className="sk-fill"
                          initial={{ scaleX: 0 }} whileInView={{ scaleX: s.pct / 100 }}
                          viewport={{ once: true }} transition={{ duration: 1.1, delay: 0.25, ease: EASE }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.22}>
                <div className="clients">
                  <span className="clients-label mono">Trusted by creators</span>
                  <div className="clients-row">{CLIENTS.map((c) => <span key={c}>{c}</span>)}</div>
                </div>
                <blockquote className="testi">
                  <p className="testi-q">"This guy does my edits for fun and I love that!"</p>
                  <cite className="testi-by mono">— Ayush More, Content Creator</cite>
                </blockquote>
                <div className="stats">
                  {STATS.map((s) => (
                    <div key={s.label}><b>{s.value}</b><span className="mono">{s.label}</span></div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* SERVICES */}
          <section id="services" className="sec">
            <div className="panel wide">
              <Reveal><Kicker>What I do</Kicker></Reveal>
              <div className="svc-grid">
                {SERVICES.map((s, i) => (
                  <motion.div className="svc" key={s.n}
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, delay: i * 0.12, ease: EASE }}
                    whileHover={{ y: -8 }}>
                    <span className="svc-n mono">{s.n}</span>
                    <h3 className="svc-title">{s.title}</h3>
                    <p className="svc-desc">{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CONTACT — end credits */}
          <section id="contact" className="sec contact">
            <div className="contact-inner">
              <Reveal><Kicker>Ready to go viral?</Kicker></Reveal>
              <Reveal delay={0.1}>
                <Magnetic strength={0.12}>
                  <a className="email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
                </Magnetic>
              </Reveal>
              <Reveal delay={0.2}>
                <div className="socials">
                  {SOCIALS.map((s) => (
                    <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                      <Icon path={s.path} /> {s.name}
                    </a>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="credits mono">
                  <span>© 2026 Meet Sarvaiya — Video Editor</span>
                  <span>Shot on React Three Fiber · Cut with Framer Motion</span>
                </div>
              </Reveal>
            </div>
          </section>
        </div>
      </main>
    </MotionConfig>
  )
}
