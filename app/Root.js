import Provider from "./components/Provider";
import App from "./App";

export default function Root() {
  return (
    <Provider>
      <App/>
    </Provider>
  );
}