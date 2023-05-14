import '../styles/textures/planets-and-stars.scss';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { PlanetComponent } from '../components/planet';
import { PlanetSideBar } from '../UI/planet-side-bar';

export const PlanetView = () => {
    const playerPlanet = useAppSelector((state) => state.sector.activeSystem.activePlanet);
    useEffect(() => {
        console.log(playerPlanet)
    })
    return (
        <div>
            <PlanetSideBar playerPlanet={playerPlanet} />
            <PlanetComponent planet={playerPlanet} />
        </div>
    )
}