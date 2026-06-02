import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function enviarEmailNotificacao(tipo: string, dados: any) {
  let assunto = ''
  let texto = ''
  let html = ''

  if (tipo === 'novo_convidado') {
    assunto = `🎉 Novo convidado cadastrado - ${dados.nome}`
    texto = `
Novo convidado cadastrado no sistema!

Nome: ${dados.nome}
Telefone: ${dados.telefone}
Acompanhantes permitidos: ${dados.limiteConvites}
Link: ${dados.link}

Acesse o admin para gerenciar: ${process.env.NEXT_PUBLIC_BASE_URL}/admin/convidados
    `
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06142A, #0B1F3D); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: #D7B65D; margin: 0;">🚀 NOVO CONVIDADO CADASTRADO!</h2>
        </div>
        <div style="background: #0B1F3D; padding: 20px; border-radius: 0 0 10px 10px;">
          <p><strong>👤 Nome:</strong> ${dados.nome}</p>
          <p><strong>📱 Telefone:</strong> ${dados.telefone}</p>
          <p><strong>👥 Acompanhantes permitidos:</strong> ${dados.limiteConvites}</p>
          <p><strong>🔗 Link do convite:</strong> <a href="${dados.link}" style="color: #D7B65D;">${dados.link}</a></p>
          <hr style="border-color: #D7B65D;">
          <p style="text-align: center;"><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/convidados" style="background: #D7B65D; color: #06142A; padding: 10px 20px; text-decoration: none; border-radius: 5px;">📋 Gerenciar Convidados</a></p>
        </div>
      </div>
    `
  } else if (tipo === 'confirmacao') {
    // Formatar lista de acompanhantes
    const listaAcompanhantes = dados.acompanhantes && dados.acompanhantes.length > 0
      ? dados.acompanhantes.map((a: any, i: number) => `${i + 1}. ${a.nome}${a.documento ? ` (${a.documento})` : ''}`).join('<br>')
      : '<span style="color: #9ca3af;">Nenhum acompanhante</span>'
    
    assunto = `✅ Presença confirmada - ${dados.nome}`
    texto = `
Presença confirmada!

Nome: ${dados.nome}
Telefone: ${dados.telefone}
Acompanhantes: ${dados.totalAcompanhantes}

${dados.totalAcompanhantes > 0 ? 'Lista de acompanhantes:\n' + dados.acompanhantes?.map((a: any) => `- ${a.nome}`).join('\n') : 'Sem acompanhantes'}

Acesse o admin para mais detalhes: ${process.env.NEXT_PUBLIC_BASE_URL}/admin/presencas
    `
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06142A, #0B1F3D); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: #4ade80; margin: 0;">✅ PRESENÇA CONFIRMADA!</h2>
        </div>
        <div style="background: #0B1F3D; padding: 20px; border-radius: 0 0 10px 10px;">
          <p><strong>👤 Nome:</strong> ${dados.nome}</p>
          <p><strong>📱 Telefone:</strong> ${dados.telefone}</p>
          <p><strong>👥 Total de acompanhantes:</strong> ${dados.totalAcompanhantes}</p>
          
          ${dados.totalAcompanhantes > 0 ? `
          <div style="background: #06142A; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="color: #D7B65D; margin: 0 0 10px 0;"><strong>📋 LISTA DE ACOMPANHANTES:</strong></p>
            <div style="color: white;">
              ${listaAcompanhantes}
            </div>
          </div>
          ` : '<p style="color: #9ca3af;">📌 Nenhum acompanhante registrado</p>'}
          
          <hr style="border-color: #D7B65D;">
          <p style="text-align: center;"><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/presencas" style="background: #D7B65D; color: #06142A; padding: 10px 20px; text-decoration: none; border-radius: 5px;">📋 Ver Lista de Presenças</a></p>
        </div>
      </div>
    `
  } else if (tipo === 'ausencia') {
    assunto = `😢 Ausência registrada - ${dados.nome}`
    texto = `
Ausência registrada!

Nome: ${dados.nome}
Telefone: ${dados.telefone}

Acesse o admin para mais detalhes: ${process.env.NEXT_PUBLIC_BASE_URL}/admin/presencas
    `
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #06142A, #0B1F3D); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h2 style="color: #f87171; margin: 0;">😢 AUSÊNCIA REGISTRADA</h2>
        </div>
        <div style="background: #0B1F3D; padding: 20px; border-radius: 0 0 10px 10px;">
          <p><strong>👤 Nome:</strong> ${dados.nome}</p>
          <p><strong>📱 Telefone:</strong> ${dados.telefone}</p>
          <p><strong>💔 Status:</strong> Não poderá comparecer</p>
          <hr style="border-color: #D7B65D;">
          <p style="text-align: center;"><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/presencas" style="background: #D7B65D; color: #06142A; padding: 10px 20px; text-decoration: none; border-radius: 5px;">📋 Ver Lista de Presenças</a></p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail({
      from: `"Missão Espacial Davi" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_NOTIFICACAO,
      subject: assunto,
      text: texto,
      html: html,
    })
    console.log('Email enviado com sucesso')
  } catch (error) {
    console.error('Erro ao enviar email:', error)
  }
}
