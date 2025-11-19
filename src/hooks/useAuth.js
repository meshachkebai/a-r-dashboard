import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check for stored admin session
        const storedAdmin = localStorage.getItem('ar_admin');
        if (storedAdmin) {
            try {
                const adminData = JSON.parse(storedAdmin);
                setUser(adminData);
                setIsAdmin(true);
            } catch (e) {
                localStorage.removeItem('ar_admin');
            }
        }
        setLoading(false);
    }, []);

    const login = async (artistName, code) => {
        try {
            const { data, error } = await supabase
                .from('artist_access_codes')
                .select('*')
                .eq('artist_name', artistName)
                .eq('code', code)
                .eq('is_admin', true)
                .eq('is_revoked', false)
                .single();

            if (error || !data) {
                throw new Error('Invalid credentials or not an admin account');
            }

            const adminData = {
                id: data.id,
                artistName: data.artist_name,
                accountType: data.account_type,
                contentCategory: data.content_category
            };

            localStorage.setItem('ar_admin', JSON.stringify(adminData));
            setUser(adminData);
            setIsAdmin(true);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('ar_admin');
        setUser(null);
        setIsAdmin(false);
    };

    return {
        user,
        loading,
        isAdmin,
        login,
        logout
    };
}
