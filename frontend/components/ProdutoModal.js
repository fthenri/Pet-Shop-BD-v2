'use client';

import { useState, useEffect } from 'react';
import { useNotification } from 'ft-ui-react';

export default function ProdutoModal({ onClose, onSave, produtoParaEditar }) {
	const API_URL = 'http://localhost:8080/api/produtos';
    const { showNotification } = useNotification(); 

	const [formData, setFormData] = useState({
		nomeProduto: '',
		descricao: '',
		precoVenda: '',
		quantidadeEstoque: '',
		cnpjFornecedor: '', 
	});

	const isEditMode = Boolean(produtoParaEditar);
	const modalTitle = isEditMode ? 'Editar Produto' : 'Cadastrar Novo Produto';

	useEffect(() => {
		if (isEditMode) {
			setFormData({
				nomeProduto: produtoParaEditar.nome_produto || '',
				descricao: produtoParaEditar.descricao || '',
				precoVenda: produtoParaEditar.preco_venda || '',
				quantidadeEstoque: produtoParaEditar.quantidade_estoque || '',
				cnpjFornecedor: produtoParaEditar.cnpjFornecedor || '',
			});
		} else {
			setFormData({
				nomeProduto: '',
				descricao: '',
				precoVenda: '',
				quantidadeEstoque: '',
				cnpjFornecedor: '',
			});
		}
	}, [produtoParaEditar, isEditMode]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const produtoData = {
			nome_produto: formData.nomeProduto,
			descricao: formData.descricao,
			preco_venda: parseFloat(formData.precoVenda),
			quantidade_estoque: parseInt(formData.quantidadeEstoque),
			cnpjFornecedor: formData.cnpjFornecedor,
		};

		const url = isEditMode
			? `${API_URL}/${produtoParaEditar.cod_produto}`
			: API_URL;
		const method = isEditMode ? 'PUT' : 'POST';

		try {
			const response = await fetch(url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(produtoData),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || 'Erro ao salvar produto');
			}

            showNotification({ 
                message: `Produto ${isEditMode ? 'atualizado' : 'cadastrado'} com sucesso!`, 
                type: 'success' 
            }); 
			onSave();
		} catch (error) {
			console.error('Falha ao salvar produto:', error);
            showNotification({ message: `Não foi possível salvar o produto: ${error.message}`, type: 'error', duration: 6000 });
		}
	};

	return (
		<div id="produto-modal" className="modal-overlay active">
			<div className="modal-content">
				<div className="modal-header">
					<h3>{modalTitle}</h3>
					<span className="close-button" onClick={onClose}>
						&times;
					</span>
				</div>
				<form id="form-produto" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="nomeProduto">Nome do Produto:</label>
						<input
							type="text"
							id="nomeProduto"
							name="nomeProduto" 
							required
							value={formData.nomeProduto}
							onChange={handleChange}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="descricao">Descrição:</label>
						<textarea
							id="descricao"
							name="descricao" 
							rows="3"
							value={formData.descricao}
							onChange={handleChange}
						></textarea>
					</div>
					<div className="form-grid">
						<div className="form-group">
							<label htmlFor="precoVenda">Preço de Venda (R$):</label>
							<input
								type="number"
								id="precoVenda"
								name="precoVenda" 
								step="0.01"
								min="0"
								required
								placeholder="Ex: 189.90"
								value={formData.precoVenda}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="quantidadeEstoque">Qtd. em Estoque:</label>
							<input
								type="number"
								id="quantidadeEstoque"
								name="quantidadeEstoque" 
								min="0"
								required
								placeholder="Ex: 50"
								value={formData.quantidadeEstoque}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label htmlFor="cnpjFornecedor">CNPJ do Fornecedor:</label>
							<input
								type="text"
								id="cnpjFornecedor"
								name="cnpjFornecedor" 
								maxLength="14"
								required
								placeholder="Apenas números"
								value={formData.cnpjFornecedor}
								onChange={handleChange}
							/>
						</div>
					</div>
					<div className="form-actions">
						<button type="submit" className="btn btn-primary">
							Salvar Produto
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