import '../../../styles/menus/pop-ups.scss'
import '../../../styles/menus/menu-base-styles.css'
import { playerRawResources } from '../../../player-data/raw-resources'
import { playerRefinedResources } from '../../../player-data/refined-resources'
import { playerRareResources } from '../../../player-data/rare-resources'
export const ResourceMenu = () => {
    return (
        <div className='resource-menu'>

            {/* the big 4 */}
            <div className="first-line">
                <h4>Raw resources</h4>
                <p>Gas: {playerRawResources.gas}</p>
                <p>Oil: {playerRawResources.oil}</p>
                <p>Water: {playerRawResources.water}</p>
                <p>Ore : {playerRawResources.ore}</p>
            </div>
            <div className='second-line'>
                <h4>Refined resources</h4>
                <p>Approval: {playerRefinedResources.approval}</p>
                <p>Energy: {playerRefinedResources.energy}</p>
                <p>Fuel: {playerRefinedResources.fuel}</p>
                <p> Alloys: {playerRefinedResources.alloys}</p>
                <p>Ceramics and Plastics: {playerRefinedResources['ceramics-and-plastics']}</p>
                <p>Metals: {playerRefinedResources.metals}</p>
                <p>Delicacies: {playerRefinedResources.delicacies}</p>
                <p>Consumer Goods: {playerRefinedResources['consumer-goods']}</p>
            </div>
            <div className='third-line'>
                <h4>Unique resources</h4>
                <p>Sector-a-crystals: {playerRareResources['sector-a-crystals']}</p>
                <p>Sector-b-crystals: {playerRareResources['sector-b-crystals']}</p>
                <p>Sector-c-crystals: {playerRareResources['sector-c-crystals']}</p>
                <p>Sector-d-crystals: {playerRareResources['sector-d-crystals']}</p>
                <p>Sector-e-crystals: {playerRareResources['sector-e-crystals']}</p>
                <p>Sector-f-crystals: {playerRareResources['sector-f-crystals']}</p>
                <p>Sector-g-crystals: {playerRareResources['sector-g-crystals']}</p>
                <p>Sector-h-crystals: {playerRareResources['sector-h-crystals']}</p>
            </div>

        </div>
    )
}