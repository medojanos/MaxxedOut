import Login from "./components/Login";
import Screens from "./components/Screens";
import { useEffect, useState } from "react";
import { getData } from "./misc/Storage";

export default function App() {
  const [isLoggedIn, setLogin] = useState();

  useEffect(() => {
    async function get() {
      setLogin(await getData("isLoggedIn"))
    }
    get();
  })

  return (
    {isLoggedIn} ? <Screens/> : <Login/>
  );
}