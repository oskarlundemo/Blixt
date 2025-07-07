import {DropDownUsers} from "../DropDownUsers.jsx";
import {useEffect} from "react";


export const BottomSheetItem = ({title = '',
                                    svg = null,
                                    dropDown = false,
                                    groupMembers = [],
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

            {(dropDown && groupMembers.length > 0) && (
                <DropDownUsers
                    admin={admin}
                    items={groupMembers}
                    openMenu={showGroupUsers}
                />
            )}
        </div>

    )
}