import axios from 'axios';
import React, { createContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.with

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = useCallback(async () => {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
                setIsLoggedIn(true);
            } else {
                toast.error(data.message);
                setUserData(null);
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('Failed to get user data:', error);
            toast.error(error.response?.data?.message || 'Failed to get user data');
            setUserData(null);
            setIsLoggedIn(false);
        }
    }, [backendUrl]);

    const getAuthState = useCallback(async ()=> {
        try {
            axios.defaults.withCredentials = true;
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            console.error('Auth state check failed:', error);
            setIsLoggedIn(false);
            setUserData(null);
            // Don't show toast error for auth check as it's called on app load
        }
    }, [backendUrl, getUserData]);

    useEffect(() => {
        getAuthState();
    }, [getAuthState]);

    const value = {
        backendUrl, 
        isLoggedIn, setIsLoggedIn,
        userData, setUserData,
        getUserData,
        getAuthState
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

