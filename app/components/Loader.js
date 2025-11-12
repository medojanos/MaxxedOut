import { View, Text } from "react-native-web";
import Style from "../style/Style";

export default function Loader() {
    return <View style={Style.container}><Text>Loading...</Text></View>
}