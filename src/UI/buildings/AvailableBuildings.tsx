import { useEffect, useState } from 'react';
import { getAvailableBuildings } from '../../clientLibrary/buildings';
import { Buildings } from './AvailableBuildingsTypes';
import '../../styles/user-interface-master.scss'
export const AvailableBuildings = () => {
  const [availableBuildings, setAvailableBuildings] = useState<Array<Buildings>>([]);

  useEffect(() => {
    const fetchBuildings = async () => {
      const fetchedBuildings = await getAvailableBuildings();
      setAvailableBuildings(fetchedBuildings.buildingData);
    };
    fetchBuildings();
  }, []);

  return (
    <>
      {availableBuildings && availableBuildings.length > 0 && (
        <div>
          {availableBuildings.map((building) => {
            return (
              <div key={building._id} className='available-building'>
                <hr />
                <p>Name: {building.name}</p>
                <p>Description: {building.description}</p>
                <p>Cost: {building.cost}</p>
                { /* <p>Tech Level: {building.techLevel}</p> */ }
                <div>BUILD</div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};
