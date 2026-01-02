import { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const { user } = useAuth();

    const searchUsers = useCallback(async (query) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/users/search?q=${query}`, config);
            setSearchedUsers(data);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }, []);

    const getUserProfile = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/users/${id}`, config);
            return data;
        } catch (error) {
            console.error(error);
            toast.error('Error fetching user profile');
            return null;
        }
    };

    const followUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.post(`http://localhost:5000/api/users/${userId}/follow`, {}, config);
            toast.success('User followed!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error following user');
        }
    };

    const unfollowUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            await axios.delete(`http://localhost:5000/api/users/${userId}/follow`, config);
            toast.success('User unfollowed');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error unfollowing user');
        }
    };

    const getFollowers = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/users/${userId}/followers`, config);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const getFollowing = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/users/${userId}/following`, config);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const getUserLibrary = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get(`http://localhost:5000/api/users/${userId}/library`, config);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const getUserFeed = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const { data } = await axios.get('http://localhost:5000/api/users/feed', config);
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    return (
        <UserContext.Provider value={{ searchedUsers, searchUsers, getUserProfile, followUser, unfollowUser, getFollowers, getFollowing, getUserLibrary, getUserFeed }}>
            {children}
        </UserContext.Provider>
    );
};
