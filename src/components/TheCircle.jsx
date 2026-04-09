import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import Avatar from './Avatar'
import { CHARACTERS, AFIA, CIRCLE_RADIUS } from '../data/characters'

// Converts degrees → radians
const deg2rad = d => (d * Math.PI) / 180

// ── Single Character in the circle ───────────────────────────
function CircleMember({ char, isRevealed, isClapping, isTalkingTo, onHover, onHoverOut, onClick }) {
  const groupRef = useRef()
  const angleRad = deg2rad(char.angle)
  const x = Math.sin(angleRad) * CIRCLE_RADIUS
  const z = Math.cos(angleRad) * CIRCLE_RADIUS

  // Face toward center (Afia)
  const lookAngle = Math.atan2(x, z) + Math.PI

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    if (isTalkingTo) {
      // Lean slightly forward when clicked
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 2) * 0.04
    }
  })

  if (!isRevealed) return null

  return (
    <group
      ref={groupRef}
      position={[x, 0.06, z]}
      rotation={[0, lookAngle, 0]}
    >
      <Avatar
        {...char}
        isClapping={isClapping}
        phase={char.angle / 60}  // different idle phase per character
        onClick={() => onClick(char)}
        onPointerOver={() => onHover(char)}
        onPointerOut={onHoverOut}
      />
    </group>
  )
}

// ── Afia beside the cake ─────────────────────────────────────
function AfiaCenter({ isRevealed, isClapping }) {
  if (!isRevealed) return null
  return (
    <group position={[-1.2, 0.06, 0]} rotation={[0, Math.PI / 2, 0]}>
      <Avatar
        {...AFIA}
        isBirthdayGirl
        isClapping={isClapping}
        phase={0}
      />
    </group>
  )
}

// ── The full Circle ───────────────────────────────────────────
export default function TheCircle({
  revealedCount,   // 0–8: how many members have appeared so far
  isClapping,
  onCharacterHover,
  onCharacterHoverOut,
  onCharacterClick,
  showAfia,
}) {
  return (
    <group>
      <AfiaCenter isRevealed={showAfia} isClapping={isClapping} />
      {CHARACTERS.map((char, i) => (
        <CircleMember
          key={char.id}
          char={char}
          isRevealed={i < revealedCount}
          isClapping={isClapping}
          isTalkingTo={false}
          onHover={onCharacterHover}
          onHoverOut={onCharacterHoverOut}
          onClick={onCharacterClick}
        />
      ))}
    </group>
  )
}
