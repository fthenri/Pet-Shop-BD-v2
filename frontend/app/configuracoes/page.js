'use client';

import { useTheme } from '../../contexts/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './configuracoes.module.css'; 

export default function Configuracoes() {
	
    const { theme, toggleTheme } = useTheme();

	return (
		<section id="configuracoes-section" className="content-section">
			<div className="section-header">
				<h2>Configurações do Sistema</h2>
			</div>

			<div className={styles.settingsCard}>
                <div className={styles.label}>
                    Tema do Aplicativo
                    <span>
                        Mudar para modo {theme === 'light' ? 'Escuro' : 'Claro'}
                    </span>
                </div>
                
                <div className={styles.themeSwitchWrapper}>
                    <FaSun style={{ color: theme === 'light' ? '#f0b429' : 'var(--text-color-muted)' }}/>
                    <label className={styles.themeSwitch}>
                        <input 
                            type="checkbox"
                            checked={theme === 'dark'}
                            onChange={toggleTheme}
                        />
                        <span className={styles.slider}></span>
                    </label>
                    <FaMoon style={{ color: theme === 'dark' ? 'var(--primary-color)' : 'var(--text-color-muted)' }}/>
                </div>
            </div>
            
		</section>
	);
}