import { useEffect } from 'react'
import { useAppSelector } from '../redux/hooks';
import { BigNCOComponent } from '../components/bigNCO';
import { NCOSideBar } from '../UI/side-bars/NCO-side-bar';
export const NCOView = () => {
    const playerNCO = useAppSelector((state) => state.sector.activeNCO);
    useEffect(() => {
        console.log(playerNCO)
    }, [])
    return (
        <div className="text-center bold p-20">
            <NCOSideBar />
            <BigNCOComponent NCO={playerNCO} />
        </div>
    )
}