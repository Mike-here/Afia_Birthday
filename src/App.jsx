import { useRef, useState, useEffect, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'
import * as THREE from 'three'

import UI from './components/UI'
import { Room, BirthdayCake, Balloons, ConfettiParticles, WallDecor } from './components/Scene'
import TheCircle from './components/TheCircle'

// ── Camera animator (lives inside Canvas) ─────────────────────
function CameraController({ step }) {
  const { camera } = useThree()
  const hasAnimated = useRef({})

  useEffect(() => {
    if (hasAnimated.current[step]) return
    hasAnimated.current[step] = true

    if (step === 'reveal') {
      // Start far → zoom in
      camera.position.set(0, 14, 22)
      camera.lookAt(0, 1, 0)
      gsap.to(camera.position, {
        x: 0, y: 6, z: 13,
        duration: 2.4, ease: 'power3.inOut',
      })
    }
    if (step === 'singing') {
      gsap.to(camera.position, {
        x: 0, y: 4.5, z: 10,
        duration: 1.8, ease: 'power2.inOut',
      })
    }
    if (step === 'candles') {
      gsap.to(camera.position, {
        x: 0, y: 3, z: 7,
        duration: 1.6, ease: 'power2.inOut',
      })
    }
    if (step === 'celebration') {
      gsap.to(camera.position, {
        x: 2, y: 5, z: 11,
        duration: 1.4, ease: 'power2.inOut',
      })
    }
  }, [step, camera])

  return null
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  // State machine: landing → reveal → singing → candles → celebration
  const [step, setStep] = useState('landing')
  const [revealedCount, setRevealedCount] = useState(0)
  const [showAfia, setShowAfia] = useState(false)
  const [isClapping, setIsClapping] = useState(false)
  const [candlesLit, setCandlesLit] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [lyricsIndex, setLyricsIndex] = useState(0)

  // UI state
  const [hoveredChar, setHoveredChar] = useState(null)
  const [clickedChar, setClickedChar] = useState(null)
  const [collectedIds, setCollectedIds] = useState([])

  // ── Audio refs
  // SWAP IN YOUR OWN AUDIO FILES HERE ↓
  // Place files in /public/ folder and update these paths:
  const bgMusicRef = useRef(null)
  const cheerRef = useRef(null)

  const initAudio = useCallback(() => {
    if (!bgMusicRef.current) {
      bgMusicRef.current = new Audio('/audio/happy-birthday.mp3')
      bgMusicRef.current.loop = true
      bgMusicRef.current.volume = 0.4
    }
  }, [])

  // ── Step: START ─────────────────────────────────────────────
  const handleStart = useCallback(() => {
    setStep('reveal')
    initAudio()

    // Reveal characters one by one (stagger)
    let count = 0
    setShowAfia(true)
    const interval = setInterval(() => {
      count++
      setRevealedCount(count)
      if (count >= 8) {
        clearInterval(interval)
        // Move to singing after a pause
        setTimeout(() => setStep('singing'), 1200)
      }
    }, 350)
  }, [initAudio])

  // ── Step: REVEAL ────────────────────────────────────────────
  useEffect(() => {
    if (step !== 'reveal') return
    // Start music when reveal begins
    if (bgMusicRef.current) {
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.play().catch(() => {})
    }
  }, [step])

  // ── Step: SINGING ───────────────────────────────────────────
  useEffect(() => {
    if (step !== 'singing') return
    setIsClapping(true)

    // Try to play music (may be blocked without user gesture on some browsers)
    bgMusicRef.current?.play().catch(() => {})

    // Cycle lyrics
    let idx = 0
    setLyricsIndex(0)
    const lyricsInterval = setInterval(() => {
      idx++
      setLyricsIndex(idx)
      if (idx >= 4) {
        clearInterval(lyricsInterval)
        setTimeout(() => setStep('candles'), 1500)
      }
    }, 2200)
    return () => clearInterval(lyricsInterval)
  }, [step])

  // ── Step: BLOW CANDLES ──────────────────────────────────────
  const handleBlowCandles = useCallback(() => {
    setCandlesLit(false)
    setStep('celebration')

    // Browser confetti burst
    const duration = 4000
    const end = Date.now() + duration
    const frame = () => {
      confetti({ particleCount: 6, angle: 60,  spread: 55, origin: { x: 0 }, colors: ['#ff6bbd','#ffd700','#00e5ff'] })
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff6bbd','#a855f7','#ffd700'] })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()

    setShowConfetti(true)

    // REPLACE THIS with your group audio file in /public/:
    // const cheer = new Audio('/the_circle_shoutout.mp3')
    // cheer.play()
  }, [])

  // ── Step: CELEBRATION ──────────────────────────────────────
  useEffect(() => {
    if (step !== 'celebration') return
    // Stop music after confetti finishes (4 seconds)
    setTimeout(() => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause()
        bgMusicRef.current.currentTime = 0
      }
    }, 4000)
  }, [step])
  const handleCharacterClick = useCallback((char) => {
    setClickedChar(char)
    setCollectedIds(prev => prev.includes(char.id) ? prev : [...prev, char.id])
  }, [])

  const handleClosePopup = useCallback(() => setClickedChar(null), [])

  const handleHover = useCallback((char) => {
    setHoveredChar(char)
    document.body.style.cursor = 'pointer'
  }, [])

  const handleHoverOut = useCallback(() => {
    setHoveredChar(null)
    document.body.style.cursor = 'default'
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#08000f', position: 'relative' }}>

      {/* ── 3D CANVAS — scene logic only ── */}
      <Canvas
        shadows
        camera={{ position: [0, 14, 22], fov: 55, near: 0.1, far: 100 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Camera transition controller */}
        <CameraController step={step} />

        {/* Orbit controls — mouse drag to rotate */}
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 1.5, 0]}
        />

        {/* ── COMPREHENSIVE BRIGHT LIGHTING SETUP ── */}

        {/* ── MODERN BLUE THEME LIGHTING ── */}

        {/* Cool blue-tinted ambient light for modern environment */}
        <ambientLight intensity={step === 'landing' ? 0 : 1.25} color="#e8f4f8" />

        {/* Soft hemisphere light with blue sky, blue-lit ground */}
        <hemisphereLight
          skyColor="#b3d9f2"
          groundColor="#2E8BC0"
          intensity={step === 'landing' ? 0 : 0.65}
        />

        {/* Main warm directional light balanced against cool blue */}
        <directionalLight
          position={[0, 8, 3]}
          intensity={step === 'landing' ? 0 : 1.2}
          color="#fff5e6"
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-5}
          castShadow
        />

        {/* Warm spotlight on Afia and cake (birthday focus) */}
        <spotLight
          position={[0, 6, 6]}
          target-position={[0, 0.5, 0]}
          angle={0.6}
          penumbra={0.7}
          intensity={step === 'landing' ? 0 : 0.95}
          color="#fff9ed"
          distance={16}
          castShadow
        />

        {/* Soft fill lights to prevent dark shadows */}
        {/* Front-left fill (warm) */}
        <pointLight position={[-4, 3.5, 8]} intensity={0.4} color="#fff0e0" distance={14} />
        {/* Front-right fill (warm) */}
        <pointLight position={[4, 3.5, 8]} intensity={0.4} color="#fff0e0" distance={14} />
        {/* Back-left fill (cool) */}
        <pointLight position={[-5, 2, -5]} intensity={0.25} color="#d6e8f7" distance={12} />
        {/* Back-right fill (cool) */}
        <pointLight position={[5, 2, -5]} intensity={0.25} color="#d6e8f7" distance={12} />

        {/* Floor ambient accent (subtle blue glow) */}
        <pointLight position={[0, 1.5, 0]} intensity={0.35} color="#a8d8ed" distance={10} />

        {/* LED strip accent lights (bright cyan/blue) */}
        <pointLight position={[-7, 1, 0]} intensity={0.5} color="#00d4ff" distance={8} />
        <pointLight position={[7, 1, 0]} intensity={0.5} color="#1e90ff" distance={8} />
        <pointLight position={[0, 1, -6.5]} intensity={0.3} color="#00bfff" distance={8} />

        {/* Accent decorative lights (colorful balloons) */}
        <pointLight position={[-6, 5, -5]} intensity={0.3} color="#9b59b6" />
        <pointLight position={[6, 5, -5]}  intensity={0.3} color="#ff6b9d" />
        <pointLight position={[0, 3.5, 6]}   intensity={0.25} color="#ff8c94" />

        {/* Scene geometry */}
        {step !== 'landing' && (
          <>
            <Room />
            <Balloons />
            <WallDecor />
            <BirthdayCake
              candlesLit={candlesLit}
              onCakeClick={step === 'candles' ? handleBlowCandles : undefined}
            />
            <ConfettiParticles active={showConfetti} />
          </>
        )}

        {/* Characters */}
        <TheCircle
          revealedCount={revealedCount}
          isClapping={isClapping}
          showAfia={showAfia}
          onCharacterHover={handleHover}
          onCharacterHoverOut={handleHoverOut}
          onCharacterClick={handleCharacterClick}
        />
      </Canvas>

      {/* ── HTML/CSS UI OVERLAY — UI logic only ── */}
      <UI
        step={step}
        onStart={handleStart}
        hoveredChar={hoveredChar}
        clickedChar={clickedChar}
        onClosePopup={handleClosePopup}
        collectedIds={collectedIds}
        onBlowCandles={handleBlowCandles}
        lyricsIndex={lyricsIndex}
      />
    </div>
  )
}
