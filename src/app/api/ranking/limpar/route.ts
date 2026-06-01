import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    // Verificar autenticação
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
    await jwtVerify(token, secret)
    
    await prisma.ranking.deleteMany()
    
    return NextResponse.json({ success: true, message: 'Ranking limpo com sucesso' })
  } catch (error) {
    console.error('Erro ao limpar ranking:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
