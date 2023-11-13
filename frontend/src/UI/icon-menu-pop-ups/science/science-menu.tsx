import { useState } from 'react'
import { ExplorePopUpMenu } from './exploration'
import { FactionsPopUpMenu } from './factions'
import { ResearchPopUpMenu } from './research'
export const ScienceMenu = () => {
    const [selector, setSelector] = useState('')
    return (
        <div>
            <div className='p-3'>
                <h3 className='text-center'>Scientific Affairs</h3>
                <div>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'exploration' ? setSelector('none') : setSelector('exploration'))}>Exploration</p>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'factions' ? setSelector('none') : setSelector('factions'))}>Factions</p>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'research' ? setSelector('none') : setSelector('research'))}>Research</p>
                </div>
                <div className={selector === 'exploration' ? '' : 'hidden'}>
                    <ExplorePopUpMenu />
                </div>
                <div className={selector === 'factions' ? '' : 'hidden'}>
                    <FactionsPopUpMenu />
                </div>
                <div className={selector === 'research' ? '' : 'hidden'}>
                   <ResearchPopUpMenu />
                </div>
            </div>
        </div>
    )
}