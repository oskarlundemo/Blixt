import '../../styles/Profile.css'
import {useNavigate} from "react-router-dom";

/**
 * This component is rendered in the Profile.jsx component once a user
 * visits a profile that ain't theirs, therefore showing them the options to
 * either follow or message that user
 *
 * @param follows state to check if the user is already following this user
 * @param handleFollow function to handle a follow request
 * @param conversationId if the users clicks message, navigate to that conversation
 * @returns {JSX.Element}
 * @constructor
 */



export const FollowMessageContainer = ({follows, handleFollow, initiateConversation, conversationId = ''}) => {

    const navigate = useNavigate(); // This hook is used for navigating to other pages

    return (
        <div
            className="follow-message-container"
            style={{
                width: "100%",

            }}>

            {follows ? (
                <button
                    onClick={() => {
                        handleFollow()
                    }}
                >
                    Unfollow
                </button>
            ) : (
                <button
                    onClick={() => {
                        handleFollow()
                    }}>
                    Follow
                </button>
            )}

            <button
                style={{
                    backgroundColor: 'var(--accent-color)',
                    color: 'white'
                }}
                onClick={() => {
                    initiateConversation();
                }}>
                Message
            </button>
        </div>
    )
}