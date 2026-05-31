import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    
    if (!token) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }
    
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
    await jwtVerify(token, secret)
    
    const { id } = await params
    
    await prisma.convidado.delete({
      where: { id: id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar convidado:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
