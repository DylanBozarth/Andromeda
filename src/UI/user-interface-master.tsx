import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { decrement, increment } from '../redux/testSlice';
import styles from '../styles/user-interface-master.module.css';
import { useSystems } from '../utils/system-generator/redux-hook';
import { playerRefinedResources } from '../player-data/refined-resources';
import { playerRawResources } from '../player-data/raw-resources';
import { BottomNavBar } from './bottom-navigation-bar';
export const UImaster: React.FC = () => {
  const dispatch = useAppDispatch();
  const generateSystems = useSystems(10, 8);
  return (
    <div>
      <div className={styles.menu}>
        <nav>
          <ul>
            <li>
              <a href='#' onClick={() => generateSystems()}>
                Generate
              </a>
            </li>
            <li>
              <a href='#'>fuel: {playerRefinedResources.fuel}</a>
            </li>
            <li>
              <a href='#'>Water: {playerRawResources.water}</a>
            </li>
            <li>
              <a href='#'>Energy {playerRefinedResources.energy}</a>
            </li>
            <li>
              <a href='#' className={styles.oneline}>Raw </a>
              <ul className={styles.sub1}>
                <li>
                  <a href='#'>Gas: {playerRawResources.gas}</a>
                </li>
                <li>
                  <a href='#'>Oil: {playerRawResources.oil}</a>
                </li>
                <li>
                  <a href='#'>Ore: {playerRawResources.ore}</a>
                </li>
              </ul>
            </li>
            <li>
              <a href='#' className={styles.oneline}>Refined </a>
              <ul className={styles.sub1}>
                <li>
                  <a href='#'>Hard metal{playerRefinedResources['hard-metal']}</a>
                </li>
                <li>
                  <a href='#'>Soft metal {playerRefinedResources['soft-metal']}</a>
                </li>
                <li>
                  <a href='#'>Approval: {playerRefinedResources.approval}</a>
                </li>
                <li>
                  <a href='#'>Biomass {playerRefinedResources.biomass}</a>
                </li>

                <li>
                  <a href='#'>Consumer goods {playerRefinedResources['consumer-goods']}</a>
                </li>
                <li>
                  <a href='#'>Femented Grain {playerRefinedResources['fermented-grain']}</a>
                </li>
                <li>
                  <a href='#'>Refined Minerals {playerRefinedResources['refined-minerals']}</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
      <BottomNavBar />
    </div>
  );
};
