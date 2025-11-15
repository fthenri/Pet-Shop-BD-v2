'use client';

export default function ProdutosEncalhadosTable({ tableData }) {
  return (
    <div>
      <h4 style={{ textAlign: 'center', marginBottom: '1rem' }}>
        Produtos Encalhados (Nunca Vendidos)
      </h4>
      <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Cód.</th>
              <th>Nome do Produto</th>
              <th>Estoque</th>
            </tr>
          </thead>
          <tbody>
            {!tableData ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Carregando...</td>
              </tr>
            ) : tableData.length === 0 ? (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center' }}>Nenhum produto encalhado!</td>
              </tr>
            ) : (
              tableData.map(item => (
                <tr key={item.cod_produto}>
                  <td>{item.cod_produto}</td>
                  <td>{item.nome_produto}</td>
                  <td>{item.quantidade_estoque}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}