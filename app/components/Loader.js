import { View, Text } from "react-native-web";
import MainStyle from "../style/MainStyle";

export default function Loader() {
    return <View style={MainStyle.container}><Text>Loading...</Text></View>
}