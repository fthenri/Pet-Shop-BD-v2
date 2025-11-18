'use client'; 
import { useState, useEffect, useMemo } from 'react';
import ProdutoModal from '../../components/ProdutoModal'; 
import { useNotification } from '../../contexts/NotificationContext';
import { 
    FaStore,
    FaEdit,
    FaTrash,
    FaBoxOpen,
    FaWallet,
    FaArrowUp,
    FaArrowDown,
    FaCheckCircle,
    FaExclamationTriangle,
    FaTimesCircle
} from 'react-icons/fa';
import styles from './produtos.module.css';

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

const BadgeEstoque = ({ qtd }) => {
    if (qtd === 0) {
        return (
            <span className={`${styles.badge} ${styles.badgeEsgotado}`}>
                <FaTimesCircle /> Fora de Estoque (0)
            </span>
        );
    }
    if (qtd <= 10) {
        return (
            <span className={`${styles.badge} ${styles.badgeBaixo}`}>
                <FaExclamationTriangle /> Estoque Baixo ({qtd})
            </span>
        );
    }
    return (
        <span className={`${styles.badge} ${styles.badgeOk}`}>
            <FaCheckCircle /> Em Estoque ({qtd})
        </span>
    );
};

export default function GerenciarProdutos() {
	const [produtos, setProdutos] = useState([]);
    const [filtro, setFiltro] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

	const API_URL = 'http://localhost:8080/api/produtos';
	const { showNotification, showConfirmation } = useNotification();

	const carregarProdutos = async () => {
        setIsLoading(true);
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error('Erro ao buscar produtos');
			}
			const data = await response.json();
			setProdutos(data);
		} catch (error) {
			console.error('Falha ao carregar produtos:', error);
			showNotification({ message: 'Não foi possível carregar os produtos.', type: 'error' });
		} finally {
            setIsLoading(false);
        }
	};

	useEffect(() => {
		carregarProdutos();
	}, []);

	const handleAbrirModalNovo = () => {
		setProdutoEmEdicao(null);
		setIsModalOpen(true);
	};

	const handleAbrirModalEditar = (produto) => {
		setProdutoEmEdicao(produto);
		setIsModalOpen(true);
	};

	const handleFecharModal = () => {
		setIsModalOpen(false);
		setProdutoEmEdicao(null);
	};

    const handleSave = () => {
        handleFecharModal();
        carregarProdutos(); 
    };

	const handleExcluir = (produto) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir o produto ${produto.nome_produto} (Cód. ${produto.cod_produto})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL}/${produto.cod_produto}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok && response.status !== 204) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(
                            errorData.message || 'Erro ao excluir produto.'
                        );
                    }

                    showNotification({ message: 'Produto excluído com sucesso!', type: 'success' });
                    carregarProdutos(); 
                } catch (error) {
                    console.error('Falha ao excluir produto:', error);
                    showNotification({ message: `Não foi possível excluir o produto: ${error.message}`, type: 'error', duration: 6000 });
                }
            }
        });
	};

    const produtosFiltrados = useMemo(() => {
        const termoBusca = filtro.toLowerCase();
        if (!termoBusca) return produtos;
        
        return produtos.filter(p =>
            (p.nome_produto && p.nome_produto.toLowerCase().includes(termoBusca)) ||
            (p.cod_produto && p.cod_produto.toString().includes(termoBusca)) ||
            (p.cnpjFornecedor && p.cnpjFornecedor.includes(termoBusca))
        );
    }, [produtos, filtro]);

    const kpiData = useMemo(() => {
        const totalSKUs = produtos.length;
        if (totalSKUs === 0) {
            return {
                totalSKUs: 0,
                valorTotalEstoque: 'R$ 0,00',
                produtoMaisCaro: { nome: 'N/A', valor: 'R$ 0,00' },
                menorEstoque: { nome: 'N/A', qtd: 0 }
            };
        }

        let valorTotalEstoque = 0;
        let produtoMaisCaro = { nome: '', valor: 0 };
        let menorEstoque = { nome: '', qtd: Infinity };

        produtos.forEach(p => {
            const preco = parseFloat(p.preco_venda || 0);
            const estoque = parseInt(p.quantidade_estoque || 0);
            
            valorTotalEstoque += preco * estoque;

            if (preco > produtoMaisCaro.valor) {
                produtoMaisCaro = { nome: p.nome_produto, valor: preco };
            }

            if (estoque > 0 && estoque < menorEstoque.qtd) {
                menorEstoque = { nome: p.nome_produto, qtd: estoque };
            }
        });
        
        if (menorEstoque.qtd === Infinity) {
             menorEstoque = { nome: 'N/A', qtd: 0 };
        }

        return {
            totalSKUs,
            valorTotalEstoque: valorTotalEstoque.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            produtoMaisCaro: { nome: produtoMaisCaro.nome, valor: produtoMaisCaro.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) },
            menorEstoque
        };
    }, [produtos]);

	return (
		<section id="produtos-section" className="content-section">
			<div className="section-header">
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
					<FaStore style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
					<h2>Gerenciamento de Produtos</h2>
				</div>
			</div>

            <div className={styles.kpiContainer}>
                <KpiCard 
                    title="Total de Produtos (SKUs)" 
                    value={kpiData.totalSKUs} 
                    icon={<FaBoxOpen />}
                    color="var(--primary-color)"
                />
                <KpiCard 
                    title="Valor Total em Estoque" 
                    value={kpiData.valorTotalEstoque} 
                    icon={<FaWallet />}
                    color="#28a745"
                />
                 <KpiCard 
                    title="Produto Mais Caro" 
                    value={`${kpiData.produtoMaisCaro.nome} (${kpiData.produtoMaisCaro.valor})`}
                    icon={<FaArrowUp />}
                    color="#f0b429"
                />
                <KpiCard 
                    title="Item com Menor Estoque" 
                    value={`${kpiData.menorEstoque.nome} (${kpiData.menorEstoque.qtd} un.)`}
                    icon={<FaArrowDown />}
                    color="#dc3545"
                />
            </div>

            <div className={styles.toolbar}>
                <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                    <input
                        type="text"
                        placeholder="Filtrar por Cód., Nome ou CNPJ Fornecedor..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className={styles.filtroInput}
                    />
                </div>
                <button
					id="open-produto-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo}
				>
					Cadastrar Novo Produto
				</button>
            </div>

			<div className="table-container">
				<table className="data-table" id="tabela-produtos">
					<thead>
						<tr>
							<th>Cód.</th>
							<th>Nome do Produto</th>
							<th>Preço Venda</th>
							<th>Status Estoque</th>
							<th>CNPJ Fornecedor</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody id="corpo-tabela-produtos">
						{produtosFiltrados.map((produto) => (
							<tr key={produto.cod_produto}>
								<td>{produto.cod_produto}</td>
								<td>{produto.nome_produto}</td>
								<td>
									{parseFloat(produto.preco_venda).toLocaleString('pt-BR', {
										style: 'currency',
										currency: 'BRL',
									})}
								</td>
								<td>
                                    <BadgeEstoque qtd={produto.quantidade_estoque} />
                                </td>
								<td>{produto.cnpjFornecedor}</td>
								<td className={styles.actionsCell}>
									<button
										className={`${styles.actionButton} ${styles.editButton}`} 
										onClick={() => handleAbrirModalEditar(produto)}
                                        title="Editar Produto"
									>
										<FaEdit />
									</button>
									<button
										className={`${styles.actionButton} ${styles.deleteButton}`} 
										onClick={() => handleExcluir(produto)}
                                        title="Excluir Produto"
									>
										<FaTrash />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{isModalOpen && (
				<ProdutoModal
					produtoParaEditar={produtoEmEdicao}
					onClose={handleFecharModal}
					onSave={handleSave}
				/>
			)}
		</section>
	);
}