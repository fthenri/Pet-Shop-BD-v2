'use client';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/dashboard';

export default function DashboardGlobalFilters({ filters, setFilters, onClearFilters }) {
  const [produtos, setProdutos] = useState([]);
  const [atendentes, setAtendentes] = useState([]);
  const [anos, setAnos] = useState([]); 
  const [meses, setMeses] = useState([]); 

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [resProdutos, resAtendentes, resAnos] = await Promise.all([
          fetch(`${API_URL}/filtros/produtos`),
          fetch(`${API_URL}/filtros/atendentes`),
          fetch(`${API_URL}/filtros/anos`) 
        ]);
        if (resProdutos.ok) setProdutos(await resProdutos.json());
        if (resAtendentes.ok) setAtendentes(await resAtendentes.json());
        if (resAnos.ok) setAnos(await resAnos.json()); 
      } catch (error) {
        console.error("Erro ao carregar dados dos filtros:", error);
      }
    };
    fetchFilterData();
  }, []); 

  useEffect(() => {
    const fetchMeses = async () => {
      if (filters.ano) {
        try {
          const resMeses = await fetch(`${API_URL}/filtros/meses?ano=${filters.ano}`);
          if (resMeses.ok) {
            setMeses(await resMeses.json());
          }
        } catch (error) {
          console.error("Erro ao carregar meses:", error);
          setMeses([]);
        }
      } else {
        setMeses([]); 
      }
    };
    fetchMeses();
  }, [filters.ano]); 

  const handleFilterChange = (key, value) => {
    setFilters(key, value || null); 
  };

  return (
    <div className="global-filters">
      
      <div className="form-group">
        <label>Ano:</label>
        <select
          value={filters.ano || ''}
          onChange={(e) => handleFilterChange('ano', e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">Todos os Anos</option>
          {anos.map(a => (
            <option key={a.ano} value={a.ano}>
              {a.ano}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Mês:</label>
        <select
          value={filters.mes || ''}
          onChange={(e) => handleFilterChange('mes', e.target.value)}
          disabled={!filters.ano} // Desabilita se o ano não estiver selecionado
        >
          <option value="">Todos os Meses</option>
          {meses.map(m => (
            <option key={m.mes} value={m.mes}>
              {m.mes}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Produto:</label>
        <select
          value={filters.produtoId || ''}
          onChange={(e) => handleFilterChange('produtoId', e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">Todos os Produtos</option>
          {produtos.map(p => (
            <option key={p.cod_produto} value={p.cod_produto}>
              {p.nome_produto}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Atendente:</label>
        <select
          value={filters.atendenteId || ''}
          onChange={(e) => handleFilterChange('atendenteId', e.target.value ? parseInt(e.target.value) : null)}
        >
          <option value="">Todos os Atendentes</option>
          {atendentes.map(a => (
            <option key={a.cod_funcionario} value={a.cod_funcionario}>
              {a.nome}
            </option>
          ))}
        </select>
      </div>

      <button className="btn btn-secondary" onClick={onClearFilters}>
        Limpar Filtros
      </button>
    </div>
  );
}