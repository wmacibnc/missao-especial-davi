'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [showIntro, setShowIntro] = useState(true)
  const [countdownValue, setCountdownValue] = useState(3)

  useEffect(() => {
    if (countdownValue > 0) {
      const timer = setTimeout(() => setCountdownValue(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdownValue === 0) {
      setTimeout(() => setShowIntro(false), 500)
    }
  }, [countdownValue])

  useEffect(() => {
    const target = new Date('2026-07-11T17:00:00-03:00')
    const interval = setInterval(() => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3
  }))

  if (showIntro) {
    return (
      <div style={{ minHeight: '100vh', background: '#06142A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'fixed', inset: 0 }}>
          {stars.map((star) => (
            <div key={star.id} style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: 0.3, animation: `twinkle ${3 + star.delay}s infinite` }} />
          ))}
        </div>
        <div style={{ textAlign: 'center', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '48px', color: '#D7B65D' }}>MISSÃO ESPACIAL</h1>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '64px', color: '#FFD700' }}>DAVI</h2>
          <div style={{ fontSize: '24px', color: 'white', marginTop: '32px' }}>Lançamento em...</div>
          <div style={{ fontSize: '80px', fontFamily: 'Orbitron', color: '#D7B65D', marginTop: '20px', animation: countdownValue > 0 ? 'pulse 1s infinite' : 'fadeOut 0.5s forwards' }}>
            {countdownValue > 0 ? `${countdownValue}` : '🚀'}
          </div>
        </div>
        <style jsx>{`
          @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: 0.7; } }
          @keyframes fadeOut { to { opacity: 0; transform: scale(1.5); visibility: hidden; } }
          @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        `}</style>
      </div>
    )
  }

  
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: -10, background: '#06142A', overflow: 'hidden' }}>
        {stars.map((star) => (
          <div key={star.id} style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: 0.3, animation: `twinkle ${3 + star.delay}s infinite` }} />
        ))}
      </div>

      <div style={{ minHeight: '100vh', padding: '48px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '48px', color: '#D7B65D' }}>🚀 MISSÃO ESPACIAL</h1>
          <h2 style={{ fontFamily: 'Orbitron', fontSize: '36px', color: 'white' }}>7º ANO DO DAVI</h2>
          
          <div style={{ margin: '32px 0', padding: '20px', background: 'rgba(215,182,93,0.1)', borderRadius: '16px' }}>
            <p style={{ color: '#D7B65D', fontSize: '20px', marginBottom: '12px' }}>✨ Você está convidado para uma grande aventura no espaço! ✨</p>
            <p style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Lançamento em 3...2...1... para o 7º ano do Davi</p>
            <p style={{ color: '#D7B65D', fontSize: '24px', fontWeight: 'bold' }}>🚀 Você não pode perder! 🚀</p>
          </div>
          
          {/* Foto com object-position para centralizar melhor */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
            <div style={{ width: '300px', height: '300px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #D7B65D', boxShadow: '0 0 30px rgba(215,182,93,0.5)' }}>
              <img src="/fotos/davi2.jpeg" alt="Davi" style={{ width: '100%', height: '170%', objectFit: 'cover', objectPosition: 'top 20%' }} />
            </div>
          </div>

          {/* Card de Localização */}
          <div style={{ background: 'rgba(17,45,89,0.95)', padding: '28px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #D7B65D' }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '24px', color: '#D7B65D', marginBottom: '8px' }}>📍 LOCALIZAÇÃO</h3>
            <p style={{ fontSize: '18px', color: 'white', marginBottom: '4px' }}>Living Park Sul</p>
            <p style={{ fontSize: '16px', color: '#D7B65D', marginBottom: '16px' }}>Condomínio Living</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700', marginBottom: '16px' }}>11 de Julho de 2026 • 17h</p>
            <a href="https://maps.app.goo.gl/Ab4gCngsNNd6ixraA" target="_blank" style={{ background: '#D7B65D', color: '#06142A', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>Abrir no Google Maps →</a>
          </div>

            {/* Cards com números grandes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', maxWidth: '500px', margin: '0 auto 32px' }}>
            <div style={{ background: 'rgba(11,31,61,0.8)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '36px', color: '#D7B65D' }}>{timeLeft.days}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>DIAS</div>
            </div>
            <div style={{ background: 'rgba(11,31,61,0.8)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '36px', color: '#D7B65D' }}>{timeLeft.hours}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>HORAS</div>
            </div>
            <div style={{ background: 'rgba(11,31,61,0.8)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '36px', color: '#D7B65D' }}>{timeLeft.minutes}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>MINUTOS</div>
            </div>
            <div style={{ background: 'rgba(11,31,61,0.8)', padding: '16px', borderRadius: '8px' }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: '36px', color: '#D7B65D' }}>{timeLeft.seconds}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af' }}>SEGUNDOS</div>
            </div>
          </div>

          {/* Botões */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/ranking"><button style={{ background: 'linear-gradient(135deg, #D7B65D, #FFD700)', color: '#06142A', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🏆 Hall da Fama</button></Link>
            <Link href="/game"><button style={{ background: 'linear-gradient(135deg, #D7B65D, #FFD700)', color: '#06142A', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🎮 Desafio Lunar</button></Link>
          </div>

          <div style={{ marginTop: '48px', padding: '16px', background: 'rgba(215,182,93,0.1)', borderRadius: '8px' }}>
            <p style={{ color: '#D7B65D', fontSize: '14px' }}>💫 Os convites são enviados por WhatsApp com um link exclusivo<br />Aguarde sua missão! 🚀</p>
          </div>
        </div>
      </div>

      <style jsx>{`@keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }`}</style>
    </>
  )
}
