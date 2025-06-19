import {useAuth} from "../../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {GifContainer} from "./GifContainer.jsx";


export const MessageInput = ({message, setMessage, showGif, setShowGif}) => {


    const {token, API_URL} = useAuth();
    const {username, group_id} = useParams();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (message.trim().length === 0)
            return;

        const endpointType = group_id ? 'group' : 'private';
        const identifier = group_id || encodeURIComponent(username);
        const endpoint = `${API_URL}/messages/create/${endpointType}/${identifier}`;

        try {
            await fetch(endpoint, {
                method: "POST",
                body: JSON.stringify({
                    message,
                }),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            })
        } catch (error) {
            console.error(error);
        }
        setMessage('')
    }


    return (
        <footer
            className="conversation-footer"
        >

            <form onSubmit={handleSubmit}>
                <textarea
                    className="conversation-input"
                    placeholder="Message..."
                    value={message}
                    onChange={(e) => {
                        setMessage(e.target.value);
                    }}
                    onSubmit={event => handleSubmit(event)}
                />
            </form>



                <div className="message-icons">

                    <div className="gif-icon">
                        <svg
                            onClick={() => {
                                setShowGif(true)
                            }}
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm240-160h60v-240h-60v240Zm-160 0h80q17 0 28.5-11.5T400-400v-80h-60v60h-40v-120h100v-20q0-17-11.5-28.5T360-600h-80q-17 0-28.5 11.5T240-560v160q0 17 11.5 28.5T280-360Zm280 0h60v-80h80v-60h-80v-40h120v-60H560v240ZM200-200v-560 560Z"/></svg>
                        <GifContainer
                            showGifs={showGif}
                            setShowGifs={setShowGif}
                        />
                    </div>


                    <svg
                        onClick={() => {
                            setShowGif(true)
                        }}

                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z"/></svg>
                    <svg
                        onClick={(e) => {
                            handleSubmit(e);
                        }}
                        xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/></svg>
                </div>

        </footer>
    )


}