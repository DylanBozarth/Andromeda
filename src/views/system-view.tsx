import { useEffect } from "react"
import { PlanetComponent } from "../components/planet";
interface playerSystemProps {
  playerSystem: Object,
  setPlayerSystem: Function
}

export const SystemView: React.FC<playerSystemProps> = ({ playerSystem, setPlayerSystem }) => {
  let playerSystemArray = Object.values(playerSystem);
  let systemPlanetArray = playerSystemArray[0].systemPlanets
  useEffect(() => {
    
console.log(systemPlanetArray)

  }, [])
  return (
    <div className="playerSystemArray-view-wrapper">
      {systemPlanetArray.map((planet) => {
        return (
          <div className="">
            
           
          
            <PlanetComponent planet={planet} />
          
                     
            

          </div>
        )
      })}
    </div>
  )

}