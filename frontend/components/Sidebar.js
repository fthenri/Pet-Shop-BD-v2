'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { 
    FaHome, 
    FaBoxOpen, 
    FaChartBar, 
    FaDatabase, 
    FaSearch, 
    FaCog, 
    FaUsers, 
    FaStore, 
    FaTruck,
    FaChevronRight,
    FaChevronDown,
    FaPaw,
    FaUserFriends,
    FaUsersCog,
    FaCashRegister,
    FaStethoscope 
} from 'react-icons/fa';


export default function Sidebar() {
    const [isGestaoOpen, setIsGestaoOpen] = useState(true);
    const pathname = usePathname();

    const toggleGestao = () => {
        setIsGestaoOpen(!isGestaoOpen);
    };

    const isActive = (path) => pathname === path;
    const isSubmenuActive = (paths) => paths.some(path => pathname.startsWith(path));

    useEffect(() => {
        if (isSubmenuActive(['/clientes', '/produtos', '/fornecedores', '/pets', '/funcionarios'])) {
            setIsGestaoOpen(true);
        }
    }, [pathname]);

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
                            <FaHome />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    
                    {/* vendas */}
                    <li className="nav-item">
                        <Link href="/vendas" className={`nav-link ${isActive('/vendas') ? 'active' : ''}`}>
                            <FaCashRegister />
                            <span>Caixa (Produtos)</span>
                        </Link>
                    </li>
                    
                    {/* consultas e serviços */}
                    <li className="nav-item">
                        <Link href="/consultas-servicos" className={`nav-link ${isActive('/consultas-servicos') ? 'active' : ''}`}>
                            <FaStethoscope />
                            <span>Registrar Serviço</span>
                        </Link>
                    </li>

                    {/* gestão (dropdown) */}
                    <li className="nav-item">
                        <a 
                            className={`nav-link nav-toggle ${isSubmenuActive(['/clientes', '/produtos', '/fornecedores', '/pets', '/funcionarios']) ? 'active' : ''}`} 
                            onClick={toggleGestao}
                            style={{ cursor: 'pointer' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <FaBoxOpen />
                                <span>Gestão</span>
                            </div>
                            
                            {isGestaoOpen ? <FaChevronDown /> : <FaChevronRight />}
                        </a>
                        
                        <ul className={`nav-submenu ${isGestaoOpen ? 'open' : ''}`}>
                            <li>
                                <Link href="/clientes" className={isActive('/clientes') ? 'active-sub' : ''}>
                                    <FaUsers /> Gerenciar Clientes
                                </Link>
                            </li>
                            <li>
                                <Link href="/funcionarios" className={isActive('/funcionarios') ? 'active-sub' : ''}>
                                    <FaUsersCog /> Gerenciar Funcionários
                                </Link>
                            </li>
                            <li>
                                <Link href="/produtos" className={isActive('/produtos') ? 'active-sub' : ''}>
                                    <FaStore /> Gerenciar Produtos
                                </Link>
                            </li>
                            <li>
                                <Link href="/fornecedores" className={isActive('/fornecedores') ? 'active-sub' : ''}>
                                    <FaTruck /> Gerenciar Fornecedores
                                </Link>
                            </li>
                            <li>
                                <Link href="/pets" className={isActive('/pets') ? 'active-sub' : ''}>
                                    <FaPaw /> Gerenciar Pets
                                </Link>
                            </li>
                        </ul>
                    </li>

                    {/* graficos estaticos */}
                    <li className="nav-item">
                        <Link href="/graficos" className={`nav-link ${isActive('/graficos') ? 'active' : ''}`}>
                            <FaChartBar />
                            <span>Gráficos (Est)</span>
                        </Link>
                    </li>
                    
                    {/* consultas SQL */}
                    <li className="nav-item">
                        <Link href="/consultas" className={`nav-link ${isActive('/consultas') ? 'active' : ''}`}>
                            <FaDatabase />
                            <span>Consultas SQL</span>
                        </Link>
                    </li>

                    {/* auditoria */}
                    <li className="nav-item">
                        <Link href="/auditoria" className={`nav-link ${isActive('/auditoria') ? 'active' : ''}`}>
                            <FaSearch />
                            <span>Auditoria</span>
                        </Link>
                    </li>
                    
                    {/* configurações */}
                    <li className="nav-item">
                        <Link href="/configuracoes" className={`nav-link ${isActive('/configuracoes') ? 'active' : ''}`}>
                            <FaCog />
                            <span>Configurações</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}