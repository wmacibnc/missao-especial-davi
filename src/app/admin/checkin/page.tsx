'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

// Componente que usa useSearchParams (precisa estar dentro de Suspense)
function CheckinContent() {
  const searchParams = useSearchParams()
  const tokenParam = searchParams.get('token')
  
  const [token, setToken] = useState(tokenParam || '')
  const [convidado, setConvidado] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [scannerActive, setScannerActive] = useState(false)

  // Resto do código permanece igual...
  const buscarConvidado = async () => {
    if (!token) {
      setMessage('Digite ou escaneie o token do convite')
      return
    }
    
    setLoading(true)
    setMessage('')
    
    try {
      const res = await fetch(`/api/convite/${token}`)
      const data = await res.json()
      
      if (res.ok) {
        setConvidado(data)
        setMessage(`✅ Convidado encontrado: ${data.nome}`)
      } else {
        setConvidado(null)
        setMessage('❌ Convite não encontrado')
      }
    } catch (error) {
      setMessage('❌ Erro ao buscar convidado')
    } finally {
      setLoading(false)
    }
  }

  const fazerCheckin = async () => {
    if (!convidado) return
    
    setLoading(true)
    
    try {
      const res = await fetch(`/api/checkin/${convidado.token}`, {
        method: 'POST'
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setMessage(`✅ Check-in realizado com sucesso para ${convidado.nome}!`)
        setConvidado({ ...convidado, checkinRealizado: true })
        setTimeout(() => {
          setToken('')
          setConvidado(null)
          setMessage('')
        }, 3000)
      } else {
        setMessage(data.error || '❌ Erro ao fazer check-in')
      }
    } catch (error) {
      setMessage('❌ Erro ao processar check-in')
    } finally {
      setLoading(false)
    }
  }

  const iniciarScanner = () => {
    setScannerActive(true)
    setMessage('📱 Modo de escaneamento ativo. Digite o token manualmente ou cole o link.')
  }

  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3
  }))

  return (
    <div style={{ minHeight: '100vh', background: '#06142A' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: -10, background: '#06142A', overflow: 'hidden' }}>
        {stars.map((star) => (
          <div
            key={star.id}
            className="animate-twinkle"
            style={{
              position: 'absolute',
              background: 'white',
              borderRadius: '50%',
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: star.size,
              height: star.size,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
        <div style={{
          background: 'rgba(11, 31, 61, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: '8px',
          padding: '32px',
          border: '1px solid rgba(215, 182, 93, 0.3)'
        }}>
          <h1 style={{
            fontFamily: 'Orbitron, monospace',
            fontSize: '28px',
            color: '#D7B65D',
            textAlign: 'center',
            marginBottom: '8px'
          }}>
            📱 CHECK-IN
          </h1>
          <p style={{ color: '#9ca3af', textAlign: 'center', marginBottom: '32px' }}>
            Escaneie o QR Code ou digite o token do convite
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ color: '#D7B65D', display: 'block', marginBottom: '8px' }}>
              Token do Convite:
            </label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Cole o token aqui..."
              style={{
                width: '100%',
                padding: '12px',
                background: '#06142A',
                color: 'white',
                border: '1px solid #D7B65D',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={buscarConvidado}
              disabled={loading}
              style={{
                flex: 1,
                background: '#D7B65D',
                color: '#06142A',
                padding: '12px',
                borderRadius: '4px',
                border: 'none',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Buscar
            </button>
            <button
              onClick={iniciarScanner}
              style={{
                flex: 1,
                background: '#0B1F3D',
                color: '#D7B65D',
                padding: '12px',
                borderRadius: '4px',
                border: '1px solid #D7B65D',
                cursor: 'pointer'
              }}
            >
              📷 Simular Scanner
            </button>
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '4px',
              marginBottom: '24px',
              background: message.includes('✅') ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.includes('✅') ? '#4ade80' : '#f87171',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          {convidado && (
            <div style={{
              background: '#112D59',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ color: '#D7B65D', marginBottom: '16px' }}>Dados do Convidado:</h3>
              <p><strong style={{ color: '#D7B65D' }}>Nome:</strong> {convidado.nome}</p>
              <p><strong style={{ color: '#D7B65D' }}>Telefone:</strong> {convidado.telefone}</p>
              <p><strong style={{ color: '#D7B65D' }}>Acompanhantes:</strong> {convidado.acompanhantes?.length || 0}</p>
              <p>
                <strong style={{ color: '#D7B65D' }}>Status:</strong>{' '}
                <span style={{
                  color: convidado.checkinRealizado ? '#4ade80' : '#facc15'
                }}>
                  {convidado.checkinRealizado ? '✅ Check-in realizado' : '⏳ Aguardando check-in'}
                </span>
              </p>
              
              {!convidado.checkinRealizado && (
                <button
                  onClick={fazerCheckin}
                  disabled={loading}
                  style={{
                    width: '100%',
                    marginTop: '16px',
                    background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
                    color: '#06142A',
                    padding: '12px',
                    borderRadius: '4px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✅ Confirmar Check-in
                </button>
              )}
            </div>
          )}

          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#9ca3af', fontSize: '12px' }}>
              💡 Dica: O QR Code é gerado automaticamente após a confirmação do convite
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

// Página principal com Suspense
import { useState } from 'react'

export default function CheckinPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#06142A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Carregando...</div>}>
      <CheckinContent />
    </Suspense>
  )
}
