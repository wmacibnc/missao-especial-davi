import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { acompanhantes } = await request.json()
    
    console.log('Confirmando para token:', token)
    console.log('Acompanhantes recebidos:', JSON.stringify(acompanhantes, null, 2))
    
    // Verificar se o convidado existe
    const convidadoExistente = await prisma.convidado.findUnique({
      where: { token: token }
    })
    
    if (!convidadoExistente) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 })
    }
    
    if (convidadoExistente.confirmado) {
      return NextResponse.json({ error: 'Presença já confirmada' }, { status: 400 })
    }
    
    // Atualizar convidado
    const convidado = await prisma.convidado.update({
      where: { token: token },
      data: { confirmado: true }
    })
    
    // Adicionar acompanhantes (apenas os que têm nome preenchido)
    const acompanhantesFiltrados = acompanhantes.filter(a => a.nome && a.nome.trim() !== '')
    
    console.log('Acompanhantes a salvar:', JSON.stringify(acompanhantesFiltrados, null, 2))
    
    if (acompanhantesFiltrados.length > convidadoExistente.limiteConvites) {
      return NextResponse.json({ error: 'Número de acompanhantes excede o limite' }, { status: 400 })
    }
    
    for (const acomp of acompanhantesFiltrados) {
      await prisma.acompanhante.create({
        data: {
          nome: acomp.nome.trim(),
          documento: acomp.documento?.trim() || '',
          convidadoId: convidado.id
        }
      })
    }
    
    // Buscar convidado atualizado com acompanhantes
    const convidadoAtualizado = await prisma.convidado.findUnique({
      where: { token: token },
      include: { acompanhantes: true }
    })
    
    console.log('Total de acompanhantes salvos:', convidadoAtualizado?.acompanhantes.length)
    
    return NextResponse.json({ 
      success: true, 
      message: 'Presença confirmada com sucesso!',
      totalAcompanhantes: acompanhantesFiltrados.length
    })
  } catch (error) {
    console.error('Erro ao confirmar presença:', error)
    return NextResponse.json({ error: 'Erro interno no servidor: ' + error.message }, { status: 500 })
  }
}
