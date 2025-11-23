import Provider from "./misc/Provider";
import App from "./App";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function Root() {
  return (
    <SafeAreaProvider>
        <Provider>
            <App/>
        </Provider>
    </SafeAreaProvider>
    
  );
}