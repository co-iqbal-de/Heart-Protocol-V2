import { useState, useEffect } from 'react'

interface Flower {
  emoji: string
  wish: string
  label: string
}

const FLOWERS: Flower[] = [
  { emoji: '🌹', label: 'Red Rose', wish: 'May your days be as beautiful as you are, always.' },
  { emoji: '🌸', label: 'Cherry Blossom', wish: 'Like the sakura, your presence makes the world bloom.' },
  { emoji: '🪷', label: 'Lotus', wish: 'You rise with grace through every storm.' },
  { emoji: '🌺', label: 'Hibiscus', wish: 'Your warmth lights up every room you enter.' },
  { emoji: '🌻', label: 'Sunflower', wish: 'Always facing the light — just like you do.' },
  { emoji: '🌷', label: 'Tulip', wish: 'Every moment with you is a gift I cherish.' },
  { emoji: '💐', label: 'Bouquet', wish: 'This garden is a tiny piece of the love I hold for you.' },
]

export default function FlowerGarden() {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  // FIX: auto-bloom semua bunga saat komponen mount
  const [bloomedIdx, setBloomedIdx] = useState<number[]>([])

  useEffect(() => {
    // Bloom satu per satu dengan delay bertahap
    FLOWERS.forEach((_, i) => {
      setTimeout(() => {
        setBloomedIdx(prev => [...prev, i])
      }, 300 + i * 150) // mulai 300ms, lalu tiap 150ms
    })
  }, [])

  const handleClick = (i: number) => {
    setActiveIdx(i === activeIdx ? null : i)
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.eyebrow}>your birthday garden</p>
      <h2 style={styles.heading}>A Garden Blooming</h2>
      <p style={styles.subheading}><em>Just For You Today</em></p>

      <div style={styles.gardenRow}>
        {FLOWERS.map((f, i) => (
          <div key={i} style={styles.flowerWrap} onClick={() => handleClick(i)}>
            {/* Flower */}
            <div style={{
              ...styles.flowerEmoji,
              transform: bloomedIdx.includes(i) ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(-30deg)',
              transition: `transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s`,
              filter: activeIdx === i ? 'drop-shadow(0 0 12px rgba(255,120,180,0.8))' : 'none',
            }}>
              {f.emoji}
            </div>
          </div>
        ))}
      </div>

      {/* Wish bubble */}
      <div style={{
        ...styles.wishBubble,
        opacity: activeIdx !== null ? 1 : 0,
        transform: activeIdx !== null ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.4s ease',
        pointerEvents: activeIdx !== null ? 'auto' : 'none',
      }}>
        {activeIdx !== null && (
          <>
            <span style={styles.wishEmoji}>{FLOWERS[activeIdx].emoji}</span>
            <p style={styles.wishLabel}>{FLOWERS[activeIdx].label}</p>
            <p style={styles.wishText}>"{FLOWERS[activeIdx].wish}"</p>
          </>
        )}
      </div>

      <p style={styles.hint}>☽ touch each flower · a birthday wish is hiding inside ✦</p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    textAlign: 'center',
    padding: '80px 24px',
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: 'rgba(255,150,180,0.7)',
    letterSpacing: '0.25em',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  heading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(32px, 6vw, 56px)',
    fontWeight: 400,
    color: '#fff',
    marginBottom: 4,
  },
  subheading: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(20px, 3.5vw, 32px)',
    color: '#ff9abf',
    marginBottom: 48,
  },
  gardenRow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 'clamp(16px, 3.5vw, 36px)',
    marginBottom: 32,
    flexWrap: 'wrap',
  },
  flowerWrap: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative',
  },
  flowerEmoji: {
    fontSize: 'clamp(36px, 6vw, 56px)',
    display: 'block',
    userSelect: 'none',
  },
  wishBubble: {
    background: 'rgba(30, 5, 40, 0.75)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,150,180,0.2)',
    borderRadius: 16,
    padding: '20px 28px',
    maxWidth: 420,
    margin: '0 auto 24px',
    minHeight: 80,
  },
  wishEmoji: { fontSize: 28 },
  wishLabel: {
    fontFamily: "'Cormorant Garamond', serif",
    color: '#ff9abf',
    fontSize: 13,
    letterSpacing: '0.15em',
    marginTop: 4,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  wishText: {
    fontFamily: "'Cormorant Garamond', serif",
    color: 'rgba(255,230,240,0.9)',
    fontSize: 'clamp(14px, 2.5vw, 17px)',
    lineHeight: 1.7,
    fontStyle: 'italic',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,150,180,0.45)',
    letterSpacing: '0.12em',
    fontStyle: 'italic',
  },
}