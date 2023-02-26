import styles from '../../styles/user-interface-master.scss';
import { useState } from 'react';
export const FactionsDetails = () => {
const [hidden, setHidden] = useState(1);
    return ( 
        <div>
            <div className=' mt-5 '>
        <h3 className='text-center p-2' onClick={() => setHidden(1)}>Active missions</h3><h3 className='text-center p-2' onClick={() => setHidden(2)}>Available Missions</h3></div>
        <div className=" flex container">
            <div className='faction-list border-1'>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>The Templars</h4>
                    <p>Reputation: Alright</p></div>
                    <div className='text-center '>Intel</div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>Princess Andromeda</h4>
                    <p>Reputation: Alright</p></div>
                    <div className='text-center '>Intel</div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>The Colonial Republic</h4>
                    <p>Reputation: Alright</p>
                    </div><div className='text-center '>Intel</div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>The Circle of life</h4>
                    <p>Reputation: Alright</p></div>
                    <div className='text-center '>Intel</div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>New Dawn</h4>
                    <p>Reputation: Alright</p></div>
                    <div className='text-center '>Intel</div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>Caretakers</h4>
                    <p>Reputation: Alright</p>
                </div><div className='text-center '>Intel</div>
                <div className='p-5 border-1'>
                    <h4 className='text-center'>Wai-Xing</h4>
                    <p>Reputation: hated</p>
                </div><div className='text-center '>Intel</div>
            </div>
           
            <div className={hidden === 2 ? 'hidden' : 'border-2 p-5 w-100'}><h3>ACTIVE MISSIONS</h3>
            <div>
            <p>Free slaves on X system
                <br />
                New Dawn: Reward 10 Reputation and a cheeseburger
            </p>
            </div>
            </div>
            
            <div className={hidden === 1 ? 'hidden' : 'border-2 p-5 w-100'}><h3>Available missions</h3>
            <div>
            <p>Raid Trade routes of X
                <br />
                The Templars: Reward 10 Reputation and a cheeseburger
            </p>
            </div>
            </div>

        </div>
        </div>
    )
}