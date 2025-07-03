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
import { useChatContext} from "../context/GroupChatContext.jsx";


export const Conversation = ({}) => {

    const {username} = useParams();
    const {token, user, API_URL} = useAuth();
    const [loading, setLoading] = useState(true);
    const {group_id} = useParams();

    const {setGroupMembers, setActiveChatRecipient, setIsGroup, configureUI} = useChatContext();
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
                    setIsGroup(!!data.group);
                    setActiveChatRecipient(data.otherUser || data.group);
                    setGroupMembers(data.group?.GroupMembers || null)
                    setLoading(false);
                })
                .catch(error =>  {
                    console.log(error);
                    setLoading(false);
                });
        }
    }, [username, group_id]);

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
        if (!user?.id || !token) return;

        const privateChannel = supabase
            .channel(`private-messages-${user.id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'PrivateMessages' },
                async (payload) => {

                    const message = payload.new;
                    console.log(message);

                    if (message.sender_id === user.id || message.receiver_id === user.id) {
                        try {
                            const response = await fetch(`${API_URL}/messages/fetch/private/new/enriched`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ message }),
                            });

                            const data = await response.json();
                            console.log(data);
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
            privateChannel.unsubscribe();
        };

    }, [user?.id, group_id, token]);


    useEffect(() => {
        if (!group_id) return

        const groupChannel = supabase
            .channel(`group-messages-${group_id || 'global'}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'GroupMessage' },
                async (payload) => {
                    const message = payload.new;
                    console.log(message);
                    if (message.group_id === group_id) {
                        try {
                            const response = await fetch(`${API_URL}/messages/fetch/group/new/enriched`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ message }),
                            });

                            const data = await response.json();
                            console.log(data);
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
            groupChannel.unsubscribe();
        };

    }, [group_id, user?.id]);

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