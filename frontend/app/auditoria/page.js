'use client';
import { useState, useEffect } from 'react';
import { useNotification } from '@/app/contexts/NotificationContext'; // Importar o contexto de notificação

export default function AuditoriaPage() {
    const [logs, setLogs] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [isAuditing, setIsAuditing] = useState(false); // Novo estado para controlar o clique do botão
    const { showNotification } = useNotification(); // Usar o contexto de notificação

    const API_URL = 'http://localhost:8080/api/consultas/executar';
    
    const QUERY = "SELECT id_log, cod_produto_afetado, preco_antigo, preco_novo, data_hora_alteracao, usuario_db FROM Log_AuditoriaPreco ORDER BY data_hora_alteracao DESC";

    useEffect(() => {
        const carregarLogs = async () => {
            setIsLoading(true);
            setErro(null);
            try {
                const response = await fetch(API_URL, {
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
        carregarLogs();
    }, []);

    // Nova função para executar auditoria de vendas
    const handleExecutarAuditoriaVendas = async () => {
        setIsAuditing(true);
        showNotification('Iniciando auditoria de vendas...', 'info');

        try {
            const response = await fetch('http://localhost:8080/api/dashboard/executar-auditoria-vendas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erro ao executar auditoria de vendas.');
            }

            const resultado = await response.json();
            showNotification('Auditoria de vendas executada com sucesso!', 'success');
            
            // Recarregar os logs após executar a auditoria
            const reloadResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: QUERY }),
            });
            
            if (reloadResponse.ok) {
                const data = await reloadResponse.json();
                setLogs(data);
            }
            
        } catch (error) {
            console.error('Falha ao executar auditoria de vendas:', error);
            showNotification(`Erro ao executar auditoria: ${error.message}`, 'error');
        } finally {
            setIsAuditing(false);
        }
    };

    return (
        <section id="auditoria-section" className="content-section">
            <div className="section-header">
                <h2>Auditoria de Preços de Produtos</h2>
                {/* Novo botão para executar auditoria de vendas */}
                <button 
                    onClick={handleExecutarAuditoriaVendas}
                    disabled={isAuditing}
                    className="btn-primary"
                    style={{ marginLeft: 'auto' }}
                >
                    {isAuditing ? 'Executando...' : 'Executar Auditoria de Vendas (SP)'}
                </button>
            </div>
            <p>
                Esta página exibe o log de todas as alterações de preços.
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