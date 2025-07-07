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


export const Conversation = ({}) => {

    const {token, user, API_URL} = useAuth();
    const [loading, setLoading] = useState(true);
    const {conversationId} = useParams();

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
        if (!user?.id || !token || !conversationId) return;

        const messageChannel = supabase
            .channel('messages', )
            .on(
                'postgres_changes',
                {
                    event: 'INSERT', schema: 'public', table: 'Message',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async (payload) => {
                    const message = payload.new;
                    console.log('New message:', message);
                    try {
                        const response = await fetch(
                            `${API_URL}/messages/fetch/enriched/message/${conversationId}`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ message }),
                            }
                        );

                        const data = await response.json();
                        setMessages((prev) => [...prev, data]);
                        playNotificationSound();
                    } catch (err) {
                        console.error('Error fetching enriched message', err);
                    }
                }
            )
            .subscribe();

        return () => {
            messageChannel.unsubscribe();
        };
    }, [user?.id, conversationId]);

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