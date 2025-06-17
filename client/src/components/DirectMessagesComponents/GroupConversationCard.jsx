import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";


export const GroupConversationCard = ({
                                            group = null,
                                            latestMessage = null,
                                            loggedInUserId = "",
                                            members = [],
                                        }) => {

    const navigate = useNavigate();

    return (
        <article

            onClick={() => {
                navigate(`/messages/group/${group.id}`)
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

                    {members.length > 0 && (
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
                    )}
                </div>

                <h2>{group?.name || 'No name'}</h2>
            </div>

            <div className="direct-messages-card-body">
                {latestMessage ? (
                    <p>
                        {latestMessage?.sender.id === loggedInUserId ? (
                            <>
                                <span>You: </span>
                                {latestMessage?.content}
                            </>
                        ) : (
                            <>
                                <span>{latestMessage.sender.username}: </span>
                                {latestMessage?.content}
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