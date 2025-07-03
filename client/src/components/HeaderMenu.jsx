import {useNavigate} from "react-router-dom";
import {useChatContext} from "../context/GroupChatContext.jsx";


export const HeaderMenu = ({backArrow = false,
                               more = false,
                               newMessage = false,
                               setShowMore = false,
                               setCreateChatUI = false,
                                absolutePath = "/"
}) => {

    const navigate = useNavigate();

    return (
        <header className={'header-menu'}>

            {backArrow && (
                <svg
                    onClick={() => {
                        if (absolutePath) {
                            navigate(absolutePath);
                        } else {
                            navigate(-1);
                        }
                    }}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e3e3e3"
                >
                    <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
                </svg>
            )}

            <div className="header-menu__logo">
                <h2>Blixt ⚡️</h2>
            </div>

            {more && (
                <svg
                    onClick={() => setShowMore(true)}
                    className={'dm-icon'}
                    style={{
                        rotate: '90deg'
                    }}
                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z"/></svg>
            )}

            {(!backArrow && !more && !newMessage) && (
                <svg
                    onClick={() => {
                        navigate("/messages");
                    }}
                    className={'dm-icon'}
                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
            )}

            {setCreateChatUI && (
                <svg
                    onClick={() => {
                        setCreateChatUI(true);
                    }}
                    className={'dm-icon'}
                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                 )}
        </header>
    )
}
