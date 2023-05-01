import '../styles/textures/planets-and-stars.scss';
import { useEffect } from 'react';
import { useAppSelector } from '../redux/hooks';
{/* for future plans */}
export const SystemStarView = () => {
const playerSystem = useAppSelector((state) => state.sector.activeSystem);
    useEffect(() => {
        console.log(playerSystem)
    })
    return (
        <div>
            <div className={playerSystem.systemStar + '-system-view'}></div>
        </div>
    )
}