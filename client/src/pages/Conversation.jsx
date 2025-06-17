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
    const {username} = useParams();
    const [insepctedConversation, setInseptedConversation] = useState(null);

    const {token, user, API_URL} = useAuth();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const bottomRef = useRef(null);
    const {group_id} = useParams();

    const [messages, setMessages] = useState([]);

    useEffect(() => {

        let endpoint = "";

        if (group_id) {
            endpoint = `${API_URL}/messages/fetch/by-conversation/${group_id}`;
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
                    setMessages(data.messages);
                    setInseptedConversation(data.otherUser || data.group);
                    setLoading(false);
                })
                .catch(error =>  {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [username, group_id]);


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play();
    };

    useEffect(() => {
        if (!user?.id || !token) return;

        const table = group_id ? 'GroupMessage' : 'PrivateMessages';
        const fetchUrl = group_id
            ? `${API_URL}/messages/fetch/group/new/enriched`
            : `${API_URL}/messages/fetch/private/new/enriched`;

        const channel = supabase
            .channel('messages-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table },
                async (payload) => {
                    const message = payload.new;

                    if (message.sender_id === user.id || message.receiver_id === user.id || group_id) {
                        try {
                            const response = await fetch(fetchUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ message }),
                            });

                            const data = await response.json();
                            setMessages((prev) => [...prev, data]);
                            playNotificationSound();
                        } catch (err) {
                            console.error('Error fetching enriched message', err);
                        }
                    }
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }, [user?.id, user?.token, group_id, API_URL, token]);

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

                        {group_id && !loading ? (
                            <div style={{ display: "flex" }}>
                                {insepctedConversation?.group?.GroupMembers?.map((groupMember, i) => (
                                    <div
                                        key={groupMember.Member.id}
                                        style={{
                                            marginLeft: i === 0 ? 0 : -10,
                                        }}>
                                        <UserAvatar
                                            user={groupMember.Member}
                                            size={24}
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <UserAvatar
                                size={30}
                                user={insepctedConversation}
                            />
                        )}

                        <h2>{insepctedConversation?.username || insepctedConversation?.name}</h2>

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