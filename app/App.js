import Login from "./screens/misc/Login";
import Main from "./Main";

import { useContext, useEffect } from "react";
import { Context } from "./components/Provider";
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
  
  switch (isLoggedIn)
  {
    case null:
      return <Loader/>
    case "true":
      return <Main/>
    case "false":
      return <Login/>
  }
}