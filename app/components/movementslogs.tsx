"use client";

interface Log {
  id: string;
  type: "ENTRADA" | "SAÍDA";
  quantity: number;
  reason: string;
  createdAt: string;
  product?: {
    name: string;
  };
}

export default function MovementLogs({ logs }: { logs: Log[] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <h2 className="text-xs font-black uppercase tracking-widest text-gray-500">
          Monitoramento de Fluxo
        </h2>
        <span className="text-[10px] text-gray-400 italic">
          Últimos 50 eventos
        </span>
      </div>

      <div className="max-h-80 overflow-y-auto font-mono text-[11px] bg-white">
        {logs.length === 0 ? (
          <p className="p-8 text-center text-gray-400 italic">
            Nenhuma movimentação registrada.
          </p>
        ) : (
          logs.map((log) => {
            let style = "border-gray-300 text-gray-600 bg-white";

            if (
              log.reason?.includes("Registro Inicial") ||
              log.reason?.includes("novo")
            ) {
              style = "border-blue-500 bg-blue-50 text-blue-800";
            } else if (log.type === "ENTRADA") {
              style = "border-teal-500 bg-teal-50 text-teal-800";
            } else if (log.type === "SAÍDA") {
              style = "border-red-500 bg-red-50 text-red-800";
            }

            return (
              <div
                key={log.id}
                className={`p-3 border-l-4 mb-0.5 flex justify-between items-center transition-all hover:brightness-95 ${style}`}
              >
                <div className="flex gap-4 items-center">
                  <span className="opacity-60 font-bold">
                    {new Date(log.createdAt).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>

                  <div className="flex flex-col">
                    <span className="font-black uppercase text-[12px]">
                      {log.product?.name || "Item Desconhecido"}
                    </span>
                    <span className="text-[9px] opacity-70 italic leading-none">
                      {log.reason}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[9px] uppercase font-bold opacity-50">
                    {log.type}
                  </span>
                  <span className="text-sm font-black w-12 text-right">
                    {log.type === "ENTRADA" ? "+" : "-"}
                    {log.quantity}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}