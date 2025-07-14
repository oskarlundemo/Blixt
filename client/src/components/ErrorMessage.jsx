import '../App.css'
import {useNavigate} from "react-router-dom";

/**
 * This component is used to render error messages
 *
 * @param svg optional
 * @param message that will be shown
 * @returns {JSX.Element}
 * @constructor
 */


export const ErrorMessage = ({svg = null, message = ''}) => {

    const navigate = useNavigate();

    return (
        <div className="no-data-container">

            <svg

                className={'back-icon top-left'}

                onClick={() => {
                    navigate(-1);
                }}

                xmlns="http://www.w3.org/2000/svg"
                height="24px" viewBox="0 -960 960 960"
                width="24px" fill="#e3e3e3">
                <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            <h2>{message}</h2>
            {svg}
        </div>
    )

}