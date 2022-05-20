import "../styles/components.css"
type starProps = {
    systemName: String,
    systemStar: String
}
export const Star: React.FC<starProps> = ({systemName, systemStar}) => {

return (
    <div className={`${systemStar}`}>{systemName}
    star props</div>
)
}