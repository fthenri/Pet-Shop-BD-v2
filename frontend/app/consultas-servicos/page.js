'use client';
import { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const API_URL_CONSULTA = 'http://localhost:8080/api/consultas';
const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';
const API_URL_VETS = 'http://localhost:8080/api/veterinarios'; 
const API_URL_PETS_POR_CLIENTE = 'http://localhost:8080/api/clientes'; 

export default function ConsultasServicosPage() {
    const { showNotification } = useNotification();

    const [clientes, setClientes] = useState([]);
    const [veterinarios, setVeterinarios] = useState([]);
    const [pets, setPets] = useState([]);
    
    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedVet, setSelectedVet] = useState('');
    const [sintomas, setSintomas] = useState('');
    const [diagnostico, setDiagnostico] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resClientes, resVets] = await Promise.all([
                    fetch(API_URL_CLIENTES),
                    fetch(API_URL_VETS)
                ]);
                
                if (!resClientes.ok || !resVets.ok) {
                    throw new Error("Falha ao carregar clientes ou veterinários.");
                }

                const dataClientes = await resClientes.json();
                const dataVets = await resVets.json();

                setClientes(dataClientes);
                setVeterinarios(dataVets);

            } catch (error) {
                showNotification({ message: `Erro ao carregar dados: ${error.message}`, type: 'error' });
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [showNotification]);

    useEffect(() => {
        if (!selectedCliente) {
            setPets([]);
            setSelectedPet('');
            return;
        }

        const fetchPets = async () => {
            try {
                const response = await fetch(`${API_URL_PETS_POR_CLIENTE}/${selectedCliente}/pets`);
                if (!response.ok) {
                    throw new Error('Erro ao buscar pets do cliente.');
                }
                const dataPets = await response.json();
                setPets(dataPets);
                setSelectedPet(''); 
            } catch (error) {
                showNotification({ message: error.message, type: 'error' });
            }
        };

        fetchPets();
    }, [selectedCliente, showNotification]);

    const handleSubmitServico = async (e) => {
        e.preventDefault();
        if (!selectedCliente || !selectedPet || !selectedVet || !diagnostico) {
            showNotification({ message: 'Cliente, Pet, Veterinário e Diagnóstico/Descrição são obrigatórios.', type: 'error' });
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
            
            setSelectedCliente('');
            setSelectedPet('');
            setSelectedVet('');
            setSintomas('');
            setDiagnostico('');
            setPets([]); 

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
            
            <form onSubmit={handleSubmitServico}>
                <fieldset className="form-fieldset">
                    <legend>Dados do Atendimento</legend>
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="cliente">Cliente*</label>
                            <select id="cliente" value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)} required>
                                <option value="">Selecione um Cliente</option>
                                {clientes.map(c => (
                                    <option key={c.cpf} value={c.cpf}>{c.nome}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="pet">Pet*</label>
                            <select id="pet" value={selectedPet} onChange={e => setSelectedPet(e.target.value)} required disabled={pets.length === 0}>
                                <option value="">{selectedCliente ? 'Selecione um Pet' : 'Selecione um Cliente primeiro'}</option>
                                {pets.map(p => (
                                    <option key={p.cod_pet} value={p.cod_pet}>{p.nomePet} (Cód: {p.cod_pet})</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="veterinario">Veterinário*</label>
                            <select id="veterinario" value={selectedVet} onChange={e => setSelectedVet(e.target.value)} required>
                                <option value="">Selecione um Veterinário</option>
                                {veterinarios.map(v => (
                                    <option key={v.codFuncionario} value={v.codFuncionario}>{v.nome} (CRMV: {v.crmv})</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="form-group" style={{marginTop: '1rem'}}>
                        <label htmlFor="sintomas">Sintomas Relatados</label>
                        <textarea
                            id="sintomas"
                            rows="3"
                            value={sintomas}
                            onChange={e => setSintomas(e.target.value)}
                            placeholder="Ex: Pet apático, sem apetite..."
                        ></textarea>
                    </div>

                    <div className="form-group" style={{marginTop: '1rem'}}>
                        <label htmlFor="diagnostico">Diagnóstico / Descrição do Serviço*</label>
                        <textarea
                            id="diagnostico"
                            rows="4"
                            value={diagnostico}
                            onChange={e => setDiagnostico(e.target.value)}
                            placeholder="Ex: Consulta de rotina e aplicação de vacina V10."
                            required
                        ></textarea>
                    </div>
                </fieldset>
                
                <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }}>
                    {isSubmitting ? 'Registrando...' : 'Finalizar e Registrar Serviço'}
                </button>
            </form>
        </section>
    );
}