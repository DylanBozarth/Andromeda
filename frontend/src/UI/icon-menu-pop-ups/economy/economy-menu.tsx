import { useState } from 'react'
import { PlanetManagerPopUpMenu } from './planet-manager'
import { ResourcePopupMenu } from './resources'
export const EconomyMenu = () => {
    const [selector, setSelector] = useState('')
    return (
        <div>
            <div className='p-3'>
                <h3 className='text-center'>Economic Affairs</h3>
                <div>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'planet-manager' ? setSelector('none') : setSelector('planet-manager'))}>Planet Manager</p>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'resources' ? setSelector('none') : setSelector('resources'))}>Resources</p>
                </div>
                <div className={selector === 'planet-manager' ? '' : 'hidden'}>
                    <PlanetManagerPopUpMenu />
                </div>
                <div className={selector === 'resources' ? '' : 'hidden'}>
                    <ResourcePopupMenu />
                </div>
            </div>
        </div>
    )
}