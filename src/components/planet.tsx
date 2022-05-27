import '../styles/components.css'
type planetProps = {
    planet: String
}
export const PlanetComponent: React.FC<planetProps> = ({planet}) => {

    return (
        <div className={`system-planet col-xl-2 ${planet}`}>{planet}</div>
    )
}