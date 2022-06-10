import styles from '../styles/components.module.css';

interface PlanetProps {
  planet: string;
}

export const PlanetComponent = ({ planet }: PlanetProps) => {
  console.log({ planet });
  return (
    <div className={`${styles['system-planet']} ${styles[planet]}`}>
      <p>{planet}</p>
    </div>
  );
};
