import '../styles/textures/planets-and-stars.scss';

interface NCOProps {
  NCOType: string;
  effect: string;
  cords: string;
  distanceMapValues: Record<string, { distance: number; eta: string }>;
}

export const NCOComponent = ({NCOType, effect, cords, distanceMapValues}: NCOProps) => {
  return (
    <div className={`sector-view-nco ${NCOType}`}>
      
    </div>
  );
};

/* NCO EFFECTS
 
*/