import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const rankings = await prisma.ranking.findMany({
      orderBy: { pontuacao: 'desc' },
      take: 50
    })
    return NextResponse.json(rankings)
  } catch (error) {
    console.error('Erro ao buscar ranking:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const { nome, pontuacao } = await request.json()
    
    const ranking = await prisma.ranking.create({
      data: {
        nome: nome,
        pontuacao: pontuacao
      }
    })
    
    return NextResponse.json(ranking)
  } catch (error) {
    console.error('Erro ao salvar pontuação:', error)
    return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 })
  }
}
