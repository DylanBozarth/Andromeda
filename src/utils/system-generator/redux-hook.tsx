import { useAppDispatch } from '../../redux/hooks';
import { setSector } from '../../redux/sectorSlice';
import { generateSector } from './generate-sector';

export const useSystems = (maxSystems: number, maxPlanets: number) => {
  const dispatch = useAppDispatch();

  const populateReduxWithSystems = () => {
    const sector = generateSector(maxSystems, maxPlanets);
    dispatch(setSector(sector));
  };

  return populateReduxWithSystems;
};
