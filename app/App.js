// React
import { useContext, useEffect, useState } from "react";

// Screens
import Login from "./screens/misc/Login";
import Main from "./Main";
import Loader from "./components/Loader";

// Misc
import { Context } from "./misc/Provider";
import { getData, getJson, } from "./misc/Storage";


export default function App() {
  const {setUserData} = useContext(Context);
  const {isLoggedIn, setLogin} = useContext(Context);
  const {setToken} = useContext(Context);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
        try {
            const token = await getData("token");
            const res = await fetch("http://localhost:4000/auth", {headers: {"Authorization" : token}});
            const data = await res.json();
            if (data.success) {
                setToken(token);
                setUserData(await getJson("user"));
                setLogin(true);
            } else {
                setLogin(false);
            }
        }
        finally {
            setLoading(false);
        }
    }
    load();
  }, [])

  if (loading) return <Loader/>;
  return isLoggedIn ? <Main/> : <Login/>
}