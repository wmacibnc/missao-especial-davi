/*
  Warnings:

  - You are about to drop the column `convidadoId` on the `Ranking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Acompanhante" DROP CONSTRAINT "Acompanhante_convidadoId_fkey";

-- DropForeignKey
ALTER TABLE "Ranking" DROP CONSTRAINT "Ranking_convidadoId_fkey";

-- AlterTable
ALTER TABLE "Convidado" ALTER COLUMN "limiteConvites" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Ranking" DROP COLUMN "convidadoId";

-- AddForeignKey
ALTER TABLE "Acompanhante" ADD CONSTRAINT "Acompanhante_convidadoId_fkey" FOREIGN KEY ("convidadoId") REFERENCES "Convidado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
