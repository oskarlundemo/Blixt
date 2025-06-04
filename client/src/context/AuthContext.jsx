

import React, {createContext, useState, useEffect, useContext} from "react";
import { jwtDecode } from "jwt-decode";
import {supabase} from "../services/SupabaseClient.js";

/**
 * This context is used to create and assign users with their
 * jwt-token so it can be used in the app.
 * @type {React.Context<unknown>}
 */


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if there is a session on load
        const session = supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.access_token) {
                setUser(jwtDecode(session.access_token));
                localStorage.setItem("token", session.access_token);
            }
        });

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.access_token) {
                setUser(jwtDecode(session.access_token));
                localStorage.setItem("token", session.access_token);
            } else {
                setUser(null);
                localStorage.removeItem("token");
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);


    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);