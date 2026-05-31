import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    
    const convidado = await prisma.convidado.findUnique({
      where: { token: token },
      include: { acompanhantes: true }
    })
    
    if (!convidado) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 })
    }
    
    return NextResponse.json(convidado)
  } catch (error) {
    console.error('Erro ao buscar convite:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
