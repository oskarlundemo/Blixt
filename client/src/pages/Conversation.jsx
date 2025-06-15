import {UserAvatar} from "../components/UserAvatar.jsx";


import '../styles/Conversation.css'
import {useNavigate, useParams} from "react-router-dom";
import {MessageInput} from "../components/ConversationComponents/MessageInput.jsx";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {MessageCard} from "../components/ConversationComponents/MessageCard.jsx";
import {supabase} from "../services/SupabaseClient.js";

export const Conversation = ({}) => {

    const navigate = useNavigate();
    const {username, conversationId} = useParams();
    const [insepctedConversation, setInseptedConversation] = useState(null);
    const {token, API_URL} = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const bottomRef = useRef(null);

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

                    console.log(data);

                    setMessages(data.conversation.messages);
                    setActiveConversationId(data.conversation.id);
                    setInseptedConversation(data.otherUser);
                    setLoading(false);
                })
                .catch(error =>  {
                    console.log(error);
                    setLoading(false);
                });
        }

    }, [username, conversationId]);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    /**
     *
     * Här kan det bli problem
     *
     */


    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play();
    };

    useEffect(() => {

        if (!activeConversationId) return;

        const channel = supabase
            .channel('messages-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Message' },
                async (payload) => {
                    const messageData = payload.new;


                    if (messageData.conversationId !== activeConversationId) return;

                    try {
                        const response = await fetch(`${API_URL}/messages/fetch/new/enriched/`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({ messageData }),
                        });

                        if (!response.ok) throw new Error('Failed to fetch enriched message');
                        const data = await response.json();
                        setMessages(prevMessages => [...prevMessages, data]);
                        playNotificationSound();

                    } catch (err) {
                        console.error('Error fetching realtime message:', err);
                    }
                }
            )
            .on('error', (e) => {
                console.error('Realtime error:', e);
            })
            .on('subscription', (status) => {
                console.log('Subscription status:', status);
            })
            .subscribe();

        return () => {
            channel.unsubscribe();
        };

    }, [activeConversationId]);

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


                        <div
                            style={{
                                width: '90%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignSelf: 'center',
                                gap: '1rem'
                            }}
                        >
                            {messages?.length > 0 ? (
                                messages.map((message, index) => (
                                    <MessageCard
                                        key={message.id}
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


                            <div ref={bottomRef} />

                        </div>

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