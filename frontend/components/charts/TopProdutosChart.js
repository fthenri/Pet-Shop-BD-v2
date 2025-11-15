'use client';
import { Bar } from 'react-chartjs-2';
import { registerChartComponents } from './ChartConfig';

registerChartComponents();

export default function TopProdutosChart({ chartData, onBarClick }) {
  if (!chartData) {
    return <p>Carregando dados de produtos...</p>;
  }
  if (chartData.length === 0) {
    return <p>Nenhum produto vendido para este período.</p>;
  }

  const productCodes = chartData.map(item => item.cod_produto);

  const data = {
    labels: chartData.map(item => item.nome_produto),
    datasets: [
      {
        label: 'Receita (R$)',
        data: chartData.map(item => item.receita_total),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
        text: 'Top 5 Produtos por Receita (Clique para filtrar)',
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const elementIndex = elements[0].index;
        const produtoCodClicado = productCodes[elementIndex];
        onBarClick(produtoCodClicado);
      }
    },
    scales: { x: { beginAtZero: true } }
  };

  return <Bar data={data} options={options} />;
}