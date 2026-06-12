/// <reference types="vite/client" />
import { useState, useRef, useEffect } from 'react'

interface MusicPlayerProps {
  songTitle?: string
  artist?: string
  src?: string
}

export default function MusicPlayer({
  songTitle = 'Shape Of My Heart',
  artist = 'Backstreet Boys',
  src = `${import.meta.env.BASE_URL}lagu.mp3`
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const miniProgressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current
      .play()
      .then(() => { setIsPlaying(true) })
      .catch((err) => { console.log("Audio gagal diputar:", err) })
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    const dur = audioRef.current.duration
    const cur = audioRef.current.currentTime
    const pct = dur > 0 ? (cur / dur) * 100 : 0
    setProgress(isNaN(pct) ? 0 : pct)
    setCurrentTime(isNaN(cur) ? 0 : cur)
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    const dur = audioRef.current.duration
    setDuration(isNaN(dur) ? 0 : dur)
  }

  const handleDurationChange = () => {
    if (!audioRef.current) return
    const dur = audioRef.current.duration
    if (!isNaN(dur) && dur > 0) setDuration(dur)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return
    const rect = progressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0)
    setProgress(pct * 100)
  }

  const handleMiniProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !miniProgressRef.current) return
    const rect = miniProgressRef.current.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    audioRef.current.currentTime = pct * (audioRef.current.duration || 0)
    setProgress(pct * 100)
  }

  const formatTime = (s: number): string => {
    if (!s || isNaN(s) || s < 0) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const barMeta = [
    { dur: '0.82s', delay: '0.00s' },
    { dur: '0.65s', delay: '0.08s' },
    { dur: '1.05s', delay: '0.15s' },
    { dur: '0.78s', delay: '0.22s' },
    { dur: '0.92s', delay: '0.05s' },
    { dur: '0.70s', delay: '0.30s' },
    { dur: '1.10s', delay: '0.12s' },
    { dur: '0.85s', delay: '0.40s' },
    { dur: '0.72s', delay: '0.18s' },
    { dur: '0.98s', delay: '0.35s' },
    { dur: '0.68s', delay: '0.08s' },
    { dur: '0.88s', delay: '0.25s' },
    { dur: '1.02s', delay: '0.42s' },
    { dur: '0.76s', delay: '0.10s' },
    { dur: '0.94s', delay: '0.20s' },
    { dur: '0.80s', delay: '0.38s' },
  ]

  return (
    <>
      <style>{`
        @keyframes bar-bounce {
          0%,  100% { transform: scaleY(0.18); }
          20%        { transform: scaleY(1.00); }
          40%        { transform: scaleY(0.45); }
          60%        { transform: scaleY(0.85); }
          80%        { transform: scaleY(0.30); }
        }
        @keyframes mp-fadein {
          from { opacity:0; transform:translateY(20px) scale(0.96); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        /* ── Root card ── */
        .mp-root {
          position: fixed;
          bottom: 28px;
          left: 28px;
          z-index: 9999;
          width: 260px;
          border-radius: 20px;
          overflow: hidden;
          animation: mp-fadein 0.55s cubic-bezier(.22,.68,0,1.2) both;
          background: rgba(10, 2, 18, 0.92);
          border: 1px solid rgba(255,110,160,0.15);
          backdrop-filter: blur(20px);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.7),
            0 0 0 1px rgba(255,110,160,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .mp-root:hover {
          transform: scale(1.02);
          box-shadow:
            0 28px 72px rgba(0,0,0,0.75),
            0 0 0 1px rgba(255,110,160,0.2),
            0 0 60px rgba(200,50,120,0.15);
        }

        /* ── Album cover ── */
        .mp-album-wrap {
          width: 100%;
          aspect-ratio: 1 / 1;
          overflow: hidden;
          position: relative;
          flex-shrink: 0;
        }
        .mp-album-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
          transition: transform 0.6s ease;
        }
        .mp-root:hover .mp-album-img {
          transform: scale(1.04);
        }
        .mp-album-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(10,2,18,0.85));
          pointer-events: none;
        }

        /* ── Body ── */
        .mp-body {
          padding: 14px 16px 18px;
          display: flex;
          flex-direction: column;
        }

        /* ── Song info ── */
        .mp-song-title {
          font-size: 15px;
          font-weight: 800;
          color: #fff;
          line-height: 1.2;
          margin: 0 0 3px;
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background: linear-gradient(90deg, #fff 30%, #ffb8d8 50%, #fff 70%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mp-song-title.shimmer {
          animation: shimmer 3s linear infinite;
        }
        .mp-artist {
          font-size: 11px;
          color: rgba(255,150,180,0.6);
          margin: 0 0 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Visualizer ── */
        .mp-visualizer {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 28px;
          margin-bottom: 10px;
          gap: 2px;
        }
        .mp-bar-wrap {
          flex: 1;
          min-width: 0;
          height: 28px;
          display: flex;
          align-items: flex-end;
        }
        .mp-bar-inner {
          width: 100%;
          border-radius: 2px 2px 1px 1px;
          background: linear-gradient(180deg, #ff9ecb 0%, #d4488e 55%, rgba(160,30,90,0.6) 100%);
          transform-origin: bottom center;
          height: 28px;
          transform: scaleY(0.12);
          box-shadow: 0 0 5px rgba(212,72,142,0.35);
        }
        .mp-bar-inner.playing {
          animation: bar-bounce var(--dur, 0.85s) ease-in-out infinite var(--delay, 0s);
        }

        /* ── Progress ── */
        .mp-progress-wrap {
          width: 100%;
          position: relative;
          height: 4px;
          background: rgba(255,255,255,0.12);
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 6px;
          overflow: visible;
        }
        .mp-progress-fill {
          position: relative;
          height: 100%;
          background: linear-gradient(90deg, #ff7eb3, #e0448e);
          border-radius: 4px;
          box-shadow: 0 0 6px rgba(224,68,142,0.5);
          min-width: 0;
        }
        .mp-progress-thumb {
          position: absolute;
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
          width: 11px; height: 11px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 8px rgba(212,72,142,0.8);
          pointer-events: none;
        }
        .mp-time-row {
          width: 100%;
          display: flex;
          justify-content: space-between;
          margin-bottom: 14px;
        }
        .mp-time {
          font-size: 9px;
          color: rgba(255,255,255,0.3);
          letter-spacing: 0.04em;
          font-variant-numeric: tabular-nums;
        }
        .mp-time-current { color: rgba(255,180,210,0.65); }

        /* ── Controls ── */
        .mp-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .mp-ctrl-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          font-size: 14px;
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s, transform 0.15s, background 0.2s;
          backdrop-filter: blur(4px);
        }
        .mp-ctrl-btn:hover {
          color: rgba(255,255,255,0.95);
          background: rgba(255,255,255,0.12);
          transform: scale(1.1);
        }
        .mp-ctrl-btn:active { transform: scale(0.93); }
        .mp-play-btn {
          width: 52px; height: 52px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #ff7eb3 0%, #d4488e 60%, #b8306e 100%);
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 18px rgba(212,72,142,0.6), 0 0 0 5px rgba(212,72,142,0.1);
          transition: transform 0.18s, box-shadow 0.2s;
          flex-shrink: 0;
        }
        .mp-play-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 24px rgba(212,72,142,0.75), 0 0 0 8px rgba(212,72,142,0.12);
        }
        .mp-play-btn:active { transform: scale(0.93); }

        /* ── Mini player (mobile only) ── */
        .mp-mini-row { display: none; }
        .mp-mini-thumb {
          width: 40px; height: 40px;
          min-width: 40px;
          border-radius: 8px;
          object-fit: cover;
          object-position: center top;
          flex-shrink: 0;
        }
        .mp-mini-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          min-width: 0;
          gap: 5px;
        }
        .mp-mini-title {
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }
        .mp-mini-progress {
          width: 100%;
          position: relative;
          height: 3px;
          background: rgba(255,255,255,0.15);
          border-radius: 3px;
          cursor: pointer;
          overflow: visible;
        }
        .mp-mini-fill {
          position: relative;
          height: 100%;
          background: linear-gradient(90deg, #ff7eb3, #e0448e);
          border-radius: 3px;
        }
        .mp-mini-thumb-dot {
          position: absolute;
          right: -4px; top: 50%;
          transform: translateY(-50%);
          width: 9px; height: 9px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 6px rgba(212,72,142,0.8);
          pointer-events: none;
        }
        .mp-mini-controls {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }
        .mp-mini-play-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: none;
          background: linear-gradient(135deg, #ff7eb3 0%, #d4488e 100%);
          color: #fff;
          font-size: 13px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(212,72,142,0.5);
          flex-shrink: 0;
        }
        .mp-mini-ctrl-btn {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          font-size: 11px;
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ── Responsive ── */
        @media (max-width: 480px) {
          .mp-root {
            bottom: 16px;
            left: 16px;
            right: auto;
            width: auto;
            max-width: 270px;
            border-radius: 16px;
          }
          .mp-album-wrap,
          .mp-body {
            display: none;
          }
          .mp-mini-row {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 10px 12px;
          }
        }
      `}</style>

      <div className="mp-root">
        <audio
          ref={audioRef}
          src={src || undefined}
          onLoadedMetadata={() => {
            console.log("Audio berhasil dimuat")
            if (!audioRef.current) return
            audioRef.current.play()
              .then(() => {
                console.log("Audio berhasil diputar")
                setIsPlaying(true)
              })
              .catch((err) => {
                console.error("PLAY ERROR:", err)
              })
            handleLoadedMetadata()
          }}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleDurationChange}
          onEnded={() => {
            setIsPlaying(false)
            setProgress(0)
            setCurrentTime(0)
          }}
          preload="auto"
        />

        {/* ── Album Cover (desktop) ── */}
        <div className="mp-album-wrap">
          <img
            className="mp-album-img"
            src={`${import.meta.env.BASE_URL}player/music.jpeg`}
            alt={songTitle}
            draggable={false}
          />
          <div className="mp-album-overlay" />
        </div>

        {/* ── Body (desktop) ── */}
        <div className="mp-body">
          <p className={`mp-song-title${isPlaying ? ' shimmer' : ''}`}>{songTitle}</p>
          <p className="mp-artist">{artist}</p>

          <div className="mp-visualizer" aria-hidden="true">
            {barMeta.map((b, i) => (
              <div className="mp-bar-wrap" key={i}>
                <div
                  className={`mp-bar-inner${isPlaying ? ' playing' : ''}`}
                  style={isPlaying ? {
                    '--dur': b.dur,
                    '--delay': b.delay,
                  } as React.CSSProperties : undefined}
                />
              </div>
            ))}
          </div>

          <div
            className="mp-progress-wrap"
            ref={progressRef}
            onClick={handleProgressClick}
          >
            <div className="mp-progress-fill" style={{ width: `${progress}%` }}>
              <div className="mp-progress-thumb" />
            </div>
          </div>

          <div className="mp-time-row">
            <span className="mp-time mp-time-current">{formatTime(currentTime)}</span>
            <span className="mp-time">{formatTime(duration)}</span>
          </div>

          <div className="mp-controls">
            <button
              className="mp-ctrl-btn"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0
                  setProgress(0)
                  setCurrentTime(0)
                }
              }}
              aria-label="Previous / restart"
            >⏮</button>
            <button
              className="mp-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >{isPlaying ? '⏸' : '▶'}</button>
            <button
              className="mp-ctrl-btn"
              onClick={() => {
                if (audioRef.current && audioRef.current.duration) {
                  audioRef.current.currentTime = audioRef.current.duration
                }
              }}
              aria-label="Skip to end"
            >⏭</button>
          </div>
        </div>

        {/* ── Mini Player (mobile only) ── */}
        <div className="mp-mini-row">
          <img
            className="mp-mini-thumb"
            src={`${import.meta.env.BASE_URL}player/music.jpeg`}
            alt={songTitle}
            draggable={false}
          />
          <div className="mp-mini-info">
            <span className="mp-mini-title">{songTitle}</span>
            <div
              className="mp-mini-progress"
              ref={miniProgressRef}
              onClick={handleMiniProgressClick}
            >
              <div className="mp-mini-fill" style={{ width: `${progress}%` }}>
                <div className="mp-mini-thumb-dot" />
              </div>
            </div>
          </div>
          <div className="mp-mini-controls">
            <button
              className="mp-mini-ctrl-btn"
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.currentTime = 0
                  setProgress(0)
                  setCurrentTime(0)
                }
              }}
              aria-label="Restart"
            >⏮</button>
            <button
              className="mp-mini-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >{isPlaying ? '⏸' : '▶'}</button>
            <button
              className="mp-mini-ctrl-btn"
              onClick={() => {
                if (audioRef.current && audioRef.current.duration) {
                  audioRef.current.currentTime = audioRef.current.duration
                }
              }}
              aria-label="Skip"
            >⏭</button>
          </div>
        </div>

      </div>
    </>
  )
}