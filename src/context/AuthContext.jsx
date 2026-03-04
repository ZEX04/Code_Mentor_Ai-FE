import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (mounted) {
                setSession(session);
                setUser(session?.user || null);
                setLoading(false);
            }
        });

        // Set up listener for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (mounted) {
                    console.log("AuthContext: Auth event:", _event);
                    setSession(session);
                    setUser(session?.user || null);
                    setLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        try {
            await supabase.auth.signOut();
            // Clear any old localStorage artifacts just in case
            localStorage.removeItem('user');
            localStorage.removeItem('sb-access-token');
            localStorage.removeItem('sb-refresh-token');
        } catch (error) {
            console.error("AuthContext: Error signing out", error);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user, signOut, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
