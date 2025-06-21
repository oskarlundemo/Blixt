import {useEffect, useState} from "react";
import {UserAvatar} from "./UserAvatar.jsx";


export const GroupAvatar = ({group, size = 25}) => {

    const [groupAvatar, setGroupAvatar] = useState(null);

    useEffect(() => {
        if (!group.avatar) {
            setGroupAvatar(group.avatar);
        }
    }, [group]);

    return (

        <div
            style={{
                height: `${size}px`,
                width: `${size}px`,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative', // optional, if you're layering avatars
            }}

            className={'group-avatar-container'}>

            {group.avatar ? (
                <p>Gruppbild</p>
            ) : (
                (group.GroupMembers.length > 0 && (
                    group.GroupMembers.map((groupMember, i) => (
                        <div
                            key={groupMember.Member.id}
                            style={{
                                marginLeft: i === 0 ? 0 : -8,
                                zIndex: group.GroupMembers.length - i,
                                border: '2px solid white',
                                borderRadius: '50%',
                            }}>
                            <UserAvatar
                                user={groupMember.Member}
                                size={size}
                            />
                        </div>
                    ))
                ))
            )}
        </div>
    )
}