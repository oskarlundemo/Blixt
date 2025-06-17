

import '../App.css'


export const NoDataFound = ({svg = null, message = ''}) => {


    return (
        <div className="no-data-container">

            <h2>{message}</h2>

            {svg}

        </div>
    )

}