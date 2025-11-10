import Login from "./components/Login";
import Screens from "./components/Screens";

export default function App() {
  return (
    true ? <Screens/> : <Login/>
  );
}