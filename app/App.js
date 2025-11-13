import Login from "./screens/Login";
import Main from "./Main";

import { useContext, useEffect } from "react";
import { Context } from "./misc/Provider";
import { getData, setData } from "./misc/Storage";
import Loader from "./components/Loader";

export default function App() {
  const { isLoggedIn, setLogin } = useContext(Context)

  useEffect(() => {
    async function isLogin() {
      try {
        await getData("user").then(data => setLogin(data.login));
      } catch {
        setLogin(undefined);
      }
      }
    isLogin();
  }, [])

  useEffect(() => {
    isLoggedIn ? setData("user", {"login" : true}) : setData("user", {"login" : false});
  }, [isLoggedIn]);
  
  if (isLoggedIn == undefined) return <Loader/>
  
  return isLoggedIn ? <Main/> : <Login/>;
}