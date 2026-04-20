import {View, Text, Pressable} from "react-native";
import MainStyle from "../style/MainStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Var from "../style/Variables"

export default function AlertBox({message, heading, visible = true}) {
    return visible ? 
        <View style={MainStyle.alertBox}>
            <Text style={MainStyle.containerTitle}>{heading}</Text>
            <Text style={[MainStyle.lightText, {textAlign: "center"}]}>{message}</Text>
        </View> : null
}