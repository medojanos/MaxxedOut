import { createContext, useState } from "react";

export const Context = createContext();

export default function Provider({children}) {
    const [isLoggedIn, setLogin] = useState();
    
    return (
        <Context.Provider value={{isLoggedIn, setLogin}}>
            {children}
        </Context.Provider>
    );
}