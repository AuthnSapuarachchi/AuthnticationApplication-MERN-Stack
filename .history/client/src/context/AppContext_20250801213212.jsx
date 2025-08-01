import axios from 'axios';
import React, { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async ()=> {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-a', { withCredentials: true });
        }catch (error) {
            toast.error(error.message);
        }
    }

    const getUserData = async () => {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to get user data');
        }
    }

    const value = {
        backendUrl, 
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

