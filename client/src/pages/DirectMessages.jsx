import {use, useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import '../styles/DirectMessages.css'
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {CreateChat} from "./CreateChat.jsx";
import {Conversations} from "../components/DirectMessagesComponents/Conversations.jsx";
import { AnimatePresence, motion } from "framer-motion";
import {supabase} from "../services/SupabaseClient.js";
import toast from "react-hot-toast";
import {ErrorMessage} from "../components/ErrorMessage.jsx";


export const DirectMessages = ({}) => {

    const [conversations, setConversations] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [createChatUI, setCreateChatUI] = useState(false);
    const [following, setFollowing] = useState([]);
    const channelRef = useRef(null);
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
                setConversations(data.conversations);
                setFollowing(data.following);
                setLoading(false);
            })
            .catch(err => {
                setError(true);
                console.log('Error fetching conversations')
            });
    }, [token])

    useEffect(() => {
        if (!user) return;

        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
        }

        channelRef.current = supabase
            .channel(`conversations-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'ConversationMember',
                },
                async (payload) => {
                    try {

                        const { eventType, new: newRow, old: oldRow } = payload;

                        if (eventType === "INSERT") {
                            if (!newRow) {
                                console.warn("Missing new row");
                                return;
                            }

                            const response = await fetch(`${API_URL}/conversations/new/invite`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({ conversation: newRow }),
                            });

                            if (response.ok) {
                                const data = await response.json();
                                console.log(data);
                                setConversations((prev) => {
                                    if (prev.find(convo => convo.id === data.newConvo.id)) {
                                        return prev; // already added
                                    }
                                    return [data.newConvo, ...prev];
                                });
                            } else {
                                toast.error('There was an error retrieving the message');
                            }

                        } else if (eventType === "DELETE") {
                            if (!oldRow) {
                                console.warn("Blocked by RLS");
                                return;
                            }

                            setConversations((prev) =>
                                prev.filter(convo => convo.id !== oldRow.conversation_id)
                            );
                        }
                    } catch (err) {
                        console.error("Realtime event handler error:", err);
                        toast.error("A realtime update failed to process.");
                    }
                }
            )
            .subscribe();

        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current)
                channelRef.current = null;
            }
        };
    }, [token, user]);

    return (
        <main className="direct-messages-container">
            {error ? (
                <div className="error-message">
                    <ErrorMessage
                        message="There was an error loading your conversations."
                        svg={
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-400 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z"/></svg>
                        }
                    />
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <LoadingTitle />
                        </motion.div>
                    ) : createChatUI ? (
                        <motion.div
                            key="create-chat"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{
                                type: 'tween',
                                ease: 'easeInOut',
                                duration: 0.5,
                            }}
                            style={{ position: 'absolute', width: '100%' }}
                        >
                            <CreateChat
                                setCreateChatUI={setCreateChatUI}
                                following={following}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="conversations"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{
                                type: 'tween',
                                ease: 'easeInOut',
                                duration: 0.5,
                            }}
                            style={{ position: 'absolute', width: '100%' }}>
                            <Conversations
                                setConversations={setConversations}
                                setCreateChatUI={setCreateChatUI}
                                conversations={conversations}/>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </main>
    );
}