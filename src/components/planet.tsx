import '../styles/textures/planets-and-stars.scss';
import { Planet } from '../types/planet-interface';

interface PlanetProps {
  planet: Planet;
}

export const PlanetComponent = ({ planet }: PlanetProps) => {
  return (
    <div className={`system-planet ${planet.name}`}>
      
    </div>
  );
};

/* planet effects  
heat levels, max 3. Higher heat is good for industry, lower heat is good for science and living areas
Frozen: heat level decrease(2), approval debuff
Lava: heat level increase(2), approval debuff, large ore refining bonus 
gas: approval debuff, heat level decrease(2), science bonus
asteroid belt: heat level decrease(3), ore collection (not refining) bonus
temperate: Approval bonus
ocean: heat level decrease, approval bonus, water bonus
desert: approval debuff, heat level increase(1), ore collection (not refining) bonus
greenhouse: approval bonus, biomass bonus, science bonus
rocky: water debuff, ore collection (not refining) bonus, ore refining bonus
*/