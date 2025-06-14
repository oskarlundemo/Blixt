import {UserAvatar} from "../components/UserAvatar.jsx";


import '../styles/Conversation.css'
import {useNavigate, useParams} from "react-router-dom";
import {MessageInput} from "../components/ConversationComponents/MessageInput.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {MessageCard} from "../components/ConversationComponents/MessageCard.jsx";

export const Conversation = ({}) => {

    const navigate = useNavigate();
    const {username, conversationId} = useParams();
    const [insepctedConversation, setInseptedConversation] = useState(null);
    const {token, API_URL} = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const [messages, setMessages] = useState([]);

    useEffect(() => {

        let endpoint = "";

        if (conversationId) {
            endpoint = `${API_URL}/messages/fetch/by-conversation/${conversationId}`;
        } else if (username) {
            endpoint = `${API_URL}/messages/fetch/by-user/${encodeURIComponent(username)}`;
        }

        if (endpoint) {
            fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setMessages(data.conversation.messages);
                    setInseptedConversation(data.otherUser);
                    setLoading(false);
                })
                .catch(error =>  {
                    console.log(error);
                    setLoading(false);
                });
        }

    }, [username, conversationId]);


    return (
        <main className="conversation-wrapper">


            {loading ? (
                <LoadingTitle/>
            ) : (
                <>
                    <div className="conversation-header">

                        <svg

                            className={'back-icon'}
                            onClick={() => {
                                navigate(-1);
                            }}
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

                        <UserAvatar
                            size={30}
                            user={insepctedConversation}
                        />

                        <h2>{insepctedConversation?.username}</h2>

                    </div>

                    <section

                        style={{
                            position: "relative",
                        }}

                        className="conversation-content">

                        {messages?.length > 0 ? (
                            messages.map((message, index) => (
                                <MessageCard
                                    index={message.id}
                                    content={message.content}
                                    sender={message.sender}
                                    timestamp={message.created_at}
                                />
                            ))
                        ) : (
                            <p
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                    textAlign: "center"
                                }}
                            >No messages yet! Initiate a conversation</p>
                        )}

                    </section>

                    <MessageInput
                        message={message}
                        setMessage={setMessage}
                    />
                </>
            )}

        </main>
    )


}