import {useState} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {AddNewGroupMember} from "./AddNewGroupMember.jsx";
import {useChatContext} from "../../context/ConversationContext.jsx";
import {ConversationControls} from "./ConversationControls.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {BottomSheet} from "../BottomSheet.jsx";
import {Overlay} from "../Overlay.jsx";
import {Spinner} from "../Spinner.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import '../../styles/ConfigureConversation.css'

/**
 * This component is rendered when the admin of a conversation (the creator) wants to
 * either add a user or kick a user from it. It is triggered inside the Conversation.jsx page
 *
 * @returns {JSX.Element}
 * @constructor
 */


export const ConfigureChat = ({}) => {

    const [showGroupUsers, setShowGroupUsers] = useState(false); // State to trigger the drop-down menu of conversation members
    const [loading, setLoading] = useState(false); // State to check if the app is loading
    const {API_URL, token} = useAuth(); // Get the users token from the AuthContext.jsx
    const {conversationId} = useParams(); // Get the id of the conversation from the params
    const navigate = useNavigate(); // The navigation hook to navigate to other pages in the app

    const {setConfigureUI, activeConversation, setAddMemberUI, addMemberUI,
        setShowDeleteContainer, conversationMembers, showDeleteContainer} = useChatContext(); // Bunch of state to update the UI

    // This function is called when the admin wants to delete a conversation
    const handleDelete = async () => {
        setLoading(true); // Set the loading state to true
        setShowDeleteContainer(false); // Toggle the delete container

        await fetch(`${API_URL}/conversations/delete/${conversationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false); // Remove the loading animation
                navigate('/messages') // Navigate back to the conversation selection
            })
            .catch(err => {
                toast.error('There was an error deleting the conversation') // Show a toast with a UI friendly message
                setLoading(false);
            });
    }

    return (
        <motion.main
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
                type: 'tween',
                ease: 'easeInOut',
                duration: 0.5
            }}
            className="inspect-conversation">

            {loading && (<Spinner/>)}

            <svg
                onClick={() => {
                    if (addMemberUI) {setAddMemberUI(false);
                    } else {setConfigureUI(false);}
                }}

                style={{
                    margin: '1rem'
                }}
                className={'configure-back'}
                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            <AnimatePresence mode="wait">
                {addMemberUI ? (
                    <motion.div
                        key="add-member"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <AddNewGroupMember />
                    </motion.div>
                ) : (
                    <motion.div key="main-config">
                        <section
                        className={'groupInfo-container'}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '2rem'
                        }}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
                                {conversationMembers.length > 0 && (
                                    conversationMembers.map((member, i) => (
                                            <div
                                                key={member.user.id}
                                                style={{
                                                    marginLeft: i === 0 ? 0 : -8,
                                                    zIndex: conversationMembers.length - i,
                                                    border: '2px solid white',
                                                    borderRadius: '50%',
                                                }}>
                                                <UserAvatar
                                                    user={member.user}
                                                    size={40}
                                                />
                                            </div>
                                        )
                                    ))
                                }
                            </div>

                        <h1 className={'ellipse-text'}>
                            {activeConversation.name || activeConversation.members[0].user.username}
                        </h1>

                        </section>

                        <section
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}
                        >

                            <ConversationControls
                                setShowGroupUsers={setShowGroupUsers}
                                showGroupUsers={showGroupUsers}
                            />

                        </section>

                        <BottomSheet
                            showMenu={showDeleteContainer}
                            setShowMenu={setShowDeleteContainer}
                            childrenElements={
                                <div
                                    style={{
                                        padding: '1rem'

                                    }}
                                    className="delet-group-container"
                                >
                                    <h2>Are you sure you want to delete this group?</h2>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            width: "100%",
                                            gap: '1rem',
                                        }}
                                    >
                                        <button
                                            onClick={() => {
                                                setShowDeleteContainer(false)
                                            }}

                                            style={{
                                                width: "50%",
                                                backgroundColor: "var(--light-grey)",
                                                color: 'black'
                                            }}
                                        >No</button>

                                        <button

                                            onClick={() => {
                                                handleDelete();
                                            }}

                                            style={{
                                                width: "50%",
                                                backgroundColor: "var(--error-color)",
                                                color: 'white'
                                            }}
                                        >Yes</button>
                                    </div>
                                </div>
                            }
                        />

                        <Overlay
                            clickToggle={true}
                            showOverlay={showDeleteContainer}
                            setShowOverlay={setShowDeleteContainer}
                        />

                    </motion.div>
                )}
            </AnimatePresence>

        </motion.main>
    )
}