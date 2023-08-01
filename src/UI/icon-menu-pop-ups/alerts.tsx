import '../../styles/user-interface-master.scss';
export const AlertsPopupMenu = () => {
    return (
        <div className='ui-blue-box top-layer-menu pop-up-menu-background  p-3'>
            <div className='border-1 cursor-pointer m-2'>
                <p>Arrakis System</p> {/* location */ }
                <p>Unknown ship detected</p> {/* brief summary */ }
                <p className='text-center'>Noteworthy</p> {/* urgency, 5 levels- minor-noteworthy-moderate-high-extreme */ }
            </div>
            <div className='border-1 cursor-pointer m-2'>
                <p>French System</p> {/* location */ }
                <p>Out of baguettes</p> {/* brief summary */ }
                <p className='text-center'>Extreme</p> {/* urgency, 5 levels- minor-noteworthy-moderate-high-extreme */ }
            </div>
        </div>
    )
}