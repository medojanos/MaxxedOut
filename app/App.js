// React
import { useContext, useEffect, useState } from "react";

// Screens
import Login from "./screens/misc/Login";
import Main from "./Main";
import Loader from "./components/Loader";

// Misc
import { Context } from "./misc/Provider";
import { getData, getJson, } from "./misc/Storage";
import Constants from 'expo-constants';

export default function App() {
  const {setToken, userData, setUserData, setWorkout} = useContext(Context);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
        try {
            console.log(Constants.expoConfig.extra.API_URL);
            const token = await getData("token");
            const res = await fetch(Constants.expoConfig.extra.API_URL + "/auth", {headers: {"Authorization" : token}});
            const data = await res.json();
            if (data.success) {
                setToken(token);
                setUserData(await getJson("user"));
                setWorkout(await getJson("workout"));
            } else setUserData(undefined);
        }
        finally {
            setLoading(false);
        }
    }
    load();
  }, [])

  if (loading) return <Loader/>;
  return userData ? <Main/> : <Login/>
}