import { useEffect } from "react"
import { PlanetComponent } from "../components/planet";
interface playerSystemProps {
    playerSystem: Object,
    setPlayerSystem: Function
    }
 
export const SystemView: React.FC<playerSystemProps> = ({playerSystem, setPlayerSystem}) => {
  let playerSystemArray = Object.values(playerSystem);
    useEffect(() => {
        console.log(playerSystemArray)
      
        
    }, [playerSystem])
    return (
      <div className="playerSystemArray-view-wrapper">
      {playerSystemArray.map((playerSystemArray) => {
        return (
          <div className="playerSystemArray-star-wrapper">
          
            <div>{playerSystemArray.systemName}</div>
          <PlanetComponent planet={playerSystemArray.systemPlanets} />
          
          </div>
        )
      })}
      
      Eventually I want these to look more random in their placements so there can be clusters, etc.
      </div>
    )
    
}