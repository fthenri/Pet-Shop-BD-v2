'use client';
import { Pie } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function VendasPorAtendenteChart({ chartData, onSliceClick }) {
  if (!chartData) {
    return <p>Carregando Vendas por Atendente...</p>;
  }
  if (chartData.length === 0) {
    return <p>Nenhuma venda de atendente para este período.</p>;
  }

  const atendenteIds = chartData.map(item => item.cod_funcionario);

  const data = {
    labels: chartData.map(item => item.nome),
    datasets: [
      {
        data: chartData.map(item => item.total_vendido),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
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
        text: 'Faturamento por Atendente (Clique para filtrar)',
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const atendenteIdClicado = atendenteIds[elementIndex];
        onSliceClick(atendenteIdClicado);
      }
    },
  };

  return <Pie data={data} options={options} />;
}