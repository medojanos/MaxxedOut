import { createContext, useState, useEffect } from "react";
import { setData, setJson } from "./Storage";
import RandomName from "./RandomName";

export const Context = createContext();

export default function Provider({children}) {
    const [isLoggedIn, setLogin] = useState();
    const [planDraft, setPlanDraft] = useState({name : "", ownIndex : 0, exercises : []});
    const [userData, setUserData] = useState();
    const [workout, setWorkout] = useState();
    const [token, setToken] = useState();

    useEffect( () => {
        setData("token", token);
    }, [token])

    useEffect(() => {
        if (!userData) return;
        if (userData.nickname == null) setUserData(prev => ({...prev, nickname: RandomName()}));
        setJson("user", userData);
    }, [userData]);
    
    return (
        <Context.Provider value={{isLoggedIn, setLogin, planDraft, setPlanDraft, userData, setUserData, workout, setWorkout, token, setToken}}>
            {children}
        </Context.Provider>
    );
}