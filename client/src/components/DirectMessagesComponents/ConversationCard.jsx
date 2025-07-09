import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";
import 'moment/locale/sv';
import {useEffect, useRef, useState} from "react";
import {supabase} from "../../services/SupabaseClient.js";
import toast from "react-hot-toast";
import {useAuth} from "../../context/AuthContext.jsx";

export const ConversationCard = ({
                                            participants = null,
                                            latestMessage = null,
                                            conversationId = null,
                                            chatname = '',
                                            loggedInUserId = "",
                                            setConversations = null
                                        }) => {

    const {token, API_URL} = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState(latestMessage);
    const channelRef = useRef(null);

    const parseMessage = (content) => {
         if (content?.endsWith(".gif") || content?.includes('media.giphy.com'))
             return 'Sent a Gif'
         return content
     }

    useEffect(() => {

        if (!conversationId) return;

        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
                .then(() => console.log("Previous channel removed"))
                .catch((err) => console.error("Failed to remove previous channel:", err));
        }

        channelRef.current = supabase
            .channel(`messages-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async (payload) => {
                    const message = payload.new;

                    try {
                        const response = await fetch(`${API_URL}/conversations/latest/message/${conversationId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({message}),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const updatedConversation = data.conversation;
                            setMessage(data.conversation.messages[0]);

                            setConversations(prev => {
                                const filtered = prev.filter(c => c.id !== updatedConversation.id);
                                return [updatedConversation, ...filtered];
                            });

                        } else {
                            console.error(response);
                            toast.error('There was an error updating the message');
                        }
                    } catch (err) {
                        console.error("Fetch failed:", err);
                        toast.error('Message fetch failed');
                    }
                })
            .subscribe();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                    .then(() => console.log('Unsubscribed from realtime channel'))
                    .catch((err) => console.error("Unsubscribe error:", err));
                channelRef.current = null;
            }
        };
    }, [token, conversationId]);

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