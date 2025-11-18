'use client';
import { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext'; 

export default function AuditoriaPage() {
    const [logs, setLogs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(null);
    
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

            carregarLogs(); 

        } catch (error) {
            console.error('Falha ao executar auditoria:', error);
            showNotification({ message: `Falha na auditoria: ${error.message}`, type: 'error' });
        } finally {
            setIsAuditing(false);
        }
    };

    return (
        <section id="auditoria-section" className="content-section">
            <div className="section-header">
                <h2>Auditoria de Preços de Produtos</h2>
                <button 
                    className="btn btn-primary" 
                    onClick={handleExecutarAuditoria}
                    disabled={isAuditing}
                >
                    {isAuditing ? 'Executando...' : 'Executar Auditoria de Totais de Venda (SP)'}
                </button>
            </div>
            <p>
                A tabela abaixo exibe o log (via Trigger) de todas as alterações de preços. O botão executa o Procedimento (SP) 
                que varre todas as vendas e corrige totais inconsistentes.
            </p>
            <div className="table-container" style={{ marginTop: '1.5rem' }}>
                <RenderizarResultado
                    isLoading={isLoading}
                    erro={erro}
                    resultado={logs}
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

    const headers = Object.keys(resultado[0]);

    const formatarHeader = (header) => {
        return header
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (l) => l.toUpperCase());
    };

    return (
        <table className="data-table">
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{formatarHeader(header)}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {resultado.map((linha, index) => (
                    <tr key={index}>
                        {headers.map((header) => {
                            const valor = linha[header];
                            let valorFormatado = valor;

                            if (typeof valor === 'string' && header.includes('data_hora_alteracao')) {
                                valorFormatado = new Date(valor).toLocaleString('pt-BR');
                            }
                            
                            if (typeof valor === 'number' && (header.includes('preco_antigo') || header.includes('preco_novo'))) {
                                valorFormatado = valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                            }

                            return <td key={header}>{valorFormatado === null ? '-' : String(valorFormatado)}</td>;
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}