'use client';
import { Pie } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function PetsPorIdadeChart({ chartData }) {
  if (!chartData) {
    return <p>Carregando dados de pets...</p>;
  }

  const data = {
    labels: chartData.map(item => item.categoria), // filhote, adulto, idoso
    datasets: [
      {
        data: chartData.map(item => item.total),
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)', // filhote
          'rgba(75, 192, 192, 0.6)', // adulto
          'rgba(153, 102, 255, 0.6)', // idoso
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Distribuição de Pets por Idade',
      },
    },
  };

  return <Pie data={data} options={options} />;
}