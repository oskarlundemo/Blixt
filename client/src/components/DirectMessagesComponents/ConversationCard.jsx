import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";
import 'moment/locale/sv';

export const ConversationCard = ({

                                            user = null,
                                            group = null,
                                            latestMessage = null,
                                            chatname = '',
                                            loggedInUserId = "",
                                            members = [],
                                        }) => {

    const navigate = useNavigate();



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
                                        style={{
                                            marginLeft: index === 0 ? 0 : -8,
                                            zIndex: members.length - index,
                                            border: '2px solid white',
                                            borderRadius: '50%',
                                        }}
                                    >
                                        <UserAvatar
                                            user={member}
                                            key={member.id}
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
                    {moment(latestMessage.created_at)
                        .tz("Europe/Stockholm")
                        .format("D MMM HH:mm")}
                </h2>

            </div>

            <div className="direct-messages-card-body">
                {latestMessage ? (
                    <p>
                        {latestMessage?.sender.id === loggedInUserId ? (
                            <>
                                <span>You: </span>
                                {parseMessage(latestMessage?.content)}
                            </>
                        ) : (
                            <>
                                <span>{latestMessage.sender.username}: </span>
                                {parseMessage(latestMessage?.content)}
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