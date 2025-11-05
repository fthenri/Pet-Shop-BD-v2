'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation'; 
import PetModal from '../../../components/PetModal'; 
import Link from 'next/link';

export default function ClientePerfil() {
    const params = useParams(); 
    const cpf = params.cpf;

    const [cliente, setCliente] = useState(null);
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);

    const API_URL = 'http://localhost:8080/api';

    const fetchData = async () => {
        if (!cpf) return;
        setIsLoading(true);
        setError(null);
        try {
            const resCliente = await fetch(`${API_URL}/clientes/${cpf}`);
            if (!resCliente.ok) throw new Error('Cliente não encontrado');
            const dataCliente = await resCliente.json();
            setCliente(dataCliente);

            const resPets = await fetch(`${API_URL}/clientes/${cpf}/pets`);
            if (!resPets.ok) throw new Error('Erro ao buscar pets');
            const dataPets = await resPets.json();
            setPets(dataPets);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [cpf]);

    const handleSavePet = async (petData) => {
        const method = currentPet ? 'PUT' : 'POST';
        const url = currentPet 
            ? `${API_URL}/pets/${currentPet.cod_pet}` 
            : `${API_URL}/pets`;                

        if (!currentPet) {
            petData.cpfCliente = cpf;
        }

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
            
            fetchData(); 
            handleCloseModal();
        } catch (err) {
            console.error(err);
            alert(`Erro ao salvar: ${err.message}`);
        }
    };

    const handleDeletePet = async (codPet) => {
        if (confirm('Tem certeza que deseja excluir este pet?')) {
            try {
                const response = await fetch(`${API_URL}/pets/${codPet}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                     const errorText = await response.text();
                     throw new Error(errorText || 'Falha ao excluir pet');
                }
                fetchData(); 
            } catch (err) {
                console.error(err);
                alert(err.message); 
            }
        }
    };

    const handleOpenModal = (pet = null) => {
        setCurrentPet(pet); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPet(null);
    };

    if (isLoading) return <p style={{ padding: '2rem' }}>Carregando perfil...</p>;
    if (error) return <p style={{ padding: '2rem', color: 'red' }}>Erro: {error}</p>;
    if (!cliente) return <p style={{ padding: '2rem' }}>Cliente não encontrado.</p>;

    return (
        <>
            <section className="content-section">
                <div className="section-header">
                    <h2>Perfil do Cliente</h2>
                    <Link href="/clientes" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Voltar</Link>
                </div>

                <div className="form-container">
                    <fieldset className="form-fieldset">
                        <legend>Dados Pessoais</legend>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Nome</label>
                                <input type="text" value={cliente.nome} readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>CPF</label>
                                <input type="text" value={cliente.cpf} readOnly disabled />
                            </div>
                            <div className="form-group">
                                <label>Telefone 1</label>
                                <input type="text" value={cliente.telefone1} readOnly disabled />
                            </div>
                             <div className="form-group">
                                <label>Cidade</label>
                                <input type="text" value={`${cliente.cidade} - ${cliente.estado}`} readOnly disabled />
                            </div>
                        </div>
                    </fieldset>
                </div>
            </section>

            <section className="content-section">
                <div className="table-header">
                    <h2>Pets de {cliente.nome.split(' ')[0]}</h2>
                    <button onClick={() => handleOpenModal()} className="btn btn-primary">
                        Adicionar Pet
                    </button>
                </div>
                
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Cód.</th>
                                <th>Nome do Pet</th>
                                <th>Espécie</th>
                                <th>Raça</th>
                                <th>Nascimento</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.length > 0 ? (
                                pets.map(pet => (
                                    <tr key={pet.cod_pet}>
                                        <td>{pet.cod_pet}</td>
                                        <td>{pet.nomePet}</td>
                                        <td>{pet.especie}</td>
                                        <td>{pet.raca}</td>
                                        <td>{pet.dataNascimento ? new Date(pet.dataNascimento + 'T00:00:00-03:00').toLocaleDateString('pt-BR') : 'N/A'}</td>
                                        <td className="action-buttons">
                                            <button onClick={() => handleOpenModal(pet)} className="btn-edit">Editar</button>
                                            <button onClick={() => handleDeletePet(pet.cod_pet)} className="btn-delete">Excluir</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum pet cadastrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {isModalOpen && (
                <PetModal
                    pet={currentPet}
                    onClose={handleCloseModal}
                    onSave={handleSavePet}
                />
            )}
        </>
    );
}