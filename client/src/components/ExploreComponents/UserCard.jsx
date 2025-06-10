import {useNavigate} from "react-router-dom";


export const UserCard = ({avatar, username, id, size = '20px', inputFocus}) => {

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
                navigate(`/profile/${username}/${id}`)

            }}
        >

            <img
                src={avatar}
                alt={avatar}
                height={size}
                width={size}
                style={{
                    borderRadius: '50%',
                }}
                />

            <p>{username}</p>

        </div>
    )
}