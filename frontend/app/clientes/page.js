'use client'; 

import { useState, useEffect } from 'react';
import ClienteModal from '../../components/ClienteModal'; 

export default function GerenciarClientes() {
	const [clientes, setClientes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [clienteEmEdicao, setClienteEmEdicao] = useState(null);

	const API_URL = 'http://localhost:8080/api/clientes';

	const carregarClientes = async () => {
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error('Erro ao buscar clientes');
			}
			const data = await response.json();
			setClientes(data); 
		} catch (error) {
			console.error('Falha ao carregar clientes:', error);
			alert('Não foi possível carregar os clientes.');
		}
	};

	useEffect(() => {
		carregarClientes();
	}, []);

	const handleAbrirModalNovo = () => {
		setClienteEmEdicao(null); 
		setIsModalOpen(true); 
	};

	const handleAbrirModalEditar = (cliente) => {
		setClienteEmEdicao(cliente); 
		setIsModalOpen(true);
	};

	const handleFecharModal = () => {
		setIsModalOpen(false);
		setClienteEmEdicao(null); 
	};

 	const handleExcluir = async (cpf) => {
		if (confirm(`Tem certeza que deseja excluir o cliente com CPF ${cpf}?`)) {
			try {
				const response = await fetch(`${API_URL}/${cpf}`, {
					method: 'DELETE',
				});

				if (!response.ok && response.status !== 204) {
					
					const errorData = await response.json();
					throw new Error(
						errorData.message || 'Erro ao excluir cliente.'
					);
				}

				alert('Cliente excluído com sucesso!');
				carregarClientes(); 
			} catch (error) {
				console.error('Falha ao excluir cliente:', error);
				alert(`Não foi possível excluir o cliente: ${error.message}`);
			}
		}
	};

	return (
		<section id="tabela1-section" className="content-section">
			<div className="section-header">
				<h2>Gerenciamento de Clientes</h2>
				<button
					id="open-cliente-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo} 
				>
					Cadastrar Novo Cliente
				</button>
			</div>

			<div className="table-container">
				<h3>Clientes Cadastrados</h3>
				<table className="data-table" id="tabela-clientes">
					<thead>
						<tr>
							<th>CPF</th>
							<th>Nome</th>
							<th>Data Cadastro</th>
							<th>Cidade</th>
							<th>Telefone 1</th>
							<th>Ações</th>
						</tr>
					</thead>
					<tbody id="corpo-tabela-clientes">
						{clientes.map((cliente) => (
							<tr key={cliente.cpf}>
								<td>{cliente.cpf}</td>
								<td>{cliente.nome}</td>
								<td>
									{new Date(cliente.dataCadastro).toLocaleString()}
								</td>
								<td>{cliente.cidade || '-'}</td>
								<td>{cliente.telefone1}</td>
								<td className="action-buttons">
									<button
										className="btn-edit"
										onClick={() => handleAbrirModalEditar(cliente)}
									>
										Editar
									</button>
									<button
										className="btn-delete"
										onClick={() => handleExcluir(cliente.cpf)}
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
				<ClienteModal
					clienteParaEditar={clienteEmEdicao}
					onClose={handleFecharModal}
					onSave={() => {
						handleFecharModal();
						carregarClientes(); 
					}}
				/>
			)}
		</section>
	);
}