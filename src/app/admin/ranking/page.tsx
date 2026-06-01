'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminRankingPage() {
  const [rankings, setRankings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarRanking()
  }, [])

  const carregarRanking = async () => {
    const res = await fetch('/api/ranking')
    const data = await res.json()
    setRankings(data)
    setLoading(false)
  }

  const excluirPontuacao = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pontuação?')) {
      const res = await fetch(`/api/ranking/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        console.log('✅ Pontuação excluída com sucesso!')
        carregarRanking()
      } else {
        alert('❌ Erro ao excluir pontuação')
      }
    }
  }

  const limparRanking = async () => {
    if (confirm('⚠️ ATENÇÃO! Isso irá excluir TODAS as pontuações do ranking.\n\nEsta ação não pode ser desfeita. Deseja continuar?')) {
      const res = await fetch('/api/ranking/limpar', {
        method: 'DELETE'
      })
      if (res.ok) {
        alert('✅ Ranking limpo com sucesso!')
        carregarRanking()
      } else {
        alert('❌ Erro ao limpar ranking')
      }
    }
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
      {/* Fundo estrelado */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
        {stars.map((star) => (
          <div key={star.id} className="animate-twinkle" style={{ 
            position: 'absolute', 
            background: 'white', 
            borderRadius: '50%', 
            left: `${star.left}%`, 
            top: `${star.top}%`, 
            width: star.size, 
            height: star.size, 
            animationDelay: `${star.delay}s` 
          }} />
        ))}
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        {/* Cabeçalho */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '32px', color: '#D7B65D' }}>🏆 Gerenciar Ranking</h1>
            <p style={{ color: '#9ca3af', marginTop: '8px' }}>Gerencie as pontuações do Hall da Fama Galáctico</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={limparRanking} style={{ background: '#ef4444', color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ Limpar Ranking</button>
            <Link href="/admin"><button style={{ background: '#0B1F3D', color: '#D7B65D', padding: '10px 20px', borderRadius: '8px', border: '1px solid #D7B65D', cursor: 'pointer' }}>← Voltar</button></Link>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div style={{ background: 'rgba(11,31,61,0.8)', borderRadius: '8px', padding: '24px', border: '1px solid rgba(215,182,93,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <h2 style={{ color: '#D7B65D', fontSize: '20px' }}>📊 Pontuações ({rankings.length})</h2>
            <button onClick={() => window.location.href = '/ranking'} style={{ background: '#112D59', color: '#D7B65D', padding: '6px 12px', borderRadius: '4px', border: '1px solid #D7B65D', cursor: 'pointer', fontSize: '14px' }}>👁️ Ver Ranking Público</button>
          </div>

          {loading ? (
            <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Carregando...</div>
          ) : rankings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
              <p>🏆 Nenhuma pontuação registrada ainda</p>
              <p style={{ fontSize: '14px', marginTop: '8px' }}>Quando alguém jogar o Desafio Lunar, as pontuações aparecerão aqui.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#0B1F3D', borderBottom: '2px solid #D7B65D' }}>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Posição</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#D7B65D' }}>Nome</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Pontuação</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Data</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((item: any, index: number) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid rgba(215,182,93,0.2)' }}>
                      <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}º`}</td>
                      <td style={{ padding: '12px', color: 'white' }}>{item.nome}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#D7B65D', fontWeight: 'bold' }}>{item.pontuacao} pts</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button onClick={() => excluirPontuacao(item.id)} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>🗑️ Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dica */}
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(17,45,89,0.5)', borderRadius: '8px', border: '1px solid rgba(215,182,93,0.2)' }}>
          <p style={{ color: '#9ca3af', fontSize: '12px', textAlign: 'center' }}>💡 Dica: Use "Limpar Ranking" para remover todas as pontuações de uma vez. Use "Excluir" para remover pontuações específicas.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
