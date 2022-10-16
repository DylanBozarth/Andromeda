import '../../../styles/menus/pop-ups.scss'
import '../../../styles/menus/menu-base-styles.css'
import { playerRawResources } from '../../../player-data/raw-resources'
export const ResourceMenu = () => {
    return (
        <div className='resource-menu'>

            <h1 className='resource-menu-title'>Resources </h1>
            {/* the big 4 */}
            <div className="first-line">
                <h4>Raw resources</h4>
                <p>Gas: {playerRawResources.gas}</p>
                <p>Oil: {playerRawResources.oil}</p>
                <p>Water: {playerRawResources.water}</p>
                <p>Ore : {playerRawResources.ore}</p>
            </div>
            <div className='second-line'>
                <h4>Refinded resources</h4>


            </div>
            <div className='third-line'>
                <h4>Unique resources</h4>
            </div>

        </div>
    )
}