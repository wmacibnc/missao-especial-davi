'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QRCode from 'react-qr-code'

export default function ConvitePage() {
  const params = useParams()
  const token = params.token as string
  
  const [convidado, setConvidado] = useState<any>(null)
  const [acompanhantes, setAcompanhantes] = useState([{ nome: '', documento: '' }])
  const [loading, setLoading] = useState(true)
  const [confirmado, setConfirmado] = useState(false)
  const [qrCodeGerado, setQrCodeGerado] = useState(false)
  const [submeter, setSubmeter] = useState(false)

  useEffect(() => {
    carregarConvidado()
  }, [token])

  const carregarConvidado = async () => {
    try {
      const res = await fetch(`/api/convite/${token}`)
      const data = await res.json()
      setConvidado(data)
      setConfirmado(data.confirmado)
      if (data.limiteConvites > 0) {
        setAcompanhantes(Array(data.limiteConvites).fill({ nome: '', documento: '' }))
      }
    } catch (error) {
      console.error('Erro ao carregar convite:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmeter(true)
    
    const acompanhantesFiltrados = acompanhantes.filter(a => a.nome.trim() !== '')
    
    try {
      const res = await fetch(`/api/convite/${token}/confirmar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acompanhantes: acompanhantesFiltrados })
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
        </div>
      </div>
    )
  }

  if (confirmado) {
    const qrCodeValue = `${window.location.origin}/admin/checkin?token=${convidado.token}`
    
    return (
      <div style={{ minHeight: '100vh', background: '#06142A', padding: '20px' }}>
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
            
            {qrCodeGerado && (
              <div style={{ marginBottom: '32px' }}>
                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', display: 'inline-block' }}>
                  <QRCode value={qrCodeValue} size={200} />
                </div>
                <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '12px' }}>
                  Guarde este QR Code para o check-in no evento!
                </p>
              </div>
            )}
            
            <a href="/">
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
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06142A', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{
          background: '#0B1F3D',
          borderRadius: '8px',
          padding: '32px',
          border: '1px solid rgba(215, 182, 93, 0.3)'
        }}>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '32px', color: '#D7B65D', textAlign: 'center', marginBottom: '8px' }}>
            MISSÃO ESPACIAL DAVI
          </h1>
          <p style={{ color: 'white', textAlign: 'center', marginBottom: '32px' }}>
            Olá, <strong>{convidado.nome}</strong>! Você está convidado para a festa de 7 anos do Davi.
          </p>

          <div style={{ background: '#112D59', padding: '16px', borderRadius: '8px', marginBottom: '32px' }}>
            <p style={{ color: '#D7B65D' }}>📅 Data: 11 de Julho de 2026</p>
            <p style={{ color: '#D7B65D' }}>⏰ Horário: 17h</p>
            <p style={{ color: '#D7B65D' }}>📍 Local: Living Park Sul - Condomínio Living</p>
          </div>

          <form onSubmit={handleSubmit}>
            <h2 style={{ color: '#D7B65D', marginBottom: '16px' }}>Confirme sua presença</h2>
            
            {convidado.limiteConvites === 0 ? (
              <div style={{ background: 'rgba(74,222,128,0.1)', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
                <p style={{ color: '#4ade80', fontSize: '18px' }}>✨ Este convite é apenas para você ✨</p>
                <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px' }}>Você virá sem acompanhantes</p>
              </div>
            ) : (
              <>
                <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
                  Você pode levar até {convidado.limiteConvites} acompanhante(s)
                </p>
                <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '12px' }}>
                  💡 Deixe os campos em branco se não quiser levar acompanhantes
                </p>

                {[...Array(convidado.limiteConvites)].map((_, index) => (
                  <div key={index} style={{
                    borderTop: index > 0 ? '1px solid rgba(215, 182, 93, 0.2)' : 'none',
                    paddingTop: index > 0 ? '16px' : '0',
                    marginTop: index > 0 ? '16px' : '0'
                  }}>
                    <h3 style={{ color: '#D7B65D', fontSize: '16px', marginBottom: '12px' }}>
                      Acompanhante {index + 1} {index === 0 && '(opcional)'}
                    </h3>
                    <input
                      type="text"
                      placeholder="Nome completo (opcional)"
                      value={acompanhantes[index]?.nome || ''}
                      onChange={(e) => {
                        const newAcompanhantes = [...acompanhantes]
                        newAcompanhantes[index] = { ...newAcompanhantes[index], nome: e.target.value }
                        setAcompanhantes(newAcompanhantes)
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        marginBottom: '12px',
                        background: '#06142A',
                        color: 'white',
                        border: '1px solid #D7B65D',
                        borderRadius: '4px'
                      }}
                    />
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
                borderRadius: '8px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
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
  )
}
