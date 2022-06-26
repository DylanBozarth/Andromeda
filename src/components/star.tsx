import styles from '../styles/components.module.css';
import uiStyles from '../styles/user-interface-master.module.css';

interface StarProps {
  systemName: string;
  systemStar: string;
  distanceMapValues: Record<string, { distance: number; eta: string }>;
}

const handleAddOutline = (id: string) => {
  const planet = document.getElementById(id);
  planet?.classList.add(uiStyles['outline-system']);
};

const handleRemoveOutline = (id: string) => {
  const planet = document.getElementById(id);
  planet?.classList.remove(uiStyles['outline-system']);
};

export const Star = ({ systemName, systemStar, distanceMapValues }: StarProps) => {
  console.log({ distanceMapValues });
  const display = (
    <>
      <table>
        <tr>
          <th>Star</th>
          <th>Distance</th>
          <th>ETA(hours)</th>
        </tr>
        {Object.keys(distanceMapValues).map((key) => {
          return (
            <tr
              key={key}
              style={{ margin: 0 }}
              onMouseEnter={() => handleAddOutline(key)}
              onMouseLeave={() => handleRemoveOutline(key)}
            >
              <td>{key}</td>
              <td>{distanceMapValues[key].distance} parsecs</td>
              <td>{distanceMapValues[key].eta}</td>
            </tr>
          );
        })}
      </table>
    </>
  );
  return (
    <div id={systemName} className={`${styles[systemStar]} star` }>
      <div className={`${styles['sector-view-star-name']} ${uiStyles.tooltip}`}>
        {systemName}
        <span className={uiStyles.tooltiptext}>{display}</span>
      </div>
    </div>
  );
};
