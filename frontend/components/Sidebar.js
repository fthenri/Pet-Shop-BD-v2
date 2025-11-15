'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// tarefa: importar icones (SVGs ou uma biblioteca como react-icons)
// usando placeholders por enquanto
const IconDashboard = () => <span>🏠</span>;
const IconGestao = () => <span>🗂️</span>;
const IconGraficos = () => <span>📊</span>;
const IconSQL = () => <span>🗃️</span>;
const IconAuditoria = () => <span>🔎</span>;
const IconConfig = () => <span>⚙️</span>;
const IconSubmenu = () => <span>-</span>;


export default function Sidebar() {
    const [isGestaoOpen, setIsGestaoOpen] = useState(false);
    const pathname = usePathname();

    const toggleGestao = () => {
        setIsGestaoOpen(!isGestaoOpen);
    };

    const isActive = (path) => pathname === path;
    const isSubmenuActive = (paths) => paths.some(path => pathname.startsWith(path));

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <h1 className="project-title">Pet Shop</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {/* dashboard */}
                    <li className="nav-item">
                        <Link href="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                            <IconDashboard />
                            <span>Dashboard</span>
                        </Link>
                    </li>

                    {/* gestão (dropdown) */}
                    <li className="nav-item">
                        <a 
                            className={`nav-link nav-toggle ${isSubmenuActive(['/clientes', '/produtos', '/fornecedores']) ? 'active' : ''}`} 
                            onClick={toggleGestao}
                            style={{ cursor: 'pointer' }}
                        >
                            <IconGestao />
                            <span>Gestão</span>
                            <span className={`arrow ${isGestaoOpen ? 'open' : ''}`}>▼</span>
                        </a>
                        <ul className={`nav-submenu ${isGestaoOpen ? 'open' : ''}`}>
                            <li>
                                <Link href="/clientes" className={isActive('/clientes') ? 'active-sub' : ''}>
                                    <IconSubmenu /> Gerenciar Clientes
                                </Link>
                            </li>
                            <li>
                                <Link href="/produtos" className={isActive('/produtos') ? 'active-sub' : ''}>
                                    <IconSubmenu /> Gerenciar Produtos
                                </Link>
                            </li>
                            <li>
                                <Link href="/fornecedores" className={isActive('/fornecedores') ? 'active-sub' : ''}>
                                    <IconSubmenu /> Gerenciar Fornecedores
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* graficos estaticos */}
                    <li className="nav-item">
                        <Link href="/graficos" className={`nav-link ${isActive('/graficos') ? 'active' : ''}`}>
                            <IconGraficos />
                            <span>Gráficos (Est)</span>
                        </Link>
                    </li>
                    
                    {/* consultas SQL */}
                    <li className="nav-item">
                        <Link href="/consultas" className={`nav-link ${isActive('/consultas') ? 'active' : ''}`}>
                            <IconSQL />
                            <span>Consultas SQL</span>
                        </Link>
                    </li>

                    {/* auditoria */}
                    <li className="nav-item">
                        <Link href="/auditoria" className={`nav-link ${isActive('/auditoria') ? 'active' : ''}`}>
                            <IconAuditoria />
                            <span>Auditoria</span>
                        </Link>
                    </li>
                    
                    {/* configurações */}
                    <li className="nav-item">
                        <Link href="/configuracoes" className={`nav-link ${isActive('/configuracoes') ? 'active' : ''}`}>
                            <IconConfig />
                            <span>Configurações</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}