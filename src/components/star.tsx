import '../styles/components.css';

interface StarProps {
  systemName: string;
  systemStar: string;
}

export const Star = ({ systemName, systemStar }: StarProps) => {
  return (
    <div className={`${systemStar}`}>
      <div className='sector-view-star-name'>{systemName}</div>
    </div>
  );
};
