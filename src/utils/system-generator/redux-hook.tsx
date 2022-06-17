import { useAppDispatch } from '../../redux/hooks';
import { setSector } from '../../redux/sectorSlice';
import { generateMultipleSystems } from './generate-sector';

export const useSystems = (maxSystems: number, maxPlanets: number) => {
  const dispatch = useAppDispatch();

  const populateReduxWithSystems = () => {
    const sector = generateMultipleSystems(maxSystems, maxPlanets);
    dispatch(setSector(sector));
  };

  return populateReduxWithSystems;
};
