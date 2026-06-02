import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { enviarEmailNotificacao } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const { acompanhantes, ausente, nome } = await request.json()
    
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
      await prisma.convidado.update({
        where: { token: token },
        data: { ausente: true }
      })
      
      await enviarEmailNotificacao('ausencia', {
        nome: convidadoExistente.nome,
        telefone: convidadoExistente.telefone
      })
      
      return NextResponse.json({ 
        success: true, 
        message: 'Ausência registrada com sucesso'
      })
    }
    
    // Atualizar nome se foi modificado
    let dadosAtualizacao: any = { confirmado: true }
    if (nome && nome !== convidadoExistente.nome) {
      dadosAtualizacao.nome = nome.trim()
    }
    
    const convidado = await prisma.convidado.update({
      where: { token: token },
      data: dadosAtualizacao
    })
    
    // Adicionar acompanhantes
    const acompanhantesFiltrados = acompanhantes.filter(a => a.nome && a.nome.trim() !== '')
    const acompanhantesSalvos = []
    
    for (const acomp of acompanhantesFiltrados) {
      const novoAcomp = await prisma.acompanhante.create({
        data: {
          nome: acomp.nome.trim(),
          documento: acomp.documento?.trim() || '',
          convidadoId: convidado.id
        }
      })
      acompanhantesSalvos.push(novoAcomp)
    }
    
    // Enviar notificação com lista de acompanhantes
    await enviarEmailNotificacao('confirmacao', {
      nome: convidado.nome,
      telefone: convidado.telefone,
      totalAcompanhantes: acompanhantesSalvos.length,
      acompanhantes: acompanhantesSalvos
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Presença confirmada com sucesso!',
      totalAcompanhantes: acompanhantesSalvos.length
    })
  } catch (error) {
    console.error('Erro ao confirmar presença:', error)
    return NextResponse.json({ error: 'Erro interno no servidor: ' + error.message }, { status: 500 })
  }
}
