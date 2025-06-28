import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext.jsx";
import '../styles/DirectMessages.css'
import {LoadingTitle} from "../components/LoadingTitle.jsx";
import {CreateChat} from "./CreateChat.jsx";
import {Conversations} from "../components/DirectMessagesComponents/Conversations.jsx";
import { AnimatePresence, motion } from "framer-motion";


export const DirectMessages = ({}) => {

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [createChatUI, setCreateChatUI] = useState(false);
    const [following, setFollowing] = useState([]);

    const {token, API_URL} = useAuth();

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
                            setCreateChatUI={setCreateChatUI}
                            conversations={conversations}
                        />
                    </motion.div>
                )})
            </AnimatePresence>

        </main>
    );
}