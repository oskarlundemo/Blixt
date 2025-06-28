import React, {createContext, useContext, useState} from "react";


const chatContext = createContext();



export const ChatProvider = ({ children }) => {

    const [groupMembers, setGroupMembers] = useState([]);
    const [isGroup, setIsGroup] = useState(false);
    const [activeChatRecipient, setActiveChatRecipient] = useState(null);
    const [configureUI, setConfigureUI] = useState(false);
    const [addMemberUI, setAddMemberUI] = useState(false);
    const [creatChatUI, setCreatChatUI] = useState(false);
    const [showDeleteContainer, setShowDeleteContainer] = useState(false);


    return (
        <chatContext.Provider value={{
            showDeleteContainer,
            setShowDeleteContainer,


            groupMembers,
            setGroupMembers,

            creatChatUI,
            setCreatChatUI,

            activeChatRecipient,
            setActiveChatRecipient,

            isGroup,
            setIsGroup,

            configureUI,
            setConfigureUI,

            setAddMemberUI,
            addMemberUI,
        }}>
            {children}
        </chatContext.Provider>
    );
}


export const useChatContext = () => useContext(chatContext);