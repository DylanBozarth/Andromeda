type planetProps = {
    planet: String
}
export const PlanetComponent: React.FC<planetProps> = ({planet}) => {

    return (
        <div className={`${planet}`}>planets</div>
    )
}