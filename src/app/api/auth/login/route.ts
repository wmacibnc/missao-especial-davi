import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Credenciais fixas para teste
    const ADMIN_EMAIL = 'admin@missaoespacial.com'
    const ADMIN_PASSWORD = 'admin123'

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }

    // Gerar token JWT
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret_temporario_123')
    const token = await new SignJWT({ email, role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret)

    // Salvar cookie (await é necessário no Next.js 16)
    const cookieStore = await cookies()
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: false, // Mude para true em produção
      sameSite: 'strict',
      maxAge: 86400,
      path: '/'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no login:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
