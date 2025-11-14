import { createContext, useState } from "react";

export const Context = createContext();

export default function Provider({children}) {
    const [isLoggedIn, setLogin] = useState();
    const [nickname, setNickname] = useState("JohnDoe");
    
    return (
        <Context.Provider value={{isLoggedIn, setLogin, nickname, setNickname}}>
            {children}
        </Context.Provider>
    );
}