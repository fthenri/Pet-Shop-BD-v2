'use client';

import { useState, useEffect } from 'react';

export default function PetModal({ pet, onClose, onSave, cpfClientePadrao }) {
    
    const [formData, setFormData] = useState({
        cpfCliente: cpfClientePadrao || '', 
        nomePet: '',
        especie: '',
        raca: '',
        dataNascimento: '',
        observacoes: ''
    });

    useEffect(() => {
        if (pet) {
            setFormData({
                cpfCliente: pet.cpfCliente || '',
                nomePet: pet.nomePet || '',
                especie: pet.especie || '',
                raca: pet.raca || '',
                dataNascimento: pet.dataNascimento ? pet.dataNascimento.split('T')[0] : '',
                observacoes: pet.observacoes || ''
            });
        } else {
            setFormData({
                cpfCliente: cpfClientePadrao || '', 
                nomePet: '',
                especie: '',
                raca: '',
                dataNascimento: '',
                observacoes: ''
            });
        }
    }, [pet, cpfClientePadrao]); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        const dataToSave = {
            ...formData,
            dataNascimento: formData.dataNascimento || null
        };
        onSave(dataToSave);
    };

    const isEditMode = Boolean(pet);

    return (
        <div className="modal-overlay active"> 
            <div className="modal-content">
                <div className="modal-header">
                    <h3>{isEditMode ? 'Editar Pet' : 'Adicionar Novo Pet'}</h3>
                    <span className="close-button" onClick={onClose}>&times;</span>
                </div>
                
                <form id="form-pet" className="form-container" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        
                        <div className="form-group grid-col-span-2">
                            <label htmlFor="cpfCliente">CPF do Cliente*</label>
                            <input
                                type="text"
                                id="cpfCliente"
                                name="cpfCliente"
                                maxLength="11"
                                value={formData.cpfCliente}
                                onChange={handleChange}
                                required
                                readOnly={isEditMode && pet.cpfCliente}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="nomePet">Nome do Pet*</label>
                            <input
                                type="text"
                                id="nomePet"
                                name="nomePet"
                                value={formData.nomePet}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="especie">Espécie*</label>
                            <input
                                type="text"
                                id="especie"
                                name="especie"
                                value={formData.especie}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="raca">Raça*</label>
                            <input
                                type="text"
                                id="raca"
                                name="raca"
                                value={formData.raca}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dataNascimento">Data de Nascimento</label>
                            <input
                                type="date"
                                id="dataNascimento"
                                name="dataNascimento"
                                value={formData.dataNascimento}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group grid-col-span-2">
                            <label htmlFor="observacoes">Observações</label>
                            <input
                                type="text"
                                id="observacoes"
                                name="observacoes"
                                value={formData.observacoes}
                                onChange={handleChange}
                            />
                        </div>
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