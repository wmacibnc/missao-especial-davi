import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    // Verificar autenticação
    const cookieStore = await cookies()
    const authToken = cookieStore.get('auth_token')?.value
    
    if (!authToken) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
    await jwtVerify(authToken, secret)
    
    const { token } = await params
    
    // Buscar convidado
    const convidado = await prisma.convidado.findUnique({
      where: { token: token }
    })
    
    if (!convidado) {
      return NextResponse.json({ error: 'Convidado não encontrado' }, { status: 404 })
    }
    
    if (!convidado.confirmado) {
      return NextResponse.json({ error: 'Presença não confirmada ainda' }, { status: 400 })
    }
    
    if (convidado.checkinRealizado) {
      return NextResponse.json({ error: 'Check-in já realizado' }, { status: 400 })
    }
    
    // Realizar check-in
    await prisma.convidado.update({
      where: { token: token },
      data: { checkinRealizado: true }
    })
    
    return NextResponse.json({ 
      success: true, 
      message: `Check-in realizado para ${convidado.nome}` 
    })
  } catch (error) {
    console.error('Erro no check-in:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
