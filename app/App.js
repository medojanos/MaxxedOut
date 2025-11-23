// React
import { useContext, useEffect } from "react";

// Screens
import Login from "./screens/misc/Login";
import Main from "./Main";
import Loader from "./components/Loader";

// Misc
import { Context } from "./misc/Provider";
import { getData, setData } from "./misc/Storage";


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
    case undefined:
      return <Loader/>
    case "true":
      return <Main/>
    case "false":
      return <Login/>
  }
}