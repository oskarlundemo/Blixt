import React, {createContext, useContext, useState} from "react";


const UIContext = createContext();


export const UIProvider = ({ children }) => {

    const [footerIndex, setFooterIndex] = useState(0);


    return (
        <UIContext.Provider value={{
            footerIndex,
            setFooterIndex,
        }}>
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => useContext(UIContext);
