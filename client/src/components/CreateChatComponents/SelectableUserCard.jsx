import {UserAvatar} from "../UserAvatar.jsx";
import {CustomCheckBox} from "../CustomCheckBox.jsx";

export const SelectableUserCard = ({username = '', user, addNewGroupMember = null, add = false, addParticipant, removeParticipant, isSelected, avatar}) => {


    return (
        <article className={'selectable-user-card'}>

            <div>
                <UserAvatar
                    user={avatar}
                    size={25}
                />

                <h2>{username}</h2>
            </div>

            {add ? (
                <button
                    onClick={() => {
                        addNewGroupMember(user)
                    }}
                >Invite</button>
            ) : (
                <CustomCheckBox
                    checked={isSelected}
                    onChange={() => {
                        if (isSelected) {
                            removeParticipant(user);
                        } else {
                            addParticipant(user);
                        }
                    }}
                />
            )}

        </article>
    )
}