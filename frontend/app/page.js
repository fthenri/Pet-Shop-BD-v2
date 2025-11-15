'use client'; 

import { useState, useEffect, useCallback } from 'react';
import ImageModal from '../components/ImageModal'; 
import { useLocalStorage } from '../hooks/useLocalStorage'; 

import DashboardGlobalFilters from '../components/charts/DashboardGlobalFilters';
import FaturamentoAnualChart from '../components/charts/FaturamentoAnualChart';
import FaturamentoMensalChart from '../components/charts/FaturamentoMensalChart';
import FaturamentoDiarioChart from '../components/charts/FaturamentoDiarioChart';
import KpiCard from '../components/charts/KpiCard'; 
import TopProdutosChart from '../components/charts/TopProdutosChart';
import ProdutosEncalhadosTable from '../components/charts/ProdutosEncalhadosTable';
import TopClientesChart from '../components/charts/TopClientesChart';
import NovosClientesChart from '../components/charts/NovosClientesChart';
import PetsPorIdadeChart from '../components/charts/PetsPorIdadeChart';
import VendasPorAtendenteChart from '../components/charts/VendasPorAtendenteChart';
import ConsultasPorVetChart from '../components/charts/ConsultasPorVetChart';


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
    const [ticketMedioData, setTicketMedioData] = useState(null); 
    const [topProdutosReceita, setTopProdutosReceita] = useState(null);
    const [topClientesData, setTopClientesData] = useState(null);
    const [novosClientesData, setNovosClientesData] = useState(null);
    const [petsPorIdadeData, setPetsPorIdadeData] = useState(null);
    const [produtosEncalhadosData, setProdutosEncalhadosData] = useState(null);
    const [topProdutosQtd, setTopProdutosQtd] = useState(null);
    const [vendasPorAtendente, setVendasPorAtendente] = useState(null);
    const [consultasPorVet, setConsultasPorVet] = useState(null);

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


    const fetchLatestData = useCallback(async () => {
        setIsLoadingDefaults(true);
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
    }, [setFilters]); 


    useEffect(() => {
        if (isLoadingDefaults) return;

        const financeQuery = buildQueryString(filters);
        const productQuery = buildQueryString({ ano: filters.ano, mes: filters.mes, atendenteId: filters.atendenteId });
        const clientQuery = buildQueryString({ ano: filters.ano, mes: filters.mes, produtoId: filters.produtoId });
        const opsQuery = buildQueryString({ ano: filters.ano, mes: filters.mes, produtoId: filters.produtoId });
        const vetQuery = buildQueryString({ ano: filters.ano, mes: filters.mes });

        const fetchFinanceData = async () => {
            try {
                const qAnual = buildQueryString({ produtoId: filters.produtoId, atendenteId: filters.atendenteId });
                const resAnual = await fetch(`${API_URL}/faturamento-anual?${qAnual}`);
                if (resAnual.ok) setAnualData(await resAnual.json());

                const resTicket = await fetch(`${API_URL}/ticket-medio?${financeQuery}`);
                if (resTicket.ok) setTicketMedioData((await resTicket.json()).ticket_medio);

                if (filters.ano) {
                    const qMensal = buildQueryString({ ano: filters.ano, produtoId: filters.produtoId, atendenteId: filters.atendenteId });
                    const resMensal = await fetch(`${API_URL}/faturamento-mensal?${qMensal}`);
                    if (resMensal.ok) setMensalData(await resMensal.json());
                } else { setMensalData([]); }

                if (filters.mes) {
                    const qDiario = buildQueryString(filters);
                    const resDiario = await fetch(`${API_URL}/faturamento-diario?${qDiario}`);
                    if (resDiario.ok) setDiarioData(await resDiario.json());
                } else { setDiarioData([]); }
            } catch (e) { console.error("Erro Financeiro:", e); }
        };
        // 2. Bloco Produtos
        const fetchProductData = async () => {
            try {
                const [resTopReceita, resTopQtd] = await Promise.all([
                    fetch(`${API_URL}/top-produtos-receita?${productQuery}`),
                    fetch(`${API_URL}/top-produtos-quantidade?${productQuery}`) // <-- NOVO FETCH
                ]);
                if (resTopReceita.ok) setTopProdutosReceita(await resTopReceita.json());
                if (resTopQtd.ok) setTopProdutosQtd(await resTopQtd.json()); // <-- NOVO STATE
            } catch (e) { console.error("Erro Produtos:", e); }
        };

        const fetchClientData = async () => {
             try {
                const resTopCli = await fetch(`${API_URL}/top-clientes-gasto?${clientQuery}`);
                if (resTopCli.ok) setTopClientesData(await resTopCli.json());
                
                if (novosClientesData === null) {
                    const resNovosCli = await fetch(`${API_URL}/novos-clientes-mes`);
                    if (resNovosCli.ok) setNovosClientesData(await resNovosCli.json());
                }
                if (petsPorIdadeData === null) {
                    const resPetsIdade = await fetch(`${API_URL}/pets-por-idade`);
                    if (resPetsIdade.ok) setPetsPorIdadeData(await resPetsIdade.json());
                }
             } catch (e) { console.error("Erro Clientes:", e); }
        };

        const fetchOpsData = async () => {
            try {
                 const [resVendasAtendente, resConsultasVet] = await Promise.all([
                    fetch(`${API_URL}/vendas-por-atendente?${opsQuery}`),
                    fetch(`${API_URL}/consultas-por-veterinario?${vetQuery}`) 
                ]);
                if (resVendasAtendente.ok) setVendasPorAtendente(await resVendasAtendente.json());
                if (resConsultasVet.ok) setConsultasPorVet(await resConsultasVet.json());
             } catch (e) { console.error("Erro Operacional:", e); }
        };

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
        fetchOpsData(); 
        fetchInventoryData();

    }, [filters, isLoadingDefaults, novosClientesData, petsPorIdadeData, produtosEncalhadosData]); 
    
    useEffect(() => {
        const savedFiltersRaw = localStorage.getItem('dashboardFilters');
        const hasSavedFilters = savedFiltersRaw && 
                                savedFiltersRaw !== 'null' && 
                                Object.values(JSON.parse(savedFiltersRaw)).some(v => v !== null);

        if (!hasSavedFilters) {
            fetchLatestData(); 
        } else {
            setIsLoadingDefaults(false); 
        }
    }, [fetchLatestData]); 

	    
    const handleGraphClick = (newFilters) => {
        setFilters(prev => {
            const updated = { ...prev };

            if (newFilters.ano !== undefined) {
                updated.ano = prev.ano === newFilters.ano ? null : newFilters.ano;
                updated.mes = null; 
            }
            if (newFilters.mes !== undefined) {
                updated.mes = prev.mes === newFilters.mes ? null : newFilters.mes;
            }
            if (newFilters.produtoId !== undefined) {
                updated.produtoId = prev.produtoId === newFilters.produtoId ? null : newFilters.produtoId;
            }
            if (newFilters.atendenteId !== undefined) {
                updated.atendenteId = prev.atendenteId === newFilters.atendenteId ? null : newFilters.atendenteId;
            }
            
            return updated;
        });
    };

    const handleGlobalFilterChange = (key, value) => {
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters, [key]: value || null };
            if (key === 'ano') {
                newFilters.mes = null; 
            }
            return newFilters;
        });
    };

    const handleClearFilters = () => {
      localStorage.removeItem('dashboardFilters');
      setFilters({ ano: null, mes: null, produtoId: null, atendenteId: null });
      fetchLatestData(); 
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

			<section id="financeiro-section" className="content-section" style={{ marginTop: '2rem' }}>
				<h2>💰 Métricas Financeiras</h2>
                <div className="charts-container" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                    <KpiCard
                        title="Ticket Médio"
                        value={ticketMedioData}
                        formatAsCurrency={true}
                    />
                    <figure>
                        <FaturamentoAnualChart 
                            chartData={anualData} 
                            onBarClick={(ano) => handleGraphClick({ ano: ano })}
                        />
                    </figure>
                    <figure>
                        <FaturamentoMensalChart 
                            chartData={mensalData} 
                            onBarClick={(mes) => handleGraphClick({ mes: mes })}
                            selectedYear={filters.ano}
                        />
                    </figure>
                    <figure style={{ gridColumn: 'span 3' }}>
                        <FaturamentoDiarioChart 
                            chartData={diarioData} 
                            selectedMonth={filters.mes}
                        />
                    </figure>
                </div>
            </section>

            <section id="produtos-clientes-section" className="content-section" style={{ marginTop: '2rem' }}>
                <h2>🛍️ Métricas de Produtos e Clientes</h2>
                <div className="charts-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    
                    <figure>
                         <TopProdutosChart 
                            chartData={topProdutosReceita}
                            title="Top 5 Produtos por Receita (R$)"
                            label="Receita (R$)"
                            backgroundColor="rgba(255, 99, 132, 0.6)"
                            onBarClick={(prodId) => handleGraphClick({ produtoId: prodId })}
                            dataKey="receita_total" 
                        />
                    </figure>

                    <figure>
                         <TopProdutosChart 
                            chartData={topProdutosQtd} 
                            title="Top 5 Produtos por Quantidade (Un.)" 
                            label="Unidades Vendidas"
                            backgroundColor="rgba(54, 162, 235, 0.6)" 
                            onBarClick={(prodId) => handleGraphClick({ produtoId: prodId })}
                            dataKey="unidades_vendidas" 
                        />
                    </figure>

                    <figure>
                        <TopClientesChart chartData={topClientesData} />
                    </figure>
                    <figure>
                        <PetsPorIdadeChart chartData={petsPorIdadeData} />
                    </figure>

                </div>
            </section>

            <section id="operacional-section" className="content-section" style={{ marginTop: '2rem' }}>
                <h2>🩺 Métricas Operacionais e de Equipe</h2>
                <div className="charts-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <figure>
                        <VendasPorAtendenteChart 
                            chartData={vendasPorAtendente}
                            onSliceClick={(atendenteId) => handleGraphClick({ atendenteId: atendenteId })}
                        />
                    </figure>
                    <figure>
                        <ConsultasPorVetChart chartData={consultasPorVet} />
                    </figure>
                    <figure>
                        <NovosClientesChart chartData={novosClientesData} />
                    </figure>
                </div>
            </section>

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