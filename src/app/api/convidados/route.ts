import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

async function verifyAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return false
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}

export async function GET() {
  const isAuth = await verifyAuth()
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const convidados = await prisma.convidado.findMany({
    include: { acompanhantes: true },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(convidados)
}

export async function POST(request: Request) {
  const isAuth = await verifyAuth()
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { nome, telefone, limiteConvites } = await request.json()
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  
  const convidado = await prisma.convidado.create({
    data: { nome, telefone, token, limiteConvites: limiteConvites || 0 }
  })
  
  return NextResponse.json(convidado)
}

export async function PUT(request: Request) {
  const isAuth = await verifyAuth()
  if (!isAuth) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { id, confirmado } = await request.json()
  
  const convidado = await prisma.convidado.update({
    where: { id },
    data: { confirmado }
  })
  
  return NextResponse.json(convidado)
}
