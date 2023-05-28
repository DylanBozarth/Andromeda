import { useState } from 'react'
export const FleetFloatMenu = () => {
    const [hidden, setHidden] = useState(false);
    return (
        <div className='layer-2-menu'>
            <h3 className='ui-border-box text-center' onClick={() => setHidden(!hidden)}>Fleets  </h3>

            <div className={hidden ? '' : 'hidden'}>
                <p className='text-center'>Fleets in this area</p>
                <div className='p-1'>
                    <div className='border-1  cursor-pointer'><b>ST@RK!LLERzXXX42069</b>
                        <p>alderon system</p> { /* location */}
                        <p>150/150</p> { /* power status, basically hitpoints */}
                        <p>Idle</p> { /* Status, in transit, idle, or in battle/retreating. If not idle they won't be able to have new orders */}
                    </div>
                    <div className='border-1 cursor-pointer'><b>Fleet 2</b>
                        <p>Interstellar space</p> { /* location */}
                        <p>68/150</p> { /* power status, basically hitpoints */}
                        <p>Retreating from example system</p> { /* Status, in transit, idle, or in battle/retreating. If not idle they won't be able to have new orders */}
                    </div>
                </div>
            </div>

        </div>
    )
}
/* This menu will show what fleets are in the system, nco, planet, etc */