import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";
import moment from "moment-timezone";
import 'moment/locale/sv';
import {useEffect, useRef, useState} from "react";
import {supabase} from "../../services/SupabaseClient.js";
import toast from "react-hot-toast";
import {useAuth} from "../../context/AuthContext.jsx";


/**
 * This component is used for rendering clickable cards of conversations
 * that the users can select and step into. Rendered in the DirectMessages.jsx component
 *
 * @param participants of the conversation
 * @param latestMessage sent in the conversation
 * @param conversationId id of the conversation
 * @param chatname of the conversation
 * @param loggedInUserId id of the logged-in user
 * @param setConversations state to update the conversations
 * @returns {JSX.Element}
 * @constructor
 */



export const ConversationCard = ({
                                            participants = null,
                                            latestMessage = null,
                                            conversationId = null,
                                            chatname = '',
                                            loggedInUserId = "",
                                            setConversations = null
                                        }) => {

    const {token, API_URL} = useAuth(); // Get the token from authContext.jsx
    const navigate = useNavigate(); // Use this hook for navigation
    const [message, setMessage] = useState(latestMessage); // Set the state of the latest message
    const channelRef = useRef(null); // Reference to supabase channel that persists between renders

    // Parse the content of the message that was last sent
    const parseMessage = (content) => {
         if (content?.endsWith(".gif") || content?.includes('media.giphy.com'))
             return 'Sent a Gif'
         return content
     }

     // This hook is used for listening to updates from the Supabase realtime
     useEffect(() => {

         if (!conversationId) return;

         // If there is a channel currently, remove it
        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
                .then(() => console.log("Previous channel removed"))
                .catch((err) => console.error("Failed to remove previous channel:", err));
        }

         // Attach the channel to listen for updates
        channelRef.current = supabase
            .channel(`messages-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                    filter: `conversation_id=eq.${conversationId}`, // Only listen to messages that has the same conversation
                },
                async (payload) => {
                    const message = payload.new; // New message was inserted

                    // Fetch more data associated with the new message before displaying
                    try {
                        const response = await fetch(`${API_URL}/conversations/latest/message/${conversationId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({message}),
                        });

                        // If it went ok, update the message
                        if (response.ok) {
                            const data = await response.json();
                            const updatedConversation = data.conversation;
                            setMessage(data.conversation.messages[0]);

                            // Remove the conversation and insert and updated version of it
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
                                    }}>
                                    <UserAvatar
                                        user={member.user}
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
                        {/* If the sendr of the message was the logged-in user, render You: before the content*/}
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