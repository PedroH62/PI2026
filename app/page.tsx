"use client";
import { useState, useEffect } from "react";
import MovementScanner from "./components/movementscanner";
import MovementLogs from "./components/movementslogs";
import StockChart from "./components/stockchart";
import BatchModal from "./components/batchmodal";

export default function LogisticDashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    expirationDate: "",
    quantity: "",
    internalCode: "",
    batchCode: "",
  });

  const refreshData = async () => {
    try {
      const [resProducts, resLogs] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/movements"),
      ]);
      if (resProducts.ok) setProducts(await resProducts.json());
      if (resLogs.ok) setLogs(await resLogs.json());
    } catch (e) {
      console.error("Erro ao sincronizar dados:", e);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: "", expirationDate: "", quantity: "", internalCode: "", batchCode: "" });
        setSearchTerm("");
        refreshData();
        alert("Lote registrado com sucesso!");
      }
    } catch {
      alert("Falha de conexão com o servidor.");
    }
  };

  // --- FUNÇÃO CORRIGIDA ---
  const deleteProduct = async (id: string) => {
    if (!id) return;
    if (confirm("Remover este item e TODOS os seus lotes?")) {
      try {
        // CORREÇÃO: A URL termina no ID. O método vai no objeto separado.
        const res = await fetch(`/api/products/${id}, { 
          method: "DELETE" 
        }`);

        if (res.ok) {
          refreshData();
        } else {
          const errorData = await res.json();
          alert(`Erro: ${errorData.error}`);
        }
      } catch (error) {
        alert("Falha de conexão ao tentar excluir.");
      }
    }
  };

  const handleOpenDetails = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const totalQuantityGlobal = products.reduce((acc, p) => acc + (Number(p.totalQuantity) || 0), 0);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold italic">WMS <span className="text-teal-600 font-black">Logistics</span></h1>
            <p className="text-sm text-gray-400 font-mono">Gestão de Lotes e Rastreabilidade</p>
          </div>
          <div className="w-64">
            <StockChart totalItems={totalQuantityGlobal} maxCapacity={10000} />
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Unidades em Estoque</p>
            <h2 className="text-3xl font-black text-teal-600">{totalQuantityGlobal}</h2>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <MovementScanner onAction={refreshData} />
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm space-y-4 border border-gray-100">
              <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Novo Registro de Lote</h3>
              <input placeholder="SKU" className="w-full border p-3 rounded-lg text-sm" value={formData.internalCode} onChange={(e) => setFormData({...formData, internalCode: e.target.value})} required />
              <input placeholder="Nome" className="w-full border p-3 rounded-lg text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input placeholder="Lote" className="w-full border p-3 rounded-lg text-sm bg-gray-50" value={formData.batchCode} onChange={(e) => setFormData({...formData, batchCode: e.target.value})} required />
              <div className="flex gap-4">
                <input type="date" className="w-1/2 border p-3 rounded-lg text-sm" value={formData.expirationDate} onChange={(e) => setFormData({...formData, expirationDate: e.target.value})} required />
                <input type="number" placeholder="Qtd" className="w-1/2 border p-3 rounded-lg text-sm" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} required />
              </div>
              <button type="submit" className="w-full bg-teal-600 text-white font-black py-4 rounded-lg uppercase text-xs hover:bg-teal-700 transition-all">Confirmar Entrada</button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <input type="text" placeholder="Pesquisar por nome, SKU ou lote..." className="w-full p-4 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-teal-500 transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <span className="absolute right-4 top-4 opacity-30 text-xl">🔍</span>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-[10px] uppercase font-black text-gray-400 tracking-tighter">
                  <tr>
                    <th className="px-6 py-4">SKU</th>
                    <th className="px-6 py-4">Item</th>
                    <th className="px-6 py-4">Saldo Total</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products
                    .filter(p => {
                      if (searchTerm === "") return true;
                      return p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.internalCode.includes(searchTerm);
                    })
                    .map((p: any) => (
                    <tr key={p.id} onDoubleClick={() => handleOpenDetails(p)} className="border-b border-gray-50 hover:bg-teal-50/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-mono text-teal-600 font-bold">{p.internalCode}</td>
                      <td className="px-6 py-4 font-bold text-gray-700">{p.name}</td>
                      <td className="px-6 py-4 font-black">{p.totalQuantity} <span className="font-normal text-[10px] opacity-40">un</span></td>
                      <td className="px-6 py-4 text-center">
                        <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }} className="text-gray-300 hover:text-red-600 transition-colors text-lg">🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <MovementLogs logs={logs} />
          </div>
        </div>

        <BatchModal product={selectedProduct} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </main>
  );
}