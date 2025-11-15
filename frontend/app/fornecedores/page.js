'use client'; 

import { useState, useEffect } from 'react';
import FornecedorModal from '../../components/FornecedorModal'; 

export default function GerenciarFornecedores() {
	const [fornecedores, setFornecedores] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [fornecedorEmEdicao, setFornecedorEmEdicao] = useState(null);

	const API_URL = 'http://localhost:8080/api/fornecedores';

	const carregarFornecedores = async () => {
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error('Erro ao buscar fornecedores');
			}
			const data = await response.json();
			setFornecedores(data);
		} catch (error) {
			console.error('Falha ao carregar fornecedores:', error);
			alert('Não foi possível carregar os fornecedores.');
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

	const handleExcluir = async (cnpj) => {
		if (
			confirm(
				`Tem certeza que deseja excluir o fornecedor com CNPJ ${cnpj}?`
			)
		) {
			try {
				const response = await fetch(`${API_URL}/${cnpj}`, {
					method: 'DELETE',
				});

				if (!response.ok && response.status !== 204) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						errorData.message || 'Erro ao excluir fornecedor.'
					);
				}

				alert('Fornecedor excluído com sucesso!');
				carregarFornecedores();
			} catch (error) {
				console.error('Falha ao excluir fornecedor:', error);
				alert(`Não foi possível excluir o fornecedor: ${error.message}`);
			}
		}
	};

	return (
		<section id="fornecedores-section" className="content-section">
			<div className="section-header">
				<h2>Gerenciamento de Fornecedores</h2>
				<button
					id="open-fornecedor-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo}
				>
					Cadastrar Novo Fornecedor
				</button>
			</div>

			<div className="table-container">
				<h3>Fornecedores Cadastrados</h3>
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
						{fornecedores.map((fornecedor) => (
							<tr key={fornecedor.cnpj}>
								<td>{fornecedor.cnpj}</td>
								<td>{fornecedor.razaoSocial}</td>
								<td>{fornecedor.contatoPrincipal || '-'}</td>
								<td className="action-buttons">
									<button
										className="btn-edit"
										onClick={() => handleAbrirModalEditar(fornecedor)}
									>
										Editar
									</button>
									<button
										className="btn-delete"
										onClick={() => handleExcluir(fornecedor.cnpj)}
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
				<FornecedorModal
					fornecedorParaEditar={fornecedorEmEdicao}
					onClose={handleFecharModal}
					onSave={() => {
						handleFecharModal();
						carregarFornecedores(); 
					}}
				/>
			)}
		</section>
	);
}