import '../../styles/user-interface-master.scss';
export const FleetsPopupMenu = () => {
    return (
        <div className='container border-1 ui-orange-box p-3'>
            <h4 className='text-center'>Fleets</h4>
            <div className='border-1 p-1 fleet-menu-fleet cursor-pointer'><b>ST@RK!LLERzXXX42069</b>
                <p>alderon system</p> { /* location */ } 
                <p>150/150</p> { /* power status, basically hitpoints */ }
                <p>Idle</p> { /* Status, in transit, idle, or in battle/retreating. If not idle they won't be able to have new orders */ }
            </div>
            <div className='border-1 p-1 fleet-menu-fleet cursor-pointer'><b>Fleet 2</b>
                <p>Interstellar space</p> { /* location */ } 
                <p>68/150</p> { /* power status, basically hitpoints */ }
                <p>Retreating from example system</p> { /* Status, in transit, idle, or in battle/retreating. If not idle they won't be able to have new orders */ }
            </div>
        </div>
    )

}
/* Eventually clicking on the fleet's icon in this menu will select the fleet */