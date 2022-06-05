import { useEffect } from "react"
import { PlanetComponent } from "../components/planet";
import "../styles/views-styles/system-view.css"
interface playerSystemProps {
  playerSystem: Object,
  setPlayerSystem: Function
}

export const SystemView: React.FC<playerSystemProps> = ({ playerSystem, setPlayerSystem }) => {
  let playerSystemArray = Object.values(playerSystem);
  let systemPlanetArray = [playerSystemArray[0].systemPlanets]
  let planetNames = systemPlanetArray[0]
  useEffect(() => {

    console.log(planetNames)

  }, [])
  return (
    <div className="playerSystemArray-view-wrapper row">
      {playerSystemArray.map(({ systemName, systemStar }) => {
        return (<div>{systemName}, {systemStar} system.</div>)
      })}
      {/*{planetNames.map(() => {
        return (<div>{planetNames} </div>)
      })} */}
    </div>
  )

}