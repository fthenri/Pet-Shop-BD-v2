'use client';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8080/api/dashboard';

export default function DashboardGlobalFilters({ filters, setFilters }) {
  const [produtos, setProdutos] = useState([]);
  const [atendentes, setAtendentes] = useState([]);

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const [resProdutos, resAtendentes] = await Promise.all([
          fetch(`${API_URL}/filtros/produtos`),
          fetch(`${API_URL}/filtros/atendentes`)
        ]);
        if (resProdutos.ok) setProdutos(await resProdutos.json());
        if (resAtendentes.ok) setAtendentes(await resAtendentes.json());
      } catch (error) {
        console.error("Erro ao carregar dados dos filtros:", error);
      }
    };
    fetchFilterData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value || null, 
    }));
  };

  const clearFilters = () => {
    setFilters({
      ano: null,
      mes: null,
      produtoId: null,
      atendenteId: null,
    });
  };

  return (
    <div className="global-filters">
      <div className="form-group">
        <label>Ano:</label>
        <input
          type="number"
          placeholder="Ex: 2023"
          value={filters.ano || ''}
          onChange={(e) => handleFilterChange('ano', e.target.value ? parseInt(e.target.value) : null)}
        />
      </div>

      <div className="form-group">
        <label>Mês:</label>
        <input
          type="text"
          placeholder="Ex: 2023-11"
          value={filters.mes || ''}
          onChange={(e) => handleFilterChange('mes', e.target.value)}
        />
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

      <button className="btn btn-secondary" onClick={clearFilters}>
        Limpar Filtros
      </button>
    </div>
  );
}