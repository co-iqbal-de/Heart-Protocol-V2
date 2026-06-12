import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; r: number
  vx: number; vy: number
  alpha: number; color: string
  type: 'bokeh' | 'petal' | 'sparkle'
  angle: number; angleSpeed: number
}

export default function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const COLORS = [
      'rgba(255,120,170,', 'rgba(200,80,140,',
      'rgba(255,180,200,', 'rgba(160,60,120,',
      'rgba(255,210,220,',
    ]

    const particles: Particle[] = Array.from({ length: 60 }, () => makeParticle(width, height, COLORS))

    function makeParticle(w: number, h: number, colors: string[]): Particle {
      const types: Particle['type'][] = ['bokeh', 'petal', 'sparkle']
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() * 18,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.2 - Math.random() * 0.5,
        alpha: 0.05 + Math.random() * 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: types[Math.floor(Math.random() * 3)],
        angle: Math.random() * Math.PI * 2,
        angleSpeed: (Math.random() - 0.5) * 0.02,
      }
    }

    function drawBokeh(p: Particle) {
      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
      grad.addColorStop(0, p.color + (p.alpha * 0.8) + ')')
      grad.addColorStop(0.6, p.color + (p.alpha * 0.3) + ')')
      grad.addColorStop(1, p.color + '0)')
      ctx!.beginPath()
      ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx!.fillStyle = grad
      ctx!.fill()
    }

    function drawPetal(p: Particle) {
      ctx!.save()
      ctx!.translate(p.x, p.y)
      ctx!.rotate(p.angle)
      ctx!.globalAlpha = p.alpha
      ctx!.fillStyle = p.color + p.alpha + ')'
      // small flower petal shape
      ctx!.beginPath()
      const size = p.r * 0.6
      for (let i = 0; i < 4; i++) {
        ctx!.ellipse(
          Math.cos((i * Math.PI) / 2) * size * 0.5,
          Math.sin((i * Math.PI) / 2) * size * 0.5,
          size * 0.4, size * 0.2,
          (i * Math.PI) / 2, 0, Math.PI * 2
        )
      }
      ctx!.fill()
      ctx!.restore()
    }

    function drawSparkle(p: Particle) {
      ctx!.save()
      ctx!.translate(p.x, p.y)
      ctx!.rotate(p.angle)
      ctx!.globalAlpha = p.alpha
      ctx!.strokeStyle = p.color + p.alpha + ')'
      ctx!.lineWidth = 1
      const s = p.r * 0.5
      ctx!.beginPath()
      ctx!.moveTo(-s, 0); ctx!.lineTo(s, 0)
      ctx!.moveTo(0, -s); ctx!.lineTo(0, s)
      ctx!.moveTo(-s * 0.7, -s * 0.7); ctx!.lineTo(s * 0.7, s * 0.7)
      ctx!.moveTo(s * 0.7, -s * 0.7); ctx!.lineTo(-s * 0.7, s * 0.7)
      ctx!.stroke()
      ctx!.restore()
    }

    let raf: number
    function animate() {
      ctx!.clearRect(0, 0, width, height)
      for (const p of particles) {
        if (p.type === 'bokeh') drawBokeh(p)
        else if (p.type === 'petal') drawPetal(p)
        else drawSparkle(p)

        p.x += p.vx; p.y += p.vy; p.angle += p.angleSpeed
        // drift slightly
        p.vx += (Math.random() - 0.5) * 0.01
        if (p.y < -p.r * 2) {
          p.y = height + p.r; p.x = Math.random() * width
        }
        if (p.x < -p.r * 2) p.x = width + p.r
        if (p.x > width + p.r * 2) p.x = -p.r
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width; canvas.height = height
    }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  )
}