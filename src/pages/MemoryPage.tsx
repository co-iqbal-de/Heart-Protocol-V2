import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingParticel from '../components/FloatingParticel'
import MusicPlayer from '../components/MusicPlayer'
import FlowerGarden from '../components/FlowerGarden'
import { caption } from 'motion/react-client'

// ─── Photos (Sakura placeholder URLs) ───────────────────────────────
const PHOTOS = [
  {url: '/gallery/image1.jpeg', caption: 'you'
    // real sakura: ganti ke path foto lokal kamu 
},
  { url: '/gallery/image2.jpeg', caption: 'are' },
  { url: '/gallery/image3.jpeg', caption: 'my' },
  { url: '/gallery/image4.jpeg', caption: 'everything' },
]

const LOVES = [
  { emoji: '✨', title: 'Your Smile', desc: 'It stops time. It always has, and it always will.' },
  { emoji: '🌟', title: 'Your Soul', desc: 'Rare, luminous, and more precious than anything this world has to offer.' },
  { emoji: '🌸', title: 'Your Kindness', desc: 'The way you love and care for everyone makes the world a softer place.' },
  { emoji: '🌹', title: 'Your Laughter', desc: 'The most beautiful sound — I want to hear it every single day.' },
  { emoji: '💪', title: 'Your Strength', desc: 'You carry so much with such grace. I see it, even when you don\'t.' },
  { emoji: '💖', title: 'Simply You', desc: 'Every version of you — messy, sleepy, glowing — I love them all.' },
]

// ─── Scroll-reveal hook ──────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return { ref, visible }
}

// ─── Reveal wrapper ──────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useReveal()
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(32px)',
      transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
    }}>
      {children}
    </div>
  )
}

// ─── Section divider ─────────────────────────────────────────────────
function Divider() {
  return (
    <div style={{ textAlign: 'center', margin: '8px 0', color: 'rgba(255,150,180,0.3)', fontSize: 18, letterSpacing: 8 }}>
      ✦ ✦ ✦
    </div>
  )
}

