import '../styles/Conversation.css'
import {useParams} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {MessageCard} from "../components/ConversationComponents/MessageCard.jsx";
import {supabase} from "../services/SupabaseClient.js";
import moment from "moment-timezone";
import {MessageSplitter} from "../components/MessasgeSplitter.jsx";
import {ConfigureChat} from "../components/ConversationComponents/ConfigureChat.jsx";
import {ChatWindow} from "../components/ConversationComponents/ChatWindow.jsx";
import { useChatContext} from "../context/ConversationContext.jsx";
import toast from "react-hot-toast";


export const Conversation = ({}) => {

    const {token, user, API_URL} = useAuth();
    const [loading, setLoading] = useState(true);
    const {conversationId} = useParams();
    const channelRef = useRef(null);

    const {configureUI, setConversationMembers, setActiveConversation} = useChatContext();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/conversations/load/${conversationId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                setMessages(data.messages);
                setActiveConversation(data.conversation);
                setLoading(false);
                setConversationMembers(data.conversation.members);
            })
            .catch(error =>  {
                console.log(error);
                setLoading(false);
            });

    }, [conversationId]);

    const renderedMessages = useMemo(() => {
        const rendered = [];
        let lastDate = null;

        // Loop through the message
        messages.forEach((message) => {

            const currDate = moment.utc(message.created_at).tz("Europe/Stockholm"); // Set the current time to now

            const isNewDay =
                !lastDate ||
                currDate.year() !== lastDate.year() ||
                currDate.month() !== lastDate.month() ||
                currDate.date() !== lastDate.date();

            if (isNewDay) { // New day, insert a MessageSplitter component in the chat window
                const formattedDate = currDate.locale('sv').format('dddd D MMMM YYYY');
                rendered.push(
                    <MessageSplitter key={`split-${message.id}`} date={formattedDate}/>
                );
                lastDate = currDate; //
            }

            rendered.push(
                <MessageCard
                    key={message.id}
                    content={message.content}
                    timestamp={message.created_at}
                    sender={message.sender}
                />);
        });
        return rendered;
    }, [messages]);


    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play();
    };

    useEffect(() => {

        if (!conversationId) return;

        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
                .then(() => console.log("Previous channel removed"))
                .catch((err) => console.error("Failed to remove previous channel:", err));
        }

        const newChannel = supabase
            .channel(`messages-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'Message',
                    filter: `conversation_id=eq."${conversationId}"`,
                },
                async (payload) => {
                    const message = payload.new;

                    try {
                        const response = await fetch(`${API_URL}/messages/fetch/enriched/message/${conversationId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({ message }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            setMessages((prev) => [...prev, data]);
                            playNotificationSound();
                        } else {
                            toast.error('There was an error retrieving the message');
                        }

                    } catch (err) {
                        console.error("Fetch failed:", err);
                        toast.error('Message fetch failed');
                    }
                }
            );

        newChannel.subscribe();
        channelRef.current = newChannel;

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
            <main className="conversation-wrapper">
            {loading ? (
                <LoadingTitle/>
            ) : (
                (configureUI ? (
                        <ConfigureChat/>
                ) : (
                    <ChatWindow
                        messages={messages}
                        renderedMessages={renderedMessages}
                        loading={loading}
                    />
                ))
            )}
            </main>
    )
}