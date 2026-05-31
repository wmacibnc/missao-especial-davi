const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log('🔄 Conectando ao Neon...')
    await prisma.$connect()
    console.log('✅ Conectado com sucesso ao Neon!')
    
    const count = await prisma.convidado.count()
    console.log('📊 Total de convidados:', count)
    
    await prisma.$disconnect()
    console.log('✅ Teste concluído!')
  } catch (error) {
    console.error('❌ Erro:', error.message)
    console.error('Detalhes:', error)
  }
}

test()
