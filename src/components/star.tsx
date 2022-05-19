import "../styles/components.css"
type starProps = {
        starName: String
}
export const Star: React.FC<starProps> = ({starName}) => {

return (
    <div className={`${starName}`}>{starName}
    star props</div>
)
}