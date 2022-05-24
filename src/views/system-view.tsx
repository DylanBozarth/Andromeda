import { useEffect } from "react"
interface playerSystemProps {
    playerSystem: Object,
    setPlayerSystem: Function
    }
export const SystemView: React.FC<playerSystemProps> = ({playerSystem, setPlayerSystem}) => {
  let playerSystemArray = Object.values(playerSystem);
    useEffect(() => {
        console.log(playerSystemArray[0])
      
        
    }, [playerSystem])
    return (
        <div className="sector-view-wrapper">
       
        lmao
        </div>
      )
}