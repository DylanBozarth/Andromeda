import { useEffect } from 'react'
import { useAppSelector } from '../redux/hooks';
import { BigNCOComponent } from '../components/bigNCO';
import { SystemSideBar } from '../UI/side-bars/system-side-bar';
export const NCOView = () => {
    const playerNCO = useAppSelector((state) => state.sector.activeNCO);
    useEffect(() => {
        console.log(playerNCO)
    }, [])
    return (
        <div className="absolute text-center bold p-20">
            <SystemSideBar />
            <BigNCOComponent NCO={playerNCO} />
            A {playerNCO.type} will be shown here. And it will have {playerNCO.effect} on all fleets who battle in the system
        </div>
    )
}