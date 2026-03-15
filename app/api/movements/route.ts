import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { sku, quantity, type } = body;

    // 1. Localiza o produto e o lote mais recente criado
    const product = await prisma.product.findUnique({
      where: { internalCode: sku },
      include: {
        batches: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não cadastrado" },
        { status: 404 }
      );
    }

    if (product.batches.length === 0) {
      return NextResponse.json(
        { error: "Produto sem lotes ativos" },
        { status: 400 }
      );
    }

    const targetBatch = product.batches[0];
    const qtyChange = Number(quantity);

    // 2. Atualiza a quantidade no Lote (Incremento ou Decremento)
    await prisma.batch.update({
      where: { id: targetBatch.id },
      data: {
        quantity:
          type === "ENTRADA"
            ? { increment: qtyChange }
            : { decrement: qtyChange },
      },
    });

    // 3. Cria o registro no histórico com o motivo detalhado
    const movement = await prisma.movement.create({
      data: {
        type: type,
        quantity: qtyChange,
        productId: product.id,
        reason: `Bip Terminal: Alterado no Lote ${targetBatch.batchCode}`,
      },
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error: any) {
    console.error("Erro na movimentação:", error);
    return NextResponse.json(
      { error: "Falha ao processar movimento" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const logs = await prisma.movement.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao carregar logs" },
      { status: 500 }
    );
  }
}