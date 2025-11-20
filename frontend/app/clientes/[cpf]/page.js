'use client';
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation'; 
import PetModal from '../../../components/PetModal'; 
import Link from 'next/link';
import { useNotification } from 'ft-ui-react';
import { 
    FaUser, 
    FaPhone, 
    FaMapMarkerAlt, 
    FaDollarSign, 
    FaBirthdayCake, 
    FaPaw, 
    FaDog, 
    FaCat,
    FaPlus,
    FaEdit,
    FaTrash
} from 'react-icons/fa';
import styles from './perfil.module.css'; 

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

export default function ClientePerfil() {
    const params = useParams(); 
    const cpf = params.cpf;

    const [cliente, setCliente] = useState(null);
    const [pets, setPets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPet, setCurrentPet] = useState(null);

    const { showNotification, showConfirmation } = useNotification();
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
                 const errorBody = await response.json().catch(() => response.text());
                 throw new Error(errorBody.message || errorBody || 'Falha ao salvar pet');
            }
            
            showNotification({ 
                message: `Pet ${currentPet ? 'atualizado' : 'cadastrado'} com sucesso!`, 
                type: 'success' 
            });
            fetchData(); 
            handleCloseModal();
        } catch (err) {
            console.error(err);
            showNotification({ message: `Erro ao salvar: ${err.message}`, type: 'error', duration: 6000 });
        }
    };

    const handleDeletePet = async (codPet, nomePet) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir o pet ${nomePet} (Cód. ${codPet})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL}/pets/${codPet}`, {
                        method: 'DELETE',
                    });
                    if (!response.ok) {
                         const errorBody = await response.json().catch(() => response.text());
                         throw new Error(errorBody.message || errorBody || 'Falha ao excluir pet');
                    }
                    showNotification({ message: 'Pet excluído com sucesso!', type: 'success' });
                    fetchData(); 
                } catch (err) {
                    console.error(err);
                    showNotification({ message: err.message, type: 'error', duration: 6000 }); 
                }
            }
        });
    };

    const handleOpenModal = (pet = null) => {
        setCurrentPet(pet); 
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPet(null);
    };

    const getPetIcon = (especie) => {
        const esp = especie.toLowerCase();
        if (esp.includes('cachorro')) return <FaDog />;
        if (esp.includes('gato')) return <FaCat />;
        return <FaPaw />;
    };

    const formatPetBirthdate = (dateString) => {
        if (!dateString) return 'Nascimento: N/A';
        try {
            const date = new Date(dateString + 'T00:00:00-03:00');
            const age = new Date().getFullYear() - date.getFullYear();
            const formattedDate = date.toLocaleDateString('pt-BR');
            return `${formattedDate} (${age} anos)`;
        } catch (e) {
            return 'Data Inválida';
        }
    };
    
    const kpiData = useMemo(() => {
        if (!cliente) return { totalGasto: '...', clienteDesde: '...', totalPets: '...' };
        
        const totalGasto = (cliente.totalGasto || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const clienteDesde = new Date(cliente.dataCadastro).toLocaleDateString('pt-BR');
        const totalPets = pets.length;

        return { totalGasto, clienteDesde, totalPets };
    }, [cliente, pets]);

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

                <div className={styles.profileHeader}>
                    <h2 className={styles.clientName}>{cliente.nome}</h2>
                    <div className={styles.headerInfo}>
                        <div className={styles.infoItem}>
                            <FaUser />
                            <span>{cliente.cpf}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <FaPhone />
                            <span>{cliente.telefone1}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <FaMapMarkerAlt />
                            <span>{cliente.cidade} - {cliente.estado}</span>
                        </div>
                    </div>
                </div>
                
                <div className={styles.kpiContainer}>
                    <KpiCard 
                        title="Total Gasto"
                        value={kpiData.totalGasto}
                        icon={<FaDollarSign />}
                        color="#28a745"
                    />
                    <KpiCard 
                        title="Total de Pets"
                        value={kpiData.totalPets}
                        icon={<FaPaw />}
                        color="var(--primary-color)"
                    />
                    <KpiCard 
                        title="Cliente Desde"
                        value={kpiData.clienteDesde}
                        icon={<FaBirthdayCake />}
                        color="#ffc107"
                    />
                </div>
            </section>

            <section className="content-section">
                <div className="section-header">
                    <h2>Pets de {cliente.nome.split(' ')[0]}</h2>
                </div>
                
                <div className={styles.petGrid}>
                    {pets.map(pet => (
                        <div className={styles.petCard} key={pet.cod_pet}>
                            <div className={styles.petCardSpeciesIcon}>
                                {getPetIcon(pet.especie)}
                            </div>
                            <div className={styles.petCardInfo}>
                                <span className={styles.petName}>{pet.nomePet} (Cód: {pet.cod_pet})</span>
                                <span className={styles.petDetails}>{pet.especie} / {pet.raca}</span>
                                <span className={styles.petDetails}>{formatPetBirthdate(pet.dataNascimento)}</span>
                            </div>
                            <div className={styles.petCardActions}>
                                <button onClick={() => handleOpenModal(pet)} className={`${styles.actionButton} ${styles.editButton}`} title="Editar Pet">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleDeletePet(pet.cod_pet, pet.nomePet)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Pet">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    <button className={styles.addPetCard} onClick={() => handleOpenModal()}>
                        <FaPlus />
                        <span>Adicionar Novo Pet</span>
                    </button>
                </div>
            </section>

            {isModalOpen && (
                <PetModal
                    pet={currentPet}
                    onClose={handleCloseModal}
                    onSave={handleSavePet}
                    cpfClientePadrao={cpf}
                />
            )}
        </>
    );
}