'use client';
import styles from './KpiCard.module.css'; // Importa o novo CSS

export default function KpiCard({ title, value, icon, color = 'var(--primary-color)', formatAsCurrency = false }) {
  
  const formatValue = () => {
    if (value === null || value === undefined) {
      return '...';
    }
    if (formatAsCurrency) {
      return parseFloat(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });
    }
    return value;
  };

  return (
    <div className={styles.kpiCard} style={{ '--card-color': color }}>
        <div className={styles.iconWrapper}>
            {icon}
        </div>
        <div className={styles.kpiInfo}>
            <span className={styles.kpiTitle}>{title}</span>
            <span className={styles.kpiValue}>{formatValue(value)}</span>
        </div>
    </div>
  );
}