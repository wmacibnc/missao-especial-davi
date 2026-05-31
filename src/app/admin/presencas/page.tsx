'use client'
import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import Link from 'next/link'

export default function PresencasPage() {
  const [convidados, setConvidados] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todos')

  useEffect(() => { carregarConvidados() }, [])

  const carregarConvidados = async () => {
    const res = await fetch('/api/convidados')
    const data = await res.json()
    setConvidados(data)
    setLoading(false)
  }

  const exportarExcel = () => {
    const dados = convidados.map((conv: any) => ({
      'Nome': conv.nome,
      'Telefone': conv.telefone,
      'Limite Acompanhantes': conv.limiteConvites,
      'Confirmado': conv.confirmado ? 'Sim' : 'Não',
      'Check-in Realizado': conv.checkinRealizado ? 'Sim' : 'Não',
      'Acompanhantes': conv.acompanhantes?.map((a: any) => `${a.nome} (${a.documento})`).join(', ') || 'Nenhum',
      'Data Cadastro': new Date(conv.createdAt).toLocaleDateString('pt-BR')
    }))
    
    const ws = XLSX.utils.json_to_sheet(dados)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Presencas')
    XLSX.writeFile(wb, `presencas_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const convidadosFiltrados = convidados.filter((conv: any) => {
    if (filtro === 'confirmados') return conv.confirmado
    if (filtro === 'pendentes') return !conv.confirmado
    if (filtro === 'checkin') return conv.checkinRealizado
    return true
  })

  const totalConfirmados = convidados.filter((c: any) => c.confirmado).length
  const totalCheckin = convidados.filter((c: any) => c.checkinRealizado).length
  const totalAcompanhantes = convidados.reduce((acc: number, c: any) => acc + (c.acompanhantes?.length || 0), 0)

  const stars = Array.from({ length: 100 }, (_, i) => ({ id: i, left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 3 }))

  return (
    <div style={{ minHeight: '100vh', background: '#06142A' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
        {stars.map((star) => (<div key={star.id} className="animate-twinkle" style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }} />))}
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '28px', color: '#D7B65D' }}>📋 Lista de Presenças</h1>
          <button onClick={exportarExcel} style={{ background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>📊 Exportar Excel</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: '#112D59', padding: '16px', borderRadius: '8px' }}><div style={{ fontSize: '28px', fontWeight: 'bold', color: '#D7B65D' }}>{convidados.length}</div><div style={{ color: 'white', fontSize: '14px' }}>Total Convidados</div></div>
          <div style={{ background: '#112D59', padding: '16px', borderRadius: '8px' }}><div style={{ fontSize: '28px', fontWeight: 'bold', color: '#4ade80' }}>{totalConfirmados}</div><div style={{ color: 'white', fontSize: '14px' }}>Confirmados</div></div>
          <div style={{ background: '#112D59', padding: '16px', borderRadius: '8px' }}><div style={{ fontSize: '28px', fontWeight: 'bold', color: '#60a5fa' }}>{totalCheckin}</div><div style={{ color: 'white', fontSize: '14px' }}>Check-in Realizado</div></div>
          <div style={{ background: '#112D59', padding: '16px', borderRadius: '8px' }}><div style={{ fontSize: '28px', fontWeight: 'bold', color: '#facc15' }}>{totalAcompanhantes}</div><div style={{ color: 'white', fontSize: '14px' }}>Total Acompanhantes</div></div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <button onClick={() => setFiltro('todos')} style={{ padding: '8px 16px', background: filtro === 'todos' ? '#D7B65D' : '#0B1F3D', color: filtro === 'todos' ? '#06142A' : '#D7B65D', border: '1px solid #D7B65D', borderRadius: '4px', cursor: 'pointer' }}>Todos</button>
          <button onClick={() => setFiltro('confirmados')} style={{ padding: '8px 16px', background: filtro === 'confirmados' ? '#D7B65D' : '#0B1F3D', color: filtro === 'confirmados' ? '#06142A' : '#D7B65D', border: '1px solid #D7B65D', borderRadius: '4px', cursor: 'pointer' }}>Confirmados</button>
          <button onClick={() => setFiltro('pendentes')} style={{ padding: '8px 16px', background: filtro === 'pendentes' ? '#D7B65D' : '#0B1F3D', color: filtro === 'pendentes' ? '#06142A' : '#D7B65D', border: '1px solid #D7B65D', borderRadius: '4px', cursor: 'pointer' }}>Pendentes</button>
          <button onClick={() => setFiltro('checkin')} style={{ padding: '8px 16px', background: filtro === 'checkin' ? '#D7B65D' : '#0B1F3D', color: filtro === 'checkin' ? '#06142A' : '#D7B65D', border: '1px solid #D7B65D', borderRadius: '4px', cursor: 'pointer' }}>Check-in Realizado</button>
        </div>

        {loading ? <div style={{ color: 'white', textAlign: 'center' }}>Carregando...</div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#0B1F3D', borderBottom: '2px solid #D7B65D' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#D7B65D' }}>Nome</th><th style={{ padding: '12px', textAlign: 'left', color: '#D7B65D' }}>Telefone</th><th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Acomp.</th><th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Confirmado</th><th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Check-in</th><th style={{ padding: '12px', textAlign: 'left', color: '#D7B65D' }}>Acompanhantes</th>
              </tr></thead>
              <tbody>{convidadosFiltrados.map((conv: any) => (
                <tr key={conv.id} style={{ borderBottom: '1px solid rgba(215, 182, 93, 0.2)' }}>
                  <td style={{ padding: '12px', color: 'white' }}>{conv.nome}</td><td style={{ padding: '12px', color: 'white' }}>{conv.telefone}</td><td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>{conv.limiteConvites}</td>
                  <td style={{ padding: '12px', textAlign: 'center' }}><span style={{ background: conv.confirmado ? 'rgba(74,222,128,0.2)' : 'rgba(250,204,21,0.2)', color: conv.confirmado ? '#4ade80' : '#facc15', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>{conv.confirmado ? '✅' : '⏳'}</span></td>
                  <td style={{ padding: '12px', textAlign: 'center' }}><span style={{ background: conv.checkinRealizado ? 'rgba(74,222,128,0.2)' : 'rgba(156,163,175,0.2)', color: conv.checkinRealizado ? '#4ade80' : '#9ca3af', padding: '4px 8px', borderRadius: '20px', fontSize: '12px' }}>{conv.checkinRealizado ? '✅' : '⏳'}</span></td>
                  <td style={{ padding: '12px', color: 'white', fontSize: '12px' }}>{conv.acompanhantes?.map((a: any) => a.nome).join(', ') || '-'}</td>
                 </tr>))}</tbody>
            </table>
          </div>
        )}
      </div>
      <style jsx>{`@keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } } .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }`}</style>
    </div>
  )
}
