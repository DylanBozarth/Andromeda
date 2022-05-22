import { useEffect } from "react"
interface playerSystemProps {
    playerSystem: Object,
    setPlayerSystem: Function
    }
export const SystemView: React.FC<playerSystemProps> = ({playerSystem, setPlayerSystem}) => {
   interface systemProps {
    systemName: String,
    systemStar: String,
    systemPlanets: Array<String>
   }
    
    return (
        <div>



        </div>
    )
}