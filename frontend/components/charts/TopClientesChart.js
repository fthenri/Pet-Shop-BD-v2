'use client';
import { Bar } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function TopClientesChart({ chartData }) {
  if (!chartData) {
    return <p>Carregando Top Clientes...</p>;
  }
  if (chartData.length === 0) {
    return <p>Nenhum dado de cliente para este período.</p>;
  }

  const data = {
    labels: chartData.map(item => item.nome),
    datasets: [
      {
        label: 'Total Gasto (R$)',
        data: chartData.map(item => item.total_gasto),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Top 10 Clientes por Faturamento',
      },
    },
    scales: { x: { beginAtZero: true } }
  };

  return <Bar data={data} options={options} />;
}