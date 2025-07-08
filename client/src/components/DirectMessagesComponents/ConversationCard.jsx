import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";
import 'moment/locale/sv';
import {useEffect, useState} from "react";

export const ConversationCard = ({
                                            participants = null,
                                            latestMessage = null,
                                            conversationId = null,
                                            chatname = '',
                                            loggedInUserId = "",
                                        }) => {

    const navigate = useNavigate();
    const [message, setMessage] = useState(latestMessage);

    const parseMessage = (content) => {
         if (content?.endsWith(".gif") || content?.includes('media.giphy.com'))
             return 'Sent a Gif'
         return content
     }

    return (
        <article
            onClick={() => {
                navigate(`/messages/${conversationId}`)
            }}
            className="direct-messages-card">

            <div
                className="direct-messages-card-header"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: '0.5rem',
                }}>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        height: "fit-content",
                    }}
                    className="direct-messages-card-title">

                    {participants.length > 0 && (
                        participants.length > 0 && (participants.map((member, index) => (
                                <div
                                    key={member.user.id}
                                    style={{
                                        marginLeft: index === 0 ? 0 : -8,
                                        zIndex: participants.length - index,
                                        border: '2px solid white',
                                        borderRadius: '50%',
                                    }}
                                >
                                    <UserAvatar
                                        user={member.user}
                                        size={25}
                                    />
                                </div>
                            ))
                        )
                    )}


                </div>

                <h2>{chatname}</h2>

                <h2 style={{ margin: '0 0 0 auto' }}>
                    {moment(message?.created_at)
                        .tz("Europe/Stockholm")
                        .format("D MMM HH:mm")}
                </h2>

            </div>

            <div className="direct-messages-card-body">
                {message ? (
                    <p>
                        {message?.sender?.id === loggedInUserId ? (
                            <>
                                <span>You: </span>
                                {parseMessage(message?.content)}
                            </>
                        ) : (
                            <>
                                <span>{message.sender?.username}: </span>
                                {parseMessage(message?.content)}
                            </>
                        )}
                    </p>
                ) : (
                    <p>No messages yet</p>
                )}
            </div>
        </article>
    );
}