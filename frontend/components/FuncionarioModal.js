'use client';

import { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';

export default function FuncionarioModal({ onClose, onSave, funcionarioParaEditar, tipoInicial, listaSupervisores }) {
    const API_URL = 'http://localhost:8080/api';
    const { showNotification } = useNotification();

    const [formData, setFormData] = useState({
        cpf: '',
        nome: '',
        dataAdmissao: '',
        codSupervisor: '',
        crmv: '', 
    });
    
    const [tipoFuncionario, setTipoFuncionario] = useState(tipoInicial);
    
    const isEditMode = Boolean(funcionarioParaEditar);

    useEffect(() => {
        if (isEditMode) {
            setFormData({
                cpf: funcionarioParaEditar.cpf || '',
                nome: funcionarioParaEditar.nome || '',
                dataAdmissao: funcionarioParaEditar.dataAdmissao ? funcionarioParaEditar.dataAdmissao.split('T')[0] : '',
                codSupervisor: funcionarioParaEditar.codSupervisor || '',
                crmv: funcionarioParaEditar.crmv || '',
            });
        }
    }, [funcionarioParaEditar, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTipoChange = (e) => {
        setTipoFuncionario(e.target.value);
        if (e.target.value !== 'vet') {
            setFormData(prev => ({ ...prev, crmv: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const commonData = {
            nome: formData.nome,
            cpf: formData.cpf,
            dataAdmissao: formData.dataAdmissao,
            codSupervisor: formData.codSupervisor ? parseInt(formData.codSupervisor) : null,
        };

        let requestBody;
        let endpoint;
        let tipoNome;

        if (tipoFuncionario === 'vet') {
            requestBody = {
                ...commonData,
                crmv: formData.crmv,
            };
            endpoint = isEditMode ? `${API_URL}/veterinarios/${funcionarioParaEditar.codFuncionario}` : `${API_URL}/veterinarios`;
            tipoNome = "Veterinário(a)";
        } else if (tipoFuncionario === 'atendente') {
            requestBody = commonData; 
            endpoint = isEditMode ? `${API_URL}/atendentes/${funcionarioParaEditar.codFuncionario}` : `${API_URL}/atendentes`;
            tipoNome = "Atendente";
        } else {
            requestBody = commonData;
            endpoint = isEditMode ? `${API_URL}/funcionarios/${funcionarioParaEditar.codFuncionario}` : `${API_URL}/funcionarios`;
            tipoNome = "Funcionário(a)";
        }

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => response.text());
                throw new Error(errorData.message || errorData || 'Erro ao salvar funcionário');
            }

            showNotification({
                message: `${tipoNome} ${isEditMode ? 'atualizado(a)' : 'cadastrado(a)'} com sucesso!`,
                type: 'success'
            });
            onSave();
        } catch (error) {
            console.error('Falha ao salvar funcionário:', error);
            showNotification({
                message: `Não foi possível salvar: ${error.message}`,
                type: 'error', duration: 6000
            });
        }
    };

    const modalTitle = isEditMode 
        ? `Editar ${tipoFuncionario === 'vet' ? 'Veterinário' : (tipoFuncionario === 'atendente' ? 'Atendente' : 'Funcionário')}`
        : 'Cadastrar Novo Funcionário';

    return (
        <div className="modal-overlay active">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{modalTitle}</h3>
                    <span className="close-button" onClick={onClose}>&times;</span>
                </div>
                <form id="form-funcionario" onSubmit={handleSubmit}>
                    
                    {!isEditMode && (
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Tipo de Funcionário:</label>
                            <div style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0' }}>
                                <label style={{ fontWeight: 'normal' }}>
                                    <input 
                                        type="radio" 
                                        value="funcionario" 
                                        checked={tipoFuncionario === 'funcionario'} 
                                        onChange={handleTipoChange}
                                    /> Funcionário (Geral)
                                </label>
                                <label style={{ fontWeight: 'normal' }}>
                                    <input 
                                        type="radio" 
                                        value="vet" 
                                        checked={tipoFuncionario === 'vet'} 
                                        onChange={handleTipoChange}
                                    /> Veterinário
                                </label>
                                <label style={{ fontWeight: 'normal' }}>
                                    <input 
                                        type="radio" 
                                        value="atendente" 
                                        checked={tipoFuncionario === 'atendente'} 
                                        onChange={handleTipoChange}
                                    /> Atendente
                                </label>
                            </div>
                        </div>
                    )}
                    
                    {isEditMode && (
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label>Tipo:</label>
                            <input
                                type="text"
                                value={tipoFuncionario === 'vet' ? 'Veterinário' : (tipoFuncionario === 'atendente' ? 'Atendente' : 'Funcionário')}
                                readOnly
                                disabled
                            />
                        </div>
                    )}


                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="nome">Nome Completo:</label>
                            <input
                                type="text"
                                id="nome"
                                name="nome"
                                required
                                value={formData.nome}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="cpf">CPF:</label>
                            <input
                                type="text"
                                id="cpf"
                                name="cpf"
                                maxLength="11"
                                required
                                placeholder="Apenas números"
                                value={formData.cpf}
                                onChange={handleChange}
                                readOnly={isEditMode} 
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dataAdmissao">Data de Admissão:</label>
                            <input
                                type="date"
                                id="dataAdmissao"
                                name="dataAdmissao"
                                required
                                value={formData.dataAdmissao}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="codSupervisor">Supervisor:</label>
                            <select
                                id="codSupervisor"
                                name="codSupervisor"
                                value={formData.codSupervisor}
                                onChange={handleChange}
                            >
                                <option value="">Nenhum</option>
                                {listaSupervisores
                                    .filter(sup => !isEditMode || sup.codFuncionario !== funcionarioParaEditar.codFuncionario)
                                    .map(sup => (
                                    <option key={sup.codFuncionario} value={sup.codFuncionario}>
                                        {sup.nome} (Cód: {sup.codFuncionario})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {tipoFuncionario === 'vet' && (
                            <div className="form-group">
                                <label htmlFor="crmv">CRMV:</label>
                                <input
                                    type="text"
                                    id="crmv"
                                    name="crmv"
                                    required={tipoFuncionario === 'vet'} 
                                    placeholder="Ex: PE1234"
                                    value={formData.crmv}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            Salvar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}