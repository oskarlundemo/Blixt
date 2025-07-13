import {DropDownUsers} from "../DropDownUsers.jsx";


/**
 *
 * This component is used to render a subheader inside a menu container,
 * called in the BottomSheet.jsx menu for example
 *
 * @param title of the subheader
 * @param svg optional svg
 * @param dropDown include drop down menu
 * @param conversationMembers members of the conversation
 * @param showGroupUsers show the members of the conversation
 * @param showDropDown state to show drop down
 * @param admin id of the conversation admin
 * @returns {JSX.Element}
 * @constructor
 */



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
                onClick={() => {showDropDown();}}
                className={'bottom-sheet-item-header'}>
                <h2>
                    {title}
                </h2>
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