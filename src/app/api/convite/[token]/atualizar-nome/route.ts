import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { nome } = await request.json()
    
    if (!nome || !nome.trim()) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const convidado = await prisma.convidado.update({
      where: { token: token },
      data: { nome: nome.trim() }
    })
    
    return NextResponse.json({ success: true, nome: convidado.nome })
  } catch (error) {
    console.error('Erro ao atualizar nome:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
