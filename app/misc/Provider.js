import { createContext, useState } from "react";

export const Context = createContext();

export default function Provider({children}) {
    const [isLoggedIn, setLogin] = useState();
    const [planDraft, setPlanDraft] = useState({name : "", ownIndex : 0, exercises : []});
    const [userData, setUserData] = useState();
    
    return (
        <Context.Provider value={{isLoggedIn, setLogin, planDraft, setPlanDraft, userData, setUserData}}>
            {children}
        </Context.Provider>
    );
}