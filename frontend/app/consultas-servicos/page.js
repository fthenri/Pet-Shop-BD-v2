'use client';
import { useState, useEffect, useMemo } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { FaUserMd, FaStethoscope, FaNotesMedical, FaUser, FaPaw, FaTimes, FaSearch } from 'react-icons/fa';
import styles from './consultas.module.css'; 

const API_URL_CONSULTA = 'http://localhost:8080/api/consultas';
const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';
const API_URL_VETS = 'http://localhost:8080/api/veterinarios'; 
const API_URL_PETS = 'http://localhost:8080/api/pets';

export default function ConsultasServicosPage() {
    const { showNotification } = useNotification();

    const [clientes, setClientes] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [pets, setPets] = useState([]);
    
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedVet, setSelectedVet] = useState('');
    const [sintomas, setSintomas] = useState('');
    const [diagnostico, setDiagnostico] = useState('');

    const [busca, setBusca] = useState('');
    const [pacienteSelecionado, setPacienteSelecionado] = useState(null); 
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resClientes, resVets, resPets] = await Promise.all([
                    fetch(API_URL_CLIENTES),
                    fetch(API_URL_VETS),
                    fetch(API_URL_PETS) 
                ]);
                
                if (!resClientes.ok || !resVets.ok || !resPets.ok) {
                    throw new Error("Falha ao carregar clientes, veterinários ou pets.");
                }

                const dataClientes = await resClientes.json();
                const dataVets = await resVets.json();
                const dataPets = await resPets.json();

                setClientes(dataClientes);
                setVeterinarios(dataVets);
                setPets(dataPets); 

            } catch (error) {
                showNotification({ message: `Erro ao carregar dados: ${error.message}`, type: 'error' });
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [showNotification]);

    const petsComDono = useMemo(() => {
        const clienteMap = new Map(clientes.map(c => [c.cpf, c]));
        return pets.map(pet => ({
            ...pet,
            dono: clienteMap.get(pet.cpfCliente) || null
        }));
    }, [pets, clientes]);

    const resultadosBusca = useMemo(() => {
        if (busca.length < 2) return [];
        const termoBusca = busca.toLowerCase();
        
        return petsComDono.filter(pet => 
            pet.nomePet.toLowerCase().includes(termoBusca) ||
            (pet.dono && pet.dono.nome.toLowerCase().includes(termoBusca)) ||
            (pet.dono && pet.dono.cpf.includes(termoBusca))
        ).slice(0, 10); 
    }, [busca, petsComDono]);

    const handleSelecionarPaciente = (pet) => {
        setPacienteSelecionado(pet); 
        setSelectedPet(pet.cod_pet); 
        setBusca(''); 
    };

    const handleLimparPaciente = () => {
        setPacienteSelecionado(null);
        setSelectedPet('');
    };

    const handleSubmitServico = async (e) => {
        e.preventDefault();
        if (!selectedPet || !selectedVet || !diagnostico) {
            showNotification({ message: 'Paciente, Veterinário e Diagnóstico/Descrição são obrigatórios.', type: 'error' });
            return;
        }

        setIsSubmitting(true);

        const servicoDTO = {
            codPet: parseInt(selectedPet),
            codVeterinario: parseInt(selectedVet),
            sintomasRelatados: sintomas,
            diagnostico: diagnostico,
        };

        try {
            const response = await fetch(API_URL_CONSULTA, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(servicoDTO)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao registrar serviço.');
            }

            showNotification({ message: `Serviço (Consulta N° ${responseData.numConsulta}) registrado com sucesso!`, type: 'success' });
            
            handleLimparPaciente();
            setSelectedVet('');
            setSintomas('');
            setDiagnostico('');

        } catch (error) {
            console.error('Falha ao registrar serviço:', error);
            showNotification({ message: `Falha: ${error.message}`, type: 'error', duration: 6000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return <p>Carregando dados...</p>;
    }

    return (
        <section id="consultas-section" className="content-section">
            <div className="section-header">
                <h2>Registrar Serviço / Consulta</h2>
            </div>
            
            <form onSubmit={handleSubmitServico} className={styles.container}>
                
                <div className={styles.colunaProntuario}>
                    
                    <fieldset className="form-fieldset">
                        <legend>1. Buscar Paciente</legend>
                        <div className={`form-group ${styles.autocompleteWrapper}`}>
                            <label htmlFor="busca-paciente">Nome do Pet, Dono ou CPF</label>
                            <div className={styles.inputIcon}>
                                <FaSearch />
                                <input
                                    type="text"
                                    id="busca-paciente"
                                    placeholder="Digite para buscar..."
                                    value={busca}
                                    onChange={e => setBusca(e.target.value)}
                                    autoComplete="off"
                                    disabled={!!pacienteSelecionado}
                                />
                            </div>
                            {resultadosBusca.length > 0 && !pacienteSelecionado && (
                                <div className={styles.autocompleteList}>
                                    {resultadosBusca.map(pet => (
                                        <div 
                                            key={pet.cod_pet} 
                                            className={styles.autocompleteItem}
                                            onClick={() => handleSelecionarPaciente(pet)}
                                        >
                                            <FaPaw />
                                            <div>
                                                <strong>{pet.nomePet}</strong> ({pet.especie})
                                                <span className={styles.itemInfo}>
                                                    Dono: {pet.dono?.nome || 'Não encontrado'} (CPF: {pet.cpfCliente})
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </fieldset>

                    {pacienteSelecionado && (
                        <div className={styles.prontuarioCard}>
                            <button type="button" onClick={handleLimparPaciente} className={styles.limparBtn} title="Limpar Paciente">
                                <FaTimes />
                            </button>
                            <h4>Paciente Selecionado</h4>
                            <div className={styles.cardInfo}>
                                <FaPaw />
                                <div>
                                    <strong>{pacienteSelecionado.nomePet} (Cód: {pacienteSelecionado.cod_pet})</strong>
                                    <span>{pacienteSelecionado.especie} / {pacienteSelecionado.raca}</span>
                                </div>
                            </div>
                            <div className={styles.cardInfo}>
                                <FaUser />
                                <div>
                                    <strong>{pacienteSelecionado.dono?.nome || 'Cliente não encontrado'}</strong>
                                    <span>CPF: {pacienteSelecionado.cpfCliente}</span>
                                    <span>Contato: {pacienteSelecionado.dono?.telefone1 || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={styles.colunaRegistro}>
                    <fieldset className="form-fieldset" disabled={!pacienteSelecionado || isSubmitting}>
                        <legend>2. Registro Clínico</legend>
                        
                        <div className="form-group">
                            <label htmlFor="veterinario">Veterinário(a) Responsável*</label>
                            <select id="veterinario" value={selectedVet} onChange={e => setSelectedVet(e.target.value)} required>
                                <option value="">Selecione um Veterinário</option>
                                {veterinarios.map(v => (
                                    <option key={v.codFuncionario} value={v.codFuncionario}>{v.nome} (CRMV: {v.crmv})</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className={`form-group ${styles.registroField}`}>
                            <label htmlFor="sintomas"><FaStethoscope /> Sintomas Relatados</label>
                            <textarea
                                id="sintomas"
                                rows="4"
                                value={sintomas}
                                onChange={e => setSintomas(e.target.value)}
                                placeholder="Ex: Pet apático, sem apetite..."
                            ></textarea>
                        </div>

                        <div className={`form-group ${styles.registroField}`}>
                            <label htmlFor="diagnostico"><FaNotesMedical /> Diagnóstico / Descrição do Serviço*</label>
                            <textarea
                                id="diagnostico"
                                rows="6"
                                value={diagnostico}
                                onChange={e => setDiagnostico(e.target.value)}
                                placeholder="Ex: Consulta de rotina e aplicação de vacina V10."
                                required
                            ></textarea>
                        </div>
                    </fieldset>

                    <button 
                        type="submit" 
                        className={`btn btn-primary ${styles.finalizarBtn}`} 
                        disabled={isSubmitting || !pacienteSelecionado || !selectedVet || !diagnostico}
                    >
                        {isSubmitting ? 'Registrando...' : 'Finalizar e Registrar Serviço'}
                    </button>
                </div>
            </form>
        </section>
    );
}