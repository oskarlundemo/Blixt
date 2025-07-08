import {DropDownUsers} from "../DropDownUsers.jsx";

export const MenuItem = ({title = '',
                                    svg = null,
                                    dropDown = false,
                                    conversationMembers = [],
                                    showGroupUsers = false,
                                    showDropDown = false,
                                    admin = '',
                                }) => {

    return (

        <div
            className={'bottom-sheet-item'}>
            <div
                onClick={() => {
                    showDropDown();
                }}
                className={'bottom-sheet-item-header'}>
                <h2>{title}</h2>
                {svg}
            </div>

            {(dropDown && conversationMembers.length > 0) && (
                <DropDownUsers
                    admin={admin}
                    members={conversationMembers}
                    openMenu={showGroupUsers}
                />
            )}
        </div>

    )
}