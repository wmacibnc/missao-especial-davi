'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

export default function GamePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mostrarMenu, setMostrarMenu] = useState(true)
  const gameRunning = useRef<boolean>(false)
  const animationRef = useRef<number | undefined>(undefined)
  const playerX = useRef<number>(50)
  const starsRef = useRef<Array<{x: number, y: number}>>([])
  const meteorsRef = useRef<Array<{x: number, y: number}>>([])
  const effectsRef = useRef<Array<{x: number, y: number, type: string, life: number}>>([])
  const scoreRef = useRef<number>(0)
  const timeRef = useRef<number>(0)
  const gameLoopRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') playerX.current = Math.max(5, playerX.current - 12)
      if (e.key === 'ArrowRight') playerX.current = Math.min(95, playerX.current + 12)
      if (e.key === 'Escape' && gameRunning.current) endGame()
    }
    window.addEventListener('keydown', handleKeyDown)
    
    const draw = () => {
      if (!ctx || !canvas) return
      
      ctx.fillStyle = '#06142A'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < 150; i++) {
        if (!window['star' + i]) {
          window['star' + i] = { x: Math.random() * canvas.width, y: Math.random() * canvas.height, size: Math.random() * 2 + 1 }
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`
        ctx.fillRect(window['star' + i].x, window['star' + i].y, window['star' + i].size, window['star' + i].size)
      }
      
      effectsRef.current = effectsRef.current.filter(effect => {
        effect.life -= 2
        if (effect.life <= 0) return false
        
        ctx.font = `${30 + (30 - effect.life)}px Arial`
        ctx.globalAlpha = effect.life / 30
        if (effect.type === 'star') {
          ctx.fillStyle = '#FFD700'
          ctx.fillText('⭐', effect.x, effect.y)
          ctx.font = `bold ${20 + (30 - effect.life)}px Arial`
          ctx.fillStyle = '#4ade80'
          ctx.fillText('+10', effect.x + 20, effect.y - 20)
        } else if (effect.type === 'meteor') {
          ctx.fillStyle = '#f87171'
          ctx.fillText('💥', effect.x, effect.y)
          ctx.font = `bold ${20 + (30 - effect.life)}px Arial`
          ctx.fillStyle = '#f87171'
          ctx.fillText('-5', effect.x + 20, effect.y - 20)
        }
        ctx.globalAlpha = 1
        return true
      })
      
      starsRef.current.forEach(star => {
        ctx.font = '32px Arial'
        ctx.fillStyle = '#FFD700'
        ctx.shadowBlur = 10
        ctx.shadowColor = '#FFD700'
        ctx.fillText('⭐', star.x, star.y)
        ctx.shadowBlur = 0
      })
      
      meteorsRef.current.forEach(meteor => {
        ctx.font = '38px Arial'
        ctx.fillStyle = '#f87171'
        ctx.shadowBlur = 8
        ctx.shadowColor = '#f87171'
        ctx.fillText('💥', meteor.x, meteor.y)
        ctx.shadowBlur = 0
      })
      
      const naveX = (playerX.current / 100) * canvas.width
      const naveY = canvas.height - 80
      ctx.font = '60px Arial'
      ctx.fillStyle = '#D7B65D'
      ctx.shadowBlur = 15
      ctx.shadowColor = '#D7B65D'
      ctx.fillText('🚀', naveX - 30, naveY)
      ctx.shadowBlur = 0
      
      ctx.font = 'bold 26px Orbitron'
      ctx.fillStyle = '#D7B65D'
      ctx.fillText(`⭐ ${scoreRef.current}`, 20, 50)
      ctx.fillText(`⏱️ ${timeRef.current}s`, canvas.width - 150, 50)
      
      animationRef.current = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', handleKeyDown)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    }
  }, [])
  
  const startGame = (duration: number) => {
    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    
    gameRunning.current = true
    setMostrarMenu(false)
    scoreRef.current = 0
    timeRef.current = duration
    starsRef.current = []
    meteorsRef.current = []
    effectsRef.current = []
    playerX.current = 50
    
    const timer = setInterval(() => {
      if (!gameRunning.current) {
        clearInterval(timer)
        return
      }
      timeRef.current--
      if (timeRef.current <= 0) {
        clearInterval(timer)
        endGame()
      }
    }, 1000)
    
    gameLoopRef.current = setInterval(() => {
      if (!gameRunning.current) return
      
      const canvas = canvasRef.current
      if (!canvas) return
      const width = canvas.width
      const height = canvas.height
      
      if (Math.random() < 0.35) {
        starsRef.current.push({
          x: Math.random() * (width - 60) + 30,
          y: 30
        })
      }
      
      if (Math.random() < 0.12) {
        meteorsRef.current.push({
          x: Math.random() * (width - 60) + 30,
          y: 30
        })
      }
      
      const naveX = (playerX.current / 100) * width
      const naveY = height - 80
      const raioColisao = 35
      
      starsRef.current = starsRef.current.filter(star => {
        star.y += 9
        
        const dx = star.x - naveX
        const dy = star.y - naveY
        const distancia = Math.sqrt(dx * dx + dy * dy)
        
        if (distancia < raioColisao) {
          scoreRef.current += 10
          effectsRef.current.push({
            x: naveX,
            y: naveY,
            type: 'star',
            life: 30
          })
          return false
        }
        return star.y < height
      })
      
      meteorsRef.current = meteorsRef.current.filter(meteor => {
        meteor.y += 7
        
        const dx = meteor.x - naveX
        const dy = meteor.y - naveY
        const distancia = Math.sqrt(dx * dx + dy * dy)
        
        if (distancia < raioColisao) {
          scoreRef.current = Math.max(0, scoreRef.current - 5)
          effectsRef.current.push({
            x: naveX,
            y: naveY,
            type: 'meteor',
            life: 30
          })
          return false
        }
        return meteor.y < height
      })
    }, 40)
  }
  
  const endGame = () => {
    gameRunning.current = false
    if (gameLoopRef.current) clearInterval(gameLoopRef.current)
    
    const finalScore = scoreRef.current
    const playerName = prompt(`🎉 Fim de jogo! Sua pontuação: ${finalScore}\n\nDigite seu nome para salvar no ranking:`)
    
    if (playerName && playerName.trim()) {
      fetch('/api/ranking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: playerName, pontuacao: finalScore })
      }).then(() => {
        alert('✅ Pontuação salva no Hall da Fama!')
        window.location.href = '/ranking'
      }).catch(() => {
        alert('❌ Erro ao salvar')
        setMostrarMenu(true)
      })
    } else {
      setMostrarMenu(true)
    }
  }
  
  return (
    <div style={{ minHeight: '100vh', background: '#06142A', position: 'relative' }}>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'block' }} />
      
      {mostrarMenu && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(11,31,61,0.95)',
          padding: '40px',
          borderRadius: '16px',
          textAlign: 'center',
          zIndex: 20,
          minWidth: '320px',
          backdropFilter: 'blur(8px)',
          border: '1px solid #D7B65D'
        }}>
          <h1 style={{ fontFamily: 'Orbitron', fontSize: '36px', color: '#D7B65D', marginBottom: '20px' }}>🚀 DESAFIO LUNAR</h1>
          <p style={{ color: 'white', marginBottom: '30px', fontSize: '18px' }}>Escolha a dificuldade:</p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => startGame(15)} style={{ background: '#4ade80', padding: '15px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>🌱 Fácil - 15s</button>
            <button onClick={() => startGame(20)} style={{ background: '#facc15', padding: '15px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>⚡ Médio - 20s</button>
            <button onClick={() => startGame(30)} style={{ background: '#f87171', padding: '15px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>🔥 Difícil - 30s</button>
          </div>
          <Link href="/">
            <button style={{ marginTop: '30px', background: '#0B1F3D', color: '#D7B65D', padding: '10px 25px', borderRadius: '8px', border: '1px solid #D7B65D', cursor: 'pointer' }}>← Voltar ao Site</button>
          </Link>
          <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(215,182,93,0.3)' }}>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>⭐ Estrela: +10 pontos | 💥 Meteoro: -5 pontos</p>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>🎮 Use as setas ← → para mover a nave</p>
          </div>
        </div>
      )}
    </div>
  )
}
