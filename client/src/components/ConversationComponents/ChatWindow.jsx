import {UserAvatar} from "../UserAvatar.jsx";
import {MessageInput} from "./MessageInput.jsx";
import {BottomSheet} from "../BottomSheet.jsx";
import {GifContainer} from "./GifContainer.jsx";
import {Overlay} from "../Overlay.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { motion } from "framer-motion";
import {useChatContext} from "../../context/ConversationContext.jsx";


export const ChatWindow = ({messages, renderedMessages, loading}) => {

    const navigate = useNavigate();
    const bottomRef = useRef(null);
    const [message, setMessage] = useState('');
    const [showGif, setShowGif] = useState(false);
    const {setConfigureUI, conversationMembers, activeConversation} = useChatContext();
    const {conversationId} = useParams();

    useEffect(() => {
        const timeout = setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 500);

        return () => clearTimeout(timeout);
    }, [messages]);

    return (
        <motion.section
            key="chat-window"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
                type: 'tween',
                ease: 'easeInOut',
                duration: 0.5
            }}
            className="chat-window"
        >

        <div
            className="conversation-header">

            <svg
                className={'back-icon'}
                onClick={() => {
                    navigate('/messages');
                    setConfigureUI(false);
                }}
                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            {!loading && (
                <div
                    onClick={() => {
                        setConfigureUI(true);
                    }}

                    style={{ display: "flex", alignItems: "center" }}>

                    {conversationMembers.length > 0 && (
                        conversationMembers.map((member, index) => (
                            <UserAvatar
                            user={member.user}
                            key={member.user.id}
                            size={25}
                            />
                        ))
                    )}
                </div>
            )}

            <h1
            >{activeConversation.name || activeConversation.members[0].user.username}</h1>
        </div>

    <section
        className="conversation-content">

        <div>
            {messages?.length > 0 ? (
                <>
                    {renderedMessages}
                    <div ref={bottomRef} />
                </>

            ) : (
                <p
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        textAlign: "center"
                    }}
                >
                    No messages yet! Initiate a conversation
                </p>
            )}

        </div>

    </section>

    <MessageInput
        showGif={showGif}
        message={message}
        setMessage={setMessage}
        setShowGif={setShowGif}
    />

    <BottomSheet
        showMenu={showGif}
        setShowMenu={setShowGif}
        childrenElements={
            <div
                style={{
                    width: '90%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>

                <GifContainer
                    showMenu={showGif}
                    setShowGifs={setShowGif}
                />

            </div>
        }
     />

         <Overlay
        showOverlay={showGif}
        setShowOverlay={setShowGif}
        clickToggle={true}/>

        </motion.section>
    )
}