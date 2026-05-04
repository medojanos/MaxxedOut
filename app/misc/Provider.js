import { createContext, useState, useEffect } from "react";
import { setData, setJson } from "./Storage";
import RandomName from "./RandomName";

export const Context = createContext();

export default function Provider({children}) {
    const [planDraft, setPlanDraft] = useState({name : "", ownIndex : 0, exercises : []});
    const [userData, setUserData] = useState(undefined);
    const [workout, setWorkout] = useState(undefined);
    const [refresh, setRefresh] = useState(0);
    const [refreshToken, setRefreshToken] = useState(undefined);
    const [accessToken, setAccessToken] = useState(undefined);

    function Logout() {
        setUserData(null);
        setWorkout(null);
        setRefreshToken(null);
        setAccessToken(null);
    }

    function Refresh() {
        setRefresh(prev => prev + 1);
    }

    useEffect(() => {
        if (refreshToken === undefined) return;
        setData("refresh_token", refreshToken);
    }, [refreshToken]);

    useEffect(() => {
        if (accessToken === undefined) return;
        setData("access_token", accessToken);
    }, [accessToken]);

    useEffect( () => {
        if (workout === undefined) return;
        setJson("workout", workout);
    }, [workout])

    useEffect(() => {
        if (userData === undefined) return;
        if (userData !== null) {
            if (userData?.nickname == null) setUserData(prev => ({...prev, nickname: RandomName()}));
            if (userData?.preferences == null) setUserData(prev => ({...prev, preferences: {restingTime: {minutes: 3, seconds: 0}, bottomTabText: "Show"}}));
        }
        setJson("user", userData);
    }, [userData]);
    
    return (
        <Context.Provider value={{planDraft, setPlanDraft, userData, setUserData, workout, setWorkout, refresh, Refresh, refreshToken, setRefreshToken, accessToken, setAccessToken, Logout}}>
            {children}
        </Context.Provider>
    );
}