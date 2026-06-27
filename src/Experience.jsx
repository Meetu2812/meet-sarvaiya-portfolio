import { useRef, useState, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  useScroll,
  useTexture,
  MeshReflectorMaterial,
  Environment,
  Float,
  MeshDistortMaterial,
  Sparkles,
  Html,
} from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'

/* generated thumbnail for the project without a YouTube still */
function makeLabel(text, bg) {
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = 1280; c.height = 720
  const x = c.getContext('2d')
  x.fillStyle = bg; x.fillRect(0, 0, 1280, 720)
  x.fillStyle = 'rgba(255,255,255,0.12)'
  for (let yy = 0; yy < 720; yy += 44) for (let xx = 0; xx < 1280; xx += 44) { x.beginPath(); x.arc(xx, yy, 3, 0, 7); x.fill() }
  x.fillStyle = '#fff'; x.font = 'bold 130px Arial'; x.textAlign = 'center'; x.textBaseline = 'middle'
  x.fillText(text, 640, 360)
  return c.toDataURL('image/png')
}
const STEEL_WING = makeLabel('STEEL WING', '#2B49D4')

export const SCREENS = [
  { thumb: '/thumbs/documentary.jpg', title: 'Documentary Style', tag: 'Documentary', link: 'https://www.youtube.com/watch?v=E8oQgbBqdS4', w: 6.4 },
  { thumb: '/thumbs/ayush.jpg', title: 'Ayush More', tag: 'Gaming', link: 'https://www.youtube.com/watch?v=ENG8HICI3Co', w: 5 },
  { thumb: '/thumbs/agnit.jpg', title: 'Agnit Plays', tag: 'Gaming', link: 'https://www.youtube.com/watch?v=F5yZ0MtIulA', w: 5 },
  { thumb: '/thumbs/ravi.jpg', title: 'Ravi Plays', tag: 'Gaming', link: 'https://www.youtube.com/watch?v=sAfkdLDxWUI', w: 5 },
  { thumb: '/thumbs/bixuu.jpg', title: 'Bixuu', tag: 'Gaming', link: 'https://www.youtube.com/watch?v=Dsd6RbKVh7o', w: 5 },
  { thumb: STEEL_WING, title: 'Steel Wing', tag: 'Gaming', link: 'https://drive.google.com/file/d/1cgE9iVwKC2ykgguoP3vaGJdwm-32gCcG/view', w: 5 },
  { thumb: '/thumbs/ayush2.jpg', title: 'Ayush More 2.0', tag: 'Horror', link: 'https://www.youtube.com/watch?v=i5laiQGK6ys', w: 5 },
]

/* ---- arc layout: screens wrap around the viewer ---- */
const R = 13             // arc radius (further back = roomier)
const STEP = 0.5         // angle between screens (rad)
const LAST = (SCREENS.length - 1) * STEP
const posAt = (theta) => [Math.sin(theta) * R, 0, -Math.cos(theta) * R]

/* smoothly scroll the gallery to a given screen index */
function goTo(scroll, idx) {
  const el = scroll.el
  const top = (idx / (SCREENS.length - 1)) * (el.scrollHeight - el.clientHeight)
  el.scrollTo({ top, behavior: 'smooth' })
}

/* colorful distorting blobs (v1 look), scattered around the arc */
function Blob({ position, color, scale, speed }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed
    ref.current.rotation.x = t * 0.15
    ref.current.rotation.y = t * 0.2
  })
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial color={color} roughness={0.15} metalness={0.4} distort={0.4} speed={2} />
      </mesh>
    </Float>
  )
}

function Blobs() {
  const grp = useRef()
  const colors = ['#7c5cff', '#ff6b9d', '#4cc9f0', '#ffd166', '#06d6a0', '#b388ff']
  useFrame((state, delta) => {
    grp.current.rotation.y = THREE.MathUtils.damp(grp.current.rotation.y, state.pointer.x * 0.45, 3, delta)
    grp.current.rotation.x = THREE.MathUtils.damp(grp.current.rotation.x, -state.pointer.y * 0.3, 3, delta)
  })
  const blobs = useMemo(() => {
    const out = []
    for (let i = 0; i < 26; i++) {
      const theta = -0.4 + Math.random() * (LAST + 0.8)
      const rad = R + (Math.random() * 6 - 3)        // in front of / behind the screens
      out.push({
        key: i,
        position: [Math.sin(theta) * rad, (Math.random() * 5 - 2.2), -Math.cos(theta) * rad],
        color: colors[i % colors.length],
        scale: 0.35 + Math.random() * 0.9,
        speed: 0.6 + Math.random() * 1.0,
      })
    }
    return out
  }, [])
  return (
    <group ref={grp}>
      {blobs.map((b) => (
        <Blob key={b.key} position={b.position} color={b.color} scale={b.scale} speed={b.speed} />
      ))}
    </group>
  )
}

