'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { FaCog } from 'react-icons/fa'; 
import styles from './configuracoes.module.css'; 

export default function Configuracoes() {
	
    const { theme, toggleTheme } = useTheme();

	return (
		<section id="configuracoes-section" className="content-section">
			<div className="section-header">
				<div className={styles.header}>
                    <FaCog />
				    <h2>Configurações do Sistema</h2>
                </div>
			</div>

            <div className={styles.card}>
                <div className={styles.settingRow}>
                    <div className={styles.settingInfo}>
                        <label htmlFor="theme-toggle">
                            Tema do Aplicativo
                        </label>
                        <p>
                            Modo atual: <strong>{theme === 'light' ? 'Claro' : 'Escuro'}</strong>
                        </p>
                    </div>

                    <label className={styles.switch} htmlFor="theme-toggle">
                        <input
                            id="theme-toggle"
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className={styles.slider}></span>
                    </label>
                </div>
            </div>
		</section>
	);
}