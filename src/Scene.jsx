import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture, MeshReflectorMaterial, Environment, Sparkles, Text, SpotLight } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { SCREENS } from './data.jsx'

/*
 * The whole site is one continuous camera move:
 *   hero    → wide shot looking down a dark soundstage corridor
 *   work    → dolly/tracking shot past the projects, a follow-spot lighting each one
 *   outro   → crane up + pull back to a high overview while the DOM panels take over
 *
 * `work` and `outro` are Framer Motion scroll progress values (0→1), read per frame.
 */

const N = SCREENS.length
const SPACING = 7.4
const SCREEN_W = 4.9
const SCREEN_H = SCREEN_W / (16 / 9)
const SCREEN_Y = 1.85
const X_OFF = 2.55
const YAW = 0.42
const END_Z = -(N - 1) * SPACING

const sideOf = (i) => (i % 2 === 0 ? -1 : 1)
const posOf = (i) => [sideOf(i) * X_OFF, SCREEN_Y, -i * SPACING]

/* screen position for a fractional index k (the camera's current focus point) */
function focusAt(k, out) {
  const i0 = Math.max(0, Math.min(N - 1, Math.floor(k)))
  const i1 = Math.min(N - 1, i0 + 1)
  const f = Math.min(1, Math.max(0, k - i0))
  const a = posOf(i0)
  const b = posOf(i1)
  out.set(a[0] + (b[0] - a[0]) * f, SCREEN_Y, a[2] + (b[2] - a[2]) * f)
  return out
}

function Screen({ data, index, work, onJump }) {
  const group = useRef()
  const bezel = useRef()
  const play = useRef()
  const [hovered, setHovered] = useState(false)
  const texture = useTexture(data.thumb)
  texture.colorSpace = THREE.SRGBColorSpace
  const [px, py, pz] = posOf(index)
  const accent = useMemo(() => new THREE.Color('#ff5c38'), [])
  const dark = useMemo(() => new THREE.Color('#141416'), [])

  useFrame((_, delta) => {
    const k = work.get() * (N - 1)
    const focus = Math.max(0, 1 - Math.abs(k - index))
    const lift = Math.max(focus, hovered ? 1 : 0)
    const s = THREE.MathUtils.damp(group.current.scale.x, 1 + lift * 0.05, 6, delta)
    group.current.scale.setScalar(s)
    bezel.current.color.lerpColors(dark, accent, Math.min(1, lift))
    const ps = THREE.MathUtils.damp(play.current.scale.x, lift > 0.5 ? 1 : 0.0001, 8, delta)
    play.current.scale.setScalar(ps)
  })

  return (
    <group
      ref={group}
      position={[px, py, pz]}
      rotation={[0, sideOf(index) * -YAW, 0]}
      onClick={(e) => {
        e.stopPropagation()
        const k = work.get() * (N - 1)
        if (Math.abs(k - index) < 0.5) window.open(data.link, '_blank', 'noopener')
        else onJump(index)
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    >
      {/* housing */}
      <mesh position={[0, 0, -0.07]}>
        <boxGeometry args={[SCREEN_W + 0.18, SCREEN_H + 0.18, 0.1]} />
        <meshStandardMaterial color="#101013" metalness={0.85} roughness={0.4} />
      </mesh>
      {/* bezel that catches the accent colour when this screen is focused */}
      <mesh position={[0, 0, -0.045]}>
        <planeGeometry args={[SCREEN_W + 0.07, SCREEN_H + 0.07]} />
        <meshBasicMaterial ref={bezel} toneMapped={false} />
      </mesh>
      {/* the still */}
      <mesh>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* play badge — appears when focused or hovered */}
      <group ref={play} position={[0, 0, 0.05]} scale={0.0001}>
        <mesh>
          <circleGeometry args={[0.4, 48]} />
          <meshBasicMaterial color="#0a0a0c" transparent opacity={0.7} toneMapped={false} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.37, 0.41, 48]} />
          <meshBasicMaterial color="#ff5c38" toneMapped={false} />
        </mesh>
        <mesh position={[0.05, 0, 0.02]} rotation={[0, 0, -Math.PI / 2]}>
          <circleGeometry args={[0.16, 3]} />
          <meshBasicMaterial color="#f4f1ea" toneMapped={false} />
        </mesh>
      </group>
      {/* slate line under the screen */}
      <Text
        position={[-SCREEN_W / 2 + 0.04, -SCREEN_H / 2 - 0.32, 0]}
        fontSize={0.2}
        anchorX="left"
        anchorY="middle"
        letterSpacing={0.18}
        color="#8b877e"
      >
        {`${String(index + 1).padStart(2, '0')} — ${data.tag.toUpperCase()}`}
      </Text>
    </group>
  )
}

