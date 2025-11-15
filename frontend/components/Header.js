'use client'; 

import Link from 'next/link';

export default function Header() {
  return (
    <header className="main-header">
      <h1 className="project-title">Pet Shop</h1>
      <nav className="main-nav">
        <ul>
          <li><Link href="/">Dashboard</Link></li>
          <li><Link href="/clientes">Gerenciar Clientes</Link></li>
          <li><Link href="/produtos">Gerenciar Produtos</Link></li>
          <li><Link href="/fornecedores">Gerenciar Fornecedores</Link></li>
          <li><Link href="/consultas">Consultas SQL</Link></li>
          <li><Link href="/auditoria">Auditoria</Link></li>
        </ul>
      </nav>
    </header>
  );
}