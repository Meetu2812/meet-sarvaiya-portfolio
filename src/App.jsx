import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ScrollControls, Scroll } from '@react-three/drei'
import Experience, { SCREENS } from './Experience.jsx'

const SKILLS = [
  { name: 'Premiere Pro', pct: 95, desc: 'My main weapon — timelines, multicam, audio sync, colour & final delivery.' },
  { name: 'After Effects', pct: 88, desc: 'Motion graphics, titles, VFX & compositing for that cinematic edge.' },
]

const SERVICES = [
  { n: '01', title: 'Documentary Editing', desc: 'Real stories told with intention — interview pacing, archival weaving & emotional rhythm.' },
  { n: '02', title: 'Gaming Montages', desc: 'High-energy, beat-synced edits built for impact. Dynamic cuts that make clips go viral.' },
  { n: '03', title: 'Color & VFX', desc: 'Cinematic colour grading & motion graphics that elevate footage to breathtaking.' },
]

function Avatar() {
  const [ok, setOk] = useState(true)
  return (
    <div className="portrait">
      {ok
        ? <img className="portrait-img" src="/me.jpg" alt="Meet Sarvaiya" onError={() => setOk(false)} />
        : <span className="portrait-mono">MS</span>}
    </div>
  )
}

function Skills() {
  const [filled, setFilled] = useState(false)
  useEffect(() => { const t = setTimeout(() => setFilled(true), 400); return () => clearTimeout(t) }, [])
  return (
    <div className="panel">
      <span className="kicker">The arsenal</span>
      {SKILLS.map((s) => (
        <div className="sk" key={s.name}>
          <div className="sk-top"><span className="sk-name">{s.name}</span><span className="sk-pct">{s.pct}%</span></div>
          <p className="sk-desc">{s.desc}</p>
          <div className="sk-bar"><div className="sk-fill" style={{ width: filled ? `${s.pct}%` : '0%' }} /></div>
        </div>
      ))}
    </div>
  )
}

function Overlay() {
  return (
    <Scroll html>
      {/* HERO */}
      <section className="s hero">
        <span className="kicker">Documentary &amp; Gaming Editor — India</span>
        <h1 className="title">I cut<br /><span>epic edits.</span><br />tell stories.</h1>
        <p className="sub">
          I'm <b>Meet Sarvaiya</b> — turning raw footage into stories that hit
          different, cut in Premiere Pro &amp; After Effects.
        </p>
        <p className="hint">↓ scroll · ← → arrow keys · click a screen to focus / watch</p>
      </section>

      <section className="s" />

      {/* ABOUT */}
      <section className="s right">
        <div className="panel">
          <div className="who">
            <Avatar />
            <div className="who-meta">
              <span className="kicker">Meet the editor</span>
              <p className="who-name">Meet Sarvaiya</p>
              <span className="avail"><i className="dot" /> Open to freelance</span>
            </div>
          </div>
          <p className="about">I turn raw footage into stories that <span className="hl">HIT DIFFERENT.</span></p>
          <p className="about-body">
            I'm Meet Sarvaiya, a video editor from India specialising in
            documentary storytelling and high-octane gaming content. For 2+ years
            I've cut for creators across YouTube — shaping pacing, sound, colour
            and motion so every frame earns its place and viewers stay locked in.
          </p>

          <div className="details">
            <div className="det"><span>Based in</span><b>India · Available worldwide</b></div>
            <div className="det"><span>Focus</span><b>Documentary · Gaming · Motion</b></div>
            <div className="det"><span>Tools</span><b>Premiere Pro · After Effects</b></div>
            <div className="det"><span>Services</span><b>Editing · Color · VFX · Sound</b></div>
          </div>

          <div className="clients">
            <span className="clients-label">Trusted by creators</span>
            <div className="clients-row">
              <span>Ayush More</span><span>Agnit Plays</span><span>Ravi Plays</span><span>Bixuu</span>
            </div>
          </div>

          <div className="testi">
            <p className="testi-q">"This guy does my edits for fun and I love that!"</p>
            <p className="testi-by">— Ayush More, Content Creator</p>
          </div>
          <div className="stats">
            <div><b>50+</b><span>Projects</span></div>
            <div><b>2+</b><span>Years</span></div>
            <div><b>10M+</b><span>Views</span></div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="s left">
        <Skills />
      </section>

      {/* SERVICES */}
      <section className="s right">
        <div className="panel wide">
          <span className="kicker">What I do</span>
          <div className="svc-grid">
            {SERVICES.map((s) => (
              <div className="svc" key={s.n}>
                <span className="svc-n">{s.n}</span>
                <h3 className="svc-title">{s.title}</h3>
                <p className="svc-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="s center">
        <div className="panel center">
          <span className="kicker">Ready to go viral?</span>
          <a className="email" href="mailto:meetuedits21@gmail.com">meetuedits21@gmail.com</a>
          <div className="socials">
            <a href="https://x.com/Meetu2169" target="_blank" rel="noopener">X / Twitter</a>
            <a href="#" target="_blank" rel="noopener">YouTube</a>
            <a href="#" target="_blank" rel="noopener">Instagram</a>
          </div>
          <span className="copyright">© 2026 Meet Sarvaiya — Video Editor</span>
        </div>
      </section>
    </Scroll>
  )
}

function Intro() {
  const [gone, setGone] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGone(true), 2200); return () => clearTimeout(t) }, [])
  return (
    <div className={`intro ${gone ? 'gone' : ''}`}>
      <span className="intro-tc">00:00:00:00</span>
      <h1 className="intro-name">MEET SARVAIYA</h1>
      <span className="intro-role">Film &amp; Video Editor — Reel 2026</span>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Intro />

      {/* cinematic letterbox */}
      <div className="bar top" />
      <div className="bar bottom" />

      <div className="topbar">
        <span className="logo">MS<i>.</i></span>
        <span className="rec"><i className="dot" /> REEL 2026 · 24FPS</span>
      </div>

      <div className="caption">
        <span id="cap-count" className="cap-count">01 / 07</span>
        <h2 id="cap-title" className="cap-title">Documentary Style</h2>
        <span id="cap-meta" className="cap-meta">Documentary</span>
      </div>

      {/* editor timeline scrubber */}
      <div className="timeline">
        <span id="tc" className="tc">00:00:00:00</span>
        <div className="track"><div id="playhead" className="playhead" /></div>
      </div>

      <Canvas camera={{ position: [0, 0.3, 0.8], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          <ScrollControls pages={6} damping={0.3}>
            <Experience />
            <Overlay />
          </ScrollControls>
        </Suspense>
      </Canvas>
    </>
  )
}
