"use client";

interface Batch {
  id: string;
  batchCode: string;
  expirationDate: string;
  quantity: number;
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  internalCode: string;
  batches: Batch[];
}

interface BatchModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BatchModal({
  product,
  isOpen,
  onClose,
}: BatchModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
        {/* Header do Modal */}
        <div className="bg-teal-700 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">
              Detalhes do Estoque
            </h2>
            <p className="text-teal-100 text-sm font-mono">
              {product.name} | SKU: {product.internalCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-teal-600 p-2 rounded-full transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Lista de Lotes */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {product.batches && product.batches.length > 0 ? (
              product.batches.map((batch) => {
                const isExpired =
                  new Date(batch.expirationDate) < new Date();

                return (
                  <div
                    key={batch.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-l-4 border-teal-500 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded font-bold uppercase">
                          Lote: {batch.batchCode}
                        </span>
                        <span className="text-gray-400 text-[10px]">
                          Registrado em:{" "}
                          {new Date(batch.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p
                        className={`text-sm font-bold ${
                          isExpired
                            ? "text-red-600"
                            : "text-gray-700"
                        }`}
                      >
                        Validade:{" "}
                        {new Date(
                          batch.expirationDate
                        ).toLocaleDateString("pt-BR")}
                        {isExpired && " (VENCIDO)"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-gray-800">
                        {batch.quantity}
                      </span>
                      <span className="text-xs text-gray-500 ml-1 italic">
                        unid.
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 italic">
                Nenhum lote encontrado para este produto.
              </p>
            )}
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 bg-gray-100 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg font-bold text-xs uppercase hover:bg-gray-700 transition-all"
          >
            Fechar Relatório
          </button>
        </div>
      </div>
    </div>
  );
}