import '../../styles/user-interface-master.scss';
import { Planet } from '../../types/planet-interface';
import { useState } from 'react';
import { FleetFloatMenu } from '../float-menus/fleets';

interface toggles {
    playerPlanet: Planet;
}
export const PlanetSideBar = ({
    playerPlanet
}: toggles) => {
    const [tabNumber, setTabNumber] = useState(1);
    const [toggleResources, setToggleResources] = useState(false);
    const [toggleBuildings, setToggleBuildings] = useState(false);
    return (
        <div className='middle-layer-menu'>
            <div className='side-bar p-1 ui-white-box'>
                <h3 className='text-center'>{playerPlanet.name} <br /> {playerPlanet.class.substring(0, playerPlanet.class.length - 1)} Planet</h3> {/* display planet type without the number on the end */}
                <p className='text-center'>Owned by: {playerPlanet.ownership}</p>
                <div className='side-bar-background'></div>
                {/* tabs */}
                <div className='flex justify-center'>
                    <div className='p-1 border-1' onClick={() => setTabNumber(1)}>
                        Production
                    </div>
                    <div className='p-1 border-1' onClick={() => setTabNumber(2)}>
                        Hangar
                    </div>
                    <div className='p-1 border-1' onClick={() => setTabNumber(3)}>
                        Resources
                    </div>
                </div>
                <div className='side-screen p-1'>
                    <div className={tabNumber === 1 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p>Production: {playerPlanet.production}</p></div>
                    </div>
                    <div className={tabNumber === 2 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p>Hangar:</p>{playerPlanet.hangar}</div>
                    </div>
                    <div className={tabNumber === 3 ? 'side-tab-info' : 'hidden'}>
                        <div className='m-2 text-center border-2 flex'><p>Resources in storage:</p>{playerPlanet.resourceStorage}</div>
                    </div>
                </div>


                <FleetFloatMenu />
                <div className='flex p-1 justify-center'>
                    <div onClick={() => setToggleBuildings(!toggleBuildings)} className=' p-1'>{toggleBuildings ? <p>{playerPlanet.buildings.length} Buildings</p> : 'Buildings'}</div>
                    <div onClick={() => setToggleResources(!toggleResources)} className=' p-1'>Desposits</div>
                </div>
                {[
                    playerPlanet.naturalResources.map((resource, idx) => {
                        return (
                            <div
                                className={toggleResources ? 'planet-resources mt-10 border-1 p-10 ' : 'hidden'}
                                key={`${playerPlanet}-${resource}-${idx}`}
                            >
                                <div className=''>{resource}</div>
                            </div>
                        );
                    }),
                ]}
                {[
                    playerPlanet.buildings.map((building, idx) => {
                        return (
                            <div
                                className={toggleBuildings ? 'planet-buildings mt-5' : 'hidden'}
                                key={`${playerPlanet}-${building}-${idx}`}
                            >
                                {building}

                            </div>
                        );
                    }),
                ]}
                <div className='text-center p-4 ui-border-box'>
                    {playerPlanet.ownership === 'unowned' ? 'Claim this planet' : ''}
                </div>
            </div>

        </div>
    );
};