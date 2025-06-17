import {UserAvatar} from "../UserAvatar.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";


export const PrivateConversationCard = ({
                                    user = null,
                                    latestMessage = null,
                                    loggedInUserId = "",
                                 }) => {

    const navigate = useNavigate();

    return (
        <article

            onClick={() => {
                navigate(`/messages/${encodeURIComponent(user.username)}`)
            }}

            className="direct-messages-card">
            <div
                className="direct-messages-card-header"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: '0.5rem'
                }}
            >
                <UserAvatar size={30} user={user} />
                <h2>{user?.username}</h2>
            </div>

            <div className="direct-messages-card-body">
                <p>
                    {latestMessage?.sender.id === loggedInUserId ? (
                        <>
                            <span>You: </span>
                            {latestMessage?.content}
                        </>
                    ) : (
                        latestMessage?.content
                    )}
                </p>
            </div>
        </article>
    );
}