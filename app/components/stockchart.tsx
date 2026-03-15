"use client";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// CORREÇÃO: Adicionados tipos :number para totalItems e maxCapacity
export default function StockChart({ totalItems, maxCapacity }: { totalItems: number, maxCapacity: number }) {
  const percent = (totalItems / maxCapacity) * 100;
  
  // CORREÇÃO: Adicionado :number ao parâmetro p
  const getColor = (p: number) => {
    if (p >= 90) return "#3B82F6"; 
    if (p >= 50) return "#EAB308"; 
    if (p >= 30) return "#F97316"; 
    return "#EF4444"; 
  };

  const data = [
    { value: totalItems },
    { value: maxCapacity - totalItems },
  ];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={35} outerRadius={50} startAngle={180} endAngle={0} dataKey="value">
              <Cell fill={getColor(percent)} />
              <Cell fill="#F3F4F6" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="text-center -mt-6">
        <p className="text-2xl font-black" style={{ color: getColor(percent) }}>
          {percent.toFixed(1)}%
        </p>
        <p className="text-[10px] uppercase font-bold text-gray-400">Capacidade</p>
      </div>
    </div>
  );
}