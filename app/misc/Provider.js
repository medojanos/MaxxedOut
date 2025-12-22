import { createContext, useState, useEffect } from "react";
import { setData, setJson } from "./Storage";
import RandomName from "./RandomName";

export const Context = createContext();

export default function Provider({children}) {
    const [planDraft, setPlanDraft] = useState({name : "", ownIndex : 0, exercises : []});
    const [userData, setUserData] = useState();
    const [workout, setWorkout] = useState();
    const [token, setToken] = useState();
    const [refresh, setRefresh] = useState(0);

    function Refresh() {
        setRefresh(prev => prev + 1);
    }

    useEffect( () => {
        setData("token", token);
    }, [token])

    useEffect( () => {
        if (workout === undefined) return;
        setJson("workout", workout);
    }, [workout])

    useEffect(() => {
        if (userData === undefined || userData === null) return;
        if (userData.nickname == null) setUserData(prev => ({...prev, nickname: RandomName()}));
        if (userData.preferences === undefined) setUserData(prev => ({...prev, preferences: {restingTime: 1.5}}));
        setJson("user", userData);
    }, [userData]);
    
    return (
        <Context.Provider value={{planDraft, setPlanDraft, userData, setUserData, workout, setWorkout, token, setToken, refresh, Refresh}}>
            {children}
        </Context.Provider>
    );
}