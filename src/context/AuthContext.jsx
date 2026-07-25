import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/api';

const AuthContext = createContext();

const formatError = (err) => {
    const detail = err.response?.data?.detail;
    if (Array.isArray(detail)) {
        return detail.map((e) => `${e.loc[e.loc.length - 1]}: ${e.msg}`).join(', ');
    }
    if (typeof detail === 'string') {
        return detail;
    }
    return err.message || 'An unexpected error occurred';
};

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => localStorage.getItem('user') || null);
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    // Listen for global 401 unauthorized events
    useEffect(() => {
        const handleUnauthorized = () => {
            logout();
        };

        window.addEventListener('unauthorized', handleUnauthorized);
        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, []);

    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');
    }, [token]);

    useEffect(() => {
        if (user) localStorage.setItem('user', user);
        else localStorage.removeItem('user');
    }, [user]);

    const login = async (username, password) => {
        setLoading(true);
        setAuthError(null);
        try {
            const formData = new URLSearchParams();
            formData.append('username', username);
            formData.append('password', password);

            const response = await API.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            const { access_token } = response.data;
            setToken(access_token);
            setUser(username);
            setLoading(false);
            return true;
        } catch (err) {
            setAuthError(formatError(err));
            setLoading(false);
            return false;
        }
    };

    const register = async (username, email, password, confirm_password) => {
        setLoading(true);
        setAuthError(null);
        try {
            await API.post('/auth/register', {
                username,
                email,
                password,
                confirm_password
            });
            
            setLoading(false);
            return true; 
        } catch (err) {
            console.error('Register API Error:', err);
            setAuthError(formatError(err));
            setLoading(false);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, register, logout, loading, authError }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}