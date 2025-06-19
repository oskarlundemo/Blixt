import {UserAvatar} from "./UserAvatar.jsx";

export const DropDownMenu = ({items, openMenu}) => {

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
                        </li>
                    ))
                )}
            </div>
        </ul>
        </div>
    )
}