function Screen({ data, theta, index }) {
  const group = useRef()
  const scroll = useScroll()
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(data.thumb)
  if (texture) texture.colorSpace = THREE.SRGBColorSpace
  const h = data.w / (16 / 9)
  const [px, py, pz] = posAt(theta)

  useFrame((_, delta) => {
    const s = THREE.MathUtils.damp(group.current.scale.x, hovered ? 1.06 : 1, 6, delta)
    group.current.scale.setScalar(s)
  })

  return (
    <group
      ref={group}
      position={[px, py, pz]}
      rotation={[0, -theta, 0]}
      onClick={(e) => {
        e.stopPropagation()
        const focused = Math.round(scroll.offset * (SCREENS.length - 1))
        if (focused === index) window.open(data.link, '_blank', 'noopener')
        else goTo(scroll, index)
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[data.w + 0.14, h + 0.14, 0.08]} />
        <meshStandardMaterial color="#15151a" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.05]}>
        <planeGeometry args={[data.w + 0.04, h + 0.04]} />
        <meshBasicMaterial color={hovered ? '#ff5a36' : '#000000'} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[data.w, h]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.02]} scale={hovered ? 1 : 0.9}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial color="#E63329" toneMapped={false} transparent opacity={hovered ? 0.95 : 0.8} />
      </mesh>
      <mesh position={[0.06, 0, 0.03]} rotation={[0, 0, -Math.PI / 2]} scale={hovered ? 1 : 0.9}>
        <circleGeometry args={[0.16, 3]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>

      {/* 3D hover label attached to the screen */}
      {hovered && (
        <Html center position={[0, -h / 2 - 0.55, 0]} distanceFactor={9} style={{ pointerEvents: 'none' }}>
          <div className="scr-label">
            <span className="scr-tag">{data.tag}</span>
            <span className="scr-title">{data.title}</span>
            <span className="scr-watch">▶ Watch</span>
          </div>
        </Html>
      )}
    </group>
  )
}

export default function Experience() {
  const scroll = useScroll()
  const focusRef = useRef(-1)
  const lookTarget = useMemo(() => new THREE.Vector3(), [])

  // arrow-key navigation between screens
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      let idx = Math.round(scroll.offset * (SCREENS.length - 1))
      idx = Math.min(SCREENS.length - 1, Math.max(0, idx + (e.key === 'ArrowRight' ? 1 : -1)))
      goTo(scroll, idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scroll])

  useFrame((state, delta) => {
    const theta = scroll.offset * LAST
    const [tx, ty, tz] = posAt(theta)
    const t = state.clock.elapsedTime

    // camera stays near the centre and TURNS to face the focused screen,
    // with a gentle idle drift so the scene always feels alive
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, state.pointer.x * 0.6 + Math.sin(t * 0.25) * 0.22, 4, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.3 + state.pointer.y * 0.5 + Math.sin(t * 0.32) * 0.12, 4, delta)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, 0.8, 4, delta)
    lookTarget.lerp({ x: tx, y: ty, z: tz }, 1 - Math.pow(0.001, delta))
    state.camera.lookAt(lookTarget)

    const idx = Math.max(0, Math.min(SCREENS.length - 1, Math.round(theta / STEP)))
    if (idx !== focusRef.current) {
      focusRef.current = idx
      const s = SCREENS[idx]
      const t = document.getElementById('cap-title')
      const m = document.getElementById('cap-meta')
      const c = document.getElementById('cap-count')
      if (t) t.textContent = s.title
      if (m) m.textContent = s.tag
      if (c) c.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(SCREENS.length).padStart(2, '0')}`
    }

    const fps = 24
    const f = Math.floor(scroll.offset * fps * 150)
    const pad = (n) => String(n).padStart(2, '0')
    const tc = document.getElementById('tc')
    if (tc) tc.textContent = `${pad(Math.floor(f / fps / 3600))}:${pad(Math.floor(f / fps / 60) % 60)}:${pad(Math.floor(f / fps) % 60)}:${pad(f % fps)}`
    const ph = document.getElementById('playhead')
    if (ph) ph.style.left = `${scroll.offset * 100}%`
  })

  return (
    <>
      <color attach="background" args={['#070709']} />
      <fog attach="fog" args={['#070709', 12, 30]} />

      <ambientLight intensity={0.4} />
      <spotLight position={[0, 9, 0]} angle={0.7} penumbra={1} intensity={50} color="#fff" />
      <pointLight position={[-7, 2, 4]} intensity={28} color="#ff5a36" />
      <pointLight position={[7, 2, 4]} intensity={28} color="#3a7bff" />

      {SCREENS.map((s, i) => (
        <Screen key={i} data={s} theta={i * STEP} index={i} />
      ))}

      <Blobs />
      <Sparkles count={220} scale={[26, 12, 26]} position={[0, 0, 0]} size={2} speed={0.3} color="#ffffff" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
        <circleGeometry args={[26, 64]} />
        <MeshReflectorMaterial
          blur={[300, 80]} resolution={1024} mixBlur={1} mixStrength={45}
          roughness={0.9} depthScale={1.1} minDepthThreshold={0.4} maxDepthThreshold={1.2}
          color="#0a0a0d" metalness={0.6}
        />
      </mesh>

      <Environment preset="night" />

      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur intensity={0.85} luminanceThreshold={0.28} luminanceSmoothing={0.35} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0009, 0.0012]} />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.32} />
        <Vignette eskil={false} offset={0.2} darkness={0.95} />
      </EffectComposer>
    </>
  )
}
