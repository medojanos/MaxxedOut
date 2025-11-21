import { View, Text } from "react-native";
import MainStyle from "../style/MainStyle";

export default function Loader() {
    return (
        <View style={MainStyle.content}>
            <Text style={MainStyle.lightText}>Loading...</Text>
        </View>
    )
}