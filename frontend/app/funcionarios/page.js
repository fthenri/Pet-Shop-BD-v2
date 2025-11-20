'use client'; 

import { useState, useEffect, useMemo } from 'react';
import FuncionarioModal from '../../components/FuncionarioModal'; 
import { useNotification } from 'ft-ui-react';
import { 
    FaUserMd, 
    FaUserFriends, 
    FaUsersCog,
    FaEdit,
    FaTrash
} from 'react-icons/fa';
import styles from './funcionarios.module.css';

const BadgeCargo = ({ tipo }) => {
    if (tipo === 'Veterinário') {
        return (
            <span className={`${styles.badge} ${styles.badgeVet}`}>
                <FaUserMd /> {tipo}
            </span>
        );
    }
    if (tipo === 'Atendente') {
        return (
            <span className={`${styles.badge} ${styles.badgeAtendente}`}>
                <FaUserFriends /> {tipo}
            </span>
        );
    }
    return (
        <span className={`${styles.badge} ${styles.badgeFunc}`}>
            <FaUsersCog /> {tipo}
        </span>
    );
};

export default function GerenciarFuncionarios() {
    const [funcionariosGeral, setFuncionariosGeral] = useState([]);
    const [listaSupervisores, setListaSupervisores] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [funcionarioEmEdicao, setFuncionarioEmEdicao] = useState(null);
    const [tipoEmEdicao, setTipoEmEdicao] = useState('funcionario'); 
    const [abaAtiva, setAbaAtiva] = useState('geral'); 
    const [filtro, setFiltro] = useState('');

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
            
        } catch (error) {
            console.error('Falha ao carregar funcionários:', error);
            showNotification({ message: 'Não foi possível carregar os funcionários.', type: 'error' });
        }
    };

    useEffect(() => {
        carregarFuncionariosGeral();
    }, []);

    const supervisorMap = useMemo(() => {
        return new Map(listaSupervisores.map(sup => [sup.codFuncionario, sup.nome]));
    }, [listaSupervisores]);

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

    const funcionariosFiltrados = useMemo(() => {
        const termoBusca = filtro.toLowerCase();
        if (!termoBusca) return funcionariosGeral;

        return funcionariosGeral.filter(func => 
            (func.nome && func.nome.toLowerCase().includes(termoBusca)) ||
            (func.cpf && func.cpf.includes(termoBusca)) ||
            (func.tipo && func.tipo.toLowerCase().includes(termoBusca))
        );
    }, [filtro, funcionariosGeral]);

    const veterinarios = funcionariosFiltrados.filter(f => f.tipo === 'Veterinário');
    const atendentes = funcionariosFiltrados.filter(f => f.tipo === 'Atendente');
    
    const getTabelaAtiva = () => {
        switch(abaAtiva) {
            case 'vet': return veterinarios;
            case 'atendente': return atendentes;
            case 'geral':
            default:
                return funcionariosFiltrados;
        }
    };
    
    return (
        <section id="funcionarios-section" className="content-section">
            <div className="section-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <FaUsersCog style={{ fontSize: '1.75rem', color: 'var(--primary-color)' }} />
                    <h2>Gerenciamento de Funcionários</h2>
                </div>
            </div>

            <div className={styles.tabContainer}>
                <button 
                    className={`${styles.tabButton} ${abaAtiva === 'geral' ? styles.activeTab : ''}`} 
                    onClick={() => setAbaAtiva('geral')}
                >
                    <FaUsersCog /> Todos ({funcionariosGeral.length})
                </button>
                <button 
                    className={`${styles.tabButton} ${abaAtiva === 'vet' ? styles.activeTab : ''}`} 
                    onClick={() => setAbaAtiva('vet')}
                >
                    <FaUserMd /> Veterinários ({funcionariosGeral.filter(f => f.tipo === 'Veterinário').length})
                </button>
                <button 
                    className={`${styles.tabButton} ${abaAtiva === 'atendente' ? styles.activeTab : ''}`} 
                    onClick={() => setAbaAtiva('atendente')}
                >
                    <FaUserFriends /> Atendentes ({funcionariosGeral.filter(f => f.tipo === 'Atendente').length})
                </button>
            </div>

            <div className={styles.toolbar}>
                <div className="form-group" style={{ flexGrow: 1, margin: 0 }}>
                    <input
                        type="text"
                        placeholder="Filtrar por Nome, CPF ou Cargo..."
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className={styles.filtroInput}
                    />
                </div>
                <button className="btn btn-primary" onClick={handleAbrirModalNovo}>
                    Novo Funcionário
                </button>
            </div>

            <div className="table-container" style={{ display: abaAtiva === 'geral' ? 'block' : 'none' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Nome</th>
                            <th>Cargo</th>
                            <th>CPF</th>
                            <th>Data Admissão</th>
                            <th>Supervisor</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {funcionariosFiltrados.map((func) => (
                            <tr key={func.codFuncionario}>
                                <td>{func.codFuncionario}</td>
                                <td>{func.nome}</td>
                                <td><BadgeCargo tipo={func.tipo} /></td>
                                <td>{func.cpf}</td>
                                <td>{formatDate(func.dataAdmissao)}</td>
                                <td>{supervisorMap.get(func.codSupervisor) || '-'}</td>
                                <td className={styles.actionsCell}>
                                    <button 
                                        className={`${styles.actionButton} ${styles.editButton}`} 
                                        onClick={() => handleAbrirModalEditar(func)}
                                        title="Editar Funcionário"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className={`${styles.actionButton} ${styles.deleteButton}`} 
                                        onClick={() => handleExcluir(func)}
                                        title="Excluir Funcionário"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container" style={{ display: abaAtiva === 'vet' ? 'block' : 'none' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Nome</th>
                            <th>CRMV</th>
                            <th>CPF</th>
                            <th>Data Admissão</th>
                            <th>Supervisor</th>
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
                                <td>{supervisorMap.get(vet.codSupervisor) || '-'}</td>
                                <td className={styles.actionsCell}>
                                    <button 
                                        className={`${styles.actionButton} ${styles.editButton}`} 
                                        onClick={() => handleAbrirModalEditar(vet)}
                                        title="Editar Veterinário"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className={`${styles.actionButton} ${styles.deleteButton}`} 
                                        onClick={() => handleExcluir(vet)}
                                        title="Excluir Veterinário"
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="table-container" style={{ display: abaAtiva === 'atendente' ? 'block' : 'none' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Cód.</th>
                            <th>Nome</th>
                            <th>CPF</th>
                            <th>Data Admissão</th>
                            <th>Supervisor</th>
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
                                <td>{supervisorMap.get(ate.codSupervisor) || '-'}</td>
                                <td className={styles.actionsCell}>
                                    <button 
                                        className={`${styles.actionButton} ${styles.editButton}`} 
                                        onClick={() => handleAbrirModalEditar(ate)}
                                        title="Editar Atendente"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button 
                                        className={`${styles.actionButton} ${styles.deleteButton}`} 
                                        onClick={() => handleExcluir(ate)}
                                        title="Excluir Atendente"
                                    >
                                        <FaTrash />
                                    </button>
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