import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
    await jwtVerify(token, secret)
    
    const total = await prisma.convidado.count()
    const confirmados = await prisma.convidado.count({ where: { confirmado: true } })
    const pendentes = total - confirmados
    const taxa = total > 0 ? Math.round((confirmados / total) * 100) : 0

    return NextResponse.json({ total, confirmados, pendentes, taxa })
  } catch (error) {
    console.error('Erro nas stats:', error)
    return NextResponse.json({ total: 0, confirmados: 0, pendentes: 0, taxa: 0 })
  }
}
