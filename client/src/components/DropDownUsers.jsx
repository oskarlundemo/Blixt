import {UserAvatar} from "./UserAvatar.jsx";
import {useAuth} from "../context/AuthContext.jsx";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";

export const DropDownUsers = ({items, openMenu, admin}) => {

    const {user, token, API_URL} = useAuth();
    const {group_id} = useParams();

    const handleKickUser = async (user) => {
        await fetch(`${API_URL}/group/kick/${group_id}`, {
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
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="drop-container">
        <ul className={`sub-menu ${openMenu ? 'show' : ''}`}>
            <div>
                {items.length > 0 && (
                    items.map((item, index) => (
                        <li key={index} className="drop-down-item">
                            <UserAvatar
                                user={item.Member}
                                size={25}
                            />
                            <p>{item.Member.username}</p>

                            {(admin === user.id) && (item.Member.id !== user.id) && (
                                <svg

                                    onClick={() => {
                                        handleKickUser(item.Member);
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