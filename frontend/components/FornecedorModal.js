'use client';

import { useState, useEffect } from 'react';

export default function FornecedorModal({ onClose, onSave, fornecedorParaEditar }) {
	const API_URL = 'http://localhost:8080/api/fornecedores';

	const [formData, setFormData] = useState({
		cnpj: '',
		razaoSocial: '',
		contatoPrincipal: '',
	});

	const isEditMode = Boolean(fornecedorParaEditar);
	const modalTitle = isEditMode ? 'Editar Fornecedor' : 'Cadastrar Novo Fornecedor';

	useEffect(() => {
		if (isEditMode) {
			setFormData({
				cnpj: fornecedorParaEditar.cnpj || '',
				razaoSocial: fornecedorParaEditar.razaoSocial || '',
				contatoPrincipal: fornecedorParaEditar.contatoPrincipal || '',
			});
		} else {
			setFormData({
				cnpj: '',
				razaoSocial: '',
				contatoPrincipal: '',
			});
		}
	}, [fornecedorParaEditar, isEditMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const fornecedorData = {
            ...formData
        };

		const url = isEditMode
			? `${API_URL}/${fornecedorParaEditar.cnpj}`
			: API_URL;
		const method = isEditMode ? 'PUT' : 'POST';

		try {
			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(fornecedorData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Erro ao salvar fornecedor');
			}

			alert(`Fornecedor ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`);
			onSave();
		} catch (error) {
			console.error('Falha ao salvar fornecedor:', error);
			alert(`Não foi possível salvar o fornecedor: ${error.message}`);
		}
	};

	return (
		<div id="fornecedor-modal" className="modal-overlay active">
			<div className="modal-content">
				<div className="modal-header">
					<h3>{modalTitle}</h3>
					<span className="close-button" onClick={onClose}>
						&times;
					</span>
				</div>
				<form id="form-fornecedor" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="cnpj">CNPJ:</label>
						<input
							type="text"
							id="cnpj"
							name="cnpj"
							maxLength="14"
							required
							placeholder="Apenas números"
							value={formData.cnpj}
							onChange={handleChange}
							readOnly={isEditMode} 
						/>
					</div>
					<div className="form-group">
						<label htmlFor="razaoSocial">Razão Social:</label>
						<input
							type="text"
							id="razaoSocial"
							name="razaoSocial"
							required
							value={formData.razaoSocial}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="contatoPrincipal">Contato Principal:</label>
						<input
							type="text"
							id="contatoPrincipal"
							name="contatoPrincipal"
							value={formData.contatoPrincipal}
							onChange={handleChange}
						/>
					</div>
					
					<div className="form-actions">
						<button type="submit" className="btn btn-primary">
							Salvar Fornecedor
						</button>
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}
						>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}