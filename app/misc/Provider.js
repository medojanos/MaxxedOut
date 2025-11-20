import { createContext, useState } from "react";

export const Context = createContext();

export default function Provider({children}) {
    const [isLoggedIn, setLogin] = useState();
    const [draftPlan, setDraftPlan] = useState();
    
    return (
        <Context.Provider value={{isLoggedIn, setLogin, draftPlan, setDraftPlan}}>
            {children}
        </Context.Provider>
    );
}