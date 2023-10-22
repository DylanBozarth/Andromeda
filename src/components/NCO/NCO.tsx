import '../../styles/textures/planets-and-stars.scss';

interface NCOProps {
  NCOType: string;
  NCOName: string;
  effect: string;
  cords: string;
}

export const NCOComponent = ({NCOType, NCOName, effect, cords}: NCOProps) => {
  return (
    <div className={`sector-view-nco ${NCOType}`}>
      
    </div>
  );
};

/* NCO EFFECTS
 
*/