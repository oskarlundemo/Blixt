import '../App.css'

/**
 * This component is used to render error messages
 *
 * @param svg optional
 * @param message that will be shown
 * @returns {JSX.Element}
 * @constructor
 */


export const NoDataFound = ({svg = null, message = ''}) => {


    return (
        <div className="no-data-container">
            <h2>{message}</h2>
            {svg}
        </div>
    )

}