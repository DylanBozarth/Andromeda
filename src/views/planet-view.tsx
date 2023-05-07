import '../styles/textures/planets-and-stars.scss';
import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';

export const PlanetView = () => {
const playerSystem = useAppSelector((state) => state.sector.activeSystem);
    useEffect(() => {
        console.log(playerSystem)
    })
    
    return (
        <div>
            
            <div className={playerSystem.systemPlanets[0].name}></div>
        </div>
    )
}