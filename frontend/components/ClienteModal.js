'use client';

import { useState, useEffect } from 'react';
import { useNotification } from 'ft-ui-react';

export default function ClienteModal({ onClose, onSave, clienteParaEditar }) {
	const API_URL = 'http://localhost:8080/api/clientes';
	
	const { showNotification } = useNotification();

	const [formData, setFormData] = useState({
		cpf: '',
		nome: '',
		telefone1: '',
		telefone2: '',
		logradouro: '',
		numero: '',
		bairro: '',
		cidade: '',
		estado: '',
		cep: '',
	});

	const isEditMode = Boolean(clienteParaEditar);
	const modalTitle = isEditMode ? 'Editar Cliente' : 'Cadastrar Novo Cliente';

	useEffect(() => {
		if (isEditMode) {
			setFormData({
				cpf: clienteParaEditar.cpf || '',
				nome: clienteParaEditar.nome || '',
				telefone1: clienteParaEditar.telefone1 || '',
				telefone2: clienteParaEditar.telefone2 || '',
				logradouro: clienteParaEditar.logradouro || '',
				numero: clienteParaEditar.numero || '',
				bairro: clienteParaEditar.bairro || '',
				cidade: clienteParaEditar.cidade || '',
				estado: clienteParaEditar.estado || '',
				cep: clienteParaEditar.cep || '',
			});
		} else {
			setFormData({
				cpf: '',
				nome: '',
				telefone1: '',
				telefone2: '',
				logradouro: '',
				numero: '',
				bairro: '',
				cidade: '',
				estado: '',
				cep: '',
			});
		}
	}, [clienteParaEditar, isEditMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault(); 

		const clienteData = {};
		for (const key in formData) {
			if (formData[key]) {
				clienteData[key] = formData[key];
			}
		}

		const url = isEditMode ? `${API_URL}/${clienteParaEditar.cpf}` : API_URL;
		const method = isEditMode ? 'PUT' : 'POST';

		try {
			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(clienteData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Erro ao salvar cliente');
			}

			showNotification({ 
                message: `Cliente ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`, 
                type: 'success' 
            }); 
			onSave();
		} catch (error) {
			console.error('Falha ao salvar cliente:', error);
			showNotification({ 
				message: `Não foi possível salvar o cliente: ${error.message}`, 
				type: 'error', duration: 6000 });
		}
	};

	return (
		<div id="cliente-modal" className="modal-overlay active">
			<div className="modal-content">
				<div className="modal-header">
					<h3>{modalTitle}</h3>
					<span className="close-button" onClick={onClose}>
						&times;
					</span>
				</div>
				<form id="form-cliente" onSubmit={handleSubmit}>
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
						<label htmlFor="telefone1">Telefone Principal:</label>
						<input
							type="tel"
							id="telefone1"
							name="telefone1"
							required
							value={formData.telefone1}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="telefone2">Telefone Secundário:</label>
						<input
							type="tel"
							id="telefone2"
							name="telefone2"
							value={formData.telefone2}
							onChange={handleChange}
						/>
					</div>
					<fieldset className="form-fieldset">
						<legend>Endereço</legend>
						<div className="form-grid">
							<div className="form-group grid-col-span-2">
								<label htmlFor="logradouro">Logradouro:</label>
								<input
									type="text"
									id="logradouro"
									name="logradouro"
									value={formData.logradouro}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="numero">Número:</label>
								<input
									type="text"
									id="numero"
									name="numero"
									value={formData.numero}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="bairro">Bairro:</label>
								<input
									type="text"
									id="bairro"
									name="bairro"
									value={formData.bairro}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cidade">Cidade:</label>
								<input
									type="text"
									id="cidade"
									name="cidade"
									value={formData.cidade}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="estado">Estado:</label>
								<input
									type="text"
									id="estado"
									name="estado"
									maxLength="2"
									placeholder="Ex: PE"
									value={formData.estado}
									onChange={handleChange}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="cep">CEP:</label>
								<input
									type="text"
									id="cep"
									name="cep"
									maxLength="8"
									placeholder="Apenas números"
									value={formData.cep}
									onChange={handleChange}
								/>
							</div>
						</div>
					</fieldset>
					<div className="form-actions">
						<button type="submit" className="btn btn-primary">
							Salvar Cliente
						</button>
						<button type="reset" className="btn btn-secondary" onClick={onClose}>
							Cancelar
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}