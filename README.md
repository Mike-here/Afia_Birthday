<<<<<<< HEAD
# 🎉 Afia's Birthday Experience
> A fully interactive 3D birthday celebration built with React Three Fiber

---

## 📁 Folder Structure

```
afia-birthday/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── (put your audio files here)
└── src/
    ├── main.jsx              — React entry point
    ├── App.jsx               — Root: state machine + Canvas + UI
    ├── data/
    │   └── characters.js     — ✏️  EDIT CHARACTER NAMES & MESSAGES HERE
    └── components/
        ├── Avatar.jsx        — Reusable procedural character mesh
        ├── Scene.jsx         — Room, cake, balloons, confetti
        ├── TheCircle.jsx     — Circle of 8 friends + Afia at center
        └── UI.jsx            — ALL HTML/CSS overlays (landing, popups, lyrics)
```

---

## 🚀 Quick Start

### 1. Initialize the project

```bash
# Create the project folder and enter it
mkdir afia-birthday && cd afia-birthday

# Copy all the provided files into this folder
# (make sure to preserve the src/ and src/components/ structure)
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Then open **http://localhost:5173** in your browser.

---

## ✏️ How to Customize

### Change character names & messages

Open `src/data/characters.js` — everything is in one place:

```js
{
  id: 'michael',
  name: 'Michael',
  message: "Afia, your energy lights up every room...", // ← EDIT THIS
  outfitColor: '#1a3a5c',  // ← Change outfit color
  skinTone: '#5C3317',     // ← Adjust skin tone hex
  ...
}
```

### Add your own audio

1. Put your MP3 file in the `/public/` folder:
   ```
   public/
   └── the_circle_shoutout.mp3
   ```

2. In `src/App.jsx`, find the audio section and update:
   ```js
   // Background birthday music:
   bgMusicRef.current = new Audio('/happy_birthday_instrumental.mp3')

   // After candles blown (celebration cheer):
   // Uncomment these lines:
   const cheer = new Audio('/the_circle_shoutout.mp3')
   cheer.play()
   ```

### Add a 9th character (or more)

Add a new entry to the `CHARACTERS` array in `src/data/characters.js`:
```js
{
  id: 'new_friend',
  name: 'Your Name',
  angle: 337,          // position in the circle (0-360 degrees)
  message: "...",
  skinTone: '#...',
  // ... other props
}
```
Then update `revealedCount >= 8` to `>= 9` in `TheCircle.jsx`.

---

## 🎮 How It Works

| Step | What Happens |
|------|-------------|
| **Landing** | Dark screen, animated text fades in |
| **Reveal** | Camera zooms in, characters appear one by one |
| **Singing** | Characters clap, lyrics scroll across screen |
| **Candles** | Camera zooms to cake, press "Blow!" |
| **Celebration** | Confetti bursts, final message appears |

**Interactive features:**
- 🖱️ **Drag** to orbit the camera around the scene
- 👆 **Hover** on any character to see their name
- 🖱️ **Click** a character to read their personal message
- 🎂 Collect all 8 messages to unlock the "cake is waiting" notice

---

## 🔧 Build for Production

```bash
npm run build
```

Output goes to `dist/` — ready to deploy on Netlify, Vercel, or any static host.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `three` | Core 3D engine |
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | OrbitControls, helpers |
| `gsap` | Smooth camera transitions |
| `canvas-confetti` | Browser confetti burst on celebration |

---

*Made with ❤️ for Afia — From The Circle*
=======
# Afia_Birthday
>>>>>>> 0d5844f15f7085427c94b70df804ca9bb0efc002
# Afia_Birthday
