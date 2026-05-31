'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ total: 0, confirmados: 0, pendentes: 0, taxa: 0 })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    const res = await fetch('/api/admin/stats')
    const data = await res.json()
    setStats(data)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06142A' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '32px', color: '#D7B65D' }}>
              🚀 Painel de Controle
            </h1>
            <p style={{ color: '#9ca3af', marginTop: '8px' }}>Missão Espacial Davi - 7 anos</p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Sair
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={{ background: '#0B1F3D', padding: '24px', borderRadius: '8px', border: '1px solid rgba(215, 182, 93, 0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#D7B65D' }}>{stats.total}</div>
            <div style={{ color: 'white', marginTop: '8px' }}>Total de Convidados</div>
          </div>
          
          <div style={{ background: '#0B1F3D', padding: '24px', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#4ade80' }}>{stats.confirmados}</div>
            <div style={{ color: 'white', marginTop: '8px' }}>Confirmados</div>
          </div>
          
          <div style={{ background: '#0B1F3D', padding: '24px', borderRadius: '8px', border: '1px solid rgba(250, 204, 21, 0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#facc15' }}>{stats.pendentes}</div>
            <div style={{ color: 'white', marginTop: '8px' }}>Pendentes</div>
          </div>
          
          <div style={{ background: '#0B1F3D', padding: '24px', borderRadius: '8px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#60a5fa' }}>{stats.taxa}%</div>
            <div style={{ color: 'white', marginTop: '8px' }}>Taxa de Confirmação</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <Link href="/admin/convidados">
            <div style={{ background: '#112D59', padding: '24px', borderRadius: '8px', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>👥</div>
              <h3 style={{ color: '#D7B65D', marginBottom: '8px' }}>Gerenciar Convidados</h3>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>Cadastrar, listar e enviar convites</p>
            </div>
          </Link>
          
          <div style={{ background: '#112D59', padding: '24px', borderRadius: '8px', opacity: 0.6 }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎮</div>
            <h3 style={{ color: '#D7B65D', marginBottom: '8px' }}>Mini Game</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Em breve...</p>
          </div>
          
          <div style={{ background: '#112D59', padding: '24px', borderRadius: '8px', opacity: 0.6 }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
            <h3 style={{ color: '#D7B65D', marginBottom: '8px' }}>Ranking</h3>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Em breve...</p>
          </div>
        </div>

        <div style={{ background: '#0B1F3D', padding: '24px', borderRadius: '8px' }}>
          <h2 style={{ fontSize: '20px', color: '#D7B65D', marginBottom: '16px' }}>📊 Status do Sistema</h2>
          <p style={{ color: '#e5e7eb' }}>
            Sistema pronto para gerenciar convidados da festa do Davi!
          </p>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#D7B65D' }}>
            🎂 11 de Julho de 2026 • 17h
          </div>
        </div>
      </div>
    </div>
  )
}
