'use client';
import { Bar } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function FaturamentoAnualChart({ chartData, onBarClick }) {
  if (!chartData || chartData.length === 0) {
    return <p>Carregando dados anuais...</p>;
  }

  const data = {
    labels: chartData.map(item => item.ano),
    datasets: [
      {
        label: 'Faturamento (R$)',
        data: chartData.map(item => item.faturamento),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Faturamento Anual (Clique para ver os meses)',
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const anoClicado = data.labels[elementIndex];
        onBarClick(anoClicado);
      }
    },
    scales: { y: { beginAtZero: true } }
  };

  return <Bar data={data} options={options} />;
}