import '../../styles/textures/planets-and-stars.scss';
import '../../styles/user-interface-master.scss';
interface BigStarProps {
  systemStar: string;
}


export const BigStar = ({systemStar }: BigStarProps) => {
  return (
    <div  className={`${systemStar}-system-view bigStar`}>
      <div className='sector-view-star-name tooltip'>
        {systemStar}
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
