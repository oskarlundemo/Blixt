import {useNavigate} from "react-router-dom";


export const HeaderMenu = ({backArrow = false, newMessage = false}) => {


    const navigate = useNavigate();

    return (
        <header className={'header-menu'}>

            {backArrow && (
                <svg

                    onClick={() => {
                        navigate(-1);
                    }}

                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            )}

            <div className="header-menu__logo">
                <h2>Blixt ⚡️</h2>
            </div>

            {!backArrow && (
                <svg
                    onClick={() => {
                        navigate("/messages");
                    }}

                    className={'dm-icon'}
                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
            )}


            {newMessage && (
                <svg
                    onClick={() => {
                        navigate("/messages/new");
                    }}

                    className={'dm-icon'}

                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                 )}
        </header>
    )

}
