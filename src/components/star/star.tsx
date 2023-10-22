import '../../styles/textures/planets-and-stars.scss';
import '../../styles/user-interface-master.scss';
interface StarProps {
  systemName: string;
  systemStar: string;
}

const handleAddOutline = (id: string) => {
  const planet = document.getElementById(id);
  planet?.classList.add('outline-system');
};

const handleRemoveOutline = (id: string) => {
  const planet = document.getElementById(id);
  planet?.classList.remove('outline-system');
};

export const Star = ({ systemName, systemStar }: StarProps) => {
  return (
    <div id={systemName} className={`${systemStar} star`}>
      <div className='sector-view-star-name tooltip'>
        {systemName}
      </div>
    </div>
  );
};

/* Star effects on system 
Red Giant: Minor approval pentalty, heat level increase, UV bonus to solar farms, fuel cost increase (if possible programically)
red supergiant:all of that but more intense
red Dwarf: no bonus or debuff
brown dwarf: Uv debuff, heat level decrease
yellow dwarf: Approval bonus
white dwarf: UV buff, heat level decrease, 
blue giant: uv buff, heat level increase

*/