/* a theatrical follow-spot that glides from screen to screen with the dolly */
function FollowSpot({ work }) {
  const light = useRef()
  const target = useMemo(() => new THREE.Object3D(), [])
  const { scene } = useThree()
  const focus = useMemo(() => new THREE.Vector3(0, SCREEN_Y, 0), [])

  useEffect(() => {
    scene.add(target)
    return () => scene.remove(target)
  }, [scene, target])

  useFrame((_, delta) => {
    focusAt(work.get() * (N - 1), focus)
    const l = light.current
    if (!l) return
    l.position.x = THREE.MathUtils.damp(l.position.x, focus.x, 5, delta)
    l.position.z = THREE.MathUtils.damp(l.position.z, focus.z + 0.7, 5, delta)
    l.position.y = 5.9
    target.position.set(focus.x, SCREEN_Y - 0.5, focus.z)
    l.target = target
  })

  return (
    <SpotLight
      ref={light}
      position={[-X_OFF, 5.9, 0.7]}
      distance={8}
      angle={0.48}
      attenuation={5.5}
      anglePower={4}
      intensity={3}
      color="#ffd9b0"
    />
  )
}

export default function Scene({ work, outro, onJump }) {
  const lookTarget = useMemo(() => new THREE.Vector3(0, SCREEN_Y, -10), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const corridorFar = useMemo(() => new THREE.Vector3(0, SCREEN_Y - 0.2, -22), [])
  const overview = useMemo(() => new THREE.Vector3(0, 1.6, END_Z - 8), [])
  const keyA = useRef()
  const keyB = useRef()
  const drift = useMemo(
    () => (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1),
    [],
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const q = work.get()
    const r = outro.get()
    const k = q * (N - 1)

    /* camera: dolly along the corridor, then crane up + retreat for the outro,
       staying on the front side of the screens so the set stays visible */
    const cx = (state.pointer.x * 0.45 + Math.sin(t * 0.22) * 0.16) * drift * (1 - r)
    const cy = 1.7 + r * 5.2
    const cz = 6.8 - k * SPACING + r * 16

    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, cx, 4, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, cy, 4, delta)
    state.camera.position.z = THREE.MathUtils.damp(state.camera.position.z, cz, 4, delta)

    /* look target: down the corridor at the top, at the focused screen while working,
       back across the whole set during the outro */
    focusAt(k, tmp)
    const heroBlend = Math.min(1, q * 8)
    tmp.lerp(corridorFar, 1 - heroBlend)
    tmp.lerp(overview, Math.min(1, r * 1.4))
    lookTarget.lerp(tmp, 1 - Math.pow(0.001, delta))
    state.camera.lookAt(lookTarget)

    /* practicals travel with the camera so the set stays lit either side */
    if (keyA.current) keyA.current.position.set(-5.5, 3.2, state.camera.position.z - 5)
    if (keyB.current) keyB.current.position.set(5.5, 3.4, state.camera.position.z - 7.5)
  })

  return (
    <>
      <color attach="background" args={['#050506']} />
      <fog attach="fog" args={['#050506', 10, 38]} />

      <ambientLight intensity={0.35} />
      <pointLight ref={keyA} intensity={26} distance={26} color="#ff5c38" />
      <pointLight ref={keyB} intensity={22} distance={26} color="#5b8cff" />

      {SCREENS.map((s, i) => (
        <Screen key={i} data={s} index={i} work={work} onJump={onJump} />
      ))}

      <FollowSpot work={work} />

      {/* dust hanging in the projector light */}
      <Sparkles
        count={260}
        scale={[12, 7, N * SPACING + 18]}
        position={[0, 2.6, END_Z / 2]}
        size={1.6}
        speed={0.25}
        color="#ffd9b0"
      />

      {/* the end of the corridor */}
      <group position={[0, 2.3, END_Z - 11]}>
        <Text fontSize={2.6} letterSpacing={0.06} color="#f4f1ea" anchorX="center" anchorY="middle">
          REEL 2026
        </Text>
        <Text position={[0, -1.9, 0]} fontSize={0.34} letterSpacing={0.42} color="#8b877e" anchorX="center" anchorY="middle">
          MEET SARVAIYA — EDITOR
        </Text>
      </group>

      {/* polished soundstage floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, END_Z / 2]}>
        <planeGeometry args={[34, N * SPACING + 46]} />
        <MeshReflectorMaterial
          blur={[300, 80]}
          resolution={1024}
          mixBlur={1}
          mixStrength={38}
          roughness={0.85}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.25}
          color="#08080a"
          metalness={0.55}
        />
      </mesh>

      <Environment preset="night" />

      <EffectComposer disableNormalPass>
        <Bloom mipmapBlur intensity={0.75} luminanceThreshold={0.3} luminanceSmoothing={0.35} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0007, 0.001]} />
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.3} />
        <Vignette eskil={false} offset={0.22} darkness={0.92} />
      </EffectComposer>
    </>
  )
}
