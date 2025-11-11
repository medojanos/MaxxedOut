import Provider from "./misc/Provider";
import App from "./App";

export default function Root() {
  return (
    <Provider>
      <App/>
    </Provider>
  );
}