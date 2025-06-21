import React, {createContext, useContext, useState} from "react";


const chatContext = createContext();



export const ChatProvider = ({ children }) => {

    const [groupMembers, setGroupMembers] = useState([]);

    return (
        <chatContext.Provider value={{
            groupMembers,
            setGroupMembers,
        }}>
            {children}
        </chatContext.Provider>
    );
}


export const useChatContext = () => useContext(chatContext);