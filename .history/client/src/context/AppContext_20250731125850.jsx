import React, { createContext } from 'react';

export const AppContext = createContext();    

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const value = {

    }

    return (
        <AppContext.Provider value={{}}>
            {props.children}
        </AppContext.Provider>
    );
}