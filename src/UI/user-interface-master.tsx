import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { decrement, increment } from '../redux/testSlice';
import styles from '../styles/user-interface-master.module.css';
import { useSystems } from '../utils/system-generator/redux-hook';
import { playerRefinedResources } from '../player-data/refined-resources';
import { playerRawResources } from '../player-data/raw-resources';
import { TopBar } from './top-bar';
import { NavigationBar } from './navigation-bar';
export const UImaster: React.FC = () => {
  const dispatch = useAppDispatch();
  const generateSystems = useSystems(10, 8);
  return (
    <div>
      <TopBar />
      <li>
              <a href='#' onClick={() => generateSystems()}>
                Generate new sector
              </a>
            </li>
      
      <NavigationBar />
    </div>
  );
};
