// React
import { useContext, useEffect } from "react";

// Screens
import Login from "./screens/misc/Login";
import Main from "./Main";
import Loader from "./components/Loader";

// Misc
import { Context } from "./misc/Provider";
import { getData, setData, setJson } from "./misc/Storage";


export default function App() {
  const {isLoggedIn, setLogin} = useContext(Context);
  const {userData, setUserData} = useContext(Context);

  useEffect(() => {
    async function load() {
      setLogin(await getData("isLoggedIn").then(data => {return data == "true" ? "true" : "false"}));
      setUserData(await getData("userData"));
    }
    load();
  }, [])

  useEffect(() => {
    isLoggedIn == "true" ? setData("isLoggedIn", "true") : setData("isLoggedIn", "false");
    setJson("user", userData);
  }, [isLoggedIn, userData]);

  switch (isLoggedIn)
  {
    case "true":
      return <Main/>
    case "false":
      return <Login/>
    default:
      return <Loader/>
  }
}