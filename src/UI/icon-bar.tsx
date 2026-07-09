import { useState } from 'react';
import { MilitaryMenu } from './icon-menu-pop-ups/military/military-menu';
import { EconomyMenu } from './icon-menu-pop-ups/economy/economy-menu';
import { ScienceMenu } from './icon-menu-pop-ups/science/science-menu';

const PANELS = [
  { key: 'military', label: 'Military', icon: '/assets/UI-icons/military.png' },
  { key: 'economy',  label: 'Economy',  icon: '/assets/UI-icons/economy.png'  },
  { key: 'science',  label: 'Science',  icon: '/assets/UI-icons/science.png'  },
] as const;

type PanelKey = typeof PANELS[number]['key'] | 'none';

export const IconBar = () => {
  const [openMenu, setOpenMenu] = useState<PanelKey>('none');

  const toggle = (key: PanelKey) =>
    setOpenMenu(prev => (prev === key ? 'none' : key));

  return (
    <div className='top-layer-menu'>
      {/* pop-up panels */}
      <div className='middle-layer-menu fixed bottom-0' style={{ left: '50%', transform: 'translateX(-50%)', marginBottom: '56px' }}>
        <div className={openMenu === 'military' ? 'pop-up-menu' : 'hidden'}><MilitaryMenu /></div>
        <div className={openMenu === 'economy'  ? 'pop-up-menu' : 'hidden'}><EconomyMenu /></div>
        <div className={openMenu === 'science'  ? 'pop-up-menu' : 'hidden'}><ScienceMenu /></div>
      </div>

      {/* icon dock */}
      <nav className='icon-dock'>
        {PANELS.map(({ key, label, icon }) => (
          <button
            key={key}
            className={`icon-dock-btn${openMenu === key ? ' icon-dock-btn--active' : ''}`}
            onClick={() => toggle(key)}
            aria-label={label}
            title={label}
          >
            <img src={icon} alt={label} className='icon-dock-img' />
            <span className='icon-dock-label'>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
