'use client';
import { Line } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function NovosClientesChart({ chartData }) {
  if (!chartData) {
    return <p>Carregando aquisição de clientes...</p>;
  }

  const data = {
    labels: chartData.map(item => item.mes),
    datasets: [
      {
        label: 'Novos Clientes',
        data: chartData.map(item => item.total_novos),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        fill: true,
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
        text: 'Aquisição de Novos Clientes por Mês',
      },
    },
    scales: { y: { beginAtZero: true } }
  };

  return <Line data={data} options={options} />;
}