import { createContext, useState } from "react";

export const Context = createContext();

export default function Provider({children}) {
    const [isLoggedIn, setLogin] = useState();
    const [planDraftSave, setPlanDraftSave] = useState();
    
    return (
        <Context.Provider value={{isLoggedIn, setLogin, planDraftSave, setPlanDraftSave}}>
            {children}
        </Context.Provider>
    );
}