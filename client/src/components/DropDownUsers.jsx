import {UserAvatar} from "./UserAvatar.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {useChatContext} from "../context/ConversationContext.jsx";
import toast from 'react-hot-toast';

/**
 * This component is a drop-down menu with users that
 * are in a conversation
 *
 *
 * @param members of a conversation
 * @param openMenu state to toggle the menu
 * @param admin id of the admin of the conversation
 * @returns {JSX.Element}
 * @constructor
 */


export const DropDownUsers = ({members, openMenu, admin}) => {

    const {user, token, API_URL} = useAuth(); // Get token from authContext
    const {conversationId} = useParams(); // Get id from parameters
    const {setConversationMembers} = useChatContext() // Set the state of the conversation members

    // This function handles kicking other users from the conversation
    const handleKickUser = async (user) => {
        await fetch(`${API_URL}/conversations/kick/${conversationId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                deletedUser: user
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                toast.success(data.message);
                setConversationMembers(prev =>
                    prev.filter(member => member.user.id !== user.id)
                );
            })
            .catch(err => console.log(err.message));
    };

    return (
        <div className="drop-container">
        <ul className={`sub-menu ${openMenu ? 'show' : ''}`}>
            <div>
                {members.length > 0 && (
                    members.map((member, index) => (
                        <li key={index} className="drop-down-item">
                            <UserAvatar
                                user={member?.user || null}
                                size={25}
                            />
                            <p>{member.user?.username || 'Undefined'}</p>

                            {(admin === user.id) && (member?.user?.id !== user.id) && (
                                <svg
                                    onClick={() => {
                                        handleKickUser(member?.user);
                                    }}
                                    className={`close-icon`}

                                    style={{
                                        marginLeft: 'auto'
                                    }}
                                    xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                            )}
                        </li>
                    ))
                )}
            </div>
        </ul>
        </div>
    )
}