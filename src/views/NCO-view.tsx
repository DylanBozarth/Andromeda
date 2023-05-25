import { useEffect } from 'react'
import { useAppSelector } from '../redux/hooks';
import { BigNCOComponent } from '../components/bigNCO';
export const NCOView = () => {
    const playerNCO = useAppSelector((state) => state.sector.activeNCO);
    useEffect(() => {
        console.log(playerNCO)
    }, [])
    return (
        <div className="absolute text-center bold p-20">
            <BigNCOComponent NCO={playerNCO} />
            A {playerNCO.name} will be shown here. And it will have {playerNCO.effect} on all fleets who battle in the system
        </div>
    )
}