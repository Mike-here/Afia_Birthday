import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── BALLOON ───────────────────────────────────────────────────
function Balloon({ position, color, phase = 0 }) {
  const ref = useRef()
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() + phase
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 0.6) * 0.15
      ref.current.rotation.z = Math.sin(t * 0.4) * 0.06
    }
  })
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    color, roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.9,
  }), [color])
  const string = useMemo(() => new THREE.MeshStandardMaterial({ color: '#888', roughness: 1 }), [])
  return (
    <group ref={ref} position={position}>
      <mesh material={mat}>
        <sphereGeometry args={[0.28, 12, 12]} />
      </mesh>
      {/* String */}
      <mesh position={[0, -0.45, 0]} material={string}>
        <cylinderGeometry args={[0.007, 0.007, 0.6, 4]} />
      </mesh>
    </group>
  )
}

// ── CONFETTI PARTICLE SYSTEM ──────────────────────────────────
export function ConfettiParticles({ active }) {
  const ref = useRef()
  const count = 200

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const vel = []
    const col = new Float32Array(count * 3)
    const palette = ['#ff6b9d', '#ffd700', '#00e5ff', '#ff4500', '#7fff00', '#da70d6']
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = Math.random() * 8
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
      vel.push({ vy: -(Math.random() * 1 + 0.5), vx: (Math.random() - 0.5) * 0.5 })
      const c = new THREE.Color(palette[Math.floor(Math.random() * palette.length)])
      col[i * 3]     = c.r
      col[i * 3 + 1] = c.g
      col[i * 3 + 2] = c.b
    }
    return [pos, vel, col]
  }, [])

  useFrame((_, delta) => {
    if (!active || !ref.current) return
    const pos = ref.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      pos[i * 3]     += velocities[i].vx * delta
      pos[i * 3 + 1] += velocities[i].vy * delta
      pos[i * 3 + 2] += velocities[i].vx * delta * 0.5
      if (pos[i * 3 + 1] < -1) {
        pos[i * 3 + 1] = 7
        pos[i * 3]     = (Math.random() - 0.5) * 10
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  if (!active) return null
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors />
    </points>
  )
}

// ── CAKE ───────────────────────────────────────────────────────
export function BirthdayCake({ candlesLit, onCakeClick }) {
  const candleGlow = useRef()
  useFrame(({ clock }) => {
    if (candleGlow.current && candlesLit) {
      candleGlow.current.intensity = 2 + Math.sin(clock.getElapsedTime() * 8) * 0.5
    }
  })

  const cakeBase    = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8B4513', roughness: 0.7 }), [])
  const icing       = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fff5e6', roughness: 0.5 }), [])
  const pinkIcing   = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff9eb5', roughness: 0.5 }), [])
  const candleWax   = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffe44d' }), [])
  const candleWick  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#333', emissive: '#ff6600', emissiveIntensity: candlesLit ? 2 : 0 }), [candlesLit])
  const plate       = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8e8e8', metalness: 0.3, roughness: 0.2 }), [])

  return (
    <group onClick={onCakeClick} position={[0, 0.01, 0]}>
      {/* Plate */}
      <mesh position={[0, 0.04, 0]} material={plate}>
        <cylinderGeometry args={[0.9, 0.9, 0.06, 24]} />
      </mesh>

      {/* Bottom tier */}
      <mesh position={[0, 0.28, 0]} material={cakeBase}>
        <cylinderGeometry args={[0.72, 0.72, 0.42, 24]} />
      </mesh>
      <mesh position={[0, 0.5, 0]} material={icing}>
        <cylinderGeometry args={[0.73, 0.73, 0.05, 24]} />
      </mesh>

      {/* Pink stripe middle */}
      <mesh position={[0, 0.56, 0]} material={pinkIcing}>
        <cylinderGeometry args={[0.6, 0.6, 0.35, 24]} />
      </mesh>
      <mesh position={[0, 0.74, 0]} material={icing}>
        <cylinderGeometry args={[0.61, 0.61, 0.05, 24]} />
      </mesh>

      {/* Top tier */}
      <mesh position={[0, 0.93, 0]} material={cakeBase}>
        <cylinderGeometry args={[0.44, 0.44, 0.3, 24]} />
      </mesh>
      <mesh position={[0, 1.09, 0]} material={icing}>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 24]} />
      </mesh>

      {/* Candles */}
      {[-0.18, 0, 0.18].map((x, i) => (
        <group key={i} position={[x, 1.14, 0]}>
          <mesh material={candleWax}>
            <cylinderGeometry args={[0.04, 0.04, 0.2, 8]} />
          </mesh>
          {/* Wick/flame */}
          <mesh position={[0, 0.16, 0]} material={candleWick}>
            <sphereGeometry args={[0.03, 6, 6]} />
          </mesh>
          {candlesLit && (
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#ff9900" emissive="#ff6600" emissiveIntensity={3} transparent opacity={0.85} />
            </mesh>
          )}
        </group>
      ))}

      {/* Candle point light */}
      {candlesLit && (
        <pointLight ref={candleGlow} position={[0, 1.5, 0]} intensity={2.5} color="#ff9900" distance={4} />
      )}
    </group>
  )
}

