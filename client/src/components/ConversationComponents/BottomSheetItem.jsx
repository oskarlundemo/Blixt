import {DropDownMenu} from "../DropDownMenu.jsx";


export const BottomSheetItem = ({title = '',
                                    svg = null,
                                    dropDown = false,
                                    groupMembers = [],
                                    showGroupUsers = false,
                                    showDropDown = false,
                                }) => {



    return (


        <div

            onClick={showDropDown}
            className={'bottom-sheet-item'}>

            <div className={'bottom-sheet-item-header'}>
                <h2>{title}</h2>
                {svg}
            </div>

            {(dropDown && groupMembers.length > 0) && (
                <DropDownMenu
                    items={groupMembers}
                    openMenu={showGroupUsers}
                />
            )}
        </div>

    )
}