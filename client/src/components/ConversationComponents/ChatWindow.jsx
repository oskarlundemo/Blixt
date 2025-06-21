import {UserAvatar} from "../UserAvatar.jsx";
import {MessageInput} from "./MessageInput.jsx";
import {BottomSheet} from "../BottomSheet.jsx";
import {GifContainer} from "./GifContainer.jsx";
import {Overlay} from "../Overlay.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {useChatContext} from "../../context/GroupChatContext.jsx";



export const ChatWindow = ({inspectedConversation, messages, renderedMessages, setConfigureChat, loading}) => {

    const navigate = useNavigate();
    const bottomRef = useRef(null);
    const [message, setMessage] = useState('');
    const [showGif, setShowGif] = useState(false);
    const {group_id} = useParams();

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
            onClick={() => {
                setConfigureChat(true);
            }}

            className="conversation-header">

            <svg
                className={'back-icon'}
                onClick={() => {
                    navigate('/messages');
                }}
                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            {group_id && !loading ? (
                <div style={{ display: "flex" }}>
                    {inspectedConversation?.GroupMembers?.map((groupMember, i) => (
                        <div
                            key={groupMember.Member.id}
                            style={{
                                marginLeft: i === 0 ? 0 : -8,
                                zIndex: inspectedConversation.GroupMembers.length - i,
                                border: '2px solid white',
                                borderRadius: '50%',
                            }}>
                            <UserAvatar
                                user={groupMember.Member}
                                size={25}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <UserAvatar
                    size={25}
                    user={inspectedConversation}
                />
            )}

            <h2>{inspectedConversation?.username || inspectedConversation?.name}</h2>

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