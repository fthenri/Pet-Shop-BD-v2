'use client';

import { useState } from 'react';
import ImageModal from '../../components/ImageModal';

export default function GraficosEstaticos() {

	const [modalImageSrc, setModalImageSrc] = useState(null); 

    const graphs = [
		{
			src: '/assets/graph1.jpg',
			alt: 'Gráfico de Gasto e Idade do Cliente',
			caption: 'Gráfico 1: Gasto e Idade do Cliente.',
		},
		{
			src: '/assets/graph2.jpg',
			alt: 'Gráfico de Satisfação e Gasto',
			caption: 'Gráfico 2: Satisfação e Gasto.',
		},
		{
			src: '/assets/graph3.jpg',
			alt: 'Gráfico de Distância e Frequência de Visitas',
			caption: 'Gráfico 3: Distância e Frequência de Visitas.',
		},
		{
			src: '/assets/graph4.jpg',
			alt: 'Gráfico de Peso e Idade do Pet',
			caption: 'Gráfico 4: Peso e Idade do Pet.',
		},
		{
			src: '/assets/graph5.jpg',
			alt: 'Gráfico de Gasto e Frequência de Visitas',
			caption: 'Gráfico 5: Gasto e Frequência de Visitas.',
		},
		{
			src: '/assets/graph6.jpg',
			alt: 'Gráfico de Distribuição das Idades dos Clientes',
			caption: 'Gráfico 6: Distribuição das Idades dos Clientes (Histograma).',
		},
		{
			src: '/assets/graph7.jpg',
			alt: 'Gráfico de Distribuição dos Gastos Mensais',
			caption: 'Gráfico 7: Distribuição dos Gastos Mensais (Histograma).',
		},
		{
			src: '/assets/graph8.jpg',
			alt: 'Gráfico de Contagem por Tipo de Pet',
			caption: 'Gráfico 8: Contagem por Tipo de Pet (Gráfico de Barras).',
		},
		{
			src: '/assets/graph9.jpg',
			alt: 'Gráfico de Satisfação por Serviço',
			caption: 'Gráfico 9: Satisfação por Serviço (Gráfico de Barras).',
		},
		{
			src: '/assets/graph10.jpg',
			alt: 'Gráfico de Gasto Médio por Gênero',
			caption: 'Gráfico 10: Gasto Médio por Gênero (Gráfico de Barras).',
		},
		{
			src: '/assets/graph11.jpg',
			alt: 'Gráfico de Proporção de Clientes por Gênero',
			caption: 'Gráfico 11: Proporção de Clientes por Gênero.',
		},
		{
			src: '/assets/graph12.jpg',
			alt: 'Gráfico de Porcentagem de Clientes com Segundo Pet',
			caption: 'Gráfico 12: Porcentagem de Clientes com Segundo Pet.',
		},
		{
			src: '/assets/graph13.jpg',
			alt: 'Gráfico de Proporção do Gasto Total por Tipo de Pet',
			caption: 'Gráfico 13: Proporção do Gasto Total por Tipo de Pet.',
		},
		{
			src: '/assets/graph14.jpg',
			alt: 'Gráfico de Relação entre Gasto, Frequência e Satisfação',
			caption:
				'Gráfico 14: Relação entre Gasto, Frequência e Satisfação (Bubble Chart).',
		},
	];

	return (
        <>
            <section id="graficos-section" className="content-section">
                <div className="section-header">
                    <h2>Análises Estatísticas (Imagens Estáticas)</h2>
                </div>
                <p>
                    Estes são os gráficos estáticos gerados a partir da pesquisa de satisfação,
                    conforme os requisitos originais do projeto de banco de dados.
                </p>
                
                <div className="charts-container" style={{ marginTop: '1.5rem' }}>
                    {graphs.map((graph, index) => (
                        <figure key={index}>
                            <img
                                src={graph.src}
                                alt={graph.alt}
                                onClick={() => setModalImageSrc(graph.src)} 
                                style={{ cursor: 'pointer' }} 
                            />
                            <figcaption>{graph.caption}</figcaption>
                        </figure>
                    ))}
                </div>
            </section>

            <ImageModal src={modalImageSrc} onClose={() => setModalImageSrc(null)} />
        </>
	);
}