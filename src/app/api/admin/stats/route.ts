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
    
    // Totais de convidados
    const totalConvidados = await prisma.convidado.count()
    const totalConfirmados = await prisma.convidado.count({ where: { confirmado: true } })
    const totalAusentes = await prisma.convidado.count({ where: { ausente: true } })
    const totalPendentes = totalConvidados - totalConfirmados - totalAusentes
    
    // Total de acompanhantes confirmados (soma de todos os acompanhantes dos convidados confirmados)
    const convidadosConfirmados = await prisma.convidado.findMany({
      where: { confirmado: true },
      include: { acompanhantes: true }
    })
    
    const totalAcompanhantesConfirmados = convidadosConfirmados.reduce(
      (acc, conv) => acc + (conv.acompanhantes?.length || 0), 
      0
    )
    
    // Total de pessoas no evento (convidados confirmados + acompanhantes)
    const totalPessoasEvento = totalConfirmados + totalAcompanhantesConfirmados
    
    // Taxa de confirmação (apenas sobre quem respondeu)
    const totalResponderam = totalConfirmados + totalAusentes
    const taxaConfirmacao = totalResponderam > 0 
      ? Math.round((totalConfirmados / totalResponderam) * 100) 
      : 0
    
    return NextResponse.json({ 
      totalConvidados,
      totalConfirmados,
      totalAusentes,
      totalPendentes,
      totalAcompanhantesConfirmados,
      totalPessoasEvento,
      taxaConfirmacao
    })
  } catch (error) {
    console.error('Erro nas stats:', error)
    return NextResponse.json({ 
      totalConvidados: 0,
      totalConfirmados: 0,
      totalAusentes: 0,
      totalPendentes: 0,
      totalAcompanhantesConfirmados: 0,
      totalPessoasEvento: 0,
      taxaConfirmacao: 0
    })
  }
}
