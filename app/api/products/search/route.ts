import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
    }

    // Busca o produto onde o internalCode seja IGUAL ao que você digitou
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { internalCode: code },
          { id: code } // Mantém o ID como opção secundária
        ]
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erro na busca:", error);
    return NextResponse.json({ error: "Erro interno na busca" }, { status: 500 });
  }
}