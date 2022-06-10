import styles from '../styles/components.module.css';

interface StarProps {
  systemName: string;
  systemStar: string;
}

export const Star = ({ systemName, systemStar }: StarProps) => {
  return (
    <div className={`${styles[systemStar]}`}>
      <div className={styles['sector-view-star-name']}>{systemName}</div>
    </div>
  );
};
