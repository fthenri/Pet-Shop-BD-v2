'use client'; 

import Link from 'next/link';
import { useState, useEffect } from 'react';
import PetModal from '../../components/PetModal'; 
import { useNotification } from '../../contexts/NotificationContext'; 
import { FaPaw } from 'react-icons/fa';

export default function GerenciarPets() {
	const [pets, setPets] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [petEmEdicao, setPetEmEdicao] = useState(null);
    const [filtro, setFiltro] = useState('');

    const { showNotification, showConfirmation } = useNotification(); 

	const API_URL = 'http://localhost:8080/api/pets';

	const carregarPets = async () => {
		try {
			const response = await fetch(API_URL);
			if (!response.ok) {
				throw new Error('Erro ao buscar pets');
			}
			const data = await response.json();
			setPets(data); 
		} catch (error) {
			console.error('Falha ao carregar pets:', error);
			showNotification({ message: 'Não foi possível carregar os pets.', type: 'error' }); 
		}
	};

	useEffect(() => {
		carregarPets();
	}, []);

	const handleAbrirModalNovo = () => {
		setPetEmEdicao(null); 
		setIsModalOpen(true); 
	};

	const handleAbrirModalEditar = (pet) => {
		setPetEmEdicao(pet); 
		setIsModalOpen(true);
	};

	const handleFecharModal = () => {
		setIsModalOpen(false);
		setPetEmEdicao(null); 
	};

    const handleSavePet = async (petData) => {
        const method = petEmEdicao ? 'PUT' : 'POST';
        const url = petEmEdicao 
            ? `${API_URL}/${petEmEdicao.cod_pet}` 
            : API_URL;                

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(petData),
            });
            if (!response.ok) {
                 const errorText = await response.text();
                 throw new Error(errorText || 'Falha ao salvar pet');
            }
            
            carregarPets(); 
            handleFecharModal();
            showNotification({ 
                message: `Pet ${petEmEdicao ? 'atualizado' : 'cadastrado'} com sucesso!`, 
                type: 'success' 
            }); 
        } catch (err) {
            console.error(err);
            let errorMessage = err.message;

            try {
                const errorJson = JSON.parse(err.message.replace('Error: ', ''));
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
            }

            showNotification({ message: `Erro ao salvar: ${errorMessage}`, type: 'error', duration: 6000 }); 
        }
    };


 	const handleExcluir = (pet) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir o pet ${pet.nomePet} (Cód. ${pet.cod_pet})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL}/${pet.cod_pet}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok && response.status !== 204) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Erro ao excluir pet.');
                    }
                    carregarPets();
                    showNotification({ message: 'Pet excluído com sucesso!', type: 'success' });
                } catch (error) {
                    console.error('Falha ao excluir pet:', error);
                    showNotification({ message: `Não foi possível excluir o pet: ${error.message}`, type: 'error', duration: 6000 });
                }
            }
        });
	};
	
    const petsFiltrados = pets.filter(pet =>
        (pet.nomePet && pet.nomePet.toLowerCase().includes(filtro.toLowerCase())) ||
        (pet.cpfCliente && pet.cpfCliente.includes(filtro)) ||
        (pet.especie && pet.especie.toLowerCase().includes(filtro.toLowerCase()))
    );
	
	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		try {
			return new Date(dateString + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
		} catch (e) {
			return 'Inválida';
		}
	};

	
	return (
		<section id="pets-section" className="content-section">
			<div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
                    <FaPaw style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
                    <h2>Gerenciamento de Pets</h2>
                </div>
				<button
					id="open-pet-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo} 
				>
					Cadastrar Novo Pet
				</button>
			</div>

            <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
                <label htmlFor="filtro-pet" style={{ fontWeight: '500' }}>Filtrar por Nome, CPF ou Espécie:</label>
                <input
                    type="text"
                    id="filtro-pet"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    placeholder="Digite o nome, CPF ou espécie..."
                />
            </div>

			<div className="table-container">
				<h3>Pets Cadastrados ({petsFiltrados.length})</h3>
				<table className="data-table" id="tabela-pets">
					
                    <thead>
						<tr>
                            {/* CÓD. ALINHADO À DIREITA */}
                            <th style={{ width: '5%', textAlign: 'right' }}>Cód.</th> 
							<th style={{ width: '25%' }}>Nome do Pet</th>
                            <th style={{ width: '25%' }}>Espécie / Raça</th> 
                            <th style={{ width: '15%' }}>Nascimento</th> 
							<th style={{ width: '15%' }}>CPF Cliente</th>
							<th style={{ width: '15%' }}>Ações</th>
						</tr>
					</thead>
					
                    <tbody id="corpo-tabela-pets">
						{petsFiltrados.map((pet) => (
							<tr key={pet.cod_pet}>
                                <td style={{ textAlign: 'right' }}>{pet.cod_pet}</td> 
								<td>{pet.nomePet}</td>
                                <td>{pet.especie} / {pet.raca}</td> 
                                <td>{formatDate(pet.dataNascimento)}</td> 
                                <td>
                                    <Link 
                                        href={`/clientes/${pet.cpfCliente}`} 
                                        style={{ color: 'var(--primary-color)', textDecoration: 'underline', cursor: 'pointer', fontWeight: '500' }}
                                    >
                                        {pet.cpfCliente}
                                    </Link>
                                </td>
								<td>
									<div className="action-buttons">
										<button
											className="btn-edit"
											onClick={() => handleAbrirModalEditar(pet)}
										>
											Editar
										</button>
										<button
											className="btn-delete"
											onClick={() => handleExcluir(pet)}
										>
											Excluir
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{isModalOpen && (
				<PetModal
					pet={petEmEdicao}
					onClose={handleFecharModal}
					onSave={handleSavePet}
                    cpfClientePadrao={null} 
				/>
			)}
		</section>
	);
}