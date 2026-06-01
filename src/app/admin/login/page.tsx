'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json()
        setError(data.error || 'Credenciais inválidas')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#06142A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#0B1F3D',
        padding: '32px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(215, 182, 93, 0.3)'
      }}>
        <h1 style={{
          fontFamily: 'Orbitron, monospace',
          fontSize: '28px',
          color: '#D7B65D',
          textAlign: 'center',
          marginBottom: '24px'
        }}>
          🚀 Login Admin
        </h1>
        
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.2)',
            color: '#f87171',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '16px',
              background: '#06142A',
              color: 'white',
              border: '1px solid rgba(215, 182, 93, 0.3)',
              borderRadius: '4px',
              outline: 'none'
            }}
            required
          />
          
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '24px',
              background: '#06142A',
              color: 'white',
              border: '1px solid rgba(215, 182, 93, 0.3)',
              borderRadius: '4px',
              outline: 'none'
            }}
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #D7B65D, #FFD700)',
              color: '#06142A',
              padding: '12px',
              borderRadius: '4px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <p style={{
          fontSize: '12px',
          textAlign: 'center',
          color: '#9ca3af',
          marginTop: '16px'
        }}>
        </p>
      </div>
    </div>
  )
}
