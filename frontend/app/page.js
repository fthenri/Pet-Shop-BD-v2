'use client'; 

import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage'; 
import styles from './page.module.css';

import { 
    FaMoneyBillWave, 
    FaBoxes, 
    FaClipboardList, 
    FaArchive,
    FaDollarSign,
    FaShoppingCart,
    FaChartLine,
    FaFileInvoiceDollar
} from 'react-icons/fa';

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

    // Estados de Dados
    const [anualData, setAnualData] = useState([]);
    const [mensalData, setMensalData] = useState([]);
    const [diarioData, setDiarioData] = useState([]);
    const [ticketMedioData, setTicketMedioData] = useState(null);
    const [faturamentoTotal, setFaturamentoTotal] = useState(null); // Novo KPI
    const [totalVendas, setTotalVendas] = useState(null); // Novo KPI
    
    const [topProdutosReceita, setTopProdutosReceita] = useState(null);
    const [topClientesData, setTopClientesData] = useState(null);
    const [novosClientesData, setNovosClientesData] = useState(null);
    const [petsPorIdadeData, setPetsPorIdadeData] = useState(null);
    const [produtosEncalhadosData, setProdutosEncalhadosData] = useState(null);
    const [topProdutosQtd, setTopProdutosQtd] = useState(null);
    const [vendasPorAtendente, setVendasPorAtendente] = useState(null);
    const [consultasPorVet, setConsultasPorVet] = useState(null);

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
                // Novos KPIs
                const [resFatTotal, resTotalVendas, resTicket] = await Promise.all([
                    fetch(`${API_URL}/faturamento-total?${financeQuery}`),
                    fetch(`${API_URL}/total-vendas?${financeQuery}`),
                    fetch(`${API_URL}/ticket-medio?${financeQuery}`)
                ]);
                if (resFatTotal.ok) setFaturamentoTotal((await resFatTotal.json()).faturamento_total);
                if (resTotalVendas.ok) setTotalVendas((await resTotalVendas.json()).total_vendas);
                if (resTicket.ok) setTicketMedioData((await resTicket.json()).ticket_medio);

                const qAnual = buildQueryString({ produtoId: filters.produtoId, atendenteId: filters.atendenteId });
                const resAnual = await fetch(`${API_URL}/faturamento-anual?${qAnual}`);
                if (resAnual.ok) setAnualData(await resAnual.json());

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
        
        const fetchProductData = async () => {
            try {
                const [resTopReceita, resTopQtd] = await Promise.all([
                    fetch(`${API_URL}/top-produtos-receita?${productQuery}`),
                    fetch(`${API_URL}/top-produtos-quantidade?${productQuery}`)
                ]);
                if (resTopReceita.ok) setTopProdutosReceita(await resTopReceita.json());
                if (resTopQtd.ok) setTopProdutosQtd(await resTopQtd.json());
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

    if (isLoadingDefaults) {
        return <p>Carregando dashboard...</p>;
    }

    return (
        <>
            {/* NOVA SEÇÃO DE KPIs NO TOPO */}
            <section className="content-section">
                <div className={styles.sectionHeader}>
                    <FaChartLine />
                    <h2>Resumo do Período</h2>
                </div>
                <div className={styles.kpiContainer}>
                    <KpiCard
                        title="Faturamento Total"
                        value={faturamentoTotal}
                        icon={<FaDollarSign />}
                        color="#28a745"
                        formatAsCurrency={true}
                    />
                    <KpiCard
                        title="Total de Vendas"
                        value={totalVendas}
                        icon={<FaShoppingCart />}
                        color="var(--primary-color)"
                    />
                    <KpiCard
                        title="Ticket Médio"
                        value={ticketMedioData}
                        icon={<FaFileInvoiceDollar />}
                        color="#f0b429"
                        formatAsCurrency={true}
                    />
                </div>
            </section>

            <section className="content-section">
                <div className={styles.sectionHeader}>
                    <h2>Filtros Globais</h2>
                </div>
                <DashboardGlobalFilters 
                    filters={filters} 
                    setFilters={handleGlobalFilterChange} 
                    onClearFilters={handleClearFilters}
                />
            </section>

            <section id="financeiro-section" className="content-section">
                <div className={styles.sectionHeader}>
                    <FaMoneyBillWave />
                    <h2>Métricas Financeiras</h2>
                </div>
                
                <div className={`${styles.chartsGrid} ${styles.financeGrid}`}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartContentWrapper}>
                            <FaturamentoAnualChart 
                                chartData={anualData} 
                                onBarClick={(ano) => handleGraphClick({ ano: ano })}
                            />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <div className={styles.chartContentWrapper}>
                            <FaturamentoMensalChart 
                                chartData={mensalData} 
                                onBarClick={(mes) => handleGraphClick({ mes: mes })}
                                selectedYear={filters.ano}
                            />
                        </div>
                    </div>
                    <div className={`${styles.chartCard} ${styles.fullWidthCard}`}>
                        <div className={styles.lineChartWrapper}>
                            <FaturamentoDiarioChart 
                                chartData={diarioData} 
                                selectedMonth={filters.mes}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section id="produtos-clientes-section" className="content-section">
                <div className={styles.sectionHeader}>
                    <FaBoxes />
                    <h2>Métricas de Produtos e Clientes</h2>
                </div>
                
                <div className={`${styles.chartsGrid} ${styles.productGrid}`}>
                    <div className={styles.chartCard}>
                        <div className={styles.chartContentWrapper}>
                            <TopProdutosChart 
                                chartData={topProdutosReceita}
                                title="Top 5 Produtos por Receita (R$)"
                                label="Receita (R$)"
                                backgroundColor="rgba(255, 99, 132, 0.6)"
                                onBarClick={(prodId) => handleGraphClick({ produtoId: prodId })}
                                dataKey="receita_total" 
                            />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <div className={styles.chartContentWrapper}>
                            <TopProdutosChart 
                                chartData={topProdutosQtd} 
                                title="Top 5 Produtos por Quantidade (Un.)" 
                                label="Unidades Vendidas"
                                backgroundColor="rgba(54, 162, 235, 0.6)" 
                                onBarClick={(prodId) => handleGraphClick({ produtoId: prodId })}
                                dataKey="unidades_vendidas" 
                            />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <div className={styles.chartContentWrapper}>
                            <TopClientesChart chartData={topClientesData} />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <div className={styles.chartContentWrapper}>
                            <PetsPorIdadeChart chartData={petsPorIdadeData} />
                        </div>
                    </div>
                </div>
            </section>

            <section id="operacional-section" className="content-section">
                <div className={styles.sectionHeader}>
                    <FaClipboardList />
                    <h2>Métricas Operacionais e de Equipe</h2>
                </div>

                <div className={`${styles.chartsGrid} ${styles.opsGrid}`}>
                    <div className={`${styles.chartCard} ${styles.pieCard}`}>
                        <div className={styles.chartContentWrapper}>
                            <VendasPorAtendenteChart 
                                chartData={vendasPorAtendente}
                                onSliceClick={(atendenteId) => handleGraphClick({ atendenteId: atendenteId })}
                            />
                        </div>
                    </div>
                    <div className={`${styles.chartCard} ${styles.barCard}`}>
                        <div className={styles.chartContentWrapper}>
                            <ConsultasPorVetChart chartData={consultasPorVet} />
                        </div>
                    </div>
                    <div className={`${styles.chartCard} ${styles.barCard}`}>
                        <div className={styles.chartContentWrapper}>
                            <NovosClientesChart chartData={novosClientesData} />
                        </div>
                    </div>
                </div>
            </section>

            <section id="inventario-section" className="content-section">
                <div className={styles.sectionHeader}>
                    <FaArchive />
                    <h2>Métricas de Inventário</h2>
                </div>
                 <div className={`${styles.chartsGrid} ${styles.inventoryGrid}`}>
                    <div className={styles.chartCard}> 
                        <ProdutosEncalhadosTable tableData={produtosEncalhadosData} />
                    </div>
                </div>
            </section>
        </>
    );
}