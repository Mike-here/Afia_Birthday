import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ============================================================
// Avatar — procedural character from config props
// isMuscular: wider torso/arms
// isSlim: narrower torso
// isFemale: slightly different proportions, skirt mesh
// hasBeard: small box under chin
// hasMoustache: thin box above lip
// hasCap: flat cylinder on head
// hasLongBraids: long cylinder hair
// hasCurlyWig: sphere-based afro wig
// ============================================================

export default function Avatar({
  skinTone = '#5C3317',
  hairColor = '#1a0a00',
  outfitColor = '#1a3a5c',
  isMuscular = false,
  isSlim = false,
  isFemale = false,
  hasBeard = false,
  hasMoustache = false,
  hasCap = false,
  hasLongBraids = false,
  hasCurlyWig = false,
  isBirthdayGirl = false,
  isClapping = false,
  phase = 0,         // idle animation phase offset (each char different)
  onClick,
  onPointerOver,
  onPointerOut,
}) {
  const groupRef = useRef()
  const headRef = useRef()
  const leftArmRef = useRef()
  const rightArmRef = useRef()

  const skin = useMemo(() => new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.8 }), [skinTone])
  const hair = useMemo(() => new THREE.MeshStandardMaterial({ color: hairColor, roughness: 1 }), [hairColor])
  const outfit = useMemo(() => new THREE.MeshStandardMaterial({ color: outfitColor, roughness: 0.6, metalness: 0.1 }), [outfitColor])
  const white = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff' }), [])
  const dark  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#111111' }), [])
  const blush = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ff9bb5', emissive: '#ff8aa5', emissiveIntensity: 0.35, roughness: 0.9 }), [])
  const mouthMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#9b244a', emissive: '#ff7b9a', emissiveIntensity: 0.2, roughness: 0.7 }), [])
  const gold  = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffd700', emissive: '#ffaa00', emissiveIntensity: 0.4 }), [])

  const torsoW = isMuscular ? 0.52 : isSlim ? 0.3 : 0.38
  const torsoH = 0.6
  const torsoD = isMuscular ? 0.32 : 0.22
  const armW   = isMuscular ? 0.14 : 0.1
  const armH   = 0.45
  const legW   = isSlim ? 0.1 : 0.13

  useFrame((state) => {
    const t = state.clock.getElapsedTime() + phase
    if (groupRef.current) {
      const bodyBounce = Math.sin(t * 1.3) * 0.03
      const energy = isClapping ? 1.3 : 0.9
      groupRef.current.position.y = 0.03 + bodyBounce * energy
      groupRef.current.rotation.y = Math.sin(t * 0.45) * 0.05
    }
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.09
      headRef.current.rotation.x = isClapping ? Math.sin(t * 0.7) * 0.02 : 0
    }
    const wave = Math.sin(t * 6)
    const sway = Math.cos(t * 2) * 0.08
    if (isClapping) {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = wave * 0.35 + 0.45
        leftArmRef.current.rotation.x = isBirthdayGirl ? -0.35 + sway : -0.2 + sway
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -wave * 0.35 - 0.45
        rightArmRef.current.rotation.x = isBirthdayGirl ? -0.35 + sway : -0.2 + sway
      }
    } else {
      if (leftArmRef.current) {
        leftArmRef.current.rotation.z = Math.sin(t * 0.8) * 0.08 + 0.28
        leftArmRef.current.rotation.x = -0.05
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.z = -Math.sin(t * 0.8) * 0.08 - 0.28
        rightArmRef.current.rotation.x = -0.05
      }
    }
  })

  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* ── LEGS ── */}
      <mesh position={[-0.1, 0.18, 0]} material={outfit}>
        <boxGeometry args={[legW, 0.42, legW]} />
      </mesh>
      <mesh position={[0.1, 0.18, 0]} material={outfit}>
        <boxGeometry args={[legW, 0.42, legW]} />
      </mesh>

      {/* ── FEET ── */}
      <mesh position={[-0.1, -0.02, 0.04]} material={dark}>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
      </mesh>
      <mesh position={[0.1, -0.02, 0.04]} material={dark}>
        <boxGeometry args={[0.12, 0.08, 0.2]} />
      </mesh>

      {/* ── TORSO ── */}
      <mesh position={[0, 0.66, 0]} material={outfit}>
        <boxGeometry args={[torsoW, torsoH, torsoD]} />
      </mesh>

      {/* Female: skirt overlay */}
      {isFemale && (
        <mesh position={[0, 0.42, 0]} material={outfit}>
          <cylinderGeometry args={[0.24, 0.32, 0.28, 8]} />
        </mesh>
      )}

      {/* Muscular: pec detail */}
      {isMuscular && (
        <>
          <mesh position={[-0.12, 0.75, 0.14]} material={outfit}>
            <sphereGeometry args={[0.1, 6, 6]} />
          </mesh>
          <mesh position={[0.12, 0.75, 0.14]} material={outfit}>
            <sphereGeometry args={[0.1, 6, 6]} />
          </mesh>
        </>
      )}

      {/* ── ARMS ── */}
      <group ref={leftArmRef} position={[-torsoW / 2 - armW / 2 - 0.02, 0.72, 0]}>
        <mesh material={skin}>
          <boxGeometry args={[armW, armH, armW]} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -armH / 2 - 0.06, 0]} material={skin}>
          <sphereGeometry args={[0.07, 6, 6]} />
        </mesh>
      </group>
      <group ref={rightArmRef} position={[torsoW / 2 + armW / 2 + 0.02, 0.72, 0]}>
        <mesh material={skin}>
          <boxGeometry args={[armW, armH, armW]} />
        </mesh>
        <mesh position={[0, -armH / 2 - 0.06, 0]} material={skin}>
          <sphereGeometry args={[0.07, 6, 6]} />
        </mesh>
      </group>

      {/* ── NECK ── */}
      <mesh position={[0, 1.0, 0]} material={skin}>
        <cylinderGeometry args={[0.08, 0.09, 0.18, 8]} />
      </mesh>

      {/* ── HEAD ── */}
      <group ref={headRef} position={[0, 1.25, 0]}>
        <mesh material={skin}>
          <boxGeometry args={[0.36, 0.38, 0.3]} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.04, 0.152]} material={white}>
          <sphereGeometry args={[0.055, 8, 8]} />
        </mesh>
        <mesh position={[0.1, 0.04, 0.152]} material={white}>
          <sphereGeometry args={[0.055, 8, 8]} />
        </mesh>
        <mesh position={[-0.1, 0.03, 0.192]} material={dark}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
        <mesh position={[0.1, 0.03, 0.192]} material={dark}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
        <mesh position={[-0.07, 0.08, 0.186]} material={white}>
          <sphereGeometry args={[0.01, 6, 6]} />
        </mesh>
        <mesh position={[0.13, 0.08, 0.186]} material={white}>
          <sphereGeometry args={[0.01, 6, 6]} />
        </mesh>

        {/* Cheerful smile */}
        <mesh position={[0, -0.06, 0.152]} material={mouthMat} rotation={[0, 0, 0]}>
          <torusGeometry args={[0.085, 0.015, 8, 18, Math.PI]} />
        </mesh>

        {/* Blush cheeks */}
        <mesh position={[-0.16, -0.03, 0.146]} material={blush}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>
        <mesh position={[0.16, -0.03, 0.146]} material={blush}>
          <sphereGeometry args={[0.04, 8, 8]} />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.19, 0.02, 0]} material={skin}>
          <sphereGeometry args={[0.055, 6, 6]} />
        </mesh>
        <mesh position={[0.19, 0.02, 0]} material={skin}>
          <sphereGeometry args={[0.055, 6, 6]} />
        </mesh>

        {/* ── HAIR / HEAD ACCESSORIES ── */}

        {/* Default short hair */}
        {!hasCap && !hasLongBraids && !hasCurlyWig && (
          <mesh position={[0, 0.18, -0.02]} material={hair}>
            <boxGeometry args={[0.38, 0.12, 0.32]} />
          </mesh>
        )}

        {/* Moustache */}
        {hasMoustache && (
          <mesh position={[0, -0.03, 0.156]} material={hair}>
            <boxGeometry args={[0.14, 0.035, 0.02]} />
          </mesh>
        )}

        {/* Beard */}
        {hasBeard && (
          <mesh position={[0, -0.13, 0.14]} material={hair}>
            <boxGeometry args={[0.22, 0.1, 0.06]} />
          </mesh>
        )}

        {/* Cap */}
        {hasCap && (
          <>
            <mesh position={[0, 0.22, 0]} material={dark}>
              <cylinderGeometry args={[0.22, 0.22, 0.08, 10]} />
            </mesh>
            {/* Brim */}
            <mesh position={[0, 0.16, 0.12]} material={dark} rotation={[0.2, 0, 0]}>
              <boxGeometry args={[0.36, 0.04, 0.22]} />
            </mesh>
          </>
        )}

        {/* Long Braids (Elizabeth) */}
        {hasLongBraids && (
          <>
            {[-0.14, -0.05, 0.05, 0.14].map((x, i) => (
              <mesh key={i} position={[x, -0.28, -0.02]} material={hair}>
                <cylinderGeometry args={[0.025, 0.015, 0.55, 6]} />
              </mesh>
            ))}
            <mesh position={[0, 0.18, -0.02]} material={hair}>
              <boxGeometry args={[0.38, 0.12, 0.32]} />
            </mesh>
          </>
        )}

        {/* Curly Afro Wig (Afia) */}
        {hasCurlyWig && (
          <>
            <mesh position={[0, 0.28, 0]} material={hair}>
              <sphereGeometry args={[0.26, 10, 10]} />
            </mesh>
            <mesh position={[-0.18, 0.12, 0]} material={hair}>
              <sphereGeometry args={[0.14, 8, 8]} />
            </mesh>
            <mesh position={[0.18, 0.12, 0]} material={hair}>
              <sphereGeometry args={[0.14, 8, 8]} />
            </mesh>
          </>
        )}

        {/* Birthday crown for Afia */}
        {isBirthdayGirl && (
          <group position={[0, 0.46, 0]}>
            {[-0.12, 0, 0.12].map((x, i) => (
              <mesh key={i} position={[x, i === 1 ? 0.06 : 0, 0]} material={gold}>
                <coneGeometry args={[0.04, 0.14, 5]} />
              </mesh>
            ))}
            <mesh material={gold}>
              <boxGeometry args={[0.38, 0.06, 0.06]} />
            </mesh>
          </group>
        )}
      </group>
    </group>
  )
}
