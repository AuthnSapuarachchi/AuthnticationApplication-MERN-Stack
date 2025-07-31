import React, { createContext } from 'react';

export const AppContext = createContext();    

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState(false)

    const value = {
        backendUrl, 
        isLoggedin,
    }

    return (
        <AppContext.Provider value={{value}}>
            {props.children}
        </AppContext.Provider>
    );
}