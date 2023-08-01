import '../../styles/user-interface-master.scss';
import { useState } from 'react';
export const FactionsPopUpMenu = () => {
const [hidden, setHidden] = useState('active');
    return ( 
        <div className='top-layer-menu pop-up-menu-background flex '>
            
                <div className='mt-5 mb-5'>
        <h3 className='text-center p-2 border-1' onClick={() => setHidden('active')}>Active missions</h3>
        <h3 className='text-center p-2 border-1' onClick={() => setHidden('available')}>Available Missions</h3>
        <h3 className='text-center p-2 border-1' onClick={() => setHidden('factions')}>Factions</h3>
        </div>
        <div className={hidden === 'active' ? 'border-2 p-5 w-100' : 'hidden'}><h3 className='text-center'>ACTIVE MISSIONS</h3>
            <div className='active-mission border-1 p-1'> <h4 className='m-1'>New Dawn:</h4>
            <p>Free slaves on X system
                <br />
                 Reward: Reputation and 2 tantalum
            </p>
            </div>
            </div>
            
            <div className={hidden === 'available' ? 'border-2 p-5 w-100' : 'hidden'}><h3 className='text-center'>Available missions</h3>
            <div className='available-mission border-1'>
            <p>Raid Trade routes of X
                <br />
                The Templars: Reward 10 Reputation and a cheeseburger
            </p>
            </div>
            </div>
        <div className={hidden === 'factions' ? 'border-2 p-5 w-100' : 'hidden'}>
            <div className='faction-list border-1 flex'>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>The Templars</h4>
                    <p>Reputation: Alright</p></div>
                    
                <div className='p-5 border-1'>
                    <h4 className='text-center'>Princess Andromeda</h4>
                    <p>Reputation: Alright</p></div>
                    
                <div className='p-5 border-1'>
                    <h4 className='text-center'>The Colonial Republic</h4>
                    <p>Reputation: Alright</p>
                    </div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>The Circle of life</h4>
                    <p>Reputation: Alright</p></div>
                    
                <div className='p-5 border-1'>
                    <h4 className='text-center'>New Dawn</h4>
                    <p>Reputation: Alright</p></div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>Caretakers</h4>
                    <p>Reputation: Alright</p>
                </div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>Wai-Xing</h4>
                    <p>Reputation: hated</p>
                </div>
            </div>
           
            

        </div>
        </div>
    )
}