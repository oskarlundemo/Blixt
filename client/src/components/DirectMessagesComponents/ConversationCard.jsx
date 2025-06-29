import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";
import 'moment/locale/sv';
import {useEffect, useState} from "react";

export const ConversationCard = ({
                                            user = null,
                                            group = null,
                                            latestMessage = null,
                                            chatname = '',
                                            loggedInUserId = "",
                                            members = [],
                                            realtimeUpdated = null,
                                        }) => {

    const navigate = useNavigate();

    const [message, setMessage] = useState(latestMessage);


    useEffect(() => {
        if (!realtimeUpdated) return;

        const isGroupMessage = group && realtimeUpdated.group_id === group.id;
        const isPrivateMessage =
            !group &&
            realtimeUpdated.conversation_id === latestMessage?.conversation_id;

        if (isGroupMessage || isPrivateMessage) {
            setMessage(realtimeUpdated);
        }
    }, [realtimeUpdated, group, latestMessage]);


    const parseMessage = (content) => {
         if (content?.endsWith(".gif") || content.includes('media.giphy.com'))
             return 'Sent a Gif'
         return content
     }

    return (
        <article

            onClick={() => {
                if (group) {
                    navigate(`/messages/group/${group.id}`)
                } else {
                    navigate(`/messages/${encodeURIComponent(user.username)}`)
                }
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

                    {group ? (
                        (members.length > 0 && (
                                members.map((member, index) => (
                                    <div
                                        key={member.id}
                                        style={{
                                            marginLeft: index === 0 ? 0 : -8,
                                            zIndex: members.length - index,
                                            border: '2px solid white',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        <UserAvatar
                                            user={member}
                                            size={25}
                                        />
                                    </div>
                                ))
                            ))
                    ) : (
                        <UserAvatar size={30} user={user} />
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
                        {message?.sender.id === loggedInUserId ? (
                            <>
                                <span>You: </span>
                                {parseMessage(message?.content)}
                            </>
                        ) : (
                            <>
                                <span>{message.sender.username}: </span>
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