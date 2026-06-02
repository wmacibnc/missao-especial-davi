'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'react-qr-code'
import Link from 'next/link'

export default function ConvitePage() {
  const params = useParams()
  const token = params.token as string
  
  const [convidado, setConvidado] = useState<any>(null)
  const [nomeAtualizado, setNomeAtualizado] = useState('')
  const [acompanhantes, setAcompanhantes] = useState<Array<{nome: string, documento: string}>>([])
  const [loading, setLoading] = useState(true)
  const [confirmado, setConfirmado] = useState(false)
  const [ausente, setAusente] = useState(false)
  const [qrCodeGerado, setQrCodeGerado] = useState(false)
  const [submeter, setSubmeter] = useState(false)
  const [mostrarJustificativa, setMostrarJustificativa] = useState(false)
  const [mostrarModalNome, setMostrarModalNome] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [musicaTocando, setMusicaTocando] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [countdownValue, setCountdownValue] = useState(3)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const introPassou = useRef(false)

  // Animação de lançamento
  useEffect(() => {
    if (countdownValue > 0) {
      const timer = setTimeout(() => setCountdownValue(prev => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdownValue === 0) {
      setTimeout(() => {
        setShowIntro(false)
        introPassou.current = true
      }, 500)
    }
  }, [countdownValue])

  // Inicializar áudio
  useEffect(() => {
    const audioElement = new Audio('/musica/also-sprach-zarathustra.mp3')
    audioElement.loop = true
    audioElement.volume = 0.3
    audioElement.preload = 'auto'
    audioRef.current = audioElement

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [])

  const iniciarMusica = () => {
    if (audioRef.current && !musicaTocando) {
      audioRef.current.play()
        .then(() => setMusicaTocando(true))
        .catch(e => console.log('Erro ao tocar:', e))
    }
  }

  const toggleMusica = () => {
    if (audioRef.current) {
      if (musicaTocando) {
        audioRef.current.pause()
        setMusicaTocando(false)
      } else {
        audioRef.current.play()
          .then(() => setMusicaTocando(true))
          .catch(e => console.log('Erro ao tocar:', e))
      }
    }
  }

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (introPassou.current && audioRef.current && !musicaTocando) {
        audioRef.current.play()
          .then(() => setMusicaTocando(true))
          .catch(e => console.log('Auto-play ainda bloqueado:', e))
      }
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }

    document.addEventListener('click', handleFirstInteraction)
    document.addEventListener('touchstart', handleFirstInteraction)

    return () => {
      document.removeEventListener('click', handleFirstInteraction)
      document.removeEventListener('touchstart', handleFirstInteraction)
    }
  }, [musicaTocando])

  // Countdown do evento
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

  useEffect(() => {
    carregarConvidado()
  }, [token])

  const carregarConvidado = async () => {
    try {
      const res = await fetch(`/api/convite/${token}`)
      const data = await res.json()
      setConvidado(data)
      setNomeAtualizado(data.nome)
      setConfirmado(data.confirmado)
      setAusente(data.ausente || false)
      if (data.limiteConvites > 0 && !data.confirmado && !data.ausente) {
        const camposVazios = Array(data.limiteConvites).fill({ nome: '', documento: '' })
        setAcompanhantes(camposVazios)
      }
    } catch (error) {
      console.error('Erro ao carregar convite:', error)
    } finally {
      setLoading(false)
    }
  }

  const atualizarAcompanhante = (index: number, campo: string, valor: string) => {
    const novos = [...acompanhantes]
    novos[index] = { ...novos[index], [campo]: valor }
    setAcompanhantes(novos)
  }

  const handleConfirmarClick = () => {
    if (nomeAtualizado !== convidado?.nome) {
      setMostrarModalNome(true)
    } else {
      document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const confirmarNome = async () => {
    if (!nomeAtualizado.trim()) {
      alert('Por favor, informe seu nome completo para a entrada na portaria.')
      return
    }
    
    setSubmeter(true)
    try {
      const res = await fetch(`/api/convite/${token}/atualizar-nome`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: nomeAtualizado })
      })
      
      if (res.ok) {
        setConvidado({ ...convidado, nome: nomeAtualizado })
        setMostrarModalNome(false)
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })
      } else {
        alert('Erro ao atualizar nome. Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao atualizar nome:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setSubmeter(false)
    }
  }

  const handleConfirmar = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmeter(true)
    
    const acompanhantesFiltrados = acompanhantes.filter(a => a.nome && a.nome.trim() !== '')
    
    try {
      const res = await fetch(`/api/convite/${token}/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          acompanhantes: acompanhantesFiltrados, 
          ausente: false,
          nome: nomeAtualizado 
        })
      })
      
      if (res.ok) {
        setConfirmado(true)
        setQrCodeGerado(true)
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao confirmar presença')
      }
    } catch (error) {
      console.error('Erro ao confirmar:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setSubmeter(false)
    }
  }

  const handleAusente = async () => {
    setMostrarJustificativa(true)
  }

  const confirmarAusente = async () => {
    setSubmeter(true)
    try {
      const res = await fetch(`/api/convite/${token}/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acompanhantes: [], ausente: true })
      })
      
      if (res.ok) {
        setAusente(true)
        setMostrarJustificativa(false)
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao registrar ausência')
      }
    } catch (error) {
      console.error('Erro ao registrar ausência:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setSubmeter(false)
    }
  }

  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3
  }))

  // Tela de intro
  if (showIntro) {
    return (
      <div 
        style={{ minHeight: '100vh', background: '#06142A', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}
        onClick={iniciarMusica}
        onTouchStart={iniciarMusica}
      >
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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#06142A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#D7B65D', fontSize: '24px' }}>🚀 Carregando...</div>
      </div>
    )
  }

  if (!convidado) {
    return (
      <div style={{ minHeight: '100vh', background: '#06142A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <h1 style={{ color: '#D7B65D' }}>Convite inválido</h1>
          <p>Este link não é válido ou expirou.</p>
          <Link href="/">
            <button style={{ marginTop: '20px', background: '#D7B65D', color: '#06142A', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Voltar ao Site</button>
          </Link>
        </div>
      </div>
    )
  }

  if (confirmado) {
    const qrCodeValue = `${window.location.origin}/admin/checkin?token=${convidado.token}`
    
    return (
      <div style={{ minHeight: '100vh', background: '#06142A', padding: '20px' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
          {stars.map((star) => (
            <div key={star.id} style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: 0.3, animation: `twinkle ${3 + star.delay}s infinite` }} />
          ))}
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: '#0B1F3D',
            padding: '40px',
            borderRadius: '8px',
            border: '2px solid #D7B65D'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ color: '#D7B65D', fontSize: '28px', marginBottom: '16px' }}>
              Confirmação Recebida!
            </h1>
            <p style={{ color: 'white', marginBottom: '32px' }}>
              {convidado.nome}, sua presença foi confirmada com sucesso!
            </p>
                        
            <Link href="/">
              <button style={{
                background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
                color: '#06142A',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Voltar para o site
              </button>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        `}</style>
      </div>
    )
  }

  if (ausente) {
    return (
      <div style={{ minHeight: '100vh', background: '#06142A', padding: '20px' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
          {stars.map((star) => (
            <div key={star.id} style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: 0.3, animation: `twinkle ${3 + star.delay}s infinite` }} />
          ))}
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: '#0B1F3D',
            padding: '40px',
            borderRadius: '8px',
            border: '2px solid #f87171'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>💔</div>
            <h1 style={{ color: '#f87171', fontSize: '28px', marginBottom: '16px' }}>
              Que pena!
            </h1>
            
            <Link href="/">
              <button style={{
                background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
                color: '#06142A',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}>
                Voltar para o site
              </button>
            </Link>
          </div>
        </div>

        <style jsx>{`
          @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        `}</style>
      </div>
    )
  }

  return (
    <div 
      style={{ minHeight: '100vh', background: '#06142A' }}
      onClick={iniciarMusica}
      onTouchStart={iniciarMusica}
    >
      {/* Fundo estrelado */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
        {stars.map((star) => (
          <div key={star.id} style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, opacity: 0.3, animation: `twinkle ${3 + star.delay}s infinite` }} />
        ))}
      </div>

      {/* Botão de música */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleMusica(); }}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(11,31,61,0.9)',
          border: '1px solid #D7B65D',
          color: '#D7B65D',
          fontSize: '24px',
          cursor: 'pointer',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {musicaTocando ? '🔊' : '🔇'}
      </button>

      {!musicaTocando && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '20px',
          background: 'rgba(0,0,0,0.7)',
          color: '#D7B65D',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '10px',
          zIndex: 100
        }}>
          Toque aqui 🔈
        </div>
      )}

      {/* Modal de confirmação de ausência */}
      {mostrarJustificativa && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            background: '#0B1F3D',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid #f87171'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💔</div>
            <h2 style={{ color: '#D7B65D', marginBottom: '16px' }}>Tem certeza?</h2>
            <p style={{ color: 'white', marginBottom: '24px' }}>
              Você está prestes a marcar que não poderá comparecer.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setMostrarJustificativa(false)}
                style={{
                  flex: 1,
                  background: 'rgba(156,163,175,0.2)',
                  color: '#9ca3af',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAusente}
                disabled={submeter}
                style={{
                  flex: 1,
                  background: '#f87171',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: submeter ? 0.7 : 1
                }}
              >
                {submeter ? 'Confirmando...' : 'Sim, não poderei ir'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para atualizar nome */}
      {mostrarModalNome && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '20px'
        }}>
          <div style={{
            background: '#0B1F3D',
            padding: '32px',
            borderRadius: '16px',
            maxWidth: '450px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid #D7B65D'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h2 style={{ color: '#D7B65D', marginBottom: '16px' }}>Confirme seu nome completo</h2>
            <p style={{ color: '#9ca3af', marginBottom: '8px', fontSize: '14px' }}>
              ⚠️ <strong>ATENÇÃO:</strong> Para garantir sua entrada na portaria do condomínio,<br />
              precisamos do seu <strong>nome completo</strong> como está no documento.
            </p>
            <p style={{ color: '#facc15', marginBottom: '24px', fontSize: '13px' }}>
              Isso é obrigatório para liberação na portaria!
            </p>
            
            <input
              type="text"
              placeholder="Nome completo (ex: Gilca Franco da Silva)"
              value={nomeAtualizado}
              onChange={(e) => setNomeAtualizado(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                marginBottom: '16px',
                background: '#06142A',
                color: 'white',
                border: '1px solid #D7B65D',
                borderRadius: '8px',
                fontSize: '16px'
              }}
              autoFocus
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setMostrarModalNome(false)}
                style={{
                  flex: 1,
                  background: 'rgba(156,163,175,0.2)',
                  color: '#9ca3af',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarNome}
                disabled={submeter}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
                  color: '#06142A',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  opacity: submeter ? 0.7 : 1
                }}
              >
                {submeter ? 'Salvando...' : 'Salvar e continuar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: '48px 16px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          {/* Título */}
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '48px', color: '#D7B65D', marginBottom: '16px' }}>
            🚀 MISSÃO ESPACIAL
          </h1>
          <h2 style={{ fontFamily: 'Orbitron, monospace', fontSize: '36px', color: 'white', marginBottom: '48px' }}>
            7º ANO DO DAVI
          </h2>
          
          {/* Foto do Davi */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px' }}>
            <div style={{ width: '300px', height: '300px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #D7B65D', boxShadow: '0 0 30px rgba(215,182,93,0.5)' }}>
              <img src="/fotos/davi2.jpeg" alt="Davi" style={{ width: '100%', height: '170%', objectFit: 'cover', objectPosition: 'top 20%' }} />
            </div>
          </div>

          {/* Frases */}
          <div style={{ margin: '32px 0', padding: '20px', background: 'rgba(215,182,93,0.1)', borderRadius: '16px' }}>
            <p style={{ color: '#D7B65D', fontSize: '20px', marginBottom: '12px' }}>✨ Olá! ✨</p>
            <p style={{ color: 'white', fontSize: '18px', marginBottom: '8px' }}>Você está convidado(a) para a grande aventura espacial do Davi!</p>
          </div>

          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
            <button
              onClick={handleConfirmarClick}
              style={{
                background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
                color: '#06142A',
                padding: '14px 28px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              🚀 CONFIRMAR PRESENÇA
            </button>
            <button
              onClick={handleAusente}
              style={{
                background: 'rgba(239,68,68,0.15)',
                color: '#f87171',
                padding: '14px 28px',
                borderRadius: '12px',
                border: '1px solid #f87171',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ❌ Infelizmente não vou conseguir ir
            </button>
          </div>

          {/* Aviso de prazo */}
          <div style={{ background: 'rgba(215,182,93,0.15)', padding: '12px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', border: '1px solid rgba(215,182,93,0.3)' }}>
            <p style={{ color: '#facc15', fontSize: '14px', fontWeight: 'bold' }}>
              ⚠️ Confirme sua presença até o dia 25/05/2026
            </p>
          </div>

          {/* Countdown */}
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

          {/* Localização */}
          <div style={{ background: 'rgba(17,45,89,0.95)', padding: '28px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #D7B65D' }}>
            <h3 style={{ fontFamily: 'Orbitron', fontSize: '24px', color: '#D7B65D', marginBottom: '8px' }}>📍 LOCALIZAÇÃO</h3>
            <p style={{ fontSize: '18px', color: 'white', marginBottom: '4px' }}>Living Park Sul</p>
            <p style={{ fontSize: '16px', color: '#D7B65D', marginBottom: '16px' }}>Salão de Festas - Bloco E</p>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFD700', marginBottom: '16px' }}>11 de Julho de 2026 • 17h</p>
            <a href="https://maps.app.goo.gl/Ab4gCngsNNd6ixraA" target="_blank" style={{ background: '#D7B65D', color: '#06142A', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>Abrir no Google Maps →</a>
          </div>

          {/* Formulário de confirmação de presença */}
          <div id="formulario" style={{
            background: 'rgba(11,31,61,0.95)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(215,182,93,0.3)'
          }}>
            <form onSubmit={handleConfirmar}>
              <h2 style={{ color: '#D7B65D', marginBottom: '24px', fontSize: '24px' }}>Confirme sua presença</h2>
              
              {/* Nome do convidado principal - somente leitura após salvo */}
              <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
                <label style={{ color: '#D7B65D', fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                  📝 Seu nome completo (para portaria)
                </label>
                <input
                  type="text"
                  value={nomeAtualizado}
                  onChange={(e) => setNomeAtualizado(e.target.value)}
                  placeholder="Digite seu nome completo"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#06142A',
                    color: 'white',
                    border: '1px solid #D7B65D',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
                <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '6px' }}>
                  ⚠️ Nome completo obrigatório para liberação na portaria do condomínio
                </p>
              </div>
              
              {convidado.limiteConvites === 0 ? (
                <div style={{ background: 'rgba(74,222,128,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
                </div>
              ) : (
                <>
                  <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
                    Você pode levar até <strong>{convidado.limiteConvites}</strong> acompanhante(s)
                  </p>
                  <p style={{ color: '#D7B65D', marginBottom: '24px', fontSize: '13px' }}>
                    💡 Preencha apenas os nomes dos acompanhantes que irão com você.
                  </p>

                  {acompanhantes.map((acomp, index) => (
                    <div key={index} style={{
                      borderTop: index > 0 ? '1px solid rgba(215, 182, 93, 0.2)' : 'none',
                      paddingTop: index > 0 ? '20px' : '0',
                      marginTop: index > 0 ? '20px' : '0'
                    }}>
                      <h3 style={{ color: '#D7B65D', fontSize: '16px', marginBottom: '12px' }}>
                        Acompanhante {index + 1}
                      </h3>
                      <input
                        type="text"
                        placeholder="Nome completo"
                        value={acomp.nome}
                        onChange={(e) => atualizarAcompanhante(index, 'nome', e.target.value)}
                        style={{
                          width: '100%',
                          padding: '14px',
                          marginBottom: '8px',
                          background: '#06142A',
                          color: 'white',
                          border: '1px solid #D7B65D',
                          borderRadius: '8px',
                          fontSize: '16px'
                        }}
                      />
                      <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>
                        Nome completo para controle de acesso
                      </p>
                    </div>
                  ))}
                </>
              )}

              <button
                type="submit"
                disabled={submeter}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
                  color: '#06142A',
                  padding: '16px',
                  borderRadius: '12px',
                  border: 'none',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer',
                  marginTop: '32px',
                  opacity: submeter ? 0.7 : 1
                }}
              >
                {submeter ? 'Confirmando...' : '🚀 CONFIRMAR PRESENÇA'}
              </button>
            </form>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
      `}</style>
    </div>
  )
}
