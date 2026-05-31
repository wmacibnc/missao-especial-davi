export interface Convidado {
  id: string
  nome: string
  telefone: string
  token: string
  limiteConvites: number
  confirmado: boolean
  checkinRealizado: boolean
  createdAt: Date
}

export interface Acompanhante {
  id: string
  nome: string
  documento: string
  convidadoId: string
}

export interface Ranking {
  id: string
  convidadoId: string
  nome: string
  pontuacao: number
  createdAt: Date
}