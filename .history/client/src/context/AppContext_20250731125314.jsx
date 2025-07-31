import React, { createContext } from 'react';

export const AppContext = createContext();    

export const AppContextProvider = (prop) => {
    return (
        <AppContext.Provider value={{}}>
            {children}
        </AppContext.Provider>
    );
}