import { View } from "react-native";
import Style from "../style/Style"
import { Calendar } from "react-native-calendars"

export default function Logs() {
    return (
        <View style={Style.container}>
            <Calendar></Calendar>
        </View>
    );
}