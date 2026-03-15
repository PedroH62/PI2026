"use client";
import { useState } from "react";

interface MovementScannerProps {
  onAction: () => void; // Função para atualizar a tabela e o histórico na page.tsx
}

export default function MovementScanner({ onAction }: MovementScannerProps) {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleMovement = async (type: "ENTRADA" | "SAÍDA") => {
    if (!barcode.trim()) return;

    setLoading(true);
    try {
      let quantity = 1;
      let sku = barcode.trim();

      // LÓGICA DO MULTIPLICADOR: Se detectar o 'x', separa a quantidade do código
      if (barcode.includes("x") || barcode.includes("X")) {
        const parts = barcode.toLowerCase().split("x");
        quantity = parseInt(parts[0]);
        sku = parts[1];

        if (isNaN(quantity) || !sku) {
          alert("Formato inválido! Use: QuantidadexCódigo (Ex: 12x789451)");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          sku: sku, 
          quantity: quantity, 
          type: type 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setBarcode(""); // Limpa o campo após o sucesso
        onAction();     // Dispara a atualização dos outros componentes
      } else {
        alert(result.error || "Erro ao processar movimentação");
      }
    } catch (error) {
      alert("Erro de conexão com o terminal.");
    } finally {
      setLoading(false);
    }
  };

  // Função para permitir dar "Enter" no teclado/leitor e disparar Entrada por padrão
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleMovement("ENTRADA");
    }
  };

  return (
    <div className="bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Modo do Terminal</h2>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Bipe ou digite '12xSKU'..."
            className="w-full bg-slate-800 border-2 border-slate-700 p-4 rounded-xl text-green-400 font-mono text-xl outline-none focus:border-green-500 transition-all placeholder:text-slate-600"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
          />
          <span className="absolute right-4 top-4 text-slate-600 text-[10px] font-bold uppercase">Aguardando...</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleMovement("ENTRADA")}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl uppercase text-xs shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : "↑ Entrada"}
          </button>
          
          <button
            onClick={() => handleMovement("SAÍDA")}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl uppercase text-xs shadow-lg shadow-rose-900/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "..." : "↓ Saída"}
          </button>
        </div>
        
        <p className="text-[9px] text-slate-500 text-center italic">
          Dica: Para múltiplas unidades, digite a quantidade seguida de 'x' e o código.
        </p>
      </div>
    </div>
  );
}