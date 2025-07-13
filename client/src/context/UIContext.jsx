import React, {createContext, useContext, useState} from "react";
const UIContext = createContext();

/**
 * This context is used for keep track of the index of
 * the NavigationBar.jsx component
 *
 * @param children
 * @returns {Element}
 * @constructor
 */


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
