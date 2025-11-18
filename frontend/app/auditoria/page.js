'use client';
import { useState, useEffect, useMemo } from 'react';
import { useNotification } from '../../contexts/NotificationContext'; 
import { 
    FaHistory, 
    FaSearch, 
    FaFileInvoiceDollar, 
    FaClock, 
    FaTag, 
    FaArrowUp, 
    FaArrowDown, 
    FaEquals 
} from 'react-icons/fa';
import styles from './auditoria.module.css';

const KpiCard = ({ title, value, icon, color }) => (
    <div className={styles.kpiCard} style={{ '--card-color': color }}>
        <div className={styles.iconWrapper}>
            {icon}
        </div>
        <div className={styles.kpiInfo}>
            <span className={styles.kpiTitle}>{title}</span>
            <span className={styles.kpiValue}>{value}</span>
        </div>
    </div>
);

const RenderizarBadgeAlteracao = ({ preco_novo, preco_antigo }) => {
    const novo = parseFloat(preco_novo);
    const antigo = parseFloat(preco_antigo);
    const diff = novo - antigo;

    if (diff > 0) {
        return (
            <span className={`${styles.badge} ${styles.badgeAumento}`}>
                <FaArrowUp /> +{diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
        );
    }
    if (diff < 0) {
        return (
            <span className={`${styles.badge} ${styles.badgeReducao}`}>
                <FaArrowDown /> {diff.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
        );
    }
    return (
        <span className={`${styles.badge} ${styles.badgeNeutro}`}>
            <FaEquals /> Sem Alteração
        </span>
    );
};


export default function AuditoriaPage() {
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [filtro, setFiltro] = useState('');
    
    const [isAuditing, setIsAuditing] = useState(false);
    const { showNotification } = useNotification();

    const API_URL_CONSULTA = 'http://localhost:8080/api/consultas/executar';
    const API_URL_AUDITORIA = 'http://localhost:8080/api/dashboard/executar-auditoria-vendas';
    
    const QUERY = "SELECT id_log, cod_produto_afetado, preco_antigo, preco_novo, data_hora_alteracao, usuario_db FROM Log_AuditoriaPreco ORDER BY data_hora_alteracao DESC";

    const carregarLogs = async () => {
        setIsLoading(true);
        setErro(null);
        try {
            const response = await fetch(API_URL_CONSULTA, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: QUERY }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao buscar logs.');
            }
            const data = await response.json();
            setLogs(data);
        } catch (error) {
            console.error('Falha ao carregar logs:', error);
            setErro(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        carregarLogs();
    }, []);

    const handleExecutarAuditoria = async () => {
        setIsAuditing(true);
        showNotification({ message: "Iniciando auditoria de vendas...", type: 'info' });
        try {
            const response = await fetch(API_URL_AUDITORIA, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao executar auditoria.');
            }
            
            showNotification({ message: "Auditoria de vendas concluída com sucesso!", type: 'success' });

        } catch (error) {
            console.error('Falha ao executar auditoria:', error);
            showNotification({ message: `Falha na auditoria: ${error.message}`, type: 'error' });
        } finally {
            setIsAuditing(false);
        }
    };

    const kpiData = useMemo(() => {
        if (!logs || logs.length === 0) {
            return {
                totalAlteracoes: 0,
                ultimaAlteracao: 'N/A',
                produtoMaisModificado: 'N/A',
            };
        }

        const ultimaAlteracao = new Date(logs[0].data_hora_alteracao).toLocaleString('pt-BR');

        const contagemProdutos = logs.reduce((acc, log) => {
            const cod = log.cod_produto_afetado;
            acc[cod] = (acc[cod] || 0) + 1;
            return acc;
        }, {});
        
        const [produtoMaisModificado, contagem] = Object.entries(contagemProdutos).reduce(
            (max, entry) => (entry[1] > max[1] ? entry : max),
            ['N/A', 0]
        );

        return {
            totalAlteracoes: logs.length,
            ultimaAlteracao,
            produtoMaisModificado: `Cód. ${produtoMaisModificado} (${contagem}x)`,
        };
    }, [logs]);

    const logsFiltrados = useMemo(() => {
        const termoBusca = filtro.toLowerCase();
        if (!termoBusca) return logs;

        return logs.filter(log =>
            log.cod_produto_afetado.toString().includes(termoBusca) ||
            log.usuario_db.toLowerCase().includes(termoBusca)
        );
    }, [logs, filtro]);

    return (
        <section id="auditoria-section" className="content-section">
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
					<FaHistory style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
					<h2>Painel de Auditoria de Preços</h2>
				</div>
            </div>

            <div className={styles.kpiContainer}>
                <KpiCard 
                    title="Total de Alterações" 
                    value={kpiData.totalAlteracoes} 
                    icon={<FaFileInvoiceDollar />}
                    color="var(--primary-color)"
                />
                <KpiCard 
                    title="Produto Mais Modificado" 
                    value={kpiData.produtoMaisModificado}
                    icon={<FaTag />}
                    color="#f0b429"
                />
                <KpiCard 
                    title="Última Alteração Registrada" 
                    value={kpiData.ultimaAlteracao}
                    icon={<FaClock />}
                    color="#6c757d"
                />
            </div>

            <div className={styles.toolbar}>
                <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <FaSearch style={{ position: 'absolute', left: '12px', color: 'var(--text-color-muted)' }} />
                        <input
                            type="text"
                            placeholder="Filtrar por Cód. Produto ou Usuário..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className={styles.filtroInput}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                </div>
                <button 
                    className="btn btn-primary" 
                    onClick={handleExecutarAuditoria}
                    disabled={isAuditing}
                >
                    {isAuditing ? 'Executando...' : 'Executar Auditoria de Totais de Venda (SP)'}
                </button>
            </div>
            
            <p>
                A tabela abaixo exibe o log (via Trigger) de todas as alterações de preços.
            </p>
            <div className="table-container" style={{ marginTop: '1.5rem' }}>
                <RenderizarResultado
                    isLoading={isLoading}
                    erro={erro}
                    resultado={logsFiltrados}
                />
            </div>
        </section>
    );
}

function RenderizarResultado({ isLoading, erro, resultado }) {
    if (isLoading) {
        return <p>Carregando logs...</p>;
    }

    if (erro) {
        return <p style={{ color: 'red' }}><b>Erro:</b> {erro}</p>;
    }

    if (!resultado) {
        return <p>O resultado da sua consulta aparecerá aqui.</p>;
    }

    if (resultado.length === 0) {
        return <p>Nenhum log de auditoria encontrado.</p>;
    }

    return (
        <table className="data-table">
            <thead>
                <tr>
                    <th>Cód. Produto</th>
                    <th>Preço Antigo</th>
                    <th>Preço Novo</th>
                    <th>Alteração</th>
                    <th>Data/Hora da Alteração</th>
                    <th>Usuário (DB)</th>
                </tr>
            </thead>
            <tbody>
                {resultado.map((linha, index) => (
                    <tr key={linha.id_log || index}>
                        <td>{linha.cod_produto_afetado}</td>
                        <td>{parseFloat(linha.preco_antigo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>{parseFloat(linha.preco_novo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                        <td>
                            <RenderizarBadgeAlteracao 
                                preco_novo={linha.preco_novo}
                                preco_antigo={linha.preco_antigo}
                            />
                        </td>
                        <td>{new Date(linha.data_hora_alteracao).toLocaleString('pt-BR')}</td>
                        <td>{linha.usuario_db}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}