'use client';
import { Bar } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function ConsultasPorVetChart({ chartData }) {
  if (!chartData) {
    return <p>Carregando Consultas por Veterinário...</p>;
  }
  if (chartData.length === 0) {
    return <p>Nenhuma consulta para este período.</p>;
  }

  const data = {
    labels: chartData.map(item => item.nome.replace('Dr. ', '').replace('Dra. ', '')),
    datasets: [
      {
        label: 'Total de Consultas',
        data: chartData.map(item => item.total_consultas),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Consultas por Veterinário',
      },
    },
    scales: { y: { beginAtZero: true } }
  };

  return <Bar data={data} options={options} />;
}