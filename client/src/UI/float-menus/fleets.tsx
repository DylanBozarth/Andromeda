import { useState } from 'react'
export const FleetFloatMenu = () => {
    const [hidden, setHidden] = useState(false);
    return (
        <div className='layer-2-menu'>
            <h3 className='text-center cursor-pointer' onClick={() => setHidden(!hidden)}>Fleets  </h3>

            <div className={hidden ? '' : 'hidden'}>
                <p className='text-center'>Known fleets in this area</p>
                <div className='p-1'>
                    <div className='border-1  cursor-pointer text-center'><b>ST@RK!LLERzXXX42069</b>
                        <p></p> { /* location */}
                        <p>150/150</p> { /* power status, basically hitpoints */}
                        <p>Idle</p> { /* Status, in transit, idle, or in battle/retreating. If not idle they won't be able to have new orders */}
                    </div>
                    <div className='border-1 cursor-pointer text-center'><b>Fleet 2</b>
                        <p></p> { /* location */}
                        <p>68/150</p> { /* power status, basically hitpoints */}
                        <p>Retreating from example system</p> { /* Status, in transit, idle, or in battle/retreating. If not idle they won't be able to have new orders */}
                    </div>
                </div>
            </div>

        </div>
    )
}