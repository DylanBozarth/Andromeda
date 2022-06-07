import { useEffect } from "react"
import { sys } from "typescript";
import { PlanetComponent } from "../components/planet";
import "../styles/views-styles/system-view.css"
interface playerSystemProps {
  playerSystem: Object,
  setPlayerSystem: Function
}

export const SystemView: React.FC<playerSystemProps> = ({ playerSystem, setPlayerSystem }) => {
  let playerSystemArray = Object.values(playerSystem);
  //let systemPlanetArray = {...playerSystemArray[0]}
  let systemPlanets = (Object.values(playerSystemArray[0])[1])
  useEffect(() => {
    console.log(systemPlanets);
    //console.log(Object.entries(planetNames))
    
  }, [])
  return (
    <div className="playerSystemArray-view-wrapper row">
      {playerSystemArray.map(({ systemName, systemStar }) => {
        return (<div>{systemName}, {systemStar} system.</div>)
      })}
      {/*{Object.keys(systemPlanets).map(() => {
        return (<div></div>)
      })} */}
    </div>
  )

}