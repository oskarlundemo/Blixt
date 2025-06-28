import {ConversationCard} from "./ConversationCard.jsx";
import {HeaderMenu} from "../HeaderMenu.jsx";
import {useAuth} from "../../context/AuthContext.jsx";


export const Conversations = ({conversations, setCreateChatUI}) => {

    const {user} = useAuth();

    return (

        <>
            <HeaderMenu backArrow={true}
                        newMessage={true}
                        setCreateChatUI={setCreateChatUI}
            />

            <section className="direct-messages">
            {conversations.length > 0 ? (
                conversations.map((conversation) => (
                    <ConversationCard
                        key={conversation.id}
                        user={conversation.otherUser || null}
                        group={conversation.group || null}
                        chatname={conversation.group?.name || conversation.otherUser?.username || 'Unknown'}
                        latestMessage={conversation.latestMessage}
                        members={conversation.members || []}
                        loggedInUserId={user?.id}
                    />
                ))
            ) : (
                <p>No conversations yet....</p>
            )}
        </section>
        </>
    )
}