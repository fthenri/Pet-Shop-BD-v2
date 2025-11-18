'use client'; 
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import PetModal from '../../components/PetModal'; 
import { useNotification } from '../../contexts/NotificationContext'; 
import { 
    FaPaw, 
    FaEdit, 
    FaTrash, 
    FaDog, 
    FaCat, 
    FaPlus, 
    FaChartPie, 
    FaBirthdayCake 
} from 'react-icons/fa';
import styles from './pets.module.css';

const API_URL_PETS = 'http://localhost:8080/api/pets';
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

export default function GerenciarPets() {
	const [pets, setPets] = useState([]);
    const [clientes, setClientes] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [petEmEdicao, setPetEmEdicao] = useState(null);
    const [filtro, setFiltro] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const { showNotification, showConfirmation } = useNotification(); 

	const carregarDados = async () => {
        setIsLoading(true);
		try {
            const [resPets, resClientes] = await Promise.all([
                fetch(API_URL_PETS),
                fetch(API_URL_CLIENTES)
            ]);

			if (!resPets.ok) throw new Error('Erro ao buscar pets');
            if (!resClientes.ok) throw new Error('Erro ao buscar clientes');
			
            const dataPets = await resPets.json();
            const dataClientes = await resClientes.json();
            
			setPets(dataPets); 
            setClientes(dataClientes);
		} catch (error) {
			console.error('Falha ao carregar dados:', error);
			showNotification({ message: 'Não foi possível carregar os dados.', type: 'error' }); 
		} finally {
            setIsLoading(false);
        }
	};

	useEffect(() => {
		carregarDados();
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
            ? `${API_URL_PETS}/${petEmEdicao.cod_pet}` 
            : API_URL_PETS;                

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
            
            carregarDados(); 
            handleFecharModal();
            showNotification({ 
                message: `Pet ${petEmEdicao ? 'atualizado' : 'cadastrado'} com sucesso!`, 
                type: 'success' 
            }); 
        } catch (err) {
            console.error(err);
            showNotification({ message: `Erro ao salvar: ${err.message}`, type: 'error', duration: 6000 }); 
        }
    };


 	const handleExcluir = (pet) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir o pet ${pet.nomePet} (Cód. ${pet.cod_pet})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL_PETS}/${pet.cod_pet}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok && response.status !== 204) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Erro ao excluir pet.');
                    }
                    carregarDados();
                    showNotification({ message: 'Pet excluído com sucesso!', type: 'success' });
                } catch (error) {
                    console.error('Falha ao excluir pet:', error);
                    showNotification({ message: `Não foi possível excluir o pet: ${error.message}`, type: 'error', duration: 6000 });
                }
            }
        });
	};
	
    const clienteMap = useMemo(() => {
        return new Map(clientes.map(c => [c.cpf, c.nome]));
    }, [clientes]);

    const petsComDono = useMemo(() => {
        return pets.map(pet => ({
            ...pet,
            nomeDono: clienteMap.get(pet.cpfCliente) || 'N/A'
        }));
    }, [pets, clienteMap]);

    const petsFiltrados = useMemo(() => {
        const termoBusca = filtro.toLowerCase();
        if (!termoBusca) return petsComDono;
        
        return petsComDono.filter(pet =>
            (pet.nomePet && pet.nomePet.toLowerCase().includes(termoBusca)) ||
            (pet.cpfCliente && pet.cpfCliente.includes(termoBusca)) ||
            (pet.especie && pet.especie.toLowerCase().includes(termoBusca)) ||
            (pet.nomeDono && pet.nomeDono.toLowerCase().includes(termoBusca))
        );
    }, [petsComDono, filtro]);
	
	const formatDate = (dateString) => {
		if (!dateString) return 'N/A';
		try {
            const date = new Date(dateString + 'T00:00:00-03:00');
            const age = new Date().getFullYear() - date.getFullYear();
            const formattedDate = date.toLocaleDateString('pt-BR');
            return `${formattedDate} (${age} anos)`;
		} catch (e) {
			return 'Inválida';
		}
	};

    const getPetIcon = (especie) => {
        if (!especie) return <FaPaw />;
        const esp = especie.toLowerCase();
        if (esp.includes('cachorro')) return <FaDog />;
        if (esp.includes('gato')) return <FaCat />;
        return <FaPaw />;
    };

    const kpiData = useMemo(() => {
        const totalPets = pets.length;
        if (totalPets === 0) {
            return {
                total: 0,
                especieComum: 'N/A',
                mediaIdade: 0
            };
        }

        const contagemEspecies = pets.reduce((acc, pet) => {
            acc[pet.especie] = (acc[pet.especie] || 0) + 1;
            return acc;
        }, {});
        
        const especieComum = Object.keys(contagemEspecies).reduce(
            (a, b) => contagemEspecies[a] > contagemEspecies[b] ? a : b, 'N/A'
        );
        
        let totalIdade = 0;
        let petsComIdade = 0;
        pets.forEach(pet => {
            if (pet.dataNascimento) {
                try {
                    const age = new Date().getFullYear() - new Date(pet.dataNascimento + 'T00:00:00-03:00').getFullYear();
                    totalIdade += age;
                    petsComIdade++;
                } catch(e) {}
            }
        });
        const mediaIdade = petsComIdade > 0 ? (totalIdade / petsComIdade).toFixed(1) : 0;

        return {
            total: totalPets,
            especieComum: especieComum,
            mediaIdade: `${mediaIdade} anos`
        };
    }, [pets]);

	
	return (
		<section id="pets-section" className="content-section">
			<div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> 
                    <FaPaw style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }}/>
                    <h2>Gerenciamento de Pets</h2>
                </div>
			</div>

            <div className={styles.kpiContainer}>
                <KpiCard 
                    title="Total de Pets" 
                    value={kpiData.total} 
                    icon={<FaPaw />}
                    color="var(--primary-color)"
                />
                <KpiCard 
                    title="Espécie Mais Comum" 
                    value={kpiData.especieComum} 
                    icon={<FaChartPie />}
                    color="#28a745"
                />
                <KpiCard 
                    title="Média de Idade" 
                    value={kpiData.mediaIdade}
                    icon={<FaBirthdayCake />}
                    color="#f0b429"
                />
            </div>

            <div className={styles.toolbar}>
                <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                    <input
                        type="text"
                        id="filtro-pet"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        placeholder="Filtrar por Nome, Espécie, Dono ou CPF..."
                        className={styles.filtroInput}
                    />
                </div>
                <button
					id="open-pet-modal"
					className="btn btn-primary"
					onClick={handleAbrirModalNovo} 
				>
					Cadastrar Novo Pet
				</button>
            </div>

			<div className={styles.petGrid}>
                {isLoading ? (
                    <p>Carregando pets...</p>
                ) : (
                    petsFiltrados.map((pet) => (
                        <div className={styles.petCard} key={pet.cod_pet}>
                            <div className={styles.petCardSpeciesIcon}>
                                {getPetIcon(pet.especie)}
                            </div>
                            <div className={styles.petCardInfo}>
                                <span className={styles.petName}>{pet.nomePet} (Cód: {pet.cod_pet})</span>
                                <span className={styles.petDetails}>{pet.especie} / {pet.raca}</span>
                                <span className={styles.petOwner}>
                                    Dono: 
                                    <Link href={`/clientes/${pet.cpfCliente}`} className={styles.ownerLink}>
                                        {pet.nomeDono}
                                    </Link> 
                                    ({pet.cpfCliente})
                                </span>
                            </div>
                            <div className={styles.petCardActions}>
                                <button onClick={() => handleAbrirModalEditar(pet)} className={`${styles.actionButton} ${styles.editButton}`} title="Editar Pet">
                                    <FaEdit />
                                </button>
                                <button onClick={() => handleExcluir(pet)} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Pet">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
                
                {!isLoading && (
                    <button className={styles.addPetCard} onClick={handleAbrirModalNovo}>
                        <FaPlus />
                        <span>Adicionar Novo Pet</span>
                    </button>
                )}
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