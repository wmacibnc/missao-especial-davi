import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { acompanhantes, ausente } = await request.json()
    
    console.log('Confirmando para token:', token)
    console.log('Ausente:', ausente)
    console.log('Acompanhantes:', acompanhantes)
    
    // Verificar se o convidado existe
    const convidadoExistente = await prisma.convidado.findUnique({
      where: { token: token }
    })
    
    if (!convidadoExistente) {
      return NextResponse.json({ error: 'Convite não encontrado' }, { status: 404 })
    }
    
    if (convidadoExistente.confirmado || convidadoExistente.ausente) {
      return NextResponse.json({ error: 'Resposta já enviada' }, { status: 400 })
    }
    
    if (ausente) {
      // Marcar como ausente
      await prisma.convidado.update({
        where: { token: token },
        data: { ausente: true }
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Ausência registrada com sucesso'
      })
    }
    
    // Atualizar convidado como confirmado
    const convidado = await prisma.convidado.update({
      where: { token: token },
      data: { confirmado: true }
    })
    
    // Adicionar acompanhantes
    const acompanhantesFiltrados = acompanhantes.filter(a => a.nome && a.nome.trim() !== '')
    
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
