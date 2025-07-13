import {ConversationCard} from "./ConversationCard.jsx";
import {HeaderMenu} from "../HeaderMenu.jsx";
import {NoDataFound} from "../NoDataFound.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

/**
 * This component is used for wrapping all the clickable ConversationCard.jsx components
 * inside the DirectMessages.jsx component
 *
 * @param conversations all the conversations
 * @param setConversations state to set the conversations
 * @param setCreateChatUI state to change UI
 * @returns {JSX.Element}
 * @constructor
 */

export const Conversations = ({conversations,
                                  setConversations,
                                  setCreateChatUI}) => {

    const {user} = useAuth(); // Get the user object from the useAuth.jsx

    return (
        <>
            <HeaderMenu
                backArrow={true}
                newMessage={true}
                setCreateChatUI={setCreateChatUI}
                absolutePath={'/feed'}
            />

            <section className="direct-messages">
            {conversations.length > 0 ? (
                conversations.map((conversation, index) => (
                    <ConversationCard
                        setConversations={setConversations}
                        key={conversation.id || index}
                        participants={conversation.members || null}
                        chatname={conversation.is_group ? conversation.name : conversation.members[0]?.user.username}
                        latestMessage={conversation.messages[0] || null}
                        loggedInUserId={user?.id}
                        conversationId={conversation.id}
                    />
                ))
            ) : (
                <NoDataFound
                    message={'No conversations yet.'}
                    svg={<svg xmlns="http://www.w3.org/2000/svg"
                              height="24px" viewBox="0 -960 960 960"
                              width="24px" fill="#e3e3e3">
                        <path d="M240-400h320v-80H240v80Zm0-120h480v-80H240v80Zm0-120h480v-80H240v80ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/>
                    </svg>}/>
            )}
        </section>
        </>
    )
}