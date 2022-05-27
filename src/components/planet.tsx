type planetProps = {
    planet: String
}
export const PlanetComponent: React.FC<planetProps> = ({planet}) => {

    return (
        <div className={`system-planet ${planet}`}>{planet}</div>
    )
}