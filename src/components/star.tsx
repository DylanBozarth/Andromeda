import styles from '../styles/components.module.css';
import uiStyles from '../styles/user-interface-master.module.css';

interface StarProps {
  systemName: string;
  systemStar: string;
  distanceMapValues: Record<string, number>;
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
  const display = (
    <>
      <h4>Distances to:</h4>
      {Object.keys(distanceMapValues).map((key) => {
        return (
          <p
            key={key}
            style={{ margin: 0 }}
            onMouseEnter={() => handleAddOutline(key)}
            onMouseLeave={() => handleRemoveOutline(key)}
          >
            {key}: {distanceMapValues[key]} parsecs
          </p>
        );
      })}
    </>
  );
  return (
    <div id={systemName} className={`${styles[systemStar]}`}>
      <div className={`${styles['sector-view-star-name']} ${uiStyles.tooltip}`}>
        {systemName}
        <span className={uiStyles.tooltiptext}>{display}</span>
      </div>
    </div>
  );
};
