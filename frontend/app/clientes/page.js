'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';
import ClienteModal from '../../components/ClienteModal'; 
import { useNotification } from '../../contexts/NotificationContext';
import { FaUsers } from 'react-icons/fa';

export default function GerenciarClientes() {
	const [clientes, setClientes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [clienteEmEdicao, setClienteEmEdicao] = useState(null);
	
    const [filtro, setFiltro] = useState('');

	const { showNotification, showConfirmation } = useNotification();

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

 	const handleExcluir = (cpf) => { 
        showConfirmation({
            message: `Tem certeza que deseja excluir o cliente com CPF ${cpf}?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL}/${cpf}`, {
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

    const clientesFiltrados = clientes.filter(cliente =>
        (cliente.nome && cliente.nome.toLowerCase().includes(filtro.toLowerCase())) ||
        (cliente.cpf && cliente.cpf.includes(filtro))
    );

	return (
		<section id="tabela1-section" className="content-section">
			<div className="section-header">
				<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
					<FaUsers style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
					<h2>Gerenciamento de Clientes</h2>
				</div>
				<button
					id="open-cliente-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo} 
				>
					Cadastrar Novo Cliente
				</button>
			</div>

            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
                <label htmlFor="filtro-cliente" style={{ fontWeight: '500' }}>Filtrar por Nome ou CPF:</label>
                <input
                    type="text"
                    id="filtro-cliente"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Digite o nome ou CPF..."
                />
            </div>

			<div className="table-container">
				<h3>Clientes Cadastrados ({clientesFiltrados.length})</h3>
				<table className="data-table" id="tabela-clientes">
					
                    <thead>
						<tr>
							<th>Nome (Ver Pets)</th>
							<th>CPF</th>
                            <th>Total Gasto</th>
							<th>Cidade</th>
							<th>Telefone 1</th>
                            <th>Data Cadastro</th>
							<th>Ações</th>
						</tr>
					</thead>
					
                    <tbody id="corpo-tabela-clientes">
						{clientesFiltrados.map((cliente) => (
							<tr key={cliente.cpf}>
                                <td>
                                    <Link 
                                        href={`/clientes/${cliente.cpf}`} 
                                        style={{ color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        {cliente.nome}
                                    </Link>
                                </td>
								<td>{cliente.cpf}</td>
                                <td>
                                    {parseFloat(cliente.totalGasto || 0).toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })}
                                </td>
								<td>{cliente.cidade || '-'}</td>
								<td>{cliente.telefone1}</td>
                                <td>
									{new Date(cliente.dataCadastro).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
								</td>
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