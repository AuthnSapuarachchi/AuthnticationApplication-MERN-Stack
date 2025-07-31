import axios from 'axios';
import React, { createContext, useState } from 'react';

export const AppContext = createContext();    

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/user/data')
            
        } catch (error) {

        }
    }

    const value = {
        backendUrl, 
        isLoggedIn, setIsLoggedIn,
        userData, setUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}