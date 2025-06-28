import {UserAvatar} from "./UserAvatar.jsx";


export const GroupAvatar = ({groupMembers = [], group = null, size = 25}) => {



    return (

        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}

            className={'group-avatar-container'}>

            {groupMembers.length > 0 && (
            groupMembers.map((member, i) => (
            <div
                key={member.Member.id}
                style={{
                    marginLeft: i === 0 ? 0 : -8,
                    zIndex: groupMembers.length - i,
                    border: '2px solid white',
                    borderRadius: '50%',
                }}>
                <UserAvatar
                    user={member.Member}
                    size={size}
                />
            </div>)))}
        </div>
    )
}