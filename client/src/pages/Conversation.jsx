import '../styles/Conversation.css'
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {MessageCard} from "../components/ConversationComponents/MessageCard.jsx";
import {supabase} from "../services/SupabaseClient.js";
import moment from "moment-timezone";
import {MessageSplitter} from "../components/MessasgeSplitter.jsx";
import {ConfigureChat} from "../components/ConversationComponents/ConfigureChat.jsx";
import {ChatWindow} from "../components/ConversationComponents/ChatWindow.jsx";
import {useChatContext} from "../context/ConversationContext.jsx";
import toast from "react-hot-toast";
import {ErrorMessage} from "../components/ErrorMessage.jsx";


/**
 * This component / page is rendered when a user is in a chat. Essentially here the whole
 * conversation and it's components is shown
 *
 * @returns {JSX.Element}
 * @constructor
 */

export const Conversation = ({}) => {

    const {token, user, API_URL} = useAuth(); // Get token from context
    const [loading, setLoading] = useState(true); // Loading
    const {conversationId} = useParams(); // Id from url
    const [error, setError] = useState(false);
    const channelRef = useRef(null); // Ref to stay persistent between renders
    const deleteChannelRef = useRef(null);  // Ref to stay persistent between renders
    const deleteConversationRef = useRef(null);  // Ref to stay persistent between renders
    const navigate = useNavigate(); // Hook for navigation

    const {configureUI, setConversationMembers, setActiveConversation} = useChatContext(); // UI and state from context
    const [messages, setMessages] = useState([]); // State to hold the messages in a conversation

    // This hook runs on mount and fetches the messages for that conversation
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
                setMessages(data.messages);
                setActiveConversation(data.conversation);
                setLoading(false);
                setConversationMembers(data.conversation.members);
            })
            .catch(error =>  {
                setError(true);
                console.log('There was an error while loading conversation');
                setLoading(false);
            });

    }, [conversationId]);

    // useMemo to optimize performance, only rendering those messages when the array changes
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


    // This function plays a notofication sound
    const playNotificationSound = () => {
        const audio = new Audio('/notification.mp3');
        audio.play();
    };


    // This hook listens for realtime updates from supabase when a conversation is deleted
    useEffect(() => {
        if (!conversationId) return;

        if (deleteConversationRef.current) {
            supabase.removeChannel(deleteConversationRef.current);
        }

        deleteConversationRef.current = supabase
            .channel(`delete-conversation-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'Conversation',
                    filter: `id=eq.${conversationId}`,
                },
                (payload) => {
                    // If the conversation a user is inspecting is deleted, take them back to /messages
                    const oldRow = payload.old;
                    if (oldRow.id === conversationId) {
                        navigate('/messages');
                    }
                }
            )
            .subscribe();

        return () => {
            if (deleteConversationRef.current) {
                supabase.removeChannel(deleteConversationRef.current);
                deleteConversationRef.current = null;
            }
        };
    }, [token, conversationId]);


    // This hook listens for members that are kicked out of a conversation
    useEffect(() => {
        if (!conversationId) return;

        if (deleteChannelRef.current) {
            supabase.removeChannel(deleteChannelRef.current);
        }

        deleteChannelRef.current = supabase
            .channel(`delete-listener-${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'ConversationMember',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                (payload) => {
                    const oldRow = payload.old;
                    if (oldRow.user_id === user.id) { // If the user was kicked out, take them back to /messages
                        navigate('/messages');
                    }
                }
            )
            .subscribe();

        return () => {
            if (deleteChannelRef.current) {
                supabase.removeChannel(deleteChannelRef.current);
                deleteChannelRef.current = null;
            }
        };
    }, [token, conversationId]);


    // This hook listens for realtime updated
    useEffect(() => {

        if (!conversationId) return;

        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
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
                    console.log(payload);
                    const message = payload.new;

                    try {
                        const response = await fetch(`${API_URL}/messages/fetch/enriched/message/${conversationId}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({message}),
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
        <main className="conversation-wrapper">
            {loading ? (
                <LoadingTitle/>
            ) : error ? (
                <ErrorMessage
                    message="There was an error while loading conversation"
                    svg={
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-400q-17 0-28.5-11.5T240-440q0-17 11.5-28.5T280-480q17 0 28.5 11.5T320-440q0 17-11.5 28.5T280-400Zm548 154-74-74h46v-480H274l-80-80h606q33 0 56.5 23.5T880-800v480q0 26-14.5 45.5T828-246ZM554-520l-80-80h246v80H554ZM820-28 606-240H240L80-80v-688l-52-52 56-56L876-84l-56 56ZM344-504Zm170-56Zm-234 40q-17 0-28.5-11.5T240-560q0-17 11.5-28.5T280-600q17 0 28.5 11.5T320-560q0 17-11.5 28.5T280-520Zm154-120-34-34v-46h320v80H434Zm-274-48v413l46-45h322L160-688Z"/></svg>
                    }
                />
            ) : configureUI ? (
                <ConfigureChat />
            ) : (
                <ChatWindow
                    messages={messages}
                    renderedMessages={renderedMessages}
                    loading={loading}
                />
            )}
        </main>
    );
}