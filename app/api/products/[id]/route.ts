import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // Define params como Promise
) {
  try {
    // RESOLUÇÃO: Aguarda o ID ser extraído da Promise (Obrigatório Next.js 15)
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
    }

    // Executa a exclusão no banco de dados
    await prisma.product.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Produto removido com sucesso" });
  } catch (error: any) {
    console.error("Erro ao deletar no Prisma:", error);
    return NextResponse.json(
      { error: "Não foi possível excluir. O item pode ter dependências no banco." },
      { status: 500 }
    );
  }
}