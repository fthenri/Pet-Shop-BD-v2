'use client';
import { useState, useEffect, useMemo, useCallback } from 'react'; 
import { useNotification } from '../../contexts/NotificationContext';

const API_URL_VENDAS = 'http://localhost:8080/api/vendas';
const API_URL_CLIENTES = 'http://localhost:8080/api/clientes';
const API_URL_FUNCIONARIOS = 'http://localhost:8080/api/funcionarios/geral';
const API_URL_PRODUTOS = 'http://localhost:8080/api/produtos';

export default function VendasPage() {
    const { showNotification } = useNotification();

    const [clientes, setClientes] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    const [selectedCliente, setSelectedCliente] = useState('');
    const [selectedFuncionario, setSelectedFuncionario] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('Cartão de Crédito');
    const [selectedProduto, setSelectedProduto] = useState('');
    const [selectedQuantidade, setSelectedQuantidade] = useState(1);
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

    const handleAdicionarAoCarrinho = (e) => {
        e.preventDefault(); 
        if (!selectedProduto || selectedQuantidade <= 0) {
            showNotification({ message: 'Selecione um produto e uma quantidade válida.', type: 'error' });
            return;
        }

        const produtoInfo = produtos.find(p => p.cod_produto === parseInt(selectedProduto));
        if (!produtoInfo) return;

        const itemExistente = carrinho.find(item => item.cod_produto === produtoInfo.cod_produto);

        if (itemExistente) {
            setCarrinho(carrinho.map(item =>
                item.cod_produto === produtoInfo.cod_produto
                    ? { ...item, quantidadeVenda: item.quantidadeVenda + selectedQuantidade }
                    : item
            ));
        } else {
            setCarrinho([...carrinho, { 
                ...produtoInfo, 
                quantidadeVenda: selectedQuantidade 
            }]);
        }
        
        setSelectedProduto('');
        setSelectedQuantidade(1);
    };

    const handleRemoverDoCarrinho = (cod_produto) => {
        setCarrinho(carrinho.filter(item => item.cod_produto !== cod_produto));
    };

    const totalVenda = useMemo(() => {
        return carrinho.reduce((total, item) => {
            const preco = typeof item.preco_venda === 'string' 
                ? parseFloat(item.preco_venda.replace(',', '.')) 
                : item.preco_venda;
            return total + (preco * item.quantidadeVenda);
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
            
            setCarrinho([]);
            setSelectedCliente('');
            setSelectedFuncionario('');
            setFormaPagamento('Cartão de Crédito');

            await carregarProdutos(); 

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
                <h2>Registrar Venda (PDV)</h2>
            </div>
            
            <form onSubmit={handleSubmitVenda} className="pdv-form">
                
                <div className="form-grid" style={{ marginBottom: '1.5rem' }}>
                    <div className="form-group">
                        <label htmlFor="cliente">Cliente</label>
                        <select id="cliente" value={selectedCliente} onChange={e => setSelectedCliente(e.target.value)} required>
                            <option value="">Selecione um Cliente</option>
                            {clientes.map(c => (
                                <option key={c.cpf} value={c.cpf}>{c.nome}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="atendente">Atendente</label>
                        <select id="atendente" value={selectedFuncionario} onChange={e => setSelectedFuncionario(e.target.value)} required>
                            <option value="">Selecione um Atendente</option>
                            {funcionarios.map(f => (
                                <option key={f.codFuncionario} value={f.codFuncionario}>{f.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <fieldset className="form-fieldset" style={{ marginBottom: '1.5rem' }}>
                    <legend>Adicionar Produto</legend>
                    
                    <div className="form-grid" style={{ alignItems: 'flex-end', gridTemplateColumns: '4fr 1fr auto' }}>
                        <div className="form-group" style={{ flex: 4 }}>
                            <label htmlFor="produto">Produto</label>
                            <select id="produto" value={selectedProduto} onChange={e => setSelectedProduto(e.target.value)}>
                                <option value="">Selecione um Produto</option>
                                {produtos.map(p => (
                                    <option key={p.cod_produto} value={p.cod_produto}>
                                        {p.nome_produto} (R$ {parseFloat(p.preco_venda).toFixed(2)}) - Estoque: {p.quantidade_estoque}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label htmlFor="quantidade">Qtd.</label>
                            <input
                                id="quantidade"
                                type="number"
                                value={selectedQuantidade}
                                onChange={e => setSelectedQuantidade(parseInt(e.target.value) || 1)}
                                min="1"
                                step="1"
                            />
                        </div>
                        <button 
                            type="button" 
                            onClick={handleAdicionarAoCarrinho} 
                            className="btn btn-secondary"
                        >
                            Adicionar
                        </button>
                    </div> 
                </fieldset>
                
                <div className="table-container" style={{ marginBottom: '1.5rem' }}>
                    <h3>Itens da Venda</h3>
                    {carrinho.length === 0 ? (
                        <p>Nenhum item no carrinho.</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Produto</th>
                                    <th>Qtd.</th>
                                    <th>Preço Unit.</th>
                                    <th>Subtotal</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {carrinho.map(item => {
                                    const preco = typeof item.preco_venda === 'string' 
                                        ? parseFloat(item.preco_venda.replace(',', '.')) 
                                        : item.preco_venda;
                                    
                                    return (
                                        <tr key={item.cod_produto}>
                                            <td>{item.nome_produto}</td>
                                            <td>{item.quantidadeVenda}</td>
                                            <td>{preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                            <td>{(preco * item.quantidadeVenda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                            <td>
                                                <button type="button" className="btn-delete" onClick={() => handleRemoverDoCarrinho(item.cod_produto)}>
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="pdv-footer" style={{ borderTop: '1px solid var(--table-border)', paddingTop: '1.5rem' }}>
                    <div className="form-group" style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
                        <label htmlFor="pagamento">Forma de Pagamento</label>
                        <select id="pagamento" value={formaPagamento} onChange={e => setFormaPagamento(e.target.value)}>
                            <option>Cartão de Crédito</option>
                            <option>Cartão de Débito</option>
                            <option>PIX</option>
                            <option>Dinheiro</option>
                        </select>
                    </div>

                    <div className="total-display" style={{ margin: '1.5rem 0', textAlign: 'right' }}>
                        <h2 style={{ color: 'var(--text-color)' }}>
                            Total: {totalVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </h2>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isSubmitting || carrinho.length === 0} style={{ width: '100%', padding: '1rem' }}>
                        {isSubmitting ? 'Registrando...' : 'Finalizar Venda'}
                    </button>
                </div>
            </form>
        </section>
    );
}