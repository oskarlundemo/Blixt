

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
    const [loading, setLoading] = useState(true); // new

    const API_URL = import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_PROD_URL
        : "/api";


    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
                setUser(jwtDecode(session.access_token));
                localStorage.setItem("token", session.access_token);
            }
            setLoading(false);
        };

        init();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (session?.access_token) {
                    const decodedUser = jwtDecode(session.access_token);
                    setUser(decodedUser);
                    localStorage.setItem("token", session.access_token);
                } else {
                    setUser(null);
                    localStorage.removeItem("token");
                }
            }
        );

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
        <AuthContext.Provider value={{ user, API_URL, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
