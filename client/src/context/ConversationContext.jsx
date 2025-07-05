import React, {createContext, useContext, useState} from "react";


const chatContext = createContext();



export const ChatProvider = ({ children }) => {

    const [activeConversation, setActiveConversation] = useState(null);
    const [configureUI, setConfigureUI] = useState(false);
    const [addMemberUI, setAddMemberUI] = useState(false);
    const [creatChatUI, setCreatChatUI] = useState(false);
    const [showDeleteContainer, setShowDeleteContainer] = useState(false);
    const [conversationMembers, setConversationMembers] = useState([]);

    return (
        <chatContext.Provider value={{
            showDeleteContainer,
            setShowDeleteContainer,

            conversationMembers,
            setConversationMembers,

            creatChatUI,
            setCreatChatUI,

            activeConversation,
            setActiveConversation,

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