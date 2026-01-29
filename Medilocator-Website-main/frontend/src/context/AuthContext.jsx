import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const userId = localStorage.getItem('userId'); // If we stored this

        if (token) {
            // Ideally we verify token with backend, but for now we trust storage or decode it
            // Simulating user restore
            setUser({ token, role, id: userId });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, role } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);

            // We might want to decode token to get user ID or other info if backend doesn't send it explicitly besides role
            // But let's assume simple state for now
            setUser({ token, role });
            return { role };
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const register = async (name, email, password, role, profileData = {}, pincode = '') => {
        try {
            await api.post('/auth/register', { name, email, password, role, pincode, ...profileData });
            return true;
        } catch (error) {
            throw error;
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
