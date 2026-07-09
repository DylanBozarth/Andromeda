import { useGame } from '../../context/GameContext';
import { BigNCOComponent } from '../../components/bigNCO';
import { NCOSideBar } from '../../UI/side-bars/NCO-side-bar';

export const NCOView = () => {
  const { activeNCO } = useGame();

  if (!activeNCO) return null;

  return (
    <div className="text-center bold p-20">
      <NCOSideBar />
      <BigNCOComponent NCO={activeNCO} />
    </div>
  );
};
