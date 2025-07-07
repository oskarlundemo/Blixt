import {BottomSheetItem} from "./BottomSheetItem.jsx";
import {useEffect, useState} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {GroupAvatar} from "../GroupAvatar.jsx";
import {AddNewGroupMember} from "./AddNewGroupMember.jsx";
import {useChatContext} from "../../context/ConversationContext.jsx";
import {GroupControls} from "./GroupControls.jsx";
import {UserAvatar} from "../UserAvatar.jsx";
import {BottomSheet} from "../BottomSheet.jsx";
import {Overlay} from "../Overlay.jsx";
import {Spinner} from "../Spinner.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import {useNavigate, useParams} from "react-router-dom";


export const ConfigureChat = ({}) => {

    const [showGroupUsers, setShowGroupUsers] = useState(false)
    const [loading, setLoading] = useState(false);
    const {API_URL, token} = useAuth();
    const {conversationId} = useParams();
    const navigate = useNavigate();

    const {setConfigureUI, activeConversation, setAddMemberUI, addMemberUI,
        setShowDeleteContainer, conversationMembers, showDeleteContainer} = useChatContext();

    const handleDelete = async () => {
        setLoading(true);
        setShowDeleteContainer(false);

        await fetch(`${API_URL}/conversations/delete/${conversationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                navigate('/messages')
            })
            .catch(err => {
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

            {loading && (
                <Spinner/>
            )}


            <svg
                onClick={() => {
                    if (addMemberUI) {
                        setAddMemberUI(false);
                    } else {
                        setConfigureUI(false);
                    }
                }}

                style={{
                    margin: '1rem'
                }}
                className={'configure-back'}
                xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z"/></svg>

            <AnimatePresence mode="wait">
                {addMemberUI ? (
                    <AddNewGroupMember/>
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

                            <GroupControls
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