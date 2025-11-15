'use client'; 

import { useState, useEffect } from 'react';
import ImageModal from '../components/ImageModal'; 
import { useLocalStorage } from '../hooks/useLocalStorage';

// componentes
import DashboardGlobalFilters from '../components/charts/DashboardGlobalFilters';
// bloco financeiro
import FaturamentoAnualChart from '../components/charts/FaturamentoAnualChart';
import FaturamentoMensalChart from '../components/charts/FaturamentoMensalChart';
import FaturamentoDiarioChart from '../components/charts/FaturamentoDiarioChart';
// bloco produtos
import TopProdutosChart from '../components/charts/TopProdutosChart';
import ProdutosEncalhadosTable from '../components/charts/ProdutosEncalhadosTable';
// bloco clientese pets
import TopClientesChart from '../components/charts/TopClientesChart';
import NovosClientesChart from '../components/charts/NovosClientesChart';
import PetsPorIdadeChart from '../components/charts/PetsPorIdadeChart';


export default function Dashboard() {
    const API_URL = 'http://localhost:8080/api/dashboard';

    const [filters, setFilters] = useLocalStorage('dashboardFilters', {
      ano: null,
      mes: null,
      produtoId: null,
      atendenteId: null,
    });

    const [anualData, setAnualData] = useState([]);
    const [mensalData, setMensalData] = useState([]);
    const [diarioData, setDiarioData] = useState([]);
    const [topProdutosData, setTopProdutosData] = useState(null);
    const [topClientesData, setTopClientesData] = useState(null);
    const [novosClientesData, setNovosClientesData] = useState(null);
    const [petsPorIdadeData, setPetsPorIdadeData] = useState(null);
    const [produtosEncalhadosData, setProdutosEncalhadosData] = useState(null);

	const [modalImageSrc, setModalImageSrc] = useState(null); 
    const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);

    const buildQueryString = (params) => {
        const query = new URLSearchParams();
        if (params.ano) query.append('ano', params.ano);
        if (params.mes) query.append('mes', params.mes);
        if (params.produtoId) query.append('produtoId', params.produtoId);
        if (params.atendenteId) query.append('atendenteId', params.atendenteId);
        return query.toString();
    };


    useEffect(() => {
        const productQuery = buildQueryString({ ano: filters.ano, mes: filters.mes, atendenteId: filters.atendenteId });
        const clientQuery = buildQueryString({ ano: filters.ano, mes: filters.mes });

        // bloco financeiro (ano / mes / dia)
        const fetchFinanceData = async () => {
            try {
                // anual
                const qAnual = buildQueryString({ produtoId: filters.produtoId, atendenteId: filters.atendenteId });
                const resAnual = await fetch(`${API_URL}/faturamento-anual?${qAnual}`);
                if (resAnual.ok) setAnualData(await resAnual.json());

                // mensal
                if (filters.ano) {
                    const qMensal = buildQueryString(filters); 
                    const resMensal = await fetch(`${API_URL}/faturamento-mensal?${qMensal}`);
                    if (resMensal.ok) setMensalData(await resMensal.json());
                } else {
                    setMensalData([]);
                }

                // diario
                if (filters.mes) {
                    const qDiario = buildQueryString(filters);
                    const resDiario = await fetch(`${API_URL}/faturamento-diario?${qDiario}`);
                    if (resDiario.ok) setDiarioData(await resDiario.json());
                } else {
                    setDiarioData([]);
                }
            } catch (e) { console.error("Erro Financeiro:", e); }
        };

        // bloco produtos
        const fetchProductData = async () => {
            try {
                const resTopProd = await fetch(`${API_URL}/top-produtos-receita?${productQuery}`);
                if (resTopProd.ok) setTopProdutosData(await resTopProd.json());
            } catch (e) { console.error("Erro Produtos:", e); }
        };

        // bloco clientes e pets
        const fetchClientData = async () => {
             try {
                const [resTopCli, resNovosCli, resPetsIdade] = await Promise.all([
                    fetch(`${API_URL}/top-clientes-gasto?${clientQuery}`),
                    fetch(`${API_URL}/novos-clientes-mes`), // infiltravel
                    fetch(`${API_URL}/pets-por-idade`)      // infiltravel
                ]);
                if (resTopCli.ok) setTopClientesData(await resTopCli.json());
                if (resNovosCli.ok) setNovosClientesData(await resNovosCli.json());
                if (resPetsIdade.ok) setPetsPorIdadeData(await resPetsIdade.json());
             } catch (e) { console.error("Erro Clientes:", e); }
        };

        // bloco inventario (nao tem filtros)
        const fetchInventoryData = async () => {
            if (produtosEncalhadosData === null) { 
                try {
                    const res = await fetch(`${API_URL}/produtos-encalhados`);
                    if (res.ok) setProdutosEncalhadosData(await res.json());
                } catch (e) { console.error("Erro Inventário:", e); }
            }
        };

        fetchFinanceData();
        fetchProductData();
        fetchClientData();
        if (produtosEncalhadosData === null) {
            fetchInventoryData();
        }

    }, [filters]); 

    
    useEffect(() => {
        const savedFiltersRaw = localStorage.getItem('dashboardFilters');
        const hasSavedFilters = savedFiltersRaw && savedFiltersRaw !== 'null';

        if (!hasSavedFilters) {
            setIsLoadingDefaults(true);
            const fetchLatestData = async () => {
                try {
                    const resAnual = await fetch(`${API_URL}/faturamento-anual`);
                    const dataAnual = await resAnual.json();
                    if (dataAnual.length > 0) {
                        const ultimoAno = dataAnual[dataAnual.length - 1].ano;

                        const resMensal = await fetch(`${API_URL}/faturamento-mensal?ano=${ultimoAno}`);
                        const dataMensal = await resMensal.json();
                        if (dataMensal.length > 0) {
                            const ultimoMes = dataMensal[dataMensal.length - 1].mes;
                            
                            setFilters({
                                ano: ultimoAno,
                                mes: ultimoMes,
                                produtoId: null,
                                atendenteId: null,
                            });
                        }
                    }
                } catch (e) {
                    console.error("Erro ao buscar dados padrão:", e);
                } finally {
                    setIsLoadingDefaults(false);
                }
            };
            fetchLatestData();
        } else {
            setIsLoadingDefaults(false); 
        }
    }, []); 

	    
    const handleGraphClick = (newFilters) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handleGlobalFilterChange = (key, value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [key]: value || null,
        }));
    };

    const handleClearFilters = () => {
      localStorage.removeItem('dashboardFilters');
      setFilters({
        ano: null,
        mes: null,
        produtoId: null,
        atendenteId: null,
      });
      setIsLoadingDefaults(true);
    };


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

    if (isLoadingDefaults) {
        return <p className="main-content">Carregando dashboard...</p>;
    }

	return (
		<>
            <section className="content-section">
                <h2>Filtros Globais</h2>
                <DashboardGlobalFilters 
                    filters={filters} 
                    setFilters={handleGlobalFilterChange} 
                    onClearFilters={handleClearFilters}
                />
            </section>

            {/* bloco metricas financeiras  */}
			<section id="financeiro-section" className="content-section" style={{ marginTop: '2rem' }}>
				<h2>💰 Métricas Financeiras</h2>
                <div className="charts-container">
                    <figure>
                        <FaturamentoAnualChart 
                            chartData={anualData} 
                            onBarClick={(ano) => handleGraphClick({ ano: filters.ano === ano ? null : ano, mes: null })}
                        />
                    </figure>
                    <figure>
                        <FaturamentoMensalChart 
                            chartData={mensalData} 
                            onBarClick={(mes) => handleGraphClick({ mes: filters.mes === mes ? null : mes })}
                            selectedYear={filters.ano}
                        />
                    </figure>
                    <figure style={{ gridColumn: 'span 2' }}>
                        <FaturamentoDiarioChart 
                            chartData={diarioData} 
                            selectedMonth={filters.mes}
                        />
                    </figure>
                </div>
            </section>

            {/* bloco produtos e clientes */}
            <section id="produtos-clientes-section" className="content-section" style={{ marginTop: '2rem' }}>
                <h2>🛍️ Métricas de Produtos e Clientes</h2>
                <div className="charts-container">
                    <figure>
                         <TopProdutosChart 
                            chartData={topProdutosData}
                            onBarClick={(prodId) => handleGraphClick({ produtoId: filters.produtoId === prodId ? null : prodId })}
                        />
                    </figure>
                    <figure>
                        <TopClientesChart chartData={topClientesData} />
                    </figure>
                    <figure>
                        <PetsPorIdadeChart chartData={petsPorIdadeData} />
                    </figure>
                     <figure>
                        <NovosClientesChart chartData={novosClientesData} />
                    </figure>
                </div>
            </section>

            {/* bloco inventario  */}
            <section id="inventario-section" className="content-section" style={{ marginTop: '2rem' }}>
                <h2>📦 Métricas de Inventário</h2>
                 <div className="charts-container">
                    <figure style={{ gridColumn: '1 / -1' }}>
                        <ProdutosEncalhadosTable tableData={produtosEncalhadosData} />
                    </figure>
                </div>
            </section>


			<section id="dashboard-section" className="content-section" style={{ marginTop: '2rem' }}>
				<h2>Análises Estatísticas (Imagens Estáticas)</h2>
				<div className="charts-container">
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