import Login from "./screens/Login";
import Main from "./Main";

import { useContext, useEffect } from "react";
import { Context } from "./misc/Provider";
import { getData, setData } from "./misc/Storage";
import Loader from "./components/Loader";

export default function App() {
  const {isLoggedIn, setLogin} = useContext(Context);

  useEffect(() => {
    async function isLogin() {
      await getData("isLoggedIn").then(data => setLogin(data));
    }
    isLogin();
  }, [])

  useEffect(() => {
    isLoggedIn == "true" ? setData("isLoggedIn", "true") : setData("isLoggedIn", "false");
  }, [isLoggedIn]);
  
  if (isLoggedIn == null) return <Loader/>
  
  return isLoggedIn == "true" ? <Main/> : <Login/>;
}