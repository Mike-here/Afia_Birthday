import { useState, useEffect } from 'react'

// ── Styles injected as a style tag ────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  .ui-root {
    position: fixed; inset: 0;
    pointer-events: none;
    z-index: 10;
    font-family: 'DM Sans', sans-serif;
  }
  .ui-root * { box-sizing: border-box; }

  /* ── LANDING SCREEN ── */
  .landing {
    position: absolute; inset: 0;
    background: #08000f;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    gap: 2rem;
    pointer-events: all;
    transition: opacity 1s ease;
  }
  .landing.fade-out { opacity: 0; pointer-events: none; }

  .landing-sparkles {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 50% 60%, rgba(180,50,255,0.18) 0%, transparent 70%);
    pointer-events: none;
  }

  .landing-subtitle {
    font-size: 0.95rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.4);
    font-weight: 300;
    animation: fadeUp 1.6s ease forwards;
    opacity: 0;
  }
  .landing-title {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(2.2rem, 6vw, 4.8rem);
    color: #fff;
    text-align: center;
    line-height: 1.2;
    text-shadow: 0 0 40px rgba(255,100,200,0.7), 0 0 80px rgba(150,50,255,0.4);
    animation: fadeUp 1.6s 0.4s ease forwards;
    opacity: 0;
  }
  .landing-title span { color: #ff6bbd; }

  .landing-hint {
    font-size: 0.85rem;
    letter-spacing: 0.2em;
    color: rgba(255,255,255,0.3);
    animation: pulse 2s infinite, fadeUp 1.6s 1.2s ease forwards;
    opacity: 0;
  }

  .start-btn {
    margin-top: 0.5rem;
    padding: 0.9rem 3rem;
    background: linear-gradient(135deg, #ff6bbd, #a855f7);
    border: none; border-radius: 50px;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    animation: fadeUp 1.6s 0.8s ease forwards;
    opacity: 0;
    box-shadow: 0 0 30px rgba(168,85,247,0.5);
  }
  .start-btn:hover {
    transform: scale(1.06);
    box-shadow: 0 0 50px rgba(255,107,189,0.7);
  }

  /* ── FLOATING NAME BADGE ── */
  .name-badge {
    position: absolute;
    bottom: 2rem; left: 50%;
    transform: translateX(-50%);
    background: rgba(10,0,20,0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,107,189,0.3);
    border-radius: 50px;
    padding: 0.5rem 1.4rem;
    color: #fff;
    font-size: 0.95rem;
    font-weight: 500;
    pointer-events: none;
    transition: opacity 0.3s;
    white-space: nowrap;
  }

  /* ── MESSAGE POPUP ── */
  .popup {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -60%);
    max-width: min(420px, 90vw);
    background: rgba(10,0,20,0.88);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,107,189,0.4);
    border-radius: 20px;
    padding: 1.8rem 2rem;
    pointer-events: all;
    animation: popIn 0.35s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 0 60px rgba(168,85,247,0.25), 0 20px 40px rgba(0,0,0,0.5);
  }
  .popup-name {
    font-family: 'Dancing Script', cursive;
    font-size: 1.8rem;
    color: #ff6bbd;
    margin-bottom: 0.6rem;
  }
  .popup-msg {
    color: rgba(255,255,255,0.85);
    font-size: 0.95rem;
    line-height: 1.7;
    font-weight: 300;
  }
  .popup-close {
    margin-top: 1.2rem;
    padding: 0.5rem 1.5rem;
    background: transparent;
    border: 1px solid rgba(255,107,189,0.4);
    border-radius: 50px;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
    cursor: pointer;
    transition: all 0.2s;
  }
  .popup-close:hover {
    border-color: #ff6bbd;
    color: #fff;
  }

  /* ── LYRICS DISPLAY ── */
  .lyrics {
    position: absolute;
    bottom: 6rem; left: 50%;
    transform: translateX(-50%);
    text-align: center;
    pointer-events: none;
  }
  .lyrics-line {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(1.5rem, 4vw, 2.8rem);
    color: #fff;
    text-shadow: 0 0 30px rgba(255,107,189,0.8), 0 0 60px rgba(168,85,247,0.5);
    animation: lyricsIn 0.6s ease;
    white-space: nowrap;
  }

  /* ── CANDLE PROMPT ── */
  .candle-prompt {
    position: absolute;
    bottom: 5rem; left: 50%;
    transform: translateX(-50%);
    text-align: center;
    pointer-events: all;
  }
  .candle-prompt p {
    color: rgba(255,255,255,0.7);
    font-size: 1rem;
    letter-spacing: 0.05em;
    margin-bottom: 0.8rem;
    animation: pulse 1.5s infinite;
  }
  .blow-btn {
    padding: 0.8rem 2.4rem;
    background: linear-gradient(135deg, #ff9900, #ff4500);
    border: none; border-radius: 50px;
    color: #fff; font-size: 1rem; font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 0 30px rgba(255,153,0,0.5);
  }
  .blow-btn:hover { transform: scale(1.06); }

  /* ── CELEBRATION BANNER ── */
  .celebration {
    position: absolute;
    top: 0; left: 0; right: 0;
    text-align: center;
    padding-top: 2.5rem;
    pointer-events: none;
    animation: fadeUp 1s ease;
  }
  .celebration-title {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(2rem, 5vw, 4rem);
    color: #ffd700;
    text-shadow: 0 0 30px rgba(255,215,0,0.6), 0 0 70px rgba(255,100,0,0.3);
    animation: celebrate 0.5s ease infinite alternate;
  }
  .celebration-sub {
    font-size: 1.1rem;
    color: rgba(255,255,255,0.7);
    margin-top: 0.5rem;
    font-weight: 300;
    letter-spacing: 0.08em;
  }

  /* ── PROGRESS DOTS (messages collected) ── */
  .progress {
    position: absolute;
    top: 1.2rem; left: 50%;
    transform: translateX(-50%);
    display: flex; gap: 0.4rem;
    pointer-events: none;
  }
  .dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,107,189,0.3);
    transition: background 0.4s, box-shadow 0.4s;
  }
  .dot.collected {
    background: #ff6bbd;
    box-shadow: 0 0 8px rgba(255,107,189,0.8);
  }

  /* ── UNLOCK NOTICE ── */
  .unlock-notice {
    position: absolute;
    bottom: 5rem; left: 50%;
    transform: translateX(-50%);
    background: rgba(255,215,0,0.15);
    border: 1px solid rgba(255,215,0,0.4);
    border-radius: 12px;
    padding: 0.7rem 1.5rem;
    color: #ffd700;
    font-size: 0.9rem;
    text-align: center;
    pointer-events: none;
    animation: fadeUp 0.5s ease;
  }

  /* ── INSTRUCTION MESSAGE (Prominent) ── */
  .instruction-box {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, rgba(10,0,20,0.92), rgba(45,50,80,0.88));
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255,107,189,0.5);
    border-radius: 20px;
    padding: 2.5rem 2.5rem;
    max-width: min(520px, 90vw);
    text-align: center;
    pointer-events: none;
    z-index: 15;
    box-shadow: 0 0 80px rgba(255,107,189,0.3), 0 20px 60px rgba(0,0,0,0.6);
    animation: slideUp 0.6s cubic-bezier(0.34,1.56,0.64,1);
  }
  .instruction-title {
    font-family: 'Dancing Script', cursive;
    font-size: clamp(1.8rem, 5vw, 2.8rem);
    color: #ff6bbd;
    margin: 0 0 1rem 0;
    text-shadow: 0 0 20px rgba(255,107,189,0.5);
    font-weight: 700;
  }
  .instruction-text {
    font-size: clamp(1rem, 3vw, 1.4rem);
    color: #fff;
    margin: 0 0 1.5rem 0;
    line-height: 1.6;
    font-weight: 500;
    letter-spacing: 0.5px;
  }
  .progress-display {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    font-size: clamp(1rem, 3vw, 1.3rem);
  }
  .progress-counter {
    background: rgba(255,107,189,0.2);
    border: 1px solid rgba(255,107,189,0.5);
    border-radius: 12px;
    padding: 0.6rem 1.2rem;
    color: #ff6bbd;
    font-weight: 600;
    font-family: 'DM Sans', monospace;
  }
  .progress-dots-inline {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  .dot-inline {
    width: 12px; height: 12px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,107,189,0.3);
    transition: all 0.4s ease;
  }
  .dot-inline.collected {
    background: #ff6bbd;
    box-shadow: 0 0 12px rgba(255,107,189,0.8), inset 0 0 4px rgba(255,255,255,0.4);
    transform: scale(1.1);
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, -40%); }
    to   { opacity: 1; transform: translate(-50%, -50%); }
  }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1;   }
  }
  @keyframes popIn {
    from { opacity: 0; transform: translate(-50%, -56%) scale(0.88); }
    to   { opacity: 1; transform: translate(-50%, -60%) scale(1);    }
  }
  @keyframes lyricsIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes celebrate {
    from { text-shadow: 0 0 30px #ffd700, 0 0 70px #ff4500; }
    to   { text-shadow: 0 0 60px #ffd700, 0 0 120px #ff6bbd; }
  }
`

const LYRICS = [
  '🎵 Happy Birthday to you…',
  '🎵 Happy Birthday to you…',
  '🎵 Happy Birthday dear Afia…',
  '🎵 Happy Birthday to you! 🎂',
  '🎉 May all your wishes come true!',
]

export default function UI({
  step,
  onStart,
  hoveredChar,
  clickedChar,
  onClosePopup,
  collectedIds,
  onBlowCandles,
  lyricsIndex,
}) {
  const [landingFading, setLandingFading] = useState(false)

  const handleStart = () => {
    setLandingFading(true)
    setTimeout(onStart, 900)
  }

  const totalChars = 8
  const allCollected = collectedIds.length >= totalChars

  return (
    <>
      <style>{styles}</style>
      <div className="ui-root">

        {/* ── LANDING ── */}
        {step === 'landing' && (
          <div className={`landing ${landingFading ? 'fade-out' : ''}`}>
            <div className="landing-sparkles" />
            <p className="landing-subtitle">From The Circle</p>
            <h1 className="landing-title">
              We have something<br />special for <span>you…</span>
            </h1>
            <button className="start-btn" onClick={handleStart}>
              ✨ Open Your Gift
            </button>
            <p className="landing-hint">click to begin</p>
          </div>
        )}

        {/* ── IN-SCENE UI ── */}
        {step !== 'landing' && (
          <>
            {/* Progress dots */}
            <div className="progress">
              {Array.from({ length: totalChars }).map((_, i) => (
                <div
                  key={i}
                  className={`dot ${collectedIds.length > i ? 'collected' : ''}`}
                />
              ))}
            </div>

            {/* Hovered character name badge */}
            {hoveredChar && !clickedChar && (
              <div className="name-badge">👤 {hoveredChar.name}</div>
            )}

            {/* Prominent instruction during reveal */}
            {step === 'reveal' && !allCollected && (
              <div className="instruction-box">
                <div className="instruction-title">🎁 Collect Birthday Messages</div>
                <p className="instruction-text">
                  Click each friend in the circle to collect their special birthday message for you!
                </p>
                <div className="progress-display">
                  <span className="progress-counter">
                    {collectedIds.length} / {totalChars}
                  </span>
                </div>
              </div>
            )}

            {/* Success state when all collected */}
            {step === 'reveal' && allCollected && (
              <div className="instruction-box">
                <div className="instruction-title">✨ All Messages Collected! ✨</div>
                <p className="instruction-text">
                  You've heard from everyone! Ready for the birthday surprise?
                </p>
                <p style={{ color: '#ffd700', fontSize: '1.1rem', marginTop: '1rem' }}>
                  → Scroll down for the next surprise ↓
                </p>
              </div>
            )}

            {/* Character message popup */}
            {clickedChar && (
              <div className="popup">
                <div className="popup-name">{clickedChar.name} says:</div>
                <p className="popup-msg">{clickedChar.message}</p>
                <button className="popup-close" onClick={onClosePopup}>close</button>
              </div>
            )}

            {/* Lyrics */}
            {step === 'singing' && (
              <div className="lyrics">
                <div className="lyrics-line" key={lyricsIndex}>
                  {LYRICS[lyricsIndex] || ''}
                </div>
              </div>
            )}

            {/* Candle prompt */}
            {step === 'candles' && (
              <div className="candle-prompt">
                <p>🕯️ Make a wish and blow the candles…</p>
                <button className="blow-btn" onClick={onBlowCandles}>
                  💨 Blow!
                </button>
              </div>
            )}

            {/* Celebration */}
            {step === 'celebration' && (
              <div className="celebration">
                <div className="celebration-title">Happy Birthday Afia! 🎉🎂</div>
                <div className="celebration-sub">We love you ❤️ — From The Circle</div>
              </div>
            )}

          </>
        )}
      </div>
    </>
  )
}
