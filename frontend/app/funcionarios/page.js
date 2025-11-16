'use client'; 

import { useState, useEffect } from 'react';
import FuncionarioModal from '../../components/FuncionarioModal'; 
import { useNotification } from '../../contexts/NotificationContext';
import { FaUserMd, FaUserFriends, FaUsersCog } from 'react-icons/fa';

export default function GerenciarFuncionarios() {
    const [veterinarios, setVeterinarios] = useState([]);
    const [atendentes, setAtendentes] = useState([]);
    const [funcionariosGeral, setFuncionariosGeral] = useState([]);
    
    const [listaSupervisores, setListaSupervisores] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState(null);
    const [tipoEmEdicao, setTipoEmEdicao] = useState('funcionario'); 

    const [abaAtiva, setAbaAtiva] = useState('geral'); 

    const { showNotification, showConfirmation } = useNotification();

    const API_URL = 'http://localhost:8080/api';

    const carregarFuncionariosGeral = async () => {
        try {
            const response = await fetch(`${API_URL}/funcionarios/geral`);
            if (!response.ok) throw new Error('Erro ao buscar lista geral de funcionários');
            const data = await response.json();
            setFuncionariosGeral(data);
            
            const supervisores = data
                .map(f => ({ codFuncionario: f.codFuncionario, nome: f.nome }))
                .sort((a, b) => a.nome.localeCompare(b.nome));
            setListaSupervisores(supervisores);
            
            setVeterinarios(data.filter(f => f.tipo === 'Veterinário'));
            setAtendentes(data.filter(f => f.tipo === 'Atendente'));

        } catch (error) {
            console.error('Falha ao carregar funcionários:', error);
            showNotification({ message: 'Não foi possível carregar os funcionários.', type: 'error' });
        }
    };

    useEffect(() => {
        carregarFuncionariosGeral();
    }, []);

    const handleAbrirModalNovo = () => {
        setFuncionarioEmEdicao(null);
        setTipoEmEdicao('funcionario'); 
        setIsModalOpen(true);
    };

    const handleAbrirModalEditar = (funcionario) => {
        let tipo = 'funcionario'; 
        if (funcionario.tipo === 'Veterinário') tipo = 'vet';
        if (funcionario.tipo === 'Atendente') tipo = 'atendente';
        
        setFuncionarioEmEdicao(funcionario);
        setTipoEmEdicao(tipo);
        setIsModalOpen(true);
    };

    const handleFecharModal = () => {
        setIsModalOpen(false);
        setFuncionarioEmEdicao(null);
    };

    const handleSalvar = () => {
        handleFecharModal();
        carregarFuncionariosGeral(); 
    };

    const handleExcluir = (funcionario) => {
        showConfirmation({
            message: `Tem certeza que deseja excluir o funcionário ${funcionario.nome} (Cód. ${funcionario.codFuncionario})?`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`${API_URL}/funcionarios/${funcionario.codFuncionario}`, {
                        method: 'DELETE',
                    });

                    if (!response.ok && response.status !== 204) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || `Erro ao excluir funcionário.`);
                    }

                    showNotification({ message: `Funcionário excluído(a) com sucesso!`, type: 'success' });
                    carregarFuncionariosGeral();
                } catch (error) {
                    console.error(`Falha ao excluir funcionário:`, error);
                    showNotification({ message: `Não foi possível excluir: ${error.message}`, type: 'error', duration: 6000 });
                }
            }
        });
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString + 'T00:00:00-03:00').toLocaleDateString('pt-BR');
    };

    return (
        <section id="funcionarios-section" className="content-section">
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FaUsersCog style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }} />
                    <h2>Gerenciamento de Funcionários</h2>
                </div>
                <button className="btn btn-primary" onClick={handleAbrirModalNovo}>
                    Novo Funcionário
                </button>
            </div>

            <div style={{ display: 'flex', borderBottom: '1px solid var(--table-border)', marginBottom: '1.5rem' }}>
                <button 
                    className={`btn ${abaAtiva === 'geral' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setAbaAtiva('geral')}
                    style={{ borderRadius: '4px 4px 0 0', marginRight: '5px' }}
                >
                    <FaUsersCog /> Todos ({funcionariosGeral.length})
                </button>
                <button 
                    className={`btn ${abaAtiva === 'vet' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setAbaAtiva('vet')}
                    style={{ borderRadius: '4px 4px 0 0', marginRight: '5px' }}
                >
                    <FaUserMd /> Veterinários ({veterinarios.length})
                </button>
                <button 
                    className={`btn ${abaAtiva === 'atendente' ? 'btn-primary' : 'btn-secondary'}`} 
                    onClick={() => setAbaAtiva('atendente')}
                    style={{ borderRadius: '4px 4px 0 0' }}
                >
                    <FaUserFriends /> Atendentes ({atendentes.length})
                </button>
            </div>

            <div className="table-container" style={{ display: abaAtiva === 'geral' ? 'block' : 'none' }}>
                <h3>Todos os Funcionários</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Nome</th>
                            <th>Cargo</th>
                            <th>CPF</th>
                            <th>Data Admissão</th>
                            <th>Supervisor (Cód.)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionariosGeral.map((func) => (
                            <tr key={func.codFuncionario}>
                                <td>{func.codFuncionario}</td>
                                <td>{func.nome}</td>
                                <td>{func.tipo}</td>
                                <td>{func.cpf}</td>
                                <td>{formatDate(func.dataAdmissao)}</td>
                                <td>{func.codSupervisor || '-'}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleAbrirModalEditar(func)}>Editar</button>
                                        <button className="btn-delete" onClick={() => handleExcluir(func)}>Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container" style={{ display: abaAtiva === 'vet' ? 'block' : 'none' }}>
                <h3>Veterinários</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Nome</th>
                            <th>CRMV</th>
                            <th>CPF</th>
                            <th>Data Admissão</th>
                            <th>Supervisor (Cód.)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {veterinarios.map((vet) => (
                            <tr key={vet.codFuncionario}>
                                <td>{vet.codFuncionario}</td>
                                <td>{vet.nome}</td>
                                <td>{vet.crmv}</td>
                                <td>{vet.cpf}</td>
                                <td>{formatDate(vet.dataAdmissao)}</td>
                                <td>{vet.codSupervisor || '-'}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleAbrirModalEditar(vet)}>Editar</button>
                                        <button className="btn-delete" onClick={() => handleExcluir(vet)}>Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container" style={{ display: abaAtiva === 'atendente' ? 'block' : 'none' }}>
                <h3>Atendentes</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Data Admissão</th>
                            <th>Supervisor (Cód.)</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {atendentes.map((ate) => (
                            <tr key={ate.codFuncionario}>
                                <td>{ate.codFuncionario}</td>
                                <td>{ate.nome}</td>
                                <td>{ate.cpf}</td>
                                <td>{formatDate(ate.dataAdmissao)}</td>
                                <td>{ate.codSupervisor || '-'}</td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="btn-edit" onClick={() => handleAbrirModalEditar(ate)}>Editar</button>
                                        <button className="btn-delete" onClick={() => handleExcluir(ate)}>Excluir</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <FuncionarioModal
                    funcionarioParaEditar={funcionarioEmEdicao}
                    tipoInicial={tipoEmEdicao}
                    listaSupervisores={listaSupervisores}
                    onClose={handleFecharModal}
                    onSave={handleSalvar}
                />
            )}
        </section>
    );
}