'use client';
import { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useNotification } from '../../contexts/NotificationContext';
import { FaTrash } from 'react-icons/fa'; // Importar o ícone de lixeira
import styles from './vendas.module.css'; // Importar o novo CSS Module

const API_URL_VENDAS = 'http://localhost:8080/api/vendas';
const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';
const API_URL_FUNCIONARIOS = 'http://localhost:8080/api/funcionarios/geral';
const API_URL_PRODUTOS = 'http://localhost:8080/api/produtos';

export default function VendasPage() {
    const { showNotification } = useNotification();

    // Estados para dados principais
    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [produtos, setProdutos] = useState([]);
    
    // Estados da Venda
    const [carrinho, setCarrinho] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedFuncionario, setSelectedFuncionario] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('Cartão de Crédito');
    
    // Novo estado para a busca de produtos
    const [buscaProduto, setBuscaProduto] = useState('');
    
    // Estados de UI
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    
    const carregarProdutos = useCallback(async () => {
        try {
            const resProdutos = await fetch(API_URL_PRODUTOS);
            if (!resProdutos.ok) {
                 const errorText = await resProdutos.text();
                 throw new Error(errorText || 'Falha ao recarregar produtos');
            }
            const dataProdutos = await resProdutos.json();
            setProdutos(dataProdutos);
        } catch (error) {
             showNotification({ message: `Erro ao atualizar lista de produtos: ${error.message}`, type: 'error' });
        }
    }, [showNotification]); 


    useEffect(() => {
        const carregarDadosIniciais = async () => {
            setIsLoadingData(true);
            try {
                const [resClientes, resFuncionarios] = await Promise.all([
                    fetch(API_URL_CLIENTES),
                    fetch(API_URL_FUNCIONARIOS)
                ]);
                
                const dataClientes = await resClientes.json();
                const dataFuncionarios = await resFuncionarios.json();

                setClientes(dataClientes);
                setFuncionarios(dataFuncionarios.filter(f => f.tipo === 'Atendente'));
                
                await carregarProdutos(); 

            } catch (error) {
                showNotification({ message: `Erro ao carregar dados: ${error.message}`, type: 'error' });
            } finally {
                setIsLoadingData(false);
            }
        };
        
        carregarDadosIniciais();
    }, [showNotification, carregarProdutos]);

    // --- LÓGICA DO CARRINHO ATUALIZADA ---

    // 1. Memo para filtrar produtos na busca (Autocomplete)
    const produtosFiltrados = useMemo(() => {
        if (!buscaProduto) return [];
        return produtos
            .filter(p => 
                p.nome_produto.toLowerCase().includes(buscaProduto.toLowerCase())
            )
            .slice(0, 7); // Limitar a 7 resultados para performance
    }, [buscaProduto, produtos]);

    // 2. Nova função para ATUALIZAR quantidade (chamada pelo input no carrinho)
    const handleAtualizarQuantidade = useCallback((codProduto, quantidadeStr) => {
        const quantidade = parseInt(quantidadeStr, 10);

        setCarrinho(carrinhoAtual => 
            carrinhoAtual.map(item => {
                if (item.cod_produto === codProduto) {
                    if (isNaN(quantidade) || quantidade < 1) {
                        return { ...item, quantidadeVenda: 1 }; // Reseta para 1 se inválido
                    }
                    
                    const produtoEstoque = produtos.find(p => p.cod_produto === codProduto)?.quantidade_estoque || 0;
                    
                    if (quantidade > produtoEstoque) {
                        showNotification({ 
                            message: `Estoque máximo para ${item.nome_produto}: ${produtoEstoque} unidades.`, 
                            type: 'error', 
                            duration: 2000 
                        });
                        return { ...item, quantidadeVenda: produtoEstoque }; // Capa no estoque
                    }
                    
                    return { ...item, quantidadeVenda: quantidade };
                }
                return item;
            })
        );
    }, [produtos, showNotification]);

    // 3. Nova função para ADICIONAR produto (chamada pelo clique no autocomplete)
    const handleAdicionarProduto = (produto) => {
        const itemExistente = carrinho.find(item => item.cod_produto === produto.cod_produto);
        const produtoEstoque = produto.quantidade_estoque || 0;

        if (itemExistente) {
            const novaQuantidade = itemExistente.quantidadeVenda + 1;
            if (novaQuantidade > produtoEstoque) {
                showNotification({ message: `Estoque máximo (${produtoEstoque}) atingido para este item.`, type: 'error', duration: 2000 });
            } else {
                handleAtualizarQuantidade(produto.cod_produto, novaQuantidade);
            }
        } else {
            if (1 > produtoEstoque) {
                showNotification({ message: `Produto ${produto.nome_produto} está fora de estoque.`, type: 'error' });
            } else {
                setCarrinho(carrinhoAtual => [...carrinhoAtual, { 
                    ...produto, 
                    quantidadeVenda: 1 
                }]);
            }
        }
        setBuscaProduto(''); // Limpa a busca
    };


    const handleRemoverDoCarrinho = (cod_produto) => {
        setCarrinho(carrinho.filter(item => item.cod_produto !== cod_produto));
    };

    const totalVenda = useMemo(() => {
        return carrinho.reduce((total, item) => {
            const preco = typeof item.preco_venda === 'string' 
                ? parseFloat(item.preco_venda.replace(',', '.')) 
                : item.preco_venda;
            return total + (preco * (item.quantidadeVenda || 1)); // Garante que não é NaN
        }, 0);
    }, [carrinho]);


    const handleSubmitVenda = async (e) => {
        e.preventDefault();
        if (!selectedCliente || !selectedFuncionario || carrinho.length === 0) {
            showNotification({ message: 'Preencha Cliente, Atendente e adicione itens ao carrinho.', type: 'error' });
            return;
        }

        setIsSubmitting(true);

        const vendaDTO = {
            cpfCliente: selectedCliente,
            codFuncionario: parseInt(selectedFuncionario),
            formaPagamento: formaPagamento,
            itens: carrinho.map(item => ({
                codProduto: item.cod_produto,
                quantidade: item.quantidadeVenda
            }))
        };

        try {
            const response = await fetch(API_URL_VENDAS, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vendaDTO)
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.message || 'Erro ao registrar venda.');
            }

            const valorTotalFormatado = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(responseData.valorTotal);
            showNotification({ message: `Venda N° ${responseData.numVenda} registrada! Total: ${valorTotalFormatado}`, type: 'success' });
            
            // Limpa o formulário
            setCarrinho([]);
            setSelectedCliente('');
            setSelectedFuncionario('');
            setFormaPagamento('Cartão de Crédito');
            setBuscaProduto('');

            await carregarProdutos(); // Recarrega o estoque

        } catch (error) {
            console.error('Falha ao registrar venda:', error);
            showNotification({ message: `Falha: ${error.message}`, type: 'error', duration: 6000 });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingData) {
        return <p>Carregando dados do PDV...</p>;
    }

    return (
        <section id="vendas-section" className="content-section">
            <div className="section-header">
                <h2>Caixa da Loja (Venda de Produtos)</h2>
            </div>
            
            {/* O layout principal agora é um grid de 2 colunas */}
            <form onSubmit={handleSubmitVenda} className={styles.pdvContainer}>
                
                {/* COLUNA ESQUERDA - CARRINHO E TOTAL */}
                <div className={styles.colunaCarrinho}>
                    <h3>Itens da Venda</h3>
                    <div className={styles.tabelaContainer}>
                        {carrinho.length === 0 ? (
                            <p className={styles.carrinhoVazio}>Nenhum item no carrinho.</p>
                        ) : (
                            <table className={`data-table ${styles.tabelaCarrinho}`}>
                                <thead>
                                    <tr>
                                        <th>Produto</th>
                                        <th>Preço Unit.</th>
                                        <th>Qtd.</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {carrinho.map(item => {
                                        const preco = typeof item.preco_venda === 'string' 
                                            ? parseFloat(item.preco_venda.replace(',', '.')) 
                                            : item.preco_venda;
                                        const subtotal = preco * item.quantidadeVenda;
                                        
                                        return (
                                            <tr key={item.cod_produto}>
                                                <td>{item.nome_produto}</td>
                                                <td>{preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td>
                                                    {/* PROPOSTA 2: Input de quantidade */}
                                                    <input
                                                        type="number"
                                                        className={styles.qtyInput}
                                                        value={item.quantidadeVenda}
                                                        onChange={(e) => handleAtualizarQuantidade(item.cod_produto, e.target.value)}
                                                        min="1"
                                                        step="1"
                                                    />
                                                </td>
                                                <td>{subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                                <td>
                                                    <button 
                                                        type="button" 
                                                        className={`btn-delete ${styles.deleteBtn}`} 
                                                        onClick={() => handleRemoverDoCarrinho(item.cod_produto)}
                                                        title="Remover item"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>
                    
                    {/* Footer da Coluna do Carrinho: Pagamento e Total */}
                    <div className={styles.footerCarrinho}>
                        <div className="form-group" style={{ maxWidth: '300px' }}>
                            <label htmlFor="pagamento">Forma de Pagamento</label>
                            <select id="pagamento" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                                <option>Cartão de Crédito</option>
                                <option>Cartão de Débito</option>
                                <option>PIX</option>
                                <option>Dinheiro</option>
                            </select>
                        </div>

                        {/* PROPOSTA 3: Display de Total destacado */}
                        <div className={styles.totalDisplay}>
                            <span>TOTAL</span>
                            <h2>
                                {totalVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </h2>
                        </div>
                    </div>
                </div>


                {/* COLUNA DIREITA - AÇÕES E FINALIZAÇÃO */}
                <div className={styles.colunaAcoes}>
                    <fieldset className="form-fieldset">
                        <legend>1. Informações da Venda</legend>
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
                            <label htmlFor="atendente">Atendente*</label>
                            <select id="atendente" value={selectedFuncionario} onChange={e => setSelectedFuncionario(e.target.value)} required>
                                <option value="">Selecione um Atendente</option>
                                {funcionarios.map(f => (
                                    <option key={f.codFuncionario} value={f.codFuncionario}>{f.nome}</option>
                                ))}
                            </select>
                        </div>
                    </fieldset>

                    <fieldset className="form-fieldset">
                        <legend>2. Adicionar Produto</legend>
                        {/* PROPOSTA 1: Busca Autocomplete */}
                        <div className={`form-group ${styles.autocompleteWrapper}`}>
                            <label htmlFor="produto">Buscar Produto*</label>
                            <input
                                id="produto"
                                type="text"
                                placeholder="Digite o nome do produto..."
                                value={buscaProduto}
                                onChange={e => setBuscaProduto(e.target.value)}
                                autoComplete="off"
                            />
                            {/* Lista de resultados */}
                            {produtosFiltrados.length > 0 && (
                                <div className={styles.autocompleteList}>
                                    {produtosFiltrados.map(p => (
                                        <div 
                                            key={p.cod_produto} 
                                            className={styles.autocompleteItem}
                                            onClick={() => handleAdicionarProduto(p)}
                                        >
                                            {p.nome_produto} 
                                            <span className={styles.itemInfo}>
                                                (R$ {parseFloat(p.preco_venda).toFixed(2)} | Estoque: {p.quantidade_estoque})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </fieldset>
                    
                    <button 
                        type="submit" 
                        className={`btn btn-primary ${styles.finalizarBtn}`} 
                        disabled={isSubmitting || carrinho.length === 0}
                    >
                        {isSubmitting ? 'Registrando...' : 'Finalizar Venda'}
                    </button>
                </div>
            </form>
        </section>
    );
}