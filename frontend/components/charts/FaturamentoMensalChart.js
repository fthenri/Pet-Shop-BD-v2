'use client';
import { Bar } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function FaturamentoMensalChart({ chartData, onBarClick, selectedYear }) {
  if (!selectedYear) {
    return <p>Clique em um ano para ver os meses.</p>;
  }
  if (!chartData || chartData.length === 0) {
    return <p>Carregando dados mensais para {selectedYear}...</p>;
  }

  const data = {
    labels: chartData.map(item => item.mes), 
    datasets: [
      {
        label: `Faturamento em ${selectedYear}`,
        data: chartData.map(item => item.faturamento),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Faturamento Mensal de ${selectedYear} (Clique para ver os dias)`,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const mesClicado = data.labels[elementIndex];
        onBarClick(mesClicado);
      }
    },
    scales: { y: { beginAtZero: true } }
  };

  return <Bar data={data} options={options} />;
}