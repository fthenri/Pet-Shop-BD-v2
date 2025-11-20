'use client'; 
import { useState, useEffect, useMemo } from 'react';
import FornecedorModal from '../../components/FornecedorModal'; 
import { useNotification } from 'ft-ui-react';
import { FaTruck, FaEdit, FaTrash } from 'react-icons/fa';
import styles from './fornecedores.module.css';

export default function GerenciarFornecedores() {
	const [fornecedores, setFornecedores] = useState([]);
    const [filtro, setFiltro] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fornecedorEmEdicao, setFornecedorEmEdicao] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

	const API_URL = 'http://localhost:8080/api/fornecedores';
    const { showNotification, showConfirmation } = useNotification();

	const carregarFornecedores = async () => {
        setIsLoading(true);
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error('Erro ao buscar fornecedores');
			}
			const data = await response.json();
			setFornecedores(data);
		} catch (error) {
			console.error('Falha ao carregar fornecedores:', error);
			showNotification({ message: 'Não foi possível carregar os fornecedores.', type: 'error' });
		} finally {
            setIsLoading(false);
        }
	};

	useEffect(() => {
		carregarFornecedores();
	}, []);

	const handleAbrirModalNovo = () => {
		setFornecedorEmEdicao(null);
		setIsModalOpen(true);
	};

	const handleAbrirModalEditar = (fornecedor) => {
		setFornecedorEmEdicao(fornecedor);
		setIsModalOpen(true);
	};

	const handleFecharModal = () => {
		setIsModalOpen(false);
		setFornecedorEmEdicao(null);
	};

    const handleSave = () => {
        handleFecharModal();
        carregarFornecedores();
    };

	const handleExcluir = (fornecedor) => { 
        showConfirmation({
            message: `Tem certeza que deseja excluir o fornecedor ${fornecedor.razaoSocial} (${fornecedor.cnpj})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL}/${fornecedor.cnpj}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok && response.status !== 204) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(
                            errorData.message || 'Erro ao excluir fornecedor.'
                        );
                    }

                    showNotification({ message: 'Fornecedor excluído com sucesso!', type: 'success' });
                    carregarFornecedores();
                } catch (error) {
                    console.error('Falha ao excluir fornecedor:', error);
                    showNotification({ message: `Não foi possível excluir o fornecedor: ${error.message}`, type: 'error', duration: 6000 }); 
                }
            }
        });
	};

    const fornecedoresFiltrados = useMemo(() => {
        const termoBusca = filtro.toLowerCase();
        if (!termoBusca) return fornecedores;

        return fornecedores.filter(f =>
            (f.razaoSocial && f.razaoSocial.toLowerCase().includes(termoBusca)) ||
            (f.cnpj && f.cnpj.includes(termoBusca))
        );
    }, [filtro, fornecedores]);

	return (
		<section id="fornecedores-section" className="content-section">
			<div className="section-header">
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
					<FaTruck style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
					<h2>Gerenciamento de Fornecedores</h2>
				</div>
			</div>

            <div className={styles.toolbar}>
                <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                    <input
                        type="text"
                        placeholder="Filtrar por Razão Social ou CNPJ..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className={styles.filtroInput}
                    />
                </div>
                <button
					id="open-fornecedor-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo}
				>
					Cadastrar Novo Fornecedor
				</button>
            </div>

			<div className="table-container">
                {isLoading ? (
                    <p>Carregando fornecedores...</p>
                ) : (
                    <table className="data-table" id="tabela-fornecedores">
                        <thead>
                            <tr>
                                <th>CNPJ</th>
                                <th>Razão Social</th>
                                <th>Contato Principal</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="corpo-tabela-fornecedores">
                            {fornecedoresFiltrados.map((fornecedor) => (
                                <tr key={fornecedor.cnpj}>
                                    <td>{fornecedor.cnpj}</td>
                                    <td>{fornecedor.razaoSocial}</td>
                                    <td>{fornecedor.contatoPrincipal || '-'}</td>
                                    <td className={styles.actionsCell}>
                                        <button
                                            className={`${styles.actionButton} ${styles.editButton}`} 
                                            onClick={() => handleAbrirModalEditar(fornecedor)}
                                            title="Editar Fornecedor"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteButton}`} 
                                            onClick={() => handleExcluir(fornecedor)}
                                            title="Excluir Fornecedor"
                                        >
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
			</div>

			{isModalOpen && (
				<FornecedorModal
					fornecedorParaEditar={fornecedorEmEdicao}
					onClose={handleFecharModal}
					onSave={handleSave}
				/>
			)}
		</section>
	);
}