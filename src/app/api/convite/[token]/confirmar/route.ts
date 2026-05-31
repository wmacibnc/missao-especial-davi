import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { acompanhantes } = await request.json()
    
    // Atualizar convidado
    const convidado = await prisma.convidado.update({
      where: { token: token },
      data: { confirmado: true }
    })
    
    // Adicionar acompanhantes
    for (const acomp of acompanhantes) {
      if (acomp.nome && acomp.documento) {
        await prisma.acompanhante.create({
          data: {
            nome: acomp.nome,
            documento: acomp.documento,
            convidadoId: convidado.id
          }
        })
      }
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao confirmar presença:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
