'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminHome() {
  const router = useRouter()
  const [stats, setStats] = useState({ 
    totalConvidados: 0, 
    totalConfirmados: 0, 
    totalAusentes: 0,
    totalPendentes: 0,
    totalAcompanhantesConfirmados: 0,
    totalPessoasEvento: 0,
    taxaConfirmacao: 0 
  })

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(setStats)
      .catch(() => { })
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const stars = Array.from({ length: 100 }, (_, i) => ({ id: i, left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 3 }))

  return (
    <div style={{ minHeight: '100vh', background: '#06142A' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
        {stars.map((star) => (<div key={star.id} className="animate-twinkle" style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }} />))}
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div><h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '32px', color: '#D7B65D' }}>🚀 Missão Espacial Davi</h1><p style={{ color: '#9ca3af' }}>Painel de Controle</p></div>
          <button onClick={handleLogout} style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>Sair</button>
        </div>

        {/* Cards principais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#0B1F3D', padding: '20px', borderRadius: '8px', border: '1px solid rgba(215,182,93,0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#D7B65D' }}>{stats.totalConvidados}</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Total de Convidados</div>
          </div>
          <div style={{ background: '#0B1F3D', padding: '20px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4ade80' }}>{stats.totalConfirmados}</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Confirmados</div>
          </div>
          <div style={{ background: '#0B1F3D', padding: '20px', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f87171' }}>{stats.totalAusentes}</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Ausentes</div>
          </div>
          <div style={{ background: '#0B1F3D', padding: '20px', borderRadius: '8px', border: '1px solid rgba(250,204,21,0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#facc15' }}>{stats.totalPendentes}</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Pendentes</div>
          </div>
        </div>

        {/* Cards de somatório */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#112D59', padding: '20px', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80' }}>{stats.totalAcompanhantesConfirmados}</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Acompanhantes Confirmados</div>
          </div>
          <div style={{ background: '#112D59', padding: '20px', borderRadius: '8px', border: '1px solid #D7B65D' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D7B65D' }}>{stats.totalPessoasEvento}</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Total de Pessoas no Evento</div>
            <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>(Convidados + Acompanhantes)</div>
          </div>
          <div style={{ background: '#112D59', padding: '20px', borderRadius: '8px', border: '1px solid rgba(96,165,250,0.3)' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#60a5fa' }}>{stats.taxaConfirmacao}%</div>
            <div style={{ color: 'white', fontSize: '14px' }}>Taxa de Confirmação</div>
            <div style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>(Entre quem respondeu)</div>
          </div>
        </div>

        {/* Cards de navegação */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <Link href="/admin/convidados">
            <div style={{ background: '#112D59', padding: '32px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>👥</div>
              <h3 style={{ color: '#D7B65D', marginTop: '12px' }}>Convidados</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Cadastrar e enviar convites</p>
            </div>
          </Link>
          <Link href="/admin/presencas">
            <div style={{ background: '#112D59', padding: '32px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>📋</div>
              <h3 style={{ color: '#D7B65D', marginTop: '12px' }}>Presenças</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Lista e exportar Excel</p>
            </div>
          </Link>
          <Link href="/admin/ranking">
            <div style={{ background: '#112D59', padding: '32px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '48px' }}>🏆</div>
              <h3 style={{ color: '#D7B65D', marginTop: '12px' }}>Ranking</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Gerenciar pontuações</p>
            </div>
          </Link>
        </div>
      </div>
      <style jsx>{`@keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } } .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }`}</style>
    </div>
  )
}
