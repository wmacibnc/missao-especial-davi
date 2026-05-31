'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function RankingPage() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarRanking()
  }, [])

  const carregarRanking = async () => {
    try {
      const res = await fetch('/api/ranking')
      const data = await res.json()
      setRankings(data)
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    } finally {
      setLoading(false)
    }
  }

  // Criar estrelas
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3
  }))

  return (
    <>
      {/* Fundo estrelado */}
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

      <div style={{ minHeight: '100vh', padding: '32px 16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/">
            <button style={{
              marginBottom: '24px',
              background: '#0B1F3D',
              color: '#D7B65D',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #D7B65D',
              cursor: 'pointer'
            }}>
              ← Voltar
            </button>
          </Link>

          <div style={{
            background: 'rgba(11, 31, 61, 0.8)',
            backdropFilter: 'blur(8px)',
            borderRadius: '8px',
            padding: '32px',
            border: '1px solid rgba(215, 182, 93, 0.3)'
          }}>
            <h1 style={{
              fontFamily: 'Orbitron, monospace',
              fontSize: '36px',
              color: '#D7B65D',
              textAlign: 'center',
              marginBottom: '8px'
            }}>
              🏆 HALL DA FAMA GALÁCTICO
            </h1>
            <p style={{
              color: '#9ca3af',
              textAlign: 'center',
              marginBottom: '32px'
            }}>
              Os melhores pilotos do Desafio Lunar
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', color: 'white' }}>Carregando ranking...</div>
            ) : rankings.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'white' }}>
                <p>🌟 Nenhuma pontuação registrada ainda</p>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>Seja o primeiro no Desafio Lunar!</p>
              </div>
            ) : (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '80px 1fr 100px',
                  gap: '16px',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  fontWeight: 'bold',
                  color: '#D7B65D'
                }}>
                  <div style={{ textAlign: 'center' }}>Posição</div>
                  <div>Nome</div>
                  <div style={{ textAlign: 'center' }}>Pontuação</div>
                </div>

                {rankings.map((item: any, index: number) => (
                  <div key={item.id} style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 100px',
                    gap: '16px',
                    padding: '12px',
                    borderBottom: '1px solid rgba(215, 182, 93, 0.2)',
                    color: 'white',
                    backgroundColor: index === 0 ? 'rgba(215, 182, 93, 0.1)' : 'transparent'
                  }}>
                    <div style={{ textAlign: 'center', fontSize: '24px' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}
                    </div>
                    <div>{item.nome}</div>
                    <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#D7B65D' }}>{item.pontuacao} pts</div>
                  </div>
                ))}
              </div>
            )}
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
    </>
  )
}
