import {use, useEffect, useRef, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import '../styles/DirectMessages.css'
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {CreateChat} from "./CreateChat.jsx";
import {Conversations} from "../components/DirectMessagesComponents/Conversations.jsx";
import { AnimatePresence, motion } from "framer-motion";
import {supabase} from "../services/SupabaseClient.js";
import toast from "react-hot-toast";


export const DirectMessages = ({}) => {

    const [conversations, setConversations] = useState([]);
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
                console.log(data);
                setConversations(data.conversations);
                setFollowing(data.following);
                setLoading(false);
            })
            .catch(err => console.log('Error fetching conversations'));
    }, [token])

    useEffect(() => {
        if (!user) return;

        if (channelRef.current) {
            supabase.removeChannel(channelRef.current)
                .then(() => console.log("Previous channel removed"))
                .catch((err) => console.error("Failed to remove previous channel:", err));
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
                                setConversations((prev) => [data.newConvo, ...prev]);
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
                    .then(() => console.log('Unsubscribed from realtime channel'))
                    .catch((err) => console.error("Unsubscribe error:", err));
                channelRef.current = null;
            }
        };
    }, [token, user]);


    return (
        <main className={'direct-messages-container'}>

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
                        transition={{
                            type: 'tween',
                            ease: 'easeInOut',
                            duration: 0.5
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
                        transition={{
                            type: 'tween',
                            ease: 'easeInOut',
                            duration: 0.5
                        }}
                        style={{ position: 'absolute', width: '100%' }}
                    >
                        <Conversations
                            setConversations={setConversations}
                            setCreateChatUI={setCreateChatUI}
                            conversations={conversations}
                        />
                    </motion.div>
                )})
            </AnimatePresence>

        </main>
    );
}