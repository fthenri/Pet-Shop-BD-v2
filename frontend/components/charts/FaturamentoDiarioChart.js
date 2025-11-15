'use client';
import { Line } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function FaturamentoDiarioChart({ chartData, selectedMonth }) {
  if (!selectedMonth) {
    return <p>Clique em um mês para ver os dias.</p>;
  }
  if (!chartData || chartData.length === 0) {
    return <p>Carregando dados diários para {selectedMonth}...</p>;
  }

  const data = {
    labels: chartData.map(item => item.dia),
    datasets: [
      {
        label: `Faturamento em ${selectedMonth}`,
        data: chartData.map(item => item.faturamento),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.6)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `Faturamento Diário de ${selectedMonth}`,
      },
    },
    scales: { y: { beginAtZero: true } }
  };

  return <Line data={data} options={options} />;
}