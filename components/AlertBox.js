import {View, Text, Pressable} from "react-native";
import MainStyle from "../style/MainStyle";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Var from "../style/Variables"

export default function AlertBox({message, heading, visible = true, onClose = () => {}}, closable = false) {
    return visible ? 
        <View style={MainStyle.alertBox}>
            {heading ? 
                <View style={MainStyle.inlineContainer}>
                    <Text style={[MainStyle.containerTitle, {marginEnd: 10}]}>{heading}</Text>
                    { closable ? <Ionicons name="close" size={15} color={Var.red} onPress={() => onClose(false)}/> : null }
                </View>
            : null }
            <View style={MainStyle.inlineContainer}>
                {message ? <Text style={[MainStyle.lightText, {marginEnd: 10}]}>{message}</Text> : null}
                {heading || !closable ? null : <Ionicons name="close" size={15} color={Var.red} onPress={() => onClose(false)}/>}
            </View>
        </View> : null
}