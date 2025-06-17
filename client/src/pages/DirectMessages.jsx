import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {NavigationBar} from "../components/NavigationBar.jsx";
import {HeaderMenu} from "../components/HeaderMenu.jsx";


import '../styles/DirectMessages.css'
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {PrivateConversationCard} from "../components/DirectMessagesComponents/PrivateConversationCard.jsx";
import {GroupConversationCard} from "../components/DirectMessagesComponents/GroupConversationCard.jsx";

export const DirectMessages = ({}) => {

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const {token, user, API_URL} = useAuth();

    useEffect(() => {
        fetch(`${API_URL}/conversations/fetch`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

            .then(res => res.json())
            .then(data => {
                console.log(data);
                setConversations(data);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, [token])

    return (
        <main className={'direct-messages-container'}>

            <HeaderMenu
                backArrow={true}
                newMessage={true}
            />

            <div className="direct-messages">

                {loading ? (
                    <LoadingTitle/>
                ) : (
                    (conversations.length > 0 ? (
                        (conversations.map((conversation) => (
                            (conversation.group ? (
                                <GroupConversationCard
                                    group={conversation.group}
                                    latestMessage={conversation.latestMessage}
                                    members={conversation.members}
                                />
                    ) : (
                                <PrivateConversationCard
                                    loggedInUserId={user.id}
                                    key={conversation.id}
                                    latestMessage={conversation.latestMessage}
                                    user={conversation.otherUser}
                                />
                            ))
                        )))
                        ) : (
                            <p>No conversations yet....</p>
                    ))
                )}
            </div>

        </main>
    )


}