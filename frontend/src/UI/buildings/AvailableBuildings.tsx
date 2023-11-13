import { useEffect, useState } from 'react';
import { Buildings } from './AvailableBuildingsTypes';
import '../../styles/user-interface-master.scss'
export const AvailableBuildings = () => {
  const [availableBuildings, setAvailableBuildings] = useState<Array<Buildings>>([]);

  return (
    <>
      {availableBuildings && availableBuildings.length > 0 && (
        <div>
          {availableBuildings.map((building) => {
            return (
              <div key={building._id} className='p-2'>
                <hr />
                <p>Name: {building.name}</p>
                <p>Description: {building.description}</p>
                <p>Cost: {building.cost}</p>
                <div>BUILD</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
