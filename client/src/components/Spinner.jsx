/**
 * This component is just a loading animation that spinns
 *
 * @returns {JSX.Element}
 * @constructor
 */


export const Spinner = ({}) => {
    return (
        <div className="uploading-overlay">
            <div className="uploading-spinner"></div>
        </div>
    )
}