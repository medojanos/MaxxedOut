import { View, Text } from "react-native";

import Style from "../misc/Style";
import Login from "../components/Login";

export default function Settings() {
    return (
        <View style={Style.container}>
            <Login></Login>
        </View>
    );
}