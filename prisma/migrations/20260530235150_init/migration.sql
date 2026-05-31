-- CreateTable
CREATE TABLE "Convidado" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "limiteConvites" INTEGER NOT NULL DEFAULT 1,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "checkinRealizado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Convidado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acompanhante" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "convidadoId" TEXT NOT NULL,

    CONSTRAINT "Acompanhante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ranking" (
    "id" TEXT NOT NULL,
    "convidadoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "pontuacao" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ranking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Convidado_token_key" ON "Convidado"("token");

-- AddForeignKey
ALTER TABLE "Acompanhante" ADD CONSTRAINT "Acompanhante_convidadoId_fkey" FOREIGN KEY ("convidadoId") REFERENCES "Convidado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ranking" ADD CONSTRAINT "Ranking_convidadoId_fkey" FOREIGN KEY ("convidadoId") REFERENCES "Convidado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
