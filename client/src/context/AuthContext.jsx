

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
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.MODE === "production"
        ? import.meta.env.VITE_API_PROD_URL
        : "/api";


    useEffect(() => {
        const init = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {

                await supabase.auth.setSession(session);
                const userId = session?.user.id;

                try {
                    const response = await fetch(`${API_URL}/users/token/${userId}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
                    })

                    if (!response.ok) {
                        console.error("Failed to fetch user profile");
                        return;
                    }

                    const profile = await response.json();

                    setUser({
                        ...jwtDecode(session.access_token),
                        ...profile,
                    });

                    localStorage.setItem("token", session.access_token);

                } catch (error) {
                    console.error(error);
                }
            }
            setLoading(false);
        };

        init();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (session?.access_token) {
                    const userId = session.user.id;

                    try {
                        const response = await fetch(`${API_URL}/users/token/${userId}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            }
                        });

                        if (!response.ok) {
                            console.error("Failed to fetch user profile on auth change");
                            return;
                        }

                        const profile = await response.json();

                        setUser({
                            ...jwtDecode(session.access_token),
                            ...profile,
                        });

                        localStorage.setItem("token", session.access_token);
                    } catch (error) {
                        console.error("Error fetching profile on auth change:", error);
                    }
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

    const login = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) throw error;
        return data;
    };


    return (
        <AuthContext.Provider value={{ user, API_URL, logout, login, token: localStorage.getItem("token"), loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
