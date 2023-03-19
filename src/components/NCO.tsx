import '../styles/textures/planets-and-stars.scss';

interface NCOProps {
  NCOName: string;
  effect: string;
  cords: string;
}

export const NCOComponent = ({NCOName, effect, cords}: NCOProps) => {
  return (
    <div className={`${NCOName}`}>
      {NCOName}
    </div>
  );
};

/* NCO EFFECTS
 
*/