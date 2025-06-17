import {UserAvatar} from "../UserAvatar.jsx";

export const SelectableUserCard = ({username = '', user, addParticipant, isSelected, avatar}) => {


    return (
        <article className={'selectable-user-card'}>

            <div>
                <UserAvatar
                    user={avatar}
                    size={25}
                />

                <h2>{username}</h2>
            </div>

            <input
                type='checkbox'
                checked={isSelected}
                onChange={() => {
                    addParticipant(user);
                }}
            />

        </article>
    )
}