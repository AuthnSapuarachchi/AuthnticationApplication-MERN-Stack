import React, { createContext } from 'react';

export const AppContext = createContext();    

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedIn] = React.useState(false);

    const value = {
        backendUrl
    }

    return (
        <AppContext.Provider value={{value}}>
            {props.children}
        </AppContext.Provider>
    );
}