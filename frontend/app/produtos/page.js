'use client'; 

import { useState, useEffect } from 'react';
import ProdutoModal from '../../components/ProdutoModal'; 
import { useNotification } from '../../contexts/NotificationContext';

export default function GerenciarProdutos() {
	const [produtos, setProdutos] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

	const API_URL = 'http://localhost:8080/api/produtos';

	const { showNotification, showConfirmation } = useNotification();

	const carregarProdutos = async () => {
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

	return (
		<section id="produtos-section" className="content-section">
			<div className="section-header">
				<h2>Gerenciamento de Produtos</h2>
				<button
					id="open-produto-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo}
				>
					Cadastrar Novo Produto
				</button>
			</div>

			<div className="table-container">
				<h3>Produtos Cadastrados</h3>
				<table className="data-table" id="tabela-produtos">
					<thead>
						<tr>
							<th>Cód. Produto</th>
							<th>Nome do Produto</th>
							<th>Preço Venda</th>
							<th>Qtd. Estoque</th>
							<th>CNPJ Fornecedor</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody id="corpo-tabela-produtos">
						{produtos.map((produto) => (
							<tr key={produto.cod_produto}>
								<td>{produto.cod_produto}</td>
								<td>{produto.nome_produto}</td>
								<td>
									{parseFloat(produto.preco_venda).toLocaleString('pt-BR', {
										style: 'currency',
										currency: 'BRL',
									})}
								</td>
								<td>{produto.quantidade_estoque}</td>
								<td>{produto.cnpjFornecedor}</td>
								<td className="action-buttons">
									<button
										className="btn-edit"
										onClick={() => handleAbrirModalEditar(produto)}
									>
										Editar
									</button>
									<button
										className="btn-delete"
										onClick={() => handleExcluir(produto)}
									>
										Excluir
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
					onSave={() => {
						handleFecharModal();
						carregarProdutos(); 
					}}
				/>
			)}
		</section>
	);
}