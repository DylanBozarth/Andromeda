import '../styles/components.css';

interface PlanetProps {
  planet: string;
}

export const PlanetComponent = ({ planet }: PlanetProps) => {
  return (
    <div className={`system-planet ${planet}`}>
      <p className='text-center'>{planet}</p>
    </div>
  );
};
