import { useState } from 'react'
import { AlertsPopupMenu } from './alerts'
import { FleetsPopupMenu } from './fleets'
export const MilitaryMenu = () => {
    const [selector, setSelector] = useState('')
    return (
        <div>
            <div className=''>
                <h3 className='text-center'>Military Affairs</h3> 
                <p className='p-1' onClick={() => setSelector('alerts')}>Alerts</p>
                <div className={selector === 'alerts' ? '' : 'hidden'}>
                    <AlertsPopupMenu />
                </div>
                <div  className={selector === 'fleets' ? '' : 'hidden'}>
                    <FleetsPopupMenu />
                </div>
            </div>
        </div>
    )
}