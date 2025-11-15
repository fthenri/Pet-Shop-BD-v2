'use client';

import { useTheme } from '../../contexts/ThemeContext';

export default function Configuracoes() {
	
    const { theme, toggleTheme } = useTheme();

	return (
		<section id="configuracoes-section" className="content-section">
			<div className="section-header">
				<h2>Configurações do Sistema</h2>
			</div>

			<div className="form-group" style={{ maxWidth: '400px' }}>
                <label htmlFor="theme-toggle" style={{ marginBottom: '0.5rem' }}>
                    Tema do Aplicativo
                </label>
                <p style={{ margin: '0.5rem 0', color: 'var(--text-color-muted)', fontSize: '0.9rem' }}>
                    Tema atual: <strong>{theme === 'light' ? 'Claro' : 'Escuro'}</strong>
                </p>
                <button
                    id="theme-toggle"
                    className="btn btn-secondary"
                    onClick={toggleTheme}
                >
                    Mudar para {theme === 'light' ? 'Escuro' : 'Claro'}
                </button>
            </div>
            
		</section>
	);
}