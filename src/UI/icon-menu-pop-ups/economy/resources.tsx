import { playerRawResources } from '../../../player-data/raw-resources'
import { playerRefinedResources } from '../../../player-data/refined-resources'
import { playerRareResources } from '../../../player-data/rare-resources'
import '../../../styles/user-interface-master.scss';
export const ResourcePopupMenu = () => {
    return (
        <div className='flex p-2'>

            {/* the big 4 */}
            <div className="">
                <h4>Raw resources</h4>
                <p>Gas: {playerRawResources.gas}</p>
                <p>Oil: {playerRawResources.oil}</p>
                <p>Water: {playerRawResources.water}</p>
                <p>Ore : {playerRawResources.ore}</p>
                <p>Uranium: {playerRawResources.uranium}</p>
            </div>
            <div className=''>
                <h4>Refined resources</h4>
                <p>Approval: {playerRefinedResources.approval}</p>
                <p>Energy: {playerRefinedResources.energy}</p>
                <p>Fuel: {playerRefinedResources.fuel}</p>
                <p> Alloys: {playerRefinedResources.alloys}</p>
                <p>Ceramics {playerRefinedResources.ceramics}</p>
                <p> Plastics: {playerRefinedResources.plastics}</p>
                <p>Metals: {playerRefinedResources.metals}</p>
            </div>
            <div className='e'>
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