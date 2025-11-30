// React
import { useContext, useEffect, useState } from "react";

// Screens
import Login from "./screens/misc/Login";
import Main from "./Main";
import Loader from "./components/Loader";

// Misc
import { Context } from "./misc/Provider";
import { getData, getJson, setJson } from "./misc/Storage";
import RandomName from "./misc/RandomName";


export default function App() {
  const {userData, setUserData} = useContext(Context);
  const {isLoggedIn, setLogin} = useContext(Context);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const token = await getData("token");
      if (!token) setLogin(false);
      fetch("http://localhost:4000/auth", {headers: {"Authorization" : token}})
      .then(res => res.json())
      .then(data => data.success ? setLogin(true) : setLogin(false))
      .finally(() => setLoading(false))
      setUserData(await getJson("user"));
    }
    load();
  }, [])

  useEffect(() => {
    if (!userData) return;
    if (userData.nickname == null) setUserData(prev => ({...prev, nickname: RandomName()}));
    setJson("user", userData);
  }, [userData]);

  if (loading) return <Loader/>;
  return isLoggedIn ? <Main/> : <Login/>
}