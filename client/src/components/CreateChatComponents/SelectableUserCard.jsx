import {UserAvatar} from "../UserAvatar.jsx";
import {CustomCheckBox} from "../CustomCheckBox.jsx";


/**
 * This component is used for rendering each result, displaying a user that
 * can be added to a conversation inside the ParticipantsSection.jsx
 *
 * @param username of the user
 * @param user object
 * @param addNewGroupMember function to add the user to the list
 * @param add
 * @param addParticipant add them to the list
 * @param removeParticipant remove them from the list
 * @param isSelected to see if they are already added into the list of new members
 * @param avatar of the user
 * @returns {JSX.Element}
 * @constructor
 */

export const SelectableUserCard = ({username = '',
                                       user,
                                       addNewGroupMember = null,
                                       add = false, addParticipant,
                                       removeParticipant,
                                       isSelected,
                                       avatar}) => {
    return (
        <article className={'selectable-user-card'}>
            <div>
                <UserAvatar user={avatar}/>
                <h2>{username}</h2>
            </div>

            {add ? (
                <button
                    onClick={() => {
                        addNewGroupMember(user)
                    }}>
                    Invite
                </button>
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