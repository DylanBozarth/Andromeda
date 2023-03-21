import '../styles/textures/planets-and-stars.scss';

interface NCOProps {
  NCOName: string;
  effect: string;
  cords: string;
  distanceMapValues: Record<string, { distance: number; eta: string }>;
}

export const NCOComponent = ({NCOName, effect, cords, distanceMapValues}: NCOProps) => {
  return (
    <div className={`${NCOName}`}>
      {NCOName}
    </div>
  );
};

/* NCO EFFECTS
 
*/