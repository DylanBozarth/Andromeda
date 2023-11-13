import { useState } from 'react'
import { AlertsPopupMenu } from './alerts'
import { FleetsPopupMenu } from './fleets'
export const MilitaryMenu = () => {
    const [selector, setSelector] = useState('')
    return (
        <div>
            <div className='p-3'>
                <h3 className='text-center'>Military Affairs</h3>
                <div>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'alerts' ? setSelector('none') : setSelector('alerts'))}>Alerts</p>
                    <p className='p-1 text-center pointer' onClick={() => (selector === 'fleets' ? setSelector('none') : setSelector('fleets'))}>Fleets</p>
                </div>
                <div className={selector === 'alerts' ? '' : 'hidden'}>
                    <AlertsPopupMenu />
                </div>
                <div className={selector === 'fleets' ? '' : 'hidden'}>
                    <FleetsPopupMenu />
                </div>
            </div>
        </div>
    )
}