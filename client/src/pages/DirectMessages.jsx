import {use, useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import '../styles/DirectMessages.css'
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {CreateChat} from "./CreateChat.jsx";
import {Conversations} from "../components/DirectMessagesComponents/Conversations.jsx";
import { AnimatePresence, motion } from "framer-motion";
import {supabase} from "../services/SupabaseClient.js";


export const DirectMessages = ({}) => {

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createChatUI, setCreateChatUI] = useState(false);
    const [following, setFollowing] = useState([]);
    const [realtimeUpdate, setRealtimeUpdate] = useState(null);
    const {token, user, API_URL} = useAuth();


    useEffect(() => {
        if (!conversations?.length) return;

        const sorted = [...conversations].sort((a, b) => {
            const dateA = new Date(a.latestMessage?.created_at || 0);
            const dateB = new Date(b.latestMessage?.created_at || 0);
            return dateB - dateA;
        });

        setConversations(sorted);
    }, [realtimeUpdate]);


    useEffect(() => {
        fetch(`${API_URL}/conversations/fetch`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

            .then(res => res.json())
            .then(data => {
                console.log(data)
                setConversations(data.conversations);
                setFollowing(data.following);
                setLoading(false);
            })
            .catch(err => console.log(err));
    }, [token])


    useEffect(() => {
        if (!user?.id || !token) return;

        const channel = supabase.channel('messages-channel');

        channel
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'PrivateMessages', filter: `receiver_id=eq.${user.id}` },
                (payload) => {
                    setRealtimeUpdate(payload.new);
                }
            )
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'GroupMessages' },
                (payload) => {
                    setRealtimeUpdate(payload.new);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, token]);


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
                            realtimeUpdated={realtimeUpdate}
                            setCreateChatUI={setCreateChatUI}
                            conversations={conversations}
                        />
                    </motion.div>
                )})
            </AnimatePresence>

        </main>
    );
}