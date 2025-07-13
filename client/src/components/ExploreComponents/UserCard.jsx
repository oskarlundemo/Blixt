import {useNavigate} from "react-router-dom";
import {UserAvatar} from "../UserAvatar.jsx";


/**
 * This component is used for rendering all the search results of users when a
 * user wants to find other profiles, and once they click on it they are
 * shown that users profile
 *
 * @param avatar of the user
 * @param username of the user
 * @param size of the
 * @param inputFocus
 * @returns {JSX.Element}
 * @constructor
 */

export const UserCard = ({avatar, username, size = '20px', inputFocus}) => {

    const navigate = useNavigate();

    return (
        <div
            className="user-card"
            style={{
                display: inputFocus ? 'flex' : 'flex',
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: '1rem',
                background: 'var(--background-color)',
                cursor: 'pointer',
            }}

            onClick={() => {
                navigate(`/${encodeURIComponent(username)}`)
            }}
        >

            <UserAvatar user={avatar} />
            <p>{username}</p>
        </div>
    )
}