import '../styles/components.css'
type planetProps = {
    planet: String
}
export const PlanetComponent: React.FC<planetProps> = ({planet}) => {

    return (
        <div className={`system-planet col-xs-2 ${planet}`}><p className="text-center">{planet}</p></div>
    )
}