import '../styles/textures/planets-and-stars.scss';
import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
import { PlanetComponent } from '../components/planet';

export const PlanetView = () => {
    
    const playerPlanet = useAppSelector((state) => state.sector.activePlanet);
    useEffect(() => {
        console.log(playerPlanet)
    })
    return (
        <div>
            <PlanetComponent planet={playerPlanet} />
        Planet
            
        </div>
    )
}