export default function MemoryPage() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <FloatingParticel />
      <MusicPlayer songTitle="Shape Of My Heart" artist="Backstreet Boys" src={`${import.meta.env.BASE_URL}lagu.mp3`} />

      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* ─────────────── SECTION 1 · HERO ─────────────── */}
      <section style={styles.hero}>
        <p style={styles.eyebrow}>a love letter, just for you</p>
        <h1 style={styles.heroTitle}>
          For You,<br />
          <em style={{ color: '#ff9abf' }}>Honskiii</em>
        </h1>
        <p style={styles.heroSub}>
          Today the whole universe is celebrating the day<br />you were born into my world.
        </p>
        <div style={styles.heroDeco}>🌸</div>
        <p style={styles.scrollHint}>scroll to discover ↓</p>
      </section>

      <Divider />

      {/* ─────────────── SECTION 2 · LOVE LETTER ─────────────── */}
      <section style={styles.section}>
        <Reveal>
          <div style={styles.card}>
            <p style={styles.flowerRow}>🌸 🌺 🌸</p>
            <p style={styles.cardEyebrow}>from the bottom of my heart</p>
            <h2 style={styles.cardTitle}>
              Today is the day<br />
              <em style={{ color: '#ff9abf' }}>the world became</em><br />
              more beautiful.
            </h2>
            <p style={styles.cardBody}>
              The day you were born is the best thing that ever happened to this world — and to me.
              Every year I get to spend beside you is a gift I never take for granted. You make
              ordinary days feel like magic, and magical days feel like dreams.
            </p>
            <p style={styles.cardBody}>
              These words are a tiny token of the enormous love I carry for you. No poem long
              enough, no song sweet enough — but know that every single one is yours.
            </p>
            <p style={styles.signature}>— Yours, always &amp; forever 🌹</p>
          </div>
        </Reveal>
      </section>

      <Divider />

      {/* ─────────────── SECTION 3 · WHAT I LOVE ─────────────── */}
      <section style={styles.section}>
        <Reveal>
          <p style={styles.eyebrow}>a thousand wishes</p>
          <h2 style={styles.sectionTitle}>What I Love About You</h2>
        </Reveal>
        <div style={styles.loveGrid}>
          {LOVES.map((item, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={styles.loveCard}>
                <span style={styles.loveEmoji}>{item.emoji}</span>
                <h3 style={styles.loveTitle}>{item.title}</h3>
                <p style={styles.loveDesc}>{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ─────────────── SECTION 4 · FLOWER GARDEN ─────────────── */}
      <section style={{ position: 'relative', zIndex: 1 }}>
        <FlowerGarden />
      </section>

      <Divider />

      {/* ─────────────── SECTION 5 · PHOTOS ─────────────── */}
      <section style={styles.section}>
        <Reveal>
          <p style={styles.eyebrow}>captured in time · celebrating you</p>
          <h2 style={styles.sectionTitle}>
            Your Beautiful<br />
            <em style={{ color: '#ff9abf' }}>Pictures</em>
          </h2>
        </Reveal>
        <div style={styles.photoGrid}>
          {PHOTOS.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={styles.photoCard}>
                <img
                  src={p.url}
                  alt={p.caption}
                  style={styles.photoImg}
                  onError={(e) => {
                    // graceful fallback if image fails
                    const t = e.target as HTMLImageElement
                    t.style.display = 'none'
                    const parent = t.parentElement!
                    const fallback = document.createElement('div')
                    fallback.style.cssText = `
                      width:100%;height:180px;display:flex;align-items:center;
                      justify-content:center;font-size:48px;background:rgba(80,20,60,0.4);
                      border-radius:12px;
                    `
                    fallback.textContent = '🌸'
                    parent.insertBefore(fallback, t)
                  }}
                />
                <p style={styles.photoCaption}>{p.caption}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Divider />

      {/* ─────────────── SECTION 6 · CLOSING ─────────────── */}
      <section style={styles.closing}>
        <Reveal>
          <p style={styles.flowerRow}>🌸 🌺 🌹 🌸 🌷</p>
          <p style={styles.closingEyebrow}>happy birthday, my love 🤍</p>
          <h2 style={styles.closingTitle}>
            You Are Loved<br />
            <em style={{ color: '#ff9abf' }}>More Than You Know</em>
          </h2>
          <p style={styles.closingBody}>
            On this beautiful day that belongs entirely to you — I want you to know that loving you
            is the greatest adventure of my life. Every year with you is a gift I treasure. Every
            laugh, every moment, every quiet heartbeat beside yours. Here's to you, today and every
            day after. Happy Birthday, my love 🌸
          </p>
          <div style={{ fontSize: 40, margin: '24px 0' }}>💗</div>
          <p style={styles.closingMade}>Made with endless love, just for you 🤍🌸</p>
        </Reveal>
      </section>

      {/* Bottom padding for music player */}
      <div style={{ height: 100 }} />
    </div>
  )
}

// ─── Styles ──────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 30% 20%, #2a0520 0%, #140010 40%, #0a000d 100%)',
    color: '#fff',
    fontFamily: "'Lato', sans-serif",
    overflowX: 'hidden',
    position: 'relative',
  },
  backBtn: {
    position: 'fixed',
    top: 20,
    right: 24,
    zIndex: 998,
    background: 'rgba(20,5,30,0.7)',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(255,150,180,0.2)',
    borderRadius: 24,
    color: 'rgba(255,200,220,0.8)',
    padding: '8px 18px',
    fontSize: 13,
    cursor: 'pointer',
    fontFamily: "'Lato', sans-serif",
    letterSpacing: '0.05em',
  },
  // ─── Hero
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '40px 24px',
    position: 'relative',
    zIndex: 1,
  },
  eyebrow: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(12px, 2vw, 15px)',
    color: 'rgba(255,150,180,0.7)',
    letterSpacing: '0.25em',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(52px, 10vw, 100px)',
    fontWeight: 400,
    lineHeight: 1.1,
    marginBottom: 24,
    color: '#fff',
  },
  heroSub: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(16px, 2.5vw, 20px)',
    color: 'rgba(255,200,220,0.7)',
    lineHeight: 1.8,
    marginBottom: 32,
  },
  heroDeco: {
    fontSize: 48,
    animation: 'pulse 3s ease-in-out infinite',
    marginBottom: 40,
  },
  scrollHint: {
    fontSize: 12,
    color: 'rgba(255,150,180,0.4)',
    letterSpacing: '0.2em',
    animation: 'fadeUpDown 2s ease-in-out infinite',
  },
  // ─── Generic section
  section: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '64px 24px',
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(32px, 6vw, 56px)',
    fontWeight: 400,
    marginBottom: 40,
    color: '#fff',
  },
  // ─── Love letter card
  card: {
    background: 'rgba(30, 5, 40, 0.6)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,150,180,0.15)',
    borderRadius: 24,
    padding: 'clamp(28px, 5vw, 56px)',
    textAlign: 'center',
  },
  flowerRow: { fontSize: 28, marginBottom: 12, letterSpacing: 8 },
  cardEyebrow: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 14,
    color: 'rgba(255,150,180,0.6)',
    letterSpacing: '0.2em',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  cardTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 400,
    lineHeight: 1.25,
    marginBottom: 28,
  },
  cardBody: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(15px, 2.2vw, 18px)',
    color: 'rgba(255,220,230,0.7)',
    lineHeight: 1.9,
    marginBottom: 16,
    maxWidth: 620,
    margin: '0 auto 16px',
  },
  signature: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(18px, 3vw, 24px)',
    color: '#ff9abf',
    fontStyle: 'italic',
    marginTop: 28,
  },
  // ─── Love grid
  loveGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    textAlign: 'center',
  },
  loveCard: {
    background: 'rgba(30, 5, 40, 0.55)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,150,180,0.12)',
    borderRadius: 20,
    padding: '28px 20px',
    transition: 'border-color 0.3s, transform 0.3s',
    cursor: 'default',
  },
  loveEmoji: { fontSize: 36, display: 'block', marginBottom: 12 },
  loveTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 400,
    marginBottom: 10,
    color: '#fff',
  },
  loveDesc: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 15,
    color: 'rgba(255,210,220,0.65)',
    lineHeight: 1.7,
  },
  // ─── Photos
  photoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    maxWidth: 700,
    margin: '0 auto',
  },
  photoCard: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    background: 'rgba(60, 10, 50, 0.4)',
    border: '1px solid rgba(255,150,180,0.15)',
  },
  photoImg: {
    width: '100%',
    aspectRatio: '1 / 1',
    objectFit: 'cover',
    display: 'block',
    filter: 'grayscale(30%) brightness(0.85)',
    transition: 'filter 0.4s, transform 0.4s',
  },
  photoCaption: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    fontStyle: 'italic',
    color: 'rgba(255,210,220,0.7)',
    textAlign: 'center',
    padding: '10px 0 8px',
    letterSpacing: '0.1em',
  },
  // ─── Closing
  closing: {
    maxWidth: 720,
    margin: '0 auto',
    padding: '80px 24px',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
  },
  closingEyebrow: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 15,
    color: 'rgba(255,150,180,0.7)',
    letterSpacing: '0.2em',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  closingTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(36px, 7vw, 64px)',
    fontWeight: 400,
    lineHeight: 1.15,
    marginBottom: 28,
  },
  closingBody: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 'clamp(15px, 2.2vw, 18px)',
    color: 'rgba(255,210,220,0.65)',
    lineHeight: 1.9,
    maxWidth: 560,
    margin: '0 auto',
  },
  closingMade: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 16,
    fontStyle: 'italic',
    color: 'rgba(255,150,180,0.5)',
    letterSpacing: '0.1em',
  },
}