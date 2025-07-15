import {MenuItem} from "./MenuItem.jsx";
import {useChatContext} from "../../context/ConversationContext.jsx";
import {useAuth} from "../../context/AuthContext.jsx";

/**
 * This component is rendered in the ConfigureChat.jsx and contains
 * all the controls when the admin or creator of a conversation wants to either
 * delete the whole conversation or kick or add new members
 *
 * @param setShowGroupUsers
 * @param showGroupUsers
 * @returns {JSX.Element}
 * @constructor
 */


export const ConversationControls = ({setShowGroupUsers, showGroupUsers}) => {

    const {activeConversation, conversationMembers, setAddMemberUI, setShowDeleteContainer} = useChatContext();
    const {user} = useAuth();

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}

            className="groupControls">

            {/* This menu item contains a dropdown of the members inside the conversation*/}
            <MenuItem
                onClick={() => {
                    setShowGroupUsers(!showGroupUsers);
                }}

                admin={activeConversation?.admin_id || ''}
                title={'Conversation members'}
                svg={
                    <>
                        <svg
                            style={{
                                transformOrigin: 'center',
                                marginRight: 'auto',
                                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: showGroupUsers ? 'rotate(-90deg)' : 'rotate(0deg)',
                            }}
                            xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-360 280-560h400L480-360Z"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z"/></svg>
                    </>}

                dropDown={true}
                showDropDown={() => setShowGroupUsers(!showGroupUsers)}
                conversationMembers={conversationMembers|| []}
                showGroupUsers={showGroupUsers}
            />

            {/* If the logged-in user is the creator of the conversation, they are allowed to see these options */}
            {activeConversation?.admin_id === user.id && (
                <>
                    {/* This menu item allows the admin to delete the conversation*/}
                    <MenuItem
                        showDropDown={() => setShowDeleteContainer(true)}
                        title={'Delete group'}
                        svg={<svg className={'delete-icon'} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>}
                    />

                    {/* This menu item triggers to show the add member page*/}
                    <MenuItem
                        showDropDown={() => setAddMemberUI(true)}
                        title={'Add group member'}
                        svg={
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
                        }
                    />
                </>
            )}

        </div>
    )
}