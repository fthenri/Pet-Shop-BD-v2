'use client';

export default function KpiCard({ title, value, formatAsCurrency = false }) {
  
  const formatValue = () => {
    if (value === null || value === undefined) {
      return '...';
    }
    if (formatAsCurrency) {
      return parseFloat(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
    return value;
  };

  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <p>{formatValue()}</p>
    </div>
  );
}