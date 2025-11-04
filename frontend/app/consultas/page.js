'use client'; 

import { useState } from 'react';

const consultasPredefinidas = [
	{
		nome: 'Produtos com Estoque Baixo',
		query:
			'SELECT cod_produto, nome_produto, quantidade_estoque FROM Produto WHERE quantidade_estoque < 10;',
	},
	{
		nome: 'Animais por Cliente (JOIN)',
		query:
			"SELECT P.nome_pet AS nome_animal, P.especie, C.nome AS nome_dono FROM Pet AS P JOIN Cliente AS C ON P.cpfCliente = C.cpf WHERE C.cpf = '11122233344';",
	},
	{
		nome: 'Contagem de Consultas por Veterinário',
		query:
			'SELECT cod_funcionario, COUNT(*) AS quantidade FROM Consulta_Atende GROUP BY cod_funcionario;',
	},
	{
		nome: "Buscar Cliente por Nome",
		query: "SELECT cpf, nome, cidade FROM Cliente WHERE nome LIKE '%Silva%';",
	},
];

export default function ConsultasSQL() {
	const [query, setQuery] = useState(''); 
	const [resultado, setResultado] = useState(null); 
	const [erro, setErro] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const API_URL = 'http://localhost:8080/api/consultas/executar';

	const handleExecutar = async () => {
		setIsLoading(true);
		setResultado(null);
		setErro(null);

		try {
			const response = await fetch(API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ query: query }),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(errorText || 'Erro ao executar a consulta.');
			}

			const data = await response.json();
			setResultado(data);
		} catch (error) {
			console.error('Falha ao executar consulta:', error);
			setErro(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<section id="sql-consultas-section" className="content-section">
			<div className="section-header">
				<h2>Executar Consultas SQL</h2>
			</div>

			<div className="consulta-container">
				<p>
					Selecione uma consulta pré-definida ou escreva sua própria SQL na
					caixa de texto abaixo.
				</p>
				<div className="botoes-consulta">
					{consultasPredefinidas.map((consulta) => (
						<button
							key={consulta.nome}
							className="btn btn-secondary"
							onClick={() => setQuery(consulta.query)} 
						>
							{consulta.nome}
						</button>
					))}
				</div>
				<div className="query-editor">
					<textarea
						id="sql-query-input"
						placeholder="Sua consulta SQL..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					<button
						id="executar-query-btn"
						className="btn btn-primary"
						onClick={handleExecutar}
						disabled={isLoading} 
					>
						{isLoading ? 'Executando...' : 'Executar'}
					</button>
				</div>
			</div>

			<div className="resultado-container">
				<h3>Resultado</h3>
				<div id="resultado-output" className="table-container">
					<RenderizarResultado
						isLoading={isLoading}
						erro={erro}
						resultado={resultado}
					/>
				</div>
			</div>
		</section>
	);
}

function RenderizarResultado({ isLoading, erro, resultado }) {
	if (isLoading) {
		return <p>Executando...</p>;
	}

	if (erro) {
		return <p style={{ color: 'red' }}><b>Erro:</b> {erro}</p>;
	}

	if (!resultado) {
		return <p>O resultado da sua consulta aparecerá aqui.</p>;
	}

	if (resultado.length === 0) {
		return <p>Nenhum resultado encontrado.</p>;
	}

	const headers = Object.keys(resultado[0]);

	const formatarHeader = (header) => {
		return header
			.replace(/_/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());
	};

	return (
		<table className="data-table">
			<thead>
				<tr>
					{headers.map((header) => (
						<th key={header}>{formatarHeader(header)}</th>
					))}
				</tr>
			</thead>
			<tbody>
				{resultado.map((linha, index) => (
					<tr key={index}>
						{headers.map((header) => {
							const valor = linha[header];
							let valorFormatado = valor;
							if (
								typeof valor === 'string' &&
								valor.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
							) {
								valorFormatado = new Date(valor).toLocaleString('pt-BR');
							}

							return <td key={header}>{valorFormatado === null ? '-' : valorFormatado}</td>;
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}