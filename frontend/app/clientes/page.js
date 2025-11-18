'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ClienteModal from '../../components/ClienteModal';
import { useNotification } from '../../contexts/NotificationContext';
import { FaEdit, FaTrash, FaStar, FaSeedling, FaUsers, FaCrown, FaDollarSign } from 'react-icons/fa';
import styles from './clientes.module.css';

const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';

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

export default function ClientesPage() {
    const [clientes, setClientes] = useState([]);
    const [filtro, setFiltro] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteEditando, setClienteEditando] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification, showConfirmation } = useNotification();

    const carregarClientes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL_CLIENTES);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Falha ao carregar clientes');
            }
            const data = await response.json();
            setClientes(data.sort((a, b) => (b.totalGasto || 0) - (a.totalGasto || 0)));
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
            showNotification({ message: `Erro ao carregar clientes: ${error.message}`, type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        carregarClientes();
    }, []);

    const handleOpenModal = (cliente = null) => {
        setClienteEditando(cliente);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setClienteEditando(null);
    };

    const handleSave = () => {
        handleCloseModal();
        carregarClientes(); 
    };

 	const handleDeleteCliente = (cpf, nome) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir o cliente ${nome} (CPF: ${cpf})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL_CLIENTES}/${cpf}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok && response.status !== 204) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(
                            errorData.message || 'Erro ao excluir cliente.'
                        );
                    }
                    showNotification({ message: 'Cliente excluído com sucesso!', type: 'success' });
                    carregarClientes(); 
                } catch (error) {
                    console.error('Falha ao excluir cliente:', error);
                    showNotification({ message: `Não foi possível excluir o cliente: ${error.message}`, type: 'error', duration: 6000 }); 
                }
            }
        });
	};

    const clientesFiltrados = useMemo(() => {
        const termoBusca = filtro.toLowerCase();
        if (!termoBusca) return clientes;
        
        return clientes.filter(cliente =>
            (cliente.nome && cliente.nome.toLowerCase().includes(termoBusca)) ||
            (cliente.cpf && cliente.cpf.includes(termoBusca))
        );
    }, [clientes, filtro]);

    const kpiData = useMemo(() => {
        const totalClientes = clientes.length;
        if (totalClientes === 0) {
            return {
                total: 0,
                maisValioso: { nome: 'N/A', valor: 0 },
                gastoMedio: 0
            };
        }
        
        const clienteMaisValioso = clientes[0];
        
        const gastoTotal = clientes.reduce((acc, c) => acc + (c.totalGasto || 0), 0);
        const gastoMedio = gastoTotal > 0 ? gastoTotal / totalClientes : 0;

        return {
            total: totalClientes,
            maisValioso: { nome: clienteMaisValioso.nome, valor: (clienteMaisValioso.totalGasto || 0) },
            gastoMedio: gastoMedio
        };
    }, [clientes]);
    
    const renderBadges = (cliente) => {
        const totalGastoCliente = cliente.totalGasto || 0; 
        const isVip = totalGastoCliente > 500;
        
        const dataCadastro = new Date(cliente.dataCadastro);
        const hoje = new Date();
        const diffTempo = Math.abs(hoje.getTime() - dataCadastro.getTime());
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));
        const isNew = diffDias <= 30;

        return (
            <>
                {isVip && (
                    <span className={`${styles.badge} ${styles.badgeVip}`} title="Cliente VIP (Gasto > R$ 500)">
                        <FaStar /> VIP
                    </span>
                )}
                {isNew && (
                    <span className={`${styles.badge} ${styles.badgeNew}`} title="Cliente novo (Cadastro nos últimos 30 dias)">
                        <FaSeedling /> Novo
                    </span>
                )}
            </>
        );
    };


    return (
        <section id="clientes-section" className="content-section">
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
					<FaUsers style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
					<h2>Gerenciamento de Clientes</h2>
				</div>
            </div>
            
            <div className={styles.kpiContainer}>
                <KpiCard 
                    title="Total de Clientes" 
                    value={kpiData.total} 
                    icon={<FaUsers />}
                    color="var(--primary-color)"
                />
                <KpiCard 
                    title="Cliente Mais Valioso" 
                    value={`${kpiData.maisValioso.nome} (${(kpiData.maisValioso.valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })})`} 
                    icon={<FaCrown />}
                    color="#f0b429"
                />
                <KpiCard 
                    title="Gasto Médio" 
                    value={kpiData.gastoMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    icon={<FaDollarSign />}
                    color="#28a745"
                />
            </div>
            
            <div className={styles.toolbar}>
                <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                    <input
                        type="text"
                        placeholder="Filtrar por Nome ou CPF..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className={styles.filtroInput}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    Cadastrar Novo Cliente
                </button>
            </div>

            {isLoading ? (
                <p>Carregando clientes...</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>CPF</th>
                                <th>Telefone 1</th>
                                <th>Cidade</th>
                                <th>Total Gasto</th>
                                <th>Data Cadastro</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientesFiltrados.length > 0 ? (
                                clientesFiltrados.map(cliente => (
                                    <tr key={cliente.cpf}>
                                        <td>
                                            <Link href={`/clientes/${cliente.cpf}`} className={styles.tableLink}>
                                                {cliente.nome}
                                            </Link>
                                            {renderBadges(cliente)}
                                        </td>
                                        <td>{cliente.cpf}</td>
                                        <td>{cliente.telefone1}</td>
                                        <td>{cliente.cidade || '-'}</td>
                                        <td>
                                            {(cliente.totalGasto || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </td>
                                        <td>{new Date(cliente.dataCadastro).toLocaleDateString('pt-BR')}</td>
                                        <td className={styles.actionsCell}>
                                            <button 
                                                className={`${styles.actionButton} ${styles.editButton}`} 
                                                onClick={() => handleOpenModal(cliente)}
                                                title="Editar Cliente"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button 
                                                className={`${styles.actionButton} ${styles.deleteButton}`} 
                                                onClick={() => handleDeleteCliente(cliente.cpf, cliente.nome)}
                                                title="Excluir Cliente"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center' }}>Nenhum cliente encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <ClienteModal
                    clienteParaEditar={clienteEditando}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </section>
    );
}