// ── LED STRIP LIGHT ───────────────────────────────────────────
function LedStrip({ positions, color = '#00e5ff' }) {
  return positions.map((pos, i) => (
    <pointLight key={i} position={pos} color={color} intensity={0.4} distance={3} />
  ))
}

// ── ROOM ───────────────────────────────────────────────────────
export function Room() {
  const floorMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#2E8BC0',
    roughness: 0.30,
    metalness: 0.55,
  }), [])
  const wallMat  = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0d1b2a',
    roughness: 0.7,
    metalness: 0.05,
  }), [])
  const ceilMat  = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#0f1f2e',
    roughness: 0.75,
    metalness: 0.02,
  }), [])

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow material={floorMat}>
        <planeGeometry args={[20, 20]} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 4, -7]} receiveShadow material={wallMat}>
        <planeGeometry args={[20, 10]} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-8, 4, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={wallMat}>
        <planeGeometry args={[14, 10]} />
      </mesh>
      {/* Right wall */}
      <mesh position={[8, 4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={wallMat}>
        <planeGeometry args={[14, 10]} />
      </mesh>
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 8, 0]} material={ceilMat}>
        <planeGeometry args={[20, 14]} />
      </mesh>

      {/* LED strips along floor edges (modern blue/cyan accent) */}
      <LedStrip color="#00d4ff" positions={[[-6, 0.5, -6], [-6, 0.5, 0], [-6, 0.5, 4]]} />
      <LedStrip color="#1e90ff" positions={[[6, 0.5, -6],  [6, 0.5, 0],  [6, 0.5, 4]]} />
      <LedStrip color="#00bfff" positions={[[-3, 0.3, -6.5], [0, 0.3, -6.5], [3, 0.3, -6.5]]} />
    </>
  )
}

// ── BALLOONS ──────────────────────────────────────────────────
export function Balloons() {
  const configs = [
    { pos: [-5.5, 3.8, -4], color: '#ff6b9d', phase: 0 },
    { pos: [-4.5, 4.4, -4.5], color: '#ffd700', phase: 1 },
    { pos: [5.5,  3.8, -4], color: '#7fff00', phase: 2 },
    { pos: [4.5,  4.4, -4.5], color: '#00e5ff', phase: 3 },
    { pos: [-6,   3.5, 1],  color: '#da70d6', phase: 0.5 },
    { pos: [6,    3.5, 1],  color: '#ff4500', phase: 1.5 },
    { pos: [0,    4.6, -6.5], color: '#ff6b9d', phase: 2.5 },
    { pos: [-2,   4.2, -6.5], color: '#ffd700', phase: 1.2 },
    { pos: [2,    4.2, -6.5], color: '#00e5ff', phase: 0.8 },
  ]
  return <>{configs.map((c, i) => <Balloon key={i} position={c.pos} color={c.color} phase={c.phase} />)}</>
}

// ── HAPPY BIRTHDAY WALL TEXT (3D) ─────────────────────────────
export function WallDecor() {
  // Simple glowing blocks spelling HB on wall — readable text is done in HTML overlay
  const glowMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ff6b9d', emissive: '#ff1a8c', emissiveIntensity: 0.8, roughness: 0.3,
  }), [])

  const starPositions = [
    [-5, 6, -6.8], [5, 6, -6.8], [0, 7, -6.8],
    [-3, 5.5, -6.8], [3, 5.5, -6.8],
  ]

  return (
    <>
      {/* Stars on back wall */}
      {starPositions.map((pos, i) => (
        <mesh key={i} position={pos} material={glowMat} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.15, 0.15, 0.05]} />
        </mesh>
      ))}
      {/* Decorative garland dots */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = -5.5 + i * 1
        const y = 4.8 + Math.sin(i * 0.8) * 0.3
        const col = ['#ff6b9d', '#ffd700', '#00e5ff'][i % 3]
        return (
          <mesh key={i} position={[x, y, -6.7]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color={col} emissive={col} emissiveIntensity={1} />
          </mesh>
        )
      })}
    </>
  )
}
