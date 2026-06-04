'use client'
import { useEffect, useState } from 'react'

export default function ConvidadosPage() {
  const [convidados, setConvidados] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ nome: '', telefone: '', limiteConvites: 0 })

  useEffect(() => { carregarConvidados() }, [])

  const carregarConvidados = async () => {
    const res = await fetch('/api/convidados')
    setConvidados(await res.json())
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/convidados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    if (res.ok) {
      setShowModal(false)
      setFormData({ nome: '', telefone: '', limiteConvites: 0 })
      carregarConvidados()
    }
  }

  const resetarStatus = async (id: string, nome: string) => {
    if (confirm(`⚠️ Resetar status do convidado "${nome}" para pendente?`)) {
      await fetch('/api/convidados', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, confirmado: false, ausente: false })
      })
      carregarConvidados()
    }
  }

  const excluirConvidado = async (id: string, nome: string) => {
    if (confirm(`⚠️ Tem certeza que deseja EXCLUIR permanentemente o convidado "${nome}"?\n\nEsta ação não pode ser desfeita!`)) {
      const res = await fetch(`/api/convidados/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        carregarConvidados()
      } else {
        alert('❌ Erro ao excluir convidado')
      }
    }
  }

  const enviarWhatsApp = (nome: string, telefone: string, token: string) => {
    const link = `${window.location.origin}/convite/${token}`
    const mensagem = `🚀 *MISSAO ESPACIAL DAVI - 7 ANOS* 🚀

✨ *${nome}, VOCE ESTA CONVIDADO!* ✨

• Data: 11/07/2026
• Horario: 17h
• Local: Living Park Sul - Salao de festas do bloco E

🔗 *CONFIRME SUA PRESENCA PELO LINK:*
${link}

📱 *OU RESPONDA ESTA MENSAGEM*

⚠️ *Confirme ate 25/06/2026*

🎉 Sua presenca e muito importante!`

    window.open(`https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`, '_blank')
  }

  const copiarLink = (token: string) => {
    const link = `${window.location.origin}/convite/${token}`
    navigator.clipboard.writeText(link)
    alert('✅ Link copiado para a área de transferência!')
  }

  const stars = Array.from({ length: 100 }, (_, i) => ({ id: i, left: Math.random() * 100, top: Math.random() * 100, size: Math.random() * 2 + 1, delay: Math.random() * 3 }))

  const getStatus = (conv: any) => {
    if (conv.ausente) return { text: '😢 Ausente', color: '#f87171', bg: 'rgba(248,113,113,0.2)' }
    if (conv.confirmado) return { text: '✅ Confirmado', color: '#4ade80', bg: 'rgba(74,222,128,0.2)' }
    return { text: '⏳ Pendente', color: '#facc15', bg: 'rgba(250,204,21,0.2)' }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#06142A' }}>
      <div style={{ position: 'fixed', inset: 0, zIndex: -10 }}>
        {stars.map((star) => (
          <div key={star.id} className="animate-twinkle" style={{ position: 'absolute', background: 'white', borderRadius: '50%', left: `${star.left}%`, top: `${star.top}%`, width: star.size, height: star.size, animationDelay: `${star.delay}s` }} />
        ))}
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'Orbitron, monospace', fontSize: '32px', color: '#D7B65D' }}>👥 Convidados</h1>
          <button onClick={() => setShowModal(true)} style={{ background: 'linear-gradient(135deg, #D7B65D, #FFD700)', color: '#06142A', padding: '12px 24px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>+ Novo Convidado</button>
        </div>
        {loading ? (
          <div style={{ color: 'white', textAlign: 'center' }}>Carregando...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0B1F3D', borderBottom: '2px solid #D7B65D' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#D7B65D' }}>Nome</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#D7B65D' }}>Telefone</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Acomp.</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Status</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#D7B65D' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {convidados.map((conv: any) => {
                  const status = getStatus(conv)
                  return (
                    <tr key={conv.id} style={{ borderBottom: '1px solid rgba(215, 182, 93, 0.2)' }}>
                      <td style={{ padding: '12px', color: 'white' }}>{conv.nome}</td>
                      <td style={{ padding: '12px', color: 'white' }}>{conv.telefone}</td>
                      <td style={{ padding: '12px', textAlign: 'center', color: 'white' }}>{conv.limiteConvites === 0 ? '🚫' : conv.limiteConvites}</td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <span style={{ background: status.bg, color: status.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
                          {status.text}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                          <button onClick={() => enviarWhatsApp(conv.nome, conv.telefone, conv.token)} style={{ background: '#25D366', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }} title="Enviar WhatsApp">📱</button>
                          <button onClick={() => copiarLink(conv.token)} style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }} title="Copiar Link">🔗</button>
                          {(conv.confirmado || conv.ausente) && (
                            <button onClick={() => resetarStatus(conv.id, conv.nome)} style={{ background: '#facc15', color: '#06142A', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }} title="Resetar Status">🔄</button>
                          )}
                          <button onClick={() => excluirConvidado(conv.id, conv.nome)} style={{ background: '#ef4444', color: 'white', padding: '6px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer', fontSize: '12px' }} title="Excluir Convidado">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#0B1F3D', padding: '32px', borderRadius: '8px', width: '90%', maxWidth: '500px' }}>
              <h2 style={{ color: '#D7B65D', marginBottom: '24px' }}>Novo Convidado</h2>
              <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '16px', background: '#06142A', color: 'white', border: '1px solid #D7B65D', borderRadius: '4px' }} required />
                <input type="text" placeholder="WhatsApp (ex: 11999999999)" value={formData.telefone} onChange={(e) => setFormData({ ...formData, telefone: e.target.value })} style={{ width: '100%', padding: '12px', marginBottom: '16px', background: '#06142A', color: 'white', border: '1px solid #D7B65D', borderRadius: '4px' }} required />
                <label style={{ color: '#D7B65D', fontSize: '14px', marginBottom: '8px', display: 'block' }}>Nº de acompanhantes (0 = sozinho)</label>
                <input type="number" min="0" value={formData.limiteConvites} onChange={(e) => setFormData({ ...formData, limiteConvites: parseInt(e.target.value) })} style={{ width: '100%', padding: '12px', marginBottom: '24px', background: '#06142A', color: 'white', border: '1px solid #D7B65D', borderRadius: '4px' }} />
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" style={{ flex: 1, background: '#D7B65D', color: '#06142A', padding: '12px', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>Salvar</button>
                  <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '12px', borderRadius: '4px', border: 'none', cursor: 'pointer' }}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 1; } }
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
