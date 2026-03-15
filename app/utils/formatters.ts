
export function formatStock(totalUnits: number, unitsPerBox: number): string {
  if (!unitsPerBox || unitsPerBox <= 0) return `${totalUnits} Unidades`;

  const boxes = Math.floor(totalUnits / unitsPerBox);
  const remainder = totalUnits % unitsPerBox;
  
  if (remainder === 0) {
    return `${boxes} ${boxes === 1 ? 'Caixa' : 'Caixas'}`;
  }
  
  if (boxes === 0) {
    return `${remainder} Unidades`;
  }

  return `${boxes} ${boxes === 1 ? 'Caixa' : 'Caixas'} e ${remainder} Unidades`;
}