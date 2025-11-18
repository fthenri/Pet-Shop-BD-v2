'use client'; 

import { useState } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import styles from './consultas.module.css'; 
import { 
    FaDatabase, 
    FaUsers, 
    FaUserSlash, 
    FaExclamationTriangle, 
    FaBoxOpen, 
    FaArchive, 
    FaPaw, 
    FaUserMd,
    FaSearchDollar
} from 'react-icons/fa';

const consultasPredefinidas = [
	{
		nome: 'Veterinários e Atendentes',
        icon: <FaUserMd />,
        description: 'Lista todos os funcionários que são Veterinários ou Atendentes, simulando um "Full Join" com UNION.',
		query:
			"SELECT \n    F.nome,\n    F.cpf,\n    V.CRMV,\n    NULL AS 'Tipo_Atendente' \nFROM \n    Veterinario V\nJOIN \n    Funcionario F ON V.cod_funcionario = F.cod_funcionario\n\nUNION\n\nSELECT \n    F.nome,\n    F.cpf,\n    NULL AS 'CRMV', \n    A.cod_funcionario AS 'Tipo_Atendente'\nFROM \n    Atendente A\nJOIN \n    Funcionario F ON A.cod_funcionario = F.cod_funcionario;",
	},
	{
		nome: 'Clientes que Nunca Compraram',
        icon: <FaUserSlash />,
        description: 'Encontra clientes que se cadastraram, mas que nunca efetuaram uma compra (usando NOT IN).',
		query:
			'SELECT \n    cpf, \n    nome, \n    telefone1,\n    data_cadastro\nFROM \n    Cliente\nWHERE \n    cpf NOT IN (SELECT DISTINCT cpfCliente FROM Venda);',
	},
	{
		nome: 'Vendas com Estoque Baixo',
        icon: <FaExclamationTriangle />,
        description: 'Lista vendas que continham pelo menos um produto cujo estoque atual é baixo (usando EXISTS).',
		query:
			'SELECT \n    V.num_venda, \n    V.data_hora, \n    C.nome AS nome_cliente,\n    V.valor_total\nFROM \n    Venda V\nJOIN \n    Cliente C ON V.cpfCliente = C.cpf\nWHERE \n    EXISTS (\n        SELECT 1 \n        FROM contem co\n        JOIN Produto P ON co.cod_produto = P.cod_produto\n        WHERE \n            co.num_venda = V.num_venda \n            AND P.quantidade_estoque < 20\n    );',
	},
	{
		nome: 'Produtos Encalhados',
        icon: <FaArchive />,
        description: 'Encontra produtos que nunca foram vendidos (Anti-Join), ideal para gerenciar o inventário.',
		query:
			'SELECT\n  P.cod_produto,\n  P.nome_produto,\n  P.preco_venda,\n  P.quantidade_estoque,\n  F.razao_social AS nome_fornecedor\nFROM\n  Produto P\nLEFT JOIN\n  contem co ON P.cod_produto = co.cod_produto\nJOIN\n  Fornecedor F ON P.cnpjFornecedor = F.cnpj\nWHERE\n  co.num_venda IS NULL \nORDER BY\n  P.nome_produto;',
	},
	{
		nome: 'Produtos com Estoque Baixo (< 10)',
        icon: <FaBoxOpen />,
        description: 'Query simples (WHERE) para listar todos os produtos com 10 ou menos unidades em estoque.',
		query:
			'SELECT \n    cod_produto, \n    nome_produto, \n    quantidade_estoque \nFROM \n    Produto \nWHERE \n    quantidade_estoque < 10;',
	},
	{
		nome: 'Animais por Cliente (Exemplo)',
        icon: <FaPaw />,
        description: 'Exemplo de JOIN simples para listar todos os pets de um cliente específico (CPF 11122233344).',
		query:
			"SELECT \n    P.nome_pet AS nome_animal, \n    P.especie, \n    C.nome AS nome_dono \nFROM \n    Pet AS P \nJOIN \n    Cliente AS C ON P.cpfCliente = C.cpf \nWHERE \n    C.cpf = '11122233344';",
	},
	{
		nome: 'Contagem de Consultas por Vet',
        icon: <FaUserMd />,
        description: 'Agrupa (GROUP BY) e conta (COUNT) o número total de consultas realizadas por cada veterinário.',
		query:
			'SELECT \n    cod_funcionario, \n    COUNT(*) AS quantidade \nFROM \n    Consulta_Atende \nGROUP BY \n    cod_funcionario;',
	},
	{
		nome: 'Buscar Cliente por Nome',
        icon: <FaSearchDollar />,
        description: 'Exemplo de busca textual usando LIKE para encontrar clientes cujo nome contém "Silva".',
		query:
			"SELECT \n    cpf, \n    nome, \n    cidade \nFROM \n    Cliente \nWHERE \n    nome LIKE '%Silva%';",
	},
];

export default function ConsultasSQL() {
	const [query, setQuery] = useState(''); 
	const [resultado, setResultado] = useState(null); 
	const [erro, setErro] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
    const { showNotification } = useNotification();

	const API_URL = 'http://localhost:8080/api/consultas/executar';

    const handleCarregarQuery = (consulta) => {
        setQuery(consulta.query);
        showNotification({ 
            message: `${consulta.nome} carregada no editor!`, 
            type: 'info',
            duration: 2000 
        });
        
        // Foca no textarea
        const editor = document.getElementById('sql-query-input');
        if (editor) {
            editor.focus();
        }
    };

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
                <div className={styles.header}>
				    <FaDatabase />
                    <h2>Executor de Consultas SQL</h2>
                </div>
			</div>

            {/* SEÇÃO 1: BIBLIOTECA DE CARDS */}
            <h3 className={styles.subheading}>Biblioteca de Consultas</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-color-muted)' }}>
                Selecione uma consulta predefinida para carregar no editor abaixo.
            </p>
            <div className={styles.queryLibrary}>
                {consultasPredefinidas.map((consulta) => (
                    <div key={consulta.nome} className={styles.queryCard}>
                        <div className={styles.cardIcon}>{consulta.icon}</div>
                        <h4 className={styles.cardTitle}>{consulta.nome}</h4>
                        <p className={styles.cardDescription}>{consulta.description}</p>
                        <button
                            className={styles.cardButton}
                            onClick={() => handleCarregarQuery(consulta)} 
                        >
                            Carregar no Editor
                        </button>
                    </div>
                ))}
            </div>

            {/* SEÇÃO 2: EDITOR DE SQL */}
            <h3 className={styles.subheading}>Editor de SQL</h3>
            <div className={styles.editorSection}>
                <textarea
                    id="sql-query-input"
                    placeholder="Sua consulta SQL (Apenas SELECTs são permitidos)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    id="executar-query-btn"
                    className="btn btn-primary"
                    onClick={handleExecutar}
                    disabled={isLoading || !query} 
                >
                    {isLoading ? 'Executando...' : 'Executar'}
                </button>
            </div>

            {/* SEÇÃO 3: RESULTADO */}
			<div className="resultado-container" style={{ marginTop: '2rem' }}>
				<h3>Resultado</h3>
                
                {resultado && !erro && (
                    <p className={styles.resultInfo}>
                        Exibindo {resultado.length} resultados.
                    </p>
                )}

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

// Componente de renderização de resultado (sem alterações, apenas movido)
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

							return <td key={header}>{valorFormatado === null ? '-' : String(valorFormatado)}</td>;
						})}
					</tr>
				))}
			</tbody>
		</table>
	